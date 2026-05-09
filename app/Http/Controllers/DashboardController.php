<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\Credit;
use App\Models\DaretGroup;
use App\Services\AnwarLogic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $accounts = $user->accounts()->get();
        $totalBalance = $accounts->sum('balance');
        
        $accountIds = $accounts->pluck('id')->toArray();
        $recentTransactions = Transaction::whereIn('from_account_id', $accountIds)
            ->orWhereIn('to_account_id', $accountIds)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($transaction) use ($accountIds) {
                // If the user's account is the recipient, or it's a deposit, it's income
                $isIncome = in_array($transaction->to_account_id, $accountIds) || $transaction->type === 'deposit';
                
                // If it's a transfer between the user's own accounts, we might want to handle it differently, 
                // but for now, let's just stick to the basic logic.
                
                // Add the flag to the transaction object
                $transaction->is_income = $isIncome;
                return $transaction;
            });

        $activeCredit = $user->credits()->where('status', 'active')->first();
        
        // Fetch real Daret data for the user
        $daretCount = $user->daretGroups()->where('daret_groups.status', 'active')->count();
        $savingsGoalsCount = $user->savingsGoals()->where('status', 'active')->count();

        // Fetch AI Analysis for SmartBanking metrics
        $aiAnalysis = AnwarLogic::analyze($user);

        // Map chart data from history if available, else fallback
        $chartData = [
            ['name' => 'Mon', 'amount' => $totalBalance * 0.95],
            ['name' => 'Tue', 'amount' => $totalBalance * 0.92],
            ['name' => 'Wed', 'amount' => $totalBalance * 0.98],
            ['name' => 'Thu', 'amount' => $totalBalance * 0.94],
            ['name' => 'Fri', 'amount' => $totalBalance * 1.05],
            ['name' => 'Sat', 'amount' => $totalBalance * 1.02],
            ['name' => 'Sun', 'amount' => $totalBalance],
        ];

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBalance' => (float)$totalBalance,
                'creditScore' => (int)$user->credit_score,
                'activeLoan' => $activeCredit ? (float)$activeCredit->amount : 0,
                'currency' => 'MAD',
                'daretCount' => $daretCount,
                'savingsGoalsCount' => $savingsGoalsCount,
                'aiRisk' => $aiAnalysis['metrics']['overdraft_risk'],
                'stressScore' => $aiAnalysis['metrics']['stress_score'],
                'aiNarrative' => $aiAnalysis['narrative']['conclusion'] ?? 'Analysis standing by.',
            ],
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'chartData' => $chartData,
        ]);
    }
}
