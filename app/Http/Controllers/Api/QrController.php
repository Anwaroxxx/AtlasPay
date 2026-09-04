<?php

namespace App\Http\Controllers\Api;

use App\Enums\QrTypes;
use App\Enums\RedirectGoals;
use App\Enums\TokenStatus;
use App\Events\QrTokenStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Token;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class QrController extends Controller
{
    /**
     * Create a QR token. $type: sender|quickpay|receiver|store
     * Returns the encrypted id + raw token (mobile renders the QR itself).
     */
    public function create(Request $request, $type)
    {
        $request->validate([
            'from_account_id' => 'nullable|exists:accounts,id',
            'amount' => 'nullable|numeric|min:0.01',
        ]);

        $map = [
            'sender' => QrTypes::SENDER,
            'quickpay' => QrTypes::SENDERPAY,
            'receiver' => QrTypes::RECEIVER,
            'store' => QrTypes::STORE,
        ];

        if (! isset($map[$type])) {
            return response()->json(['message' => 'Unknown QR type.'], 422);
        }

        $qrType = $map[$type];

        if ($qrType === QrTypes::SENDER && ! $request->filled('amount')) {
            return response()->json(['message' => 'Amount is required for sender QR.'], 422);
        }

        $wallet = $request->user()->wallet;
        if (! $wallet) {
            return response()->json(['message' => 'No wallet found.'], 404);
        }

        $fromAccountId = $request->input('from_account_id', $wallet->id);
        $account = Account::where('id', $fromAccountId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $account) {
            return response()->json(['message' => 'Invalid account selected.'], 422);
        }

        switch ($qrType) {
            case QrTypes::SENDER:
                $tokenData = ['from_account_id' => $account->id, 'to_account_id' => null, 'amount' => $request->amount, 'goal' => RedirectGoals::SENDER];
                break;
            case QrTypes::SENDERPAY:
                $tokenData = ['from_account_id' => $account->id, 'to_account_id' => null, 'goal' => RedirectGoals::SENDERPAY];
                break;
            case QrTypes::RECEIVER:
                $tokenData = ['from_account_id' => null, 'to_account_id' => $account->id, 'amount' => $request->amount, 'goal' => RedirectGoals::RECEIVER];
                break;
            default:
                $tokenData = ['from_account_id' => null, 'to_account_id' => $account->id, 'amount' => $request->amount, 'goal' => RedirectGoals::STORE];
                break;
        }

        $token = Token::create([
            'token' => (string) Str::uuid(),
            'created_by_account_id' => $wallet->id,
            'expires_at' => $qrType === QrTypes::STORE ? now()->addYears(10) : now()->addMinutes(10),
            'status' => TokenStatus::PENDING,
            ...$tokenData,
        ]);

        $encrypted = Crypt::encryptString($token->token);

        return response()->json([
            'id' => $encrypted,
            'token' => $token->load(['fromAccount.user', 'toAccount.user']),
        ], 201);
    }

    public function merchantPermanent(Request $request)
    {
        $wallet = $request->user()->wallet;
        if (! $wallet) {
            return response()->json(['message' => 'No wallet found.'], 404);
        }

        $token = Token::where('created_by_account_id', $wallet->id)
            ->where('goal', RedirectGoals::STORE)
            ->whereNull('amount')
            ->where('status', TokenStatus::PENDING)
            ->where('expires_at', '>', now())
            ->orderBy('expires_at', 'desc')
            ->first();

        if (! $token) {
            $token = Token::create([
                'token' => (string) Str::uuid(),
                'created_by_account_id' => $wallet->id,
                'to_account_id' => $wallet->id,
                'expires_at' => now()->addYears(10),
                'status' => TokenStatus::PENDING,
                'goal' => RedirectGoals::STORE,
            ]);
        }

        return response()->json([
            'id' => Crypt::encryptString($token->token),
            'token' => $token->load(['toAccount.user']),
        ]);
    }

    protected function resolveToken(string $id): Token
    {
        return Token::where('token', Crypt::decryptString($id))->firstOrFail();
    }

    public function show(string $id)
    {
        $token = $this->resolveToken($id);

        return response()->json([
            'token' => $token->load(['fromAccount.user', 'toAccount.user']),
        ]);
    }

    public function status(string $tokenStr)
    {
        $token = Token::where('token', $tokenStr)
            ->with(['toAccount.user', 'fromAccount.user'])
            ->firstOrFail();

        return response()->json(['status' => $token->status, 'token' => $token]);
    }

    /**
     * Mobile scan: same rules as web handleScan, returns JSON.
     */
    public function scan(Request $request, string $id)
    {
        $token = $this->resolveToken($id);

        if ($token->expires_at <= now()->subMinute()) {
            $token->update(['status' => TokenStatus::EXPIRED]);
            broadcast(new QrTokenStatusUpdated($token));

            return response()->json(['message' => 'This QR code has expired.'], 410);
        }

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(['message' => 'Transaction already completed.'], 422);
        }

        $wallet = $request->user()->wallet;
        if (! $wallet) {
            return response()->json(['message' => 'No wallet found.'], 404);
        }

        if (in_array($token->goal, [RedirectGoals::SENDER->value, RedirectGoals::SENDERPAY->value])) {
            if ($token->from_account_id === $wallet->id) {
                return response()->json(['message' => 'You cannot scan your own payment QR.'], 422);
            }
            $token->update(['to_account_id' => $wallet->id, 'status' => TokenStatus::SCANNED]);
        } else {
            if ($token->to_account_id === $wallet->id) {
                return response()->json(['message' => 'You cannot pay yourself.'], 422);
            }
            $token->update(['from_account_id' => $wallet->id, 'status' => TokenStatus::SCANNED]);
        }

        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(['token' => $token->load(['fromAccount.user', 'toAccount.user'])]);
    }

    public function confirm(Request $request, string $id)
    {
        $token = $this->resolveToken($id);

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(['success' => false, 'message' => 'Transaction already completed.'], 422);
        }

        if ($token->expires_at <= now()) {
            return response()->json(['success' => false, 'message' => 'Token expired.'], 410);
        }

        $from = $token->fromAccount;
        $to = $token->toAccount;
        $amount = $token->amount ?? $request->input('amount');

        if (! $from || ! $to || ! $amount) {
            return response()->json(['success' => false, 'message' => 'Missing transaction details (amount or accounts).'], 422);
        }

        $userId = $request->user()->id;
        if ($from->user_id !== $userId && $to->user_id !== $userId) {
            return response()->json(['success' => false, 'message' => 'Unauthorized for this token.'], 403);
        }

        if ($from->id === $to->id) {
            return response()->json(['success' => false, 'message' => 'Cannot pay yourself.'], 422);
        }

        if (! is_numeric($amount) || (float) $amount <= 0) {
            return response()->json(['success' => false, 'message' => 'Invalid amount.'], 422);
        }

        if ($token->amount === null && $request->filled('amount')) {
            $token->update(['amount' => $request->input('amount')]);
        }

        if ($token->goal === RedirectGoals::SENDERPAY->value) {
            $token->update(['status' => TokenStatus::READY]);
            broadcast(new QrTokenStatusUpdated($token));

            return response()->json(['success' => true, 'message' => 'Request sent to sender for approval.']);
        }

        if ((float) $from->balance < (float) $amount) {
            return response()->json(['success' => false, 'message' => 'Insufficient funds.'], 422);
        }

        $type = in_array($token->goal, [RedirectGoals::RECEIVER->value, RedirectGoals::STORE->value]) ? 'deposit' : 'transfer';

        TransactionService::create(['from' => $from, 'to' => $to, 'amount' => $amount, 'method' => 'qr', 'type' => $type]);

        $token->update(['status' => TokenStatus::COMPLETED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(['success' => true, 'message' => 'Transfer completed!']);
    }

    public function approve(Request $request, string $id)
    {
        $token = $this->resolveToken($id);

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(['success' => false, 'message' => 'Already completed.'], 422);
        }

        $account = Account::where('id', $token->from_account_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $account) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $from = $token->fromAccount;
        $to = $token->toAccount;
        $amount = $token->amount;

        if (! $amount || (float) $amount <= 0) {
            return response()->json(['success' => false, 'message' => 'Invalid amount.'], 422);
        }

        if ((float) $from->balance < (float) $amount) {
            return response()->json(['success' => false, 'message' => 'Insufficient funds.'], 422);
        }

        $type = in_array($token->goal, [RedirectGoals::RECEIVER->value, RedirectGoals::STORE->value]) ? 'deposit' : 'transfer';

        TransactionService::create(['from' => $from, 'to' => $to, 'amount' => $amount, 'method' => 'qr', 'type' => $type]);

        $token->update(['status' => TokenStatus::COMPLETED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(['success' => true, 'message' => 'Transaction approved and completed!']);
    }

    public function cancel(string $id)
    {
        $token = $this->resolveToken($id);

        if ($token->status === TokenStatus::COMPLETED) {
            return response()->json(['success' => false, 'message' => 'Cannot cancel completed transaction.'], 422);
        }

        TransactionService::create([
            'from' => $token->fromAccount,
            'to' => $token->toAccount,
            'amount' => $token->amount ?? 0,
            'method' => 'qr',
            'type' => 'transfer',
            'status' => 'cancelled',
        ]);

        $token->update(['status' => TokenStatus::CANCELLED]);
        broadcast(new QrTokenStatusUpdated($token));

        return response()->json(['success' => true, 'message' => 'Transaction cancelled.']);
    }
}
