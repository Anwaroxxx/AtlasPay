<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
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

    // Transfer Page
    Route::get('/transfer', function () {
        $user = request()->user();
        $accounts = $user->accounts()->where('status', 'active')->get();
        return \Inertia\Inertia::render('transfer', [
            'accounts' => $accounts,
        ]);
    })->name('transfer');

    // Transfer Endpoints (3 methods)
    Route::post("/transfer/bank", [TransactionController::class, 'store'])->defaults("transfer", "transfer")->name('transfer.bank');
    Route::post("/transfer/qr", [TransactionController::class, 'store'])->defaults("transfer", "qr")->name('transfer.qr');
    Route::post("/transfer/card", [TransactionController::class, 'store'])->defaults("transfer", "cash")->name('transfer.card');
});



Route::inertia("/test","test");

Route::middleware(["auth"])->group(function (){
    Route::post("/test/transfer",[TransactionController::class,'store'])->defaults("transfer", "transfer");
    Route::post("/test/qr",[TransactionController::class,'store'])->defaults("transfer", "qr");
    Route::post("/test/card",[TransactionController::class,'store'])->defaults("transfer", "cash");
    // Route::post("/test/",[TransactionController::class,'store'])->defaults("transfer", "qr");
    
});

require __DIR__.'/settings.php';
