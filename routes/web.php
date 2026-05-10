<?php

use App\Enums\RedirectGoals;
use App\Http\Controllers\AnwarTwinController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\DaretController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Qr\TokenController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SavingsGoalController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Models\Token;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('language/{locale}', function ($locale) {
    if (!in_array($locale, ['en', 'fr', 'ar'])) {
        abort(400);
    }
    session()->put('locale', $locale);
    return redirect()->back();
})->name('language.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Report Endpoints
    Route::get('/reports/transactions', [ReportController::class, 'index'])->name('reports.transactions');
    Route::get('/reports/transactions/pdf', [ReportController::class, 'exportPdf'])->name('reports.transactions.pdf');

    // Credit Routes
    Route::get('/credits', [CreditController::class, 'index'])->name('credits.index');
    Route::post('/credits', [CreditController::class, 'store'])->name('credits.store');
    Route::post('/credits/{credit}/repay', [CreditController::class, 'repay'])->name('credits.repay');

    // Budget Routes
    Route::post('/budgets', [BudgetController::class, 'store'])->name('budgets.store');

    // Savings Goals (AutoCut)
    Route::get('/savings', [SavingsGoalController::class, 'index'])->name('savings.index');
    Route::post('/savings', [SavingsGoalController::class, 'store'])->name('savings.store');
    Route::post('/savings/{goal}/request-unlock', [SavingsGoalController::class, 'requestUnlock'])->name('savings.request-unlock');
    Route::post('/savings/{goal}/unlock', [SavingsGoalController::class, 'unlock'])->name('savings.unlock');

    // Daret (Savings Groups) Routes
    Route::get('/daret', [DaretController::class, 'index'])->name('daret.index');
    Route::post('/daret', [DaretController::class, 'store'])->name('daret.store');
    Route::post('/daret/{group}/pay', [DaretController::class, 'pay'])->name('daret.pay');
    Route::post('/daret/{group}/accept', [DaretController::class, 'accept'])->name('daret.accept');
    Route::post('/daret/{group}/decline', [DaretController::class, 'decline'])->name('daret.decline');
    Route::delete('/daret/{group}', [DaretController::class, 'destroy'])->name('daret.destroy');

    // Profile Photo Upload
    Route::post('/settings/profile/photo', function (Illuminate\Http\Request $request) {
        $request->validate(['photo' => 'required|image|max:2048']);
        $path = $request->file('photo')->store('profile-photos', 'public');
        $request->user()->update(['profile_photo' => '/storage/' . $path]);
        return redirect()->back()->with('message', 'Photo updated!');
    })->name('profile.photo');

    // Chat Route
    Route::post('/chat', [ChatController::class, 'ask'])->name('chat.ask');

    // Unified Remittance Engine (Bank, QR, Card)
    Route::get('/transfer', [TransferController::class, 'index'])->name('transfer');
    Route::post('/transfer/{method}', [TransferController::class, 'process'])->name('transfer.process');

    // AI Financial Assistant
    Route::get('/ai', [AnwarTwinController::class, 'index'])->name('ai.index');
    Route::post('/ai/simulate', [AnwarTwinController::class, 'simulate'])->name('ai.simulate');

    // Legacy QR redirect for compatibility
    Route::get('/qr', function () {
        return redirect()->route('transfer');
    })->name('qr');
});

Route::inertia("/test","test");

Route::middleware(["auth"])->group(function () {
    Route::post("/test/transfer", [TransactionController::class, 'store'])->defaults("transfer", "transfer");
    Route::post("/test/qr", [TransactionController::class, 'store'])->defaults("transfer", "qr");
    Route::post("/test/card", [TransactionController::class, 'store'])->defaults("transfer", "cash");
    // Route::post("/test/",[TransactionController::class,'store'])->defaults("transfer", "qr");

});


// QRCODE payment service

Route::middleware(["auth", "verified"])->group(function () {
    // Create QR
    Route::inertia("qr/create/sender", "transactions/qr/create/sender");
    Route::post("qr/create/sender",[TokenController::class, "storeSender"]);
    Route::post("qr/create/sender/quickpay",[TokenController::class, "storeSenderPay"]);
    Route::inertia("qr/create/receiver", "transactions/qr/create/receiver");
    Route::post("qr/create/receiver",[TokenController::class, "storeReceiver"]);
    Route::inertia("qr/create/store", "transactions/qr/create/store");
    Route::post("qr/create/store",[TokenController::class, "storeReceiverSTORE"]);
    Route::get("qr/merchant/permanent", [TokenController::class, "getPermanentMerchantToken"]);
    
    
    // Scan & Update
    Route::get('qr/redirect/{id}', [TokenController::class, 'handleScan'])->name('qr.scan');
    Route::get('qr/view/{id}', [TokenController::class, 'showToken'])->name('qr.update.view');

    Route::post('/qr/confirm/{id}', [TokenController::class, 'confirmTransaction'])->name('qr.confirm');
    Route::post('/qr/approve/{id}', [TokenController::class, 'finalApproval'])->name('qr.approve');
    Route::post('/qr/cancel/{id}', [TokenController::class, 'cancelTransaction'])->name('qr.cancel');
    Route::get('/qr/status/{token}', [TokenController::class, 'checkStatus'])->name('qr.status');
    
    // Compatibility routes for existing frontend calls
    Route::post("qr/update/sender/{id}",[TokenController::class, "updateSender"]);
    Route::post("qr/update/receiver/{id}",[TokenController::class, "updateReceiver"]);
    Route::post("qr/update/store/{id}",[TokenController::class, "updateReceiverSTORE"]);

    Route::get('/debug-notify', function() {
        event(new \App\Events\GenericNotification(
            auth()->id(),
            'System Diagnostic',
            'Broadcasting is operational. Connection verified.',
            'success'
        ));
        return "Diagnostic event dispatched to user ID: " . auth()->id();
    })->middleware('auth');
});


require __DIR__ . '/settings.php';
