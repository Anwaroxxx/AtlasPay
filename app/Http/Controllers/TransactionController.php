<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TransactionController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        //

        $validated = $request->validate([
            'from_account_rib' => ['required'],
            'to_account_rib' => ['required'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ]);

        $from = Account::where('account_number', $request->from_account_rib)->first();
        $to = Account::where('account_number', $request->to_account_rib)->first();
        $amount = $request->amount;
        $method = $request->transfer;

        if (! $from || ! $to) {
            return back()->withErrors([
                'message' => 'Invalid account number. Please check the RIB and try again.',
            ], 422);
        }
        if ($from->id === $to->id) {
            return back()->withErrors([
                'message' => 'You cannot transfer money to the same account.',
            ]);
        }
        if ($amount > $from->balance) {

            return back()->withErrors([
                'message' => 'Insufficient funds. Your balance is '.number_format($from->balance, 2).' MAD.',
            ]);
        }
        if ($from->status !== 'active') {
            return back()->withErrors([
                'message' => 'Sender account is not active',
            ]);
        }
        if ($to->status !== 'active') {
            return back()->withErrors([
                'message' => 'Receiver account is not active',
            ]);
        }

        // Gate::authorize("transferMoney",$from);

        if (! auth()->user()->can('transferMoney', $from)) {
            return back()->withErrors([
                'message' => 'You are not authorized to perform this action.',
            ]);
        }

        TransactionService::create([
            'from' => $from,
            'to' => $to,
            'amount' => $amount,
            'method' => $method,
        ]);

        return back()->with('success', 'Transfer of '.number_format($amount, 2).' MAD completed successfully!');
    }
}
