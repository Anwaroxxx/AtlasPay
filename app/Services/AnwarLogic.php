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
            ->where('type', 'deposit')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // 2. Spending Behavior
        $spending = Transaction::whereIn('from_account_id', $accountIds)
            ->where('type', 'transfer')
            ->select('category', \DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // 3. Projections (Next 6 Months)
        $monthlyIncome = Transaction::whereIn('to_account_id', $accountIds)
            ->where('type', 'deposit')
            ->where('created_at', '>=', $now->copy()->subMonths(3))
            ->sum('amount') / 3;

        $monthlyExpenses = Transaction::whereIn('from_account_id', $accountIds)
            ->where('type', 'transfer')
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

    private static function getSeasonalNudges($now)
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
     * Simulate a "What If" scenario using real AI logic.
     */
    public static function simulate($user, $scenario)
    {
        $groq = new GroqService();
        $context = 'You are SmartBanking AI. Evaluate the feasibility of a financial scenario for a Moroccan user. Answer in one or two sharp, premium sentences.';
        $prompt = "Scenario: $scenario. User has " . $user->accounts()->sum('balance') . " MAD.";

        $answer = $groq->chat([
            ['role' => 'user', 'content' => $prompt]
        ], $context);

        return [
            'message' => $answer,
            'feasible' => !str_contains(strtolower($answer), 'not feasible') && !str_contains(strtolower($answer), 'error')
        ];
    }
}
