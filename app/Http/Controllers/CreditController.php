<?php

namespace App\Http\Controllers;

use App\Models\Credit;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CreditController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $credits = $user->credits()->orderBy('created_at', 'desc')->get();
        $activeCredit = $user->credits()->where('status', 'active')->first();

        return Inertia::render('credits/index', [
            'credits' => $credits,
            'activeCredit' => $activeCredit,
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
            return back()->withErrors(['amount' => "Your credit score allows a maximum of {$maxAmount} MAD."]);
        }

        if ($user->credits()->where('status', 'active')->exists()) {
            return back()->withErrors(['amount' => 'You already have an active credit.']);
        }

        try {
            $interestRate = 0.08;
            $totalToPay = $request->amount * (1 + $interestRate);

            DB::transaction(function () use ($user, $request, $totalToPay, $interestRate) {
                $account = $user->accounts()->where('status', 'active')->first();
                
                if (!$account) {
                    throw new \Exception('No active account found to deposit the credit.');
                }

                Credit::create([
                    'user_id' => $user->id,
                    'amount' => $request->amount,
                    'total_to_pay' => $totalToPay,
                    'interest_rate' => $interestRate * 100,
                    'due_date' => Carbon::now()->addMonths((int) $request->duration_months),
                    'status' => 'active',
                ]);

                $account->increment('blance', $request->amount);

                // Create transaction record
                Transaction::create([
                    'from_account_id' => $account->id, // Representing the bank as source
                    'to_account_id' => $account->id,   // Destination is user's account
                    'amount' => $request->amount,
                    'type' => 'deposit',
                    'method' => 'bank_credit',
                    'category' => 'Credit',
                    'status' => 'completed',
                ]);
            });

            return back()->with('success', 'Credit approved and deposited into your account.');
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }

    public function repay(Request $request, Credit $credit)
    {
        if ($credit->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($credit->status !== 'active') {
            return back()->withErrors(['amount' => 'This credit is already settled.']);
        }

        try {
            $user = $request->user();
            $isOnTime = Carbon::now()->lte($credit->due_date);

            DB::transaction(function () use ($user, $credit, $isOnTime) {
                $account = $user->accounts()->where('status', 'active')
                    ->where('blance', '>=', $credit->total_to_pay)
                    ->first();

                if (!$account) {
                    throw new \Exception('No active account with sufficient balance found for repayment.');
                }

                $credit->update([
                    'repaid_amount' => $credit->total_to_pay,
                    'status' => 'paid',
                ]);

                $account->decrement('blance', $credit->total_to_pay);

                // Create transaction record
                \App\Models\Transaction::create([
                    'from_account_id' => $account->id,
                    'to_account_id' => $account->id, // Representing bank as destination
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

            return back()->with('success', 'Credit repaid successfully! Your credit score has been updated.');
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
}
