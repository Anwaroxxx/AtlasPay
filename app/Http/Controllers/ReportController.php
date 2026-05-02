<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Generate a detailed report of transactions and activities.
     */
    public function index(Request $request, \App\Services\GroqService $groqService)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $now = \Carbon\Carbon::now();
        $accounts = $user->accounts()->get();
        $accountIds = $accounts->pluck('id')->toArray();

        // 1. Current Month Category Spending
        $currentMonthSpending = Transaction::whereIn('from_account_id', $accountIds)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->where('type', 'transfer') // Assuming only transfers count as spending for now
            ->select('category', \DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // 2. Budgets for Current Month
        $budgets = $user->budgets()
            ->where('month', $now->month)
            ->where('year', $now->year)
            ->get()
            ->pluck('amount', 'category')
            ->toArray();

        // 3. Monthly Trends (Last 6 Months)
        $trends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $total = Transaction::whereIn('from_account_id', $accountIds)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');
            
            $trends[] = [
                'month' => $month->format('M'),
                'total' => (float) $total
            ];
        }

        // 4. AI Insights
        $aiInsights = $groqService->analyzeSpending($currentMonthSpending, $budgets);

        // 5. Paginated Transactions
        $transactions = Transaction::whereIn('from_account_id', $accountIds)
            ->orWhereIn('to_account_id', $accountIds)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return Inertia::render('reports/transactions', [
            'reportData' => [
                'categorySpending' => $currentMonthSpending,
                'budgets' => $budgets,
                'trends' => $trends,
                'aiInsights' => $aiInsights,
                'transactions' => $transactions,
                'user' => [
                    'name' => $user->name,
                ],
            ]
        ]);
    }
}
