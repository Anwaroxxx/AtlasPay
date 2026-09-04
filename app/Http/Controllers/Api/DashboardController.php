<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\AnwarLogic;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Same data as the Inertia dashboard, as JSON for mobile.
     * Pass ?with_ai=1 to include the Groq narrative (slower).
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $accounts = $user->accounts()->get();
        $totalBalance = (float) $accounts->sum('balance');
        $accountIds = $accounts->pluck('id')->toArray();

        $recentTransactions = Transaction::whereIn('from_account_id', $accountIds)
            ->orWhereIn('to_account_id', $accountIds)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($transaction) use ($accountIds) {
                $transaction->is_income = in_array($transaction->to_account_id, $accountIds)
                    || $transaction->type === 'deposit';

                return $transaction;
            });

        $activeCredit = $user->credits()->where('status', 'active')->first();
        $daretCount = $user->daretGroups()->where('daret_groups.status', 'active')->count();
        $savingsGoalsCount = $user->savingsGoals()->where('status', 'active')->count();

        $payload = [
            'stats' => [
                'totalBalance' => $totalBalance,
                'creditScore' => (int) $user->credit_score,
                'activeLoan' => $activeCredit ? (float) $activeCredit->amount : 0,
                'currency' => 'MAD',
                'daretCount' => $daretCount,
                'savingsGoalsCount' => $savingsGoalsCount,
            ],
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
        ];

        if ($request->boolean('with_ai')) {
            try {
                $aiAnalysis = AnwarLogic::analyze($user);
                $payload['stats']['aiRisk'] = $aiAnalysis['metrics']['overdraft_risk'];
                $payload['stats']['stressScore'] = $aiAnalysis['metrics']['stress_score'];
                $payload['stats']['aiNarrative'] = $aiAnalysis['narrative']['conclusion'] ?? 'Analysis standing by.';
                $payload['ai'] = $aiAnalysis;
            } catch (\Throwable $e) {
                $payload['stats']['aiNarrative'] = 'AI analysis unavailable.';
            }
        }

        return response()->json($payload);
    }

    public function accounts(Request $request)
    {
        return response()->json($request->user()->accounts()->get());
    }

    public function transactions(Request $request)
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'category' => 'nullable|string',
            'method' => 'nullable|string',
        ]);

        $accountIds = $request->user()->accounts()->pluck('id')->toArray();

        $query = Transaction::whereIn('from_account_id', $accountIds)
            ->orWhereIn('to_account_id', $accountIds)
            ->orderBy('created_at', 'desc');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        $transactions = $query->paginate($request->input('per_page', 20));

        $transactions->getCollection()->transform(function ($transaction) use ($accountIds) {
            $transaction->is_income = in_array($transaction->to_account_id, $accountIds)
                || $transaction->type === 'deposit';

            return $transaction;
        });

        return response()->json($transactions);
    }
}
