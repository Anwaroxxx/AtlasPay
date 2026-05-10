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
        $goals = $request->user()->savingsGoals()
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();
        
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
                    'type' => 'withdrawal',
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

    public function requestUnlock(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            abort(403);
        }

        // Set default code to 0000 for development as requested
        $code = "0000";
        
        // Store in cache for 10 minutes
        \Illuminate\Support\Facades\Cache::put("vault_unlock_{$goal->id}", $code, now()->addMinutes(10));

        // Send 'Email' (In this case, we'll use a notification and log it)
        $user = $request->user();
        \Illuminate\Support\Facades\Log::info("VAULT UNLOCK CODE for {$user->email}: {$code}");
        
        // Dispatch real-time notification
        event(new \App\Events\GenericNotification(
            $user->id,
            'Vault Unlock Code',
            "Your authorization code for '{$goal->name}' is: {$code}. Valid for 10 minutes.",
            'warning'
        ));

        return redirect()->back()->with('message', 'A verification code has been dispatched to your secure contact. Please enter it to authorize the liquidation.');
    }

    public function unlock(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'code' => 'required|numeric',
        ]);

        $cachedCode = \Illuminate\Support\Facades\Cache::get("vault_unlock_{$goal->id}");

        if (!$cachedCode || (int)$request->code !== (int)$cachedCode) {
            return redirect()->back()->withErrors(['code' => 'Invalid or expired authorization code. Access denied.']);
        }

        // Clear the code after use
        \Illuminate\Support\Facades\Cache::forget("vault_unlock_{$goal->id}");

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

            // 1. Record the return of funds
            \App\Models\Transaction::create([
                'from_account_id' => $account->id,
                'to_account_id' => $account->id,
                'type' => 'deposit',
                'amount' => $returnAmount,
                'method' => 'vault_withdrawal',
                'category' => 'SAVINGS',
                'status' => 'completed',
                'description' => "Emergency Vault Liquidated: {$goal->name}. Funds returned to balance."
            ]);

            // 2. Record the fee specifically if it exists
            if ($penalty > 0) {
                \App\Models\Transaction::create([
                    'from_account_id' => $account->id,
                    'to_account_id' => $account->id,
                    'type' => 'withdrawal',
                    'amount' => $penalty,
                    'method' => 'vault_fee',
                    'category' => 'FEES',
                    'status' => 'completed',
                    'description' => "Protocol Fee (2.0%) for early vault liquidation: {$goal->name}"
                ]);
            }
        }

        // Soft delete the goal
        $goal->delete();

        return redirect()->back()->with('message', 'Vault emergency access granted. Protocol fees applied and goal archived.');
    }
}
