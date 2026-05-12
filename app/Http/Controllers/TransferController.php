<?php

namespace App\Http\Controllers;

use App\Events\TransactionCreated;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $request->validate([
            'from_account_rib' => 'required|exists:accounts,account_number',
            'to_account_rib' => 'required',
            'amount' => 'required|numeric|min:1',
            'category' => 'nullable|string',
        ]);

        $fromAccount = Account::where('account_number', $request->from_account_rib)->first();

        $processingFee = 5.00;
        $totalDeduction = $request->amount + $processingFee;

        if ($fromAccount->balance < $totalDeduction) {
            return back()->withErrors(['message' => 'Insufficient funds. Required: '.number_format($totalDeduction, 2).' MAD (includes 5 MAD fee).']);
        }

        DB::transaction(function () use ($fromAccount, $request, $method, $processingFee) {
            // Deduct from source (Amount + Fee)
            $fromAccount->decrement('balance', $request->amount + $processingFee);

            // Create main transaction
            $transaction = Transaction::create([
                'from_account_id' => $fromAccount->id,
                'to_account_id' => 1, // Default bridge
                'amount' => $request->amount,
                'type' => 'transfer',
                'method' => $method === 'bank' ? 'remittance_bank' : 'remittance_card',
                'category' => $request->category ?: 'Remittance',
                'description' => 'Sovereign Remittance via '.strtoupper($method),
                'status' => 'completed',
            ]);

            // If real target exists in DB, update record and increment balance
            if ($method !== 'qr') {
                $toAccount = Account::where('account_number', $request->to_account_rib)->first();
                if ($toAccount) {
                    $transaction->update(['to_account_id' => $toAccount->id]);
                    $toAccount->increment('balance', $request->amount);

                    // Notify Recipient
                    event(new TransactionCreated($transaction, $toAccount->user_id, true));
                }
            }

            // Notify Sender
            event(new TransactionCreated($transaction, $request->user()->id, false));
        });

        return back()->with(['message' => 'Capital deployment successful.']);
    }
}
