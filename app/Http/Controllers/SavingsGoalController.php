<?php

namespace App\Http\Controllers;

use App\Models\SavingsGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SavingsGoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = $request->user()->savingsGoals()->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('savings/index', [
            'goals' => $goals,
            'accounts' => $request->user()->accounts()->where('status', 'active')->get(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'target_amount' => 'required|numeric|min:1',
                'target_date' => 'required|date',
                'initial_deposit' => 'nullable|numeric|min:0',
            ]);

            $account = $request->user()->accounts()->where('status', 'active')->first();
            if ($request->initial_deposit > 0) {
                if (!$account || $account->balance < $request->initial_deposit) {
                    return redirect()->back()->withErrors(['initial_deposit' => 'Insufficient funds in your primary account.']);
                }
            }

            $targetDate = Carbon::parse($request->target_date);
            $months = max(1, now()->diffInMonths($targetDate));
            $monthlyDeduction = $request->target_amount / $months;

            $goal = $request->user()->savingsGoals()->create([
                'name' => $request->name,
                'target_amount' => $request->target_amount,
                'current_amount' => $request->initial_deposit ?? 0,
                'target_date' => $targetDate,
                'monthly_deduction' => $monthlyDeduction,
                'locked_until' => $targetDate,
                'status' => 'active',
            ]);

            if ($request->initial_deposit > 0 && $account) {
                $account->decrement('balance', $request->initial_deposit);
                
                // Record the vault deposit
                \App\Models\Transaction::create([
                    'from_account_id' => $account->id,
                    'to_account_id' => $account->id, // Internal move
                    'amount' => $request->initial_deposit,
                    'method' => 'vault_deposit',
                    'category' => 'SAVINGS',
                    'status' => 'completed',
                    'description' => "Initial deposit for vault: {$request->name}"
                ]);
            }

            return redirect()->back()->with('message', 'Savings Goal established and initial funds secured.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['name' => 'Failed to create goal: ' . $e->getMessage()]);
        }
    }

    public function unlock(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($goal->status !== 'active') {
            return redirect()->back()->withErrors(['message' => 'This vault is already unlocked or completed.']);
        }

        $account = $request->user()->accounts()->where('status', 'active')->first();
        if (!$account) {
            return redirect()->back()->withErrors(['message' => 'No active account found to return funds.']);
        }

        $currentAmount = (float) $goal->current_amount;
        $penalty = 0;
        
        // Apply 2% emergency fee if unlocked before target date
        if (now()->lt(Carbon::parse($goal->target_date))) {
            $penalty = $currentAmount * 0.02;
        }

        $returnAmount = $currentAmount - $penalty;

        if ($returnAmount > 0) {
            $account->increment('balance', $returnAmount);

            // Record the return transaction
            \App\Models\Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'amount' => $returnAmount,
                'method' => 'vault_withdrawal',
                'category' => 'SAVINGS',
                'status' => 'completed',
                'description' => "Emergency unlock withdrawal for: {$goal->name} (Fees: " . number_format($penalty, 2) . " MAD)"
            ]);
        }

        $goal->update(['status' => 'unlocked']);

        return redirect()->back()->with('message', 'Vault emergency access granted. Funds returned to your account minus protocol fees.');
    }
}
