<?php

namespace App\Http\Controllers;

use App\Events\TransactionCreated;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('transfer', [
            'accounts' => $request->user()->accounts()->get(),
        ]);
    }

    public function process(Request $request, $method)
    {
        $validated = $request->validate([
            'from_account_rib' => 'required|exists:accounts,account_number',
            'to_account_rib' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'nullable|string|max:255',
            'method' => 'sometimes|string',
        ]);

        if (! in_array($method, ['bank', 'card'])) {
            throw ValidationException::withMessages([
                'message' => 'Unsupported transfer method. Use bank or card (QR flows use the QR Vault).',
            ]);
        }

        if ($validated['from_account_rib'] === $validated['to_account_rib']) {
            throw ValidationException::withMessages([
                'message' => 'You cannot transfer to the same account.',
            ]);
        }

        $processingFee = 5.00;
        $amount = (float) $validated['amount'];
        $totalDeduction = $amount + $processingFee;

        $transaction = DB::transaction(function () use ($request, $validated, $method, $amount, $totalDeduction) {
            // Lock the sender row so concurrent transfers can't overdraw.
            $fromAccount = Account::where('account_number', $validated['from_account_rib'])
                ->where('user_id', $request->user()->id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first();

            if (! $fromAccount) {
                throw ValidationException::withMessages([
                    'message' => 'Source account not found or not owned by you.',
                ]);
            }

            if ((float) $fromAccount->balance < $totalDeduction) {
                throw ValidationException::withMessages([
                    'message' => 'Insufficient funds. Required: '.number_format($totalDeduction, 2).' MAD (includes 5 MAD fee).',
                ]);
            }

            // Deduct from source (Amount + Fee)
            $fromAccount->decrement('balance', $totalDeduction);

            // Create main transaction (recipient resolved below; null = external RIB)
            $transaction = Transaction::create([
                'from_account_id' => $fromAccount->id,
                'to_account_id' => null,
                'amount' => $amount,
                'type' => 'transfer',
                'method' => $method === 'bank' ? 'remittance_bank' : 'remittance_card',
                'category' => $validated['category'] ?: 'Remittance',
                'description' => 'Sovereign Remittance via '.strtoupper($method),
                'status' => 'completed',
            ]);

            // If the target exists in our DB, settle internally.
            $toAccount = Account::where('account_number', $validated['to_account_rib'])
                ->lockForUpdate()
                ->first();

            if ($toAccount) {
                if ($toAccount->id === $fromAccount->id) {
                    throw ValidationException::withMessages([
                        'message' => 'You cannot transfer to the same account.',
                    ]);
                }

                $transaction->update(['to_account_id' => $toAccount->id]);
                $toAccount->increment('balance', $amount);

                // Notify Recipient
                event(new TransactionCreated($transaction, $toAccount->user_id, true));
            }

            // Notify Sender
            event(new TransactionCreated($transaction, $request->user()->id, false));

            return $transaction;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Capital deployment successful.',
                'transaction' => $transaction,
            ]);
        }

        return back()->with(['message' => 'Capital deployment successful.']);
    }
}
