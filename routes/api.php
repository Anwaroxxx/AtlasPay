<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CreditController;
use App\Http\Controllers\Api\DaretController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\QrController;
use App\Http\Controllers\Api\SavingsController;
use App\Http\Controllers\Api\TransferController;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AtlasPay Mobile API (Sanctum tokens)
|--------------------------------------------------------------------------
| Consumed by ../AtlasPayMobile (React Native / Expo).
| Same Laravel backend + same database as the Inertia web app.
| Base URL: {APP_URL}/api  (e.g. http://localhost:8000/api)
*/

// Public
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Authenticated (Bearer token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me'])->name('api.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // Dashboard / accounts / history
    Route::get('/dashboard', [DashboardController::class, 'summary'])->name('api.dashboard');
    Route::get('/accounts', [DashboardController::class, 'accounts'])->name('api.accounts');
    Route::get('/transactions', [DashboardController::class, 'transactions'])->name('api.transactions');

    // Transfers (bank/card)
    Route::post('/transfer/{method}', [TransferController::class, 'process'])->name('api.transfer');

    // QR Vault
    Route::post('/qr/create/{type}', [QrController::class, 'create'])->name('api.qr.create');
    Route::get('/qr/merchant/permanent', [QrController::class, 'merchantPermanent'])->name('api.qr.merchant');
    Route::get('/qr/{id}', [QrController::class, 'show'])->name('api.qr.show');
    Route::post('/qr/{id}/scan', [QrController::class, 'scan'])->name('api.qr.scan');
    Route::post('/qr/{id}/confirm', [QrController::class, 'confirm'])->name('api.qr.confirm');
    Route::post('/qr/{id}/approve', [QrController::class, 'approve'])->name('api.qr.approve');
    Route::post('/qr/{id}/cancel', [QrController::class, 'cancel'])->name('api.qr.cancel');
    Route::get('/qr/status/{token}', [QrController::class, 'status'])->name('api.qr.status');

    // Daret circles
    Route::get('/daret', [DaretController::class, 'index'])->name('api.daret.index');
    Route::post('/daret', [DaretController::class, 'store'])->name('api.daret.store');
    Route::get('/daret/users', [DaretController::class, 'users'])->name('api.daret.users');
    Route::post('/daret/{group}/pay', [DaretController::class, 'pay'])->name('api.daret.pay');
    Route::post('/daret/{group}/accept', [DaretController::class, 'accept'])->name('api.daret.accept');
    Route::post('/daret/{group}/decline', [DaretController::class, 'decline'])->name('api.daret.decline');

    // Credits
    Route::get('/credits', [CreditController::class, 'index'])->name('api.credits.index');
    Route::post('/credits', [CreditController::class, 'store'])->name('api.credits.store');
    Route::post('/credits/{credit}/repay', [CreditController::class, 'repay'])->name('api.credits.repay');

    // Savings + budgets
    Route::get('/savings', [SavingsController::class, 'index'])->name('api.savings.index');
    Route::post('/savings', [SavingsController::class, 'store'])->name('api.savings.store');
    Route::post('/savings/{goal}/request-unlock', [SavingsController::class, 'requestUnlock'])->name('api.savings.request-unlock');
    Route::post('/savings/{goal}/unlock', [SavingsController::class, 'unlock'])->name('api.savings.unlock');
    Route::get('/budgets', [SavingsController::class, 'budgets'])->name('api.budgets.index');
    Route::post('/budgets', [SavingsController::class, 'storeBudget'])->name('api.budgets.store');

    // AI chat (same Groq brain as web BankBot)
    Route::post('/chat', [ChatController::class, 'ask'])->name('api.chat');
});
