<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Report Endpoints
    Route::get('/reports/transactions', [ReportController::class, 'index'])->name('reports.transactions');

    // Credit Routes
    Route::get('/credits', [CreditController::class, 'index'])->name('credits.index');
    Route::post('/credits', [CreditController::class, 'store'])->name('credits.store');
    Route::post('/credits/{credit}/repay', [CreditController::class, 'repay'])->name('credits.repay');

    // Budget Routes
    Route::post('/budgets', [BudgetController::class, 'store'])->name('budgets.store');

    // Chat Route
    Route::post('/chat', [ChatController::class, 'ask'])->name('chat.ask');
});

require __DIR__.'/settings.php';
