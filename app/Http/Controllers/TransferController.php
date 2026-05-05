<?php

namespace App\Http\Controllers;

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
        
        if ($fromAccount->balance < $request->amount) {
            return back()->withErrors(['message' => 'Insufficient funds in capital reserve.']);
        }

        DB::transaction(function () use ($fromAccount, $request, $method) {
            // Deduct from source
            $fromAccount->decrement('balance', $request->amount);

            // Create Transaction Record
            $transaction = Transaction::create([
                'from_account_id' => $fromAccount->id,
                'to_account_id' => 1, // Default bridge
                'amount' => $request->amount,
                'type' => 'transfer',
                'method' => $method === 'bank' ? 'remittance_bank' : 'remittance_card',
                'category' => $request->category ?: 'Remittance',
                'description' => 'Sovereign Remittance via ' . strtoupper($method),
                'status' => 'completed'
            ]);

            // If real target exists in DB, update record and increment balance
            if ($method !== 'qr') {
                $toAccount = Account::where('account_number', $request->to_account_rib)->first();
                if ($toAccount) {
                    $transaction->update(['to_account_id' => $toAccount->id]);
                    $toAccount->increment('balance', $request->amount);
                    
                    // Notify Recipient
                    event(new \App\Events\TransactionCreated($transaction, $toAccount->user_id, true));
                }
            }

            // Notify Sender
            event(new \App\Events\TransactionCreated($transaction, $request->user()->id, false));
        });

        return back()->with(['message' => 'Capital deployment successful.']);
    }
}
