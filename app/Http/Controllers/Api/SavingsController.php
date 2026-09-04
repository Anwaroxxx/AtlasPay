<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class SavingsController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'goals' => $request->user()->savingsGoals()->where('status', 'active')->orderBy('created_at', 'desc')->get(),
            'accounts' => $request->user()->accounts()->where('status', 'active')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:1',
            'target_date' => 'required|date|after:today',
            'initial_deposit' => 'nullable|numeric|min:0',
        ]);

        $initial = (float) ($request->initial_deposit ?? 0);
        $account = $request->user()->accounts()->where('status', 'active')->lockForUpdate()->first();

        if ($initial > 0) {
            if (! $account || (float) $account->balance < $initial) {
                throw ValidationException::withMessages(['initial_deposit' => 'Insufficient funds in your primary account.']);
            }
        }

        $targetDate = Carbon::parse($request->target_date);
        $months = max(1, (int) now()->diffInMonths($targetDate));
        $monthlyDeduction = ((float) $request->target_amount) / $months;

        $goal = $request->user()->savingsGoals()->create([
            'name' => $request->name,
            'target_amount' => $request->target_amount,
            'current_amount' => $initial,
            'target_date' => $targetDate,
            'monthly_deduction' => $monthlyDeduction,
            'locked_until' => $targetDate,
            'status' => 'active',
        ]);

        if ($initial > 0 && $account) {
            $account->decrement('balance', $initial);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'type' => 'withdrawal',
                'amount' => $initial,
                'method' => 'vault_deposit',
                'category' => 'SAVINGS',
                'status' => 'completed',
                'description' => "Initial deposit for vault: {$request->name}",
            ]);
        }

        return response()->json(['message' => 'Savings goal created.', 'goal' => $goal], 201);
    }

    public function budgets(Request $request)
    {
        return response()->json($request->user()->budgets()->orderBy('year', 'desc')->orderBy('month', 'desc')->get());
    }

    public function storeBudget(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020|max:2100',
        ]);

        $budget = $request->user()->budgets()->updateOrCreate(
            ['category' => $validated['category'], 'month' => $validated['month'], 'year' => $validated['year']],
            ['amount' => $validated['amount']]
        );

        return response()->json(['message' => 'Budget saved.', 'budget' => $budget], 201);
    }

    public function requestUnlock(Request $request, $goalId)
    {
        $goal = $request->user()->savingsGoals()->findOrFail($goalId);
        $code = '0000';
        Cache::put("vault_unlock_{$goal->id}", $code, now()->addMinutes(10));

        return response()->json(['message' => 'Verification code dispatched.']);
    }

    public function unlock(Request $request, $goalId)
    {
        $goal = $request->user()->savingsGoals()->findOrFail($goalId);
        $request->validate(['code' => 'required']);

        $cachedCode = Cache::get("vault_unlock_{$goal->id}");
        if (! $cachedCode || (int) $request->code !== (int) $cachedCode) {
            throw ValidationException::withMessages(['code' => 'Invalid or expired authorization code.']);
        }

        Cache::forget("vault_unlock_{$goal->id}");

        if ($goal->status !== 'active') {
            throw ValidationException::withMessages(['message' => 'This vault is already unlocked or completed.']);
        }

        $account = $request->user()->accounts()->where('status', 'active')->first();
        if (! $account) {
            throw ValidationException::withMessages(['message' => 'No active account found to return funds.']);
        }

        $currentAmount = (float) $goal->current_amount;
        $penalty = now()->lt(Carbon::parse($goal->target_date)) ? $currentAmount * 0.02 : 0;
        $returnAmount = $currentAmount - $penalty;

        if ($returnAmount > 0) {
            $account->increment('balance', $returnAmount);

            Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'type' => 'deposit',
                'amount' => $returnAmount,
                'method' => 'vault_withdrawal',
                'category' => 'SAVINGS',
                'status' => 'completed',
                'description' => "Emergency Vault Liquidated: {$goal->name}.",
            ]);

            if ($penalty > 0) {
                Transaction::create([
                    'from_account_id' => $account->id,
                    'to_account_id' => $account->id,
                    'type' => 'withdrawal',
                    'amount' => $penalty,
                    'method' => 'vault_fee',
                    'category' => 'FEES',
                    'status' => 'completed',
                    'description' => "Protocol Fee (2.0%) for early vault liquidation: {$goal->name}",
                ]);
            }
        }

        $goal->delete();

        return response()->json(['message' => 'Vault unlocked.', 'returned' => $returnAmount, 'fee' => $penalty]);
    }
}
