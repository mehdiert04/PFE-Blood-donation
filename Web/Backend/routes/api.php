<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HopitalController;
use App\Http\Controllers\Receveur\DashboardController as ReceveurDashboardController;
use App\Http\Controllers\Receveur\BloodDemandController;
use App\Http\Controllers\Receveur\ProfileController as ReceveurProfileController;
use App\Http\Controllers\Donneur\DashboardController as DonneurDashboardController;
use App\Http\Controllers\Donneur\RendezVousController as DonneurRendezVousController;
use App\Http\Controllers\Donneur\ProfileController as DonneurProfileController;
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

    // Donneur Module
    Route::prefix('donneur')->middleware('donneur')->group(function () {
        Route::get('/stats', [DonneurDashboardController::class, 'index']);
        Route::apiResource('appointments', DonneurRendezVousController::class)->only(['index', 'store', 'update']);
        Route::get('/profile', [DonneurProfileController::class, 'show']);
        Route::put('/profile', [DonneurProfileController::class, 'update']);
    });

    // Receveur Module
    Route::prefix('receveur')->middleware('receveur')->group(function () {
        Route::get('/stats', [ReceveurDashboardController::class, 'stats']);
        Route::apiResource('demands', BloodDemandController::class)->only(['index', 'store', 'show', 'update']);
        Route::get('/profile', [ReceveurProfileController::class, 'show']);
        Route::put('/profile', [ReceveurProfileController::class, 'update']);
    });
});
