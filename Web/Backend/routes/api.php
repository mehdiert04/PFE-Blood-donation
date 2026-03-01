<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HopitalController;
use App\Http\Controllers\Api\RendezVousController;
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
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users/me', [UserController::class, 'me']);
    Route::get('/hospitals', [HopitalController::class, 'index']);

    // Rendez-vous (Appointments)
    Route::get('/rendez-vous', [RendezVousController::class, 'index']);
    Route::post('/rendez-vous', [RendezVousController::class, 'store']);
});
