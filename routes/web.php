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
    Route::post('/savings/{goal}/unlock', [SavingsGoalController::class, 'unlock'])->name('savings.unlock');

    // Daret (Savings Groups) Routes
    Route::get('/daret', [DaretController::class, 'index'])->name('daret.index');
    Route::post('/daret', [DaretController::class, 'store'])->name('daret.store');
    Route::post('/daret/{group}/pay', [DaretController::class, 'pay'])->name('daret.pay');
    Route::post('/daret/{group}/accept', [DaretController::class, 'accept'])->name('daret.accept');
    Route::post('/daret/{group}/decline', [DaretController::class, 'decline'])->name('daret.decline');

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

// Create
Route::middleware(["auth", "verified"])->group(function () {

    Route::inertia("qr/create/sender", "transactions/qr/create/sender");
    Route::post("qr/create/sender",[TokenController::class, "storeSender"]);
    Route::inertia("qr/create/reciver", "transactions/qr/create/reciver");
    Route::post("qr/create/reciver",[TokenController::class, "storeReciver"]);
    Route::inertia("qr/create/store", "transactions/qr/create/store");
    Route::post("qr/create/store",[TokenController::class, "storeReceiverSTORE"]);
    
});

// update
Route::middleware(["auth","verified"])->group(function() {

    Route::get('qr/redirect/{id}', function ($id) {
        $token = Token::where("token", (Crypt::decryptString($id)))->first() ;
        
        if(!$token)
                {
                    return;
                }
        switch ($token->goal) {
            case "sender":
                return Inertia::render("transactions/qr/update/sender",["id" => $id]);
                break;

            case "reciver":
                return Inertia::render("transactions/qr/update/reciver",["id" => $id]);
                break;

            case "store":
                return Inertia::render("transactions/qr/update/store",["id" => $id]);
                break;

            default:
                return back();
        }
        
    });
    
    Route::post("qr/update/sender/{id}",[TokenController::class, "updateSender"])->name("updateSender");
    Route::post("qr/update/reciver/{id}",[TokenController::class, "updateReciver"])->name("updateReciver");
    Route::post("qr/update/store/{id}",[TokenController::class, "updateReciverSTORE"])->name("updateStore");
});


require __DIR__ . '/settings.php';
