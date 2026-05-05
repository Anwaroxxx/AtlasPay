<?php

use App\Enums\RedirectGoals;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Qr\TokenController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Models\Token;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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
