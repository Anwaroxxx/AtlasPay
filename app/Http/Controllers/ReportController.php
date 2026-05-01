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
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is loaded
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Get system-wide statistics (as requested in the manual report context)
        $systemStats = [
            'total_users' => User::count(),
            'total_accounts' => Account::count(),
            'total_transactions' => Transaction::count(),
        ];

        // Get user's accounts
        $accounts = $user->accounts()->get();
        $accountIds = $accounts->pluck('id')->toArray();

        // Get transactions associated with the user's accounts
        $transactions = Transaction::whereIn('from_account_id', $accountIds)
            ->orWhereIn('to_account_id', $accountIds)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        // Format the response
        $reportData = [
            'overview' => $systemStats,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'goverment_id' => $user->goverment_id,
                'created_at' => $user->created_at,
            ],
            'accounts' => $accounts->map(function ($account) {
                return [
                    'id' => $account->id,
                    'account_number' => $account->acount_number,
                    'type' => $account->type,
                    'currency' => $account->currency,
                    'status' => $account->status,
                    'balance' => $account->blance,
                ];
            }),
            'transactions' => $transactions
        ];

        return Inertia::render('reports/transactions', [
            'reportData' => $reportData
        ]);
    }
}
