<?php

namespace App\Http\Controllers\Qr;

use App\Enums\QrTypes;
use App\Enums\RedirectGoals;
use App\Enums\TokenStatus;
use App\Events\QrTokenStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Token;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TokenController extends Controller
{
    public function storeSender(Request $request)
    {
        $request->validate([
            "amount" => ["required", "numeric", "min:0.01"]
        ]);

        return $this->store($request, QrTypes::SENDER);
    }

    public function storeSenderPay(Request $request)
    {
        return $this->store($request, QrTypes::SENDERPAY);
    }

public function storeReceiver(Request $request)
    {
        return $this->store($request, QrTypes::RECEIVER);
    }

    public function storeReceiverSTORE(Request $request)
    {
        return $this->store($request, QrTypes::STORE);
    }

    public function getPermanentMerchantToken()
    {
        $wallet = auth()->user()->wallet;
        
        if (!$wallet) {
            return response()->json(["success" => false, "message" => "No wallet found."], 404);
        }

        $token = Token::where("created_by_account_id", $wallet->id)
            ->where("goal", RedirectGoals::STORE)
            ->whereNull("amount") // Permanent ones shouldn't have a fixed amount
            ->where("status", TokenStatus::PENDING)
            ->where("expires_at", ">", now())
            ->orderBy("expires_at", "desc")
            ->first();

        if (!$token) {
            // Create a new one if none exists
            $token = Token::create([
                "token" => (string) \Illuminate\Support\Str::uuid(),
                "created_by_account_id" => $wallet->id,
                "to_account_id" => $wallet->id,
                "expires_at" => now()->addYears(10),
                "status" => TokenStatus::PENDING,
                "goal" => RedirectGoals::STORE
            ]);
        }

        return response()->json([
            "id" => Crypt::encryptString($token->token),
            "token" => $token->load(['toAccount.user']),
            "appUrl" => config('app.url')
        ]);
    }

    public function store(Request $request, QrTypes $qrType)
    {
        $request->validate([
            "from_account_id" => "nullable|exists:accounts,id"
        ]);

        $wallet = auth()->user()->wallet;
        $fromAccountId = $request->from_account_id ?? $wallet->id;
        
        // Ensure user owns the account
        $account = \App\Models\Account::where('id', $fromAccountId)
            ->where('user_id', auth()->id())
            ->first();

        if (!$account) {
            return back()->withErrors("Invalid account selected.");
        }

        switch ($qrType) {
            case QrTypes::SENDER:
                $tokenData = [
                    "from_account_id" => $account->id,
                    "to_account_id" => null,
                    "amount" => $request->amount,
                    "goal" => RedirectGoals::SENDER
                ];
                break;
            
            case QrTypes::SENDERPAY:
                $tokenData = [
                    "from_account_id" => $account->id,
                    "to_account_id" => null,
                    "goal" => RedirectGoals::SENDERPAY
                ];
                break;

            case QrTypes::RECEIVER:
                $tokenData = [
                    "from_account_id" => null,
                    "to_account_id" => $account->id,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::RECEIVER
                ];
                break;

            case QrTypes::STORE:
                $tokenData = [
                    "from_account_id" => null,
                    "to_account_id" => $account->id,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::STORE
                ];
                break;

            default:
                return back()->withErrors("Invalid QR type provided.");
        }

        $expireDate = ($qrType === QrTypes::STORE) ? now()->addYears(10) : now()->addMinutes(10);

        $token = Token::create([
            "token" => (string) Str::uuid(),
            "created_by_account_id" => auth()->user()->wallet->id,
            "expires_at" => $expireDate,
            "status" => TokenStatus::PENDING,
            ...$tokenData
        ]);

        $url = Crypt::encryptString($token->token);

        return redirect()->route('qr.update.view', ['id' => $url]);
    }

    /**
     * Unified method to show the QR token.
     * Creators see the generator page (QrPage).
     * Participants see the update/payment page.
     */
    public function showToken(string $id)
    {
        $tokenStr = Crypt::decryptString($id);
        $token = Token::where("token", $tokenStr)->firstOrFail();
        $userWalletId = auth()->user()->wallet->id;

        // If the current user is the creator of the QR
        if ($token->created_by_account_id === $userWalletId) {
            return Inertia::render("transactions/qr/shared/QrPage", [
                "id" => $id,
                "token" => $token->load(['fromAccount.user', 'toAccount.user']),
                "goal" => $token->goal,
                "appUrl" => config('app.url')
            ]);
        }

        // Otherwise, they are the "other" party
        switch ($token->goal) {
            case RedirectGoals::SENDER->value:
                return Inertia::render("transactions/qr/update/sender", ["id" => $id, "token" => $token->load(['fromAccount.user', 'toAccount.user'])]);
            case RedirectGoals::SENDERPAY->value:
                return Inertia::render("transactions/qr/update/sender_pay", ["id" => $id, "token" => $token->load(['fromAccount.user', 'toAccount.user'])]);
            case RedirectGoals::RECEIVER->value:
                return Inertia::render("transactions/qr/update/receiver", ["id" => $id, "token" => $token->load(['fromAccount.user', 'toAccount.user'])]);
            case RedirectGoals::STORE->value:
                return Inertia::render("transactions/qr/update/store", ["id" => $id, "token" => $token->load(['fromAccount.user', 'toAccount.user'])]);
            default:
                return redirect()->route('transfer');
        }
    }

    /**
     * This is hit when someone scans the QR code.
     * We update the status to SCANNED and associate the scanning user.
     */
    public function handleScan(string $encryptedToken)
    {
        $tokenStr = Crypt::decryptString($encryptedToken);
        $token = Token::where("token", $tokenStr)->firstOrFail();

        if ($token->expires_at <= now()->subMinute()) {
            $token->update(["status" => TokenStatus::EXPIRED]);
            broadcast(new QrTokenStatusUpdated($token));
            return Inertia::render("transactions/qr/shared/error", ["message" => "This QR code has expired."]);
        }

        if ($token->status === TokenStatus::COMPLETED) {
            return Inertia::render("transactions/qr/shared/success", ["message" => "Transaction already completed."]);
        }

        $user = auth()->user();
        $wallet = $user->wallet;

        // Flow 1: Sender generated QR, Receiver scanned it
        if ($token->goal === RedirectGoals::SENDER->value || $token->goal === RedirectGoals::SENDERPAY->value) {
            if ($token->from_account_id === $wallet->id) {
                return Inertia::render("transactions/qr/shared/error", ["message" => "You cannot scan your own payment QR."]);
            }
            $token->update([
                "to_account_id" => $wallet->id,
                "status" => TokenStatus::SCANNED
            ]);
        } 
        // Flow 2/3: Receiver/Store generated QR, Payer scanned it
        else {
            if ($token->to_account_id === $wallet->id) {
                return Inertia::render("transactions/qr/shared/error", ["message" => "You cannot pay yourself."]);
            }
            $token->update([
                "from_account_id" => $wallet->id,
                "status" => TokenStatus::SCANNED
            ]);
        }

        broadcast(new QrTokenStatusUpdated($token));

        // Redirect to the appropriate update page
        return redirect()->route('qr.update.view', ['id' => $encryptedToken]);
    }

    public function confirmTransaction(Request $request, string $id)
    {
        $tokenStr = Crypt::decryptString($id);
        $token = Token::where("token", $tokenStr)->firstOrFail();

        if ($token->status === TokenStatus::COMPLETED) {
            return back()->withErrors("Transaction already completed.");
        }

        if ($token->expires_at <= now()) {
            return back()->withErrors("Token expired.");
        }

        $from = $token->fromAccount;
        $to = $token->toAccount;
        $amount = $token->amount ?? $request->amount;

        if (!$from || !$to || !$amount) {
            return response()->json(["success" => false, "message" => "Missing transaction details (amount or accounts)."], 422);
        }

        if ($token->amount === null && $request->amount) {
            $token->update(['amount' => $request->amount]);
        }

        // For Quick Pay (SENDERPAY), we don't complete yet. We wait for Sender approval.
        if ($token->goal === RedirectGoals::SENDERPAY->value) {
            $token->update(["status" => TokenStatus::READY]);
            broadcast(new QrTokenStatusUpdated($token));
            return response()->json(["success" => true, "message" => "Request sent to sender for approval."]);
        }

        if ($from->balance < $amount) {
            return back()->withErrors("Insufficient funds.");
        }

        // Determine type: if receiving, it's a deposit
        $type = in_array($token->goal, [RedirectGoals::RECEIVER->value, RedirectGoals::STORE->value]) ? 'deposit' : 'transfer';

        // Perform the transfer
        TransactionService::create([
            "from" => $from,
            "to" => $to,
            "amount" => $amount,
            "method" => "qr",
            "type" => $type,
        ]);

        $token->update(["status" => TokenStatus::COMPLETED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(["success" => true, "message" => "Transfer completed!"]);
    }

    public function finalApproval(Request $request, string $id)
    {
        $tokenStr = Crypt::decryptString($id);
        $token = Token::where("token", $tokenStr)->firstOrFail();

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(["success" => false, "message" => "Already completed."], 422);
        }

        // Authorize: check if the authenticated user owns the source account
        $account = \App\Models\Account::where('id', $token->from_account_id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$account) {
            return response()->json(["success" => false, "message" => "Unauthorized."], 403);
        }

        $from = $token->fromAccount;
        $to = $token->toAccount;
        $amount = $token->amount;

        if (!$amount || $amount <= 0) {
            return response()->json(["success" => false, "message" => "Invalid amount."], 422);
        }

        if ($from->balance < $amount) {
            return response()->json(["success" => false, "message" => "Insufficient funds."], 422);
        }

        // Determine type: if receiving, it's a deposit
        $type = in_array($token->goal, [RedirectGoals::RECEIVER->value, RedirectGoals::STORE->value]) ? 'deposit' : 'transfer';

        TransactionService::create([
            "from" => $from,
            "to" => $to,
            "amount" => $amount,
            "method" => "qr",
            "type" => $type,
        ]);

        $token->update(["status" => TokenStatus::COMPLETED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(["success" => true, "message" => "Transaction approved and completed!"]);
    }

    public function checkStatus(string $tokenStr)
    {
        $token = Token::where("token", $tokenStr)->with(['toAccount.user', 'fromAccount.user'])->firstOrFail();
        return response()->json([
            "status" => $token->status,
            "token" => $token
        ]);
    }

    public function cancelTransaction(string $id)
    {
        $tokenStr = \Illuminate\Support\Facades\Crypt::decryptString($id);
        $token = Token::where("token", $tokenStr)->firstOrFail();

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(["success" => false, "message" => "Cannot cancel completed transaction."], 422);
        }

        // Log the cancellation as a transaction for report visibility
        TransactionService::create([
            "from" => $token->fromAccount,
            "to" => $token->toAccount,
            "amount" => $token->amount ?? 0,
            "method" => "qr",
            "type" => "transfer",
            "status" => "cancelled",
        ]);

        $token->update(["status" => TokenStatus::CANCELLED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(["success" => true, "message" => "Transaction cancelled."]);
    }

    // Keep these for Inertia rendering compatibility with current routes
    public function updateSender(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
    public function updateReceiver(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
    public function updateReceiverSTORE(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
}
