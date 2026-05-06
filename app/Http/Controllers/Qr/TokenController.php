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

    public function storeReceiver(Request $request)
    {
        return $this->store($request, QrTypes::RECEIVER);
    }

    public function storeReceiverSTORE(Request $request)
    {
        return $this->store($request, QrTypes::STORE);
    }

    public function store(Request $request, QrTypes $qrType)
    {
        $wallet = auth()->user()->wallet;
        
        if (!$wallet) {
            return back()->withErrors("User does not have a wallet account.");
        }

        $walletId = $wallet->id;

        switch ($qrType) {
            case QrTypes::SENDER:
                $tokenData = [
                    "from_account_id" => $walletId,
                    "to_account_id" => null,
                    "amount" => $request->amount,
                    "goal" => RedirectGoals::SENDER
                ];
                break;

            case QrTypes::RECEIVER:
                $tokenData = [
                    "from_account_id" => null,
                    "to_account_id" => $walletId,
                    "amount" => $request->amount ?? null,
                    "goal" => RedirectGoals::RECEIVER
                ];
                break;

            case QrTypes::STORE:
                $tokenData = [
                    "from_account_id" => null,
                    "to_account_id" => $walletId,
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

        return Inertia::render("transactions/qr/shared/QrPage", [
            "id" => $url,
            "token" => $token->load(['fromAccount.user', 'toAccount.user']),
            "goal" => $token->goal
        ]);
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
        if ($token->goal === RedirectGoals::SENDER->value) {
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

        if ($from->balance < $amount) {
            return back()->withErrors("Insufficient funds.");
        }

        // Perform the transfer
        TransactionService::create([
            "from" => $from,
            "to" => $to,
            "amount" => $amount,
            "method" => "qr",
            "type" => "transfer",
        ]);

        $token->update(["status" => TokenStatus::COMPLETED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(["success" => true, "message" => "Transfer completed!"]);
    }

    public function checkStatus(string $tokenStr)
    {
        $token = Token::where("token", $tokenStr)->with(['toAccount.user', 'fromAccount.user'])->firstOrFail();
        return response()->json([
            "status" => $token->status,
            "token" => $token
        ]);
    }

    // Keep these for Inertia rendering compatibility with current routes
    public function updateSender(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
    public function updateReceiver(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
    public function updateReceiverSTORE(Request $request, string $id) { return $this->confirmTransaction($request, $id); }
}
