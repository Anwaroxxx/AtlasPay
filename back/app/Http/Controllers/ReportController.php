<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Services\GroqService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Generate a detailed report of transactions and activities.
     */
    public function index(Request $request, GroqService $groqService)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $now = Carbon::now();
        $accounts = $user->accounts()->get();
        $accountIds = $accounts->pluck('id')->toArray();

        // 1. Current Month Category Spending (Everything leaving the user's accounts to outside)
        $currentMonthSpending = Transaction::whereIn('from_account_id', $accountIds)
            ->whereNotIn('to_account_id', $accountIds)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
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

        // 3. Monthly Trends (Last 6 Months) - Outgoing spending
        $trends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $total = Transaction::whereIn('from_account_id', $accountIds)
                ->whereNotIn('to_account_id', $accountIds)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('amount');

            $trends[] = [
                'month' => $month->format('M'),
                'total' => (float) $total,
            ];
        }

        // 4. AI Insights
        $aiInsights = $groqService->analyzeSpending($currentMonthSpending, $budgets);

        // 5. Paginated & Filtered Transactions
        $query = Transaction::query()
            ->where(function ($q) use ($accountIds) {
                $q->whereIn('from_account_id', $accountIds)
                    ->orWhereIn('to_account_id', $accountIds);
            });

        $query->where(function ($q) use ($request) {
            if ($request->filled('search')) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('category', 'like', '%'.$request->search.'%')
                        ->orWhere('method', 'like', '%'.$request->search.'%')
                        ->orWhere('description', 'like', '%'.$request->search.'%');
                });
            }

            if ($request->filled('type') && $request->type !== 'all') {
                $q->where('type', $request->type);
            }

            if ($request->filled('date_from')) {
                $q->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $q->whereDate('created_at', '<=', $request->date_to);
            }
        });

        $transactions = $query->orderBy('created_at', 'desc')->paginate(5)->withQueryString();

        $transactions->getCollection()->transform(function ($transaction) use ($accountIds) {
            $transaction->is_income = in_array($transaction->to_account_id, $accountIds) || $transaction->type === 'deposit';

            return $transaction;
        });

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
                'filters' => $request->only(['search', 'type', 'category', 'date_from', 'date_to']),
            ],
        ]);
    }

    /**
     * Export transactions as PDF.
     */
    public function exportPdf(Request $request)
    {
        $user = $request->user();
        $accountIds = $user->accounts()->pluck('id')->toArray();

        $query = Transaction::query()
            ->where(function ($q) use ($accountIds) {
                $q->whereIn('from_account_id', $accountIds)
                    ->orWhereIn('to_account_id', $accountIds);
            });

        // Apply same filters as index
        if ($request->has('search')) {
            $query->where('category', 'like', '%'.$request->search.'%');
        }
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('pdf.transactions', [
            'transactions' => $transactions,
            'user' => $user,
            'date' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('AtlasPay_Transactions_'.now()->format('Ymd').'.pdf');
    }
}
