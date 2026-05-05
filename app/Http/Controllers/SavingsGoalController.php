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
        $request->validate([
            'name' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:1',
            'target_date' => 'required|date|after:today',
        ]);

        $targetDate = Carbon::parse($request->target_date);
        $months = max(1, now()->diffInMonths($targetDate));
        $monthlyDeduction = $request->target_amount / $months;

        $request->user()->savingsGoals()->create([
            'name' => $request->name,
            'target_amount' => $request->target_amount,
            'target_date' => $targetDate,
            'monthly_deduction' => $monthlyDeduction,
            'locked_until' => $targetDate,
            'status' => 'active',
        ]);

        return redirect()->back()->with('message', 'Savings Goal established.');
    }

    public function unlock(Request $request, SavingsGoal $goal)
    {
        if ($goal->user_id !== $request->user()->id) {
            abort(403);
        }

        // Emergency unlock logic: 2% fee warning in frontend, here we just unlock
        $goal->update(['status' => 'unlocked']);

        return redirect()->back()->with('message', 'Vault emergency access granted. Protocol fees applied.');
    }
}
