<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Credit;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreditController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'credits' => $user->credits()->orderBy('created_at', 'desc')->get(),
            'activeCredit' => $user->credits()->where('status', 'active')->first(),
            'creditScore' => $user->credit_score,
            'maxCreditAmount' => $user->credit_score * 10,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'duration_months' => 'required|integer|min:1|max:12',
        ]);

        $user = $request->user();
        $maxAmount = $user->credit_score * 10;

        if ($request->amount > $maxAmount) {
            throw ValidationException::withMessages([
                'amount' => "Your credit score allows a maximum of {$maxAmount} MAD.",
            ]);
        }

        if ($user->credits()->where('status', 'active')->exists()) {
            throw ValidationException::withMessages([
                'amount' => 'You already have an active credit.',
            ]);
        }

        $interestRate = 0.08;
        $originationFeeRate = 0.015;
        $totalToPay = $request->amount * (1 + $interestRate);
        $originationFee = $request->amount * $originationFeeRate;
        $payoutAmount = $request->amount - $originationFee;

        $credit = DB::transaction(function () use ($user, $request, $totalToPay, $interestRate, $payoutAmount, $originationFee) {
            $account = $user->accounts()->where('status', 'active')->lockForUpdate()->first();

            if (! $account) {
                throw ValidationException::withMessages(['amount' => 'No active account found to deposit the credit.']);
            }

            $credit = Credit::create([
                'user_id' => $user->id,
                'amount' => $request->amount,
                'total_to_pay' => $totalToPay,
                'interest_rate' => $interestRate * 100,
                'due_date' => Carbon::now()->addMonths((int) $request->duration_months),
                'status' => 'active',
            ]);

            $account->increment('balance', $payoutAmount);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'amount' => $payoutAmount,
                'type' => 'deposit',
                'method' => 'bank_credit',
                'category' => 'Credit Payout',
                'description' => "Credit payout (Gross: {$request->amount} MAD, Origination Fee: {$originationFee} MAD)",
                'status' => 'completed',
            ]);

            return $credit;
        });

        return response()->json(['message' => 'Credit approved and deposited.', 'credit' => $credit], 201);
    }

    public function repay(Request $request, Credit $credit)
    {
        if ($credit->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($credit->status !== 'active') {
            throw ValidationException::withMessages(['amount' => 'This credit is already settled.']);
        }

        $user = $request->user();
        $isOnTime = Carbon::now()->lte($credit->due_date);

        DB::transaction(function () use ($user, $credit, $isOnTime) {
            $account = $user->accounts()->where('status', 'active')
                ->where('balance', '>=', $credit->total_to_pay)
                ->lockForUpdate()
                ->first();

            if (! $account) {
                throw ValidationException::withMessages(['amount' => 'No active account with sufficient balance found for repayment.']);
            }

            $credit->update(['repaid_amount' => $credit->total_to_pay, 'status' => 'paid']);
            $account->decrement('balance', $credit->total_to_pay);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'amount' => $credit->total_to_pay,
                'type' => 'transfer',
                'method' => 'bank_repayment',
                'category' => 'Credit Repayment',
                'status' => 'completed',
            ]);

            if ($isOnTime) {
                $user->increment('credit_score', 50);
            } else {
                $user->decrement('credit_score', 100);
            }
        });

        return response()->json(['message' => 'Credit repaid successfully!']);
    }
}
