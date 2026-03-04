<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HopitalController;
use App\Http\Controllers\Api\RendezVousController;
use App\Http\Controllers\Api\StatistiquesController;
use App\Http\Controllers\Api\DonationHistoryController;
use App\Http\Controllers\Receveur\DashboardController;
use App\Http\Controllers\Receveur\BloodDemandController;
use Illuminate\Support\Facades\Route;

Route::post('/register/donneur', [AuthController::class, 'registerDonneur']);
Route::post('/register/receveur', [AuthController::class, 'registerReceveur']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);


Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])
    ->middleware(['throttle:6,1'])
    ->name('verification.send');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users/me', [UserController::class, 'me']);
    Route::get('/hospitals', [HopitalController::class, 'index']);

    // Donor Module – English routes
    Route::get('/stats', [StatistiquesController::class, 'index']);
    Route::get('/donations', [DonationHistoryController::class, 'index']);
    Route::get('/appointments/next', [RendezVousController::class, 'next']);
    Route::get('/appointments', [RendezVousController::class, 'index']);
    Route::post('/appointments', [RendezVousController::class, 'store']);

    // Receveur Module
    Route::prefix('receveur')->middleware('receveur')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::apiResource('demands', BloodDemandController::class)->only(['index', 'store', 'show', 'update']);
    });
});
