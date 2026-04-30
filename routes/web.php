<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenerateController;
use App\Http\Controllers\RegenerateSectionController;
use App\Http\Controllers\SalesPageController;
use App\Http\Controllers\PreviewController;
use Illuminate\Support\Facades\Route;

// Auth routes are handled automatically by Fortify via FortifyServiceProvider

// Settings routes (profile, security, appearance)
require __DIR__.'/settings.php';

// Public preview — no auth required
Route::get('/preview/{page}', [PreviewController::class, 'show'])->name('preview.show');

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Generation
    Route::get('/generate',  [GenerateController::class, 'create'])->name('generate.create');
    Route::post('/generate', [GenerateController::class, 'store'])->name('generate.store')
         ->middleware('throttle:generate');

    // Saved pages
    Route::get('/pages',             [SalesPageController::class, 'index'])->name('pages.index');
    Route::get('/pages/{page}',      [SalesPageController::class, 'show'])->name('pages.show');
    Route::get('/pages/{page}/edit', [SalesPageController::class, 'edit'])->name('pages.edit');
    Route::delete('/pages/{page}',   [SalesPageController::class, 'destroy'])->name('pages.destroy');
    Route::get('/pages/{page}/export', [SalesPageController::class, 'export'])->name('pages.export');
    Route::post('/pages/{page}/regenerate-section', RegenerateSectionController::class)->name('pages.regenerate-section');

    // Settings — our full SalesCraft settings page
    Route::get('/settings', fn() => inertia('settings'))->name('settings');

    // Redirect root to dashboard
    Route::get('/', fn() => redirect()->route('dashboard'))->name('home');
});
