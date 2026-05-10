<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\SavingsGoal;
use App\Models\Credit;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnwarLogic
{
    /**
     * Analyze user data and return projections and insights using AI if possible.
     */
    public static function analyze($user)
    {
        $accounts = $user->accounts()->get();
        $accountIds = $accounts->pluck('id')->toArray();
        $now = Carbon::now();

        // 1. Income Patterns
        $deposits = Transaction::whereIn('to_account_id', $accountIds)
            ->whereNotIn('from_account_id', $accountIds) // Exclude internal transfers
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // 2. Spending Behavior
        $spending = Transaction::whereIn('from_account_id', $accountIds)
            ->whereNotIn('to_account_id', $accountIds) // Exclude internal transfers
            ->select('category', \DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // 3. Projections (Next 6 Months)
        $monthlyIncome = Transaction::whereIn('to_account_id', $accountIds)
            ->whereNotIn('from_account_id', $accountIds)
            ->where('created_at', '>=', $now->copy()->subMonths(3))
            ->sum('amount') / 3;

        $monthlyExpenses = Transaction::whereIn('from_account_id', $accountIds)
            ->whereNotIn('to_account_id', $accountIds)
            ->where('created_at', '>=', $now->copy()->subMonths(3))
            ->sum('amount') / 3;

        $projections = [];
        $currentBalance = $accounts->sum('balance');
        for ($i = 0; $i < 6; $i++) {
            $month = $now->copy()->addMonths($i);
            $projections[] = [
                'month' => $month->format('M Y'),
                'balance' => round($currentBalance, 2)
            ];
            $currentBalance += ($monthlyIncome - $monthlyExpenses);
        }

        // 4. Risk & Scores
        $overdraftRisk = $monthlyIncome > 0 ? min(100, round(($monthlyExpenses / $monthlyIncome) * 100)) : 100;
        $stressScore = ($user->credits()->where('status', 'active')->count() * 20) + (int)($overdraftRisk / 2);

        // 5. Get AI Narrative if API Key is available
        $narrative = self::getAINarrative($spending, $monthlyIncome, $monthlyExpenses);

        return [
            'projections' => $projections,
            'metrics' => [
                'monthly_income' => round($monthlyIncome, 2),
                'monthly_expenses' => round($monthlyExpenses, 2),
                'overdraft_risk' => min(100, $overdraftRisk),
                'stress_score' => min(100, $stressScore),
            ],
            'seasonal_nudges' => self::getSeasonalNudges($now),
            'narrative' => $narrative
        ];
    }

    public static function getSeasonalNudges($now)
    {
        $nudges = [];
        $month = $now->month;

        if ($month == 3 || $month == 4) $nudges[] = "Ramadan Cycle: Food & Charity nodes likely to spike (+30%).";
        if ($month == 6 || $month == 7) $nudges[] = "Eid Al-Adha: Exceptional capital deployment detected for ritual livestock.";
        if ($month == 8) $nudges[] = "Summer Surge: Leisure and travel sectors show high volatility.";
        if ($month == 9) $nudges[] = "Educational Reset: Rentrée scolaire detected. Optimize for tuition fees.";

        return $nudges;
    }

    private static function getAINarrative($spending, $income, $expenses)
    {
        $groq = new GroqService();
        $context = 'You are SmartBanking AI. You must return only a JSON object. No other text.
        Format:
        {
          "conclusion": "one sharp sentence about their status",
          "highlight": "one specific category insight",
          "recommendation": "one actionable premium tip",
          "risk_analysis": "short reason for risk level"
        }';
        
        $data = "Data: Income $income MAD, Expenses $expenses MAD. Categories: " . json_encode($spending);
        
        $response = $groq->chat([
            ['role' => 'user', 'content' => $data]
        ], $context);

        // Attempt to parse JSON, fallback to raw if fails
        $clean = trim(str_replace(['```json', '```'], '', $response));
        $json = json_decode($clean, true);

        return $json ?: [
            'conclusion' => $response,
            'highlight' => 'Data analysis complete.',
            'recommendation' => 'Monitor your categories closely.',
            'risk_analysis' => 'Stable.'
        ];
    }

    /**
     * Builds a comprehensive financial context for the Simulation Engine.
     */
    public static function getFullFinancialContext($user)
    {
        $accounts = $user->accounts()->get();
        $accountIds = $accounts->pluck('id')->toArray();
        $now = Carbon::now();

        // Income patterns
        $monthlyIncome = Transaction::whereIn('to_account_id', $accountIds)
            ->whereNotIn('from_account_id', $accountIds)
            ->where('created_at', '>=', $now->copy()->subMonths(3))
            ->sum('amount') / 3;

        // Spending behavior
        $spending = Transaction::whereIn('from_account_id', $accountIds)
            ->whereNotIn('to_account_id', $accountIds)
            ->select('category', \DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // Recurring Debts
        $debts = Credit::where('user_id', $user->id)
            ->where('status', 'active')
            ->get()
            ->map(function ($credit) {
                return [
                    'amount_due' => $credit->total_to_pay - $credit->repaid_amount,
                    'due_date' => $credit->due_date->format('Y-m-d')
                ];
            })->toArray();

        // Active Goals
        $goals = SavingsGoal::where('user_id', $user->id)
            ->where('status', 'active')
            ->get()
            ->map(function ($goal) use ($now) {
                $remaining = $goal->target_amount - $goal->current_amount;
                $monthsLeft = $goal->monthly_deduction > 0 ? ceil($remaining / $goal->monthly_deduction) : 'N/A';
                return [
                    'name' => $goal->name,
                    'target' => $goal->target_amount,
                    'current' => $goal->current_amount,
                    'monthly_deduction' => $goal->monthly_deduction,
                    'estimated_months_to_complete' => $monthsLeft
                ];
            })->toArray();

        return [
            'current_balance' => $accounts->sum('balance'),
            'average_monthly_income' => round($monthlyIncome, 2),
            'spending_categories' => $spending,
            'active_debts' => $debts,
            'active_savings_goals' => $goals,
            'seasonal_nudges' => self::getSeasonalNudges($now),
        ];
    }

    /**
     * Deprecated: Use ChatController directly for simulations.
     */
    public static function simulate($user, $scenario)
    {
        // This is deprecated, moved to ChatController
        return ['message' => 'Use Chat interface', 'feasible' => true];
    }
}
