<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    // Report Endpoints
    Route::get('/reports/transactions', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.transactions');
});

require __DIR__.'/settings.php';
