<?php

namespace App\Http\Controllers\Api;

use App\Events\TransactionCreated;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransferController extends Controller
{
    /**
     * Mobile transfer (bank/card). Same rules as web:
     * owned active sender, no self-transfer, 5 MAD fee, row locks.
     */
    public function process(Request $request, $method)
    {
        $validated = $request->validate([
            'from_account_rib' => 'required|exists:accounts,account_number',
            'to_account_rib' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'nullable|string|max:255',
        ]);

        if (! in_array($method, ['bank', 'card'])) {
            throw ValidationException::withMessages([
                'message' => 'Unsupported transfer method. Use bank or card (QR flows use the QR endpoints).',
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

            $fromAccount->decrement('balance', $totalDeduction);

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

                event(new TransactionCreated($transaction, $toAccount->user_id, true));
            }

            event(new TransactionCreated($transaction, $request->user()->id, false));

            return $transaction;
        });

        return response()->json([
            'message' => 'Capital deployment successful.',
            'transaction' => $transaction,
        ]);
    }
}
