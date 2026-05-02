<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\Credit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $accounts = $user->accounts()->get();
        $totalBalance = $accounts->sum('blance');
        
        $recentTransactions = Transaction::whereIn('from_account_id', $accounts->pluck('id'))
            ->orWhereIn('to_account_id', $accounts->pluck('id'))
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $activeCredit = $user->credits()->where('status', 'active')->first();
        
        // fake data bima 
        $chartData = [
            ['name' => 'Mon', 'amount' => 400],
            ['name' => 'Tue', 'amount' => 300],
            ['name' => 'Wed', 'amount' => 600],
            ['name' => 'Thu', 'amount' => 800],
            ['name' => 'Fri', 'amount' => 500],
            ['name' => 'Sat', 'amount' => 900],
            ['name' => 'Sun', 'amount' => 700],
        ];

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBalance' => $totalBalance,
                'creditScore' => $user->credit_score,
                'activeLoan' => $activeCredit ? $activeCredit->amount : 0,
                'currency' => 'MAD',
            ],
            'recentTransactions' => $recentTransactions,
            'chartData' => $chartData,
        ]);
    }
}
