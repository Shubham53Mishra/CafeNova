<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendorAuthController;
use App\Http\Controllers\CafeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ==================== USER ROUTES ====================
// Public Routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// ==================== VENDOR ROUTES ====================
// Public Routes
Route::prefix('vendor')->group(function () {
    Route::post('/signup', [VendorAuthController::class, 'signup']);
    Route::post('/login', [VendorAuthController::class, 'login']);
    
    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [VendorAuthController::class, 'getProfile']);
        Route::put('/profile', [VendorAuthController::class, 'updateProfile']);
        Route::post('/logout', [VendorAuthController::class, 'logout']);

        // ==================== CAFE ROUTES ====================
        Route::post('/cafe/register', [CafeController::class, 'registerCafe']);
        Route::get('/cafes', [CafeController::class, 'getCafes']);
        Route::get('/cafe/{cafeId}', [CafeController::class, 'getCafe']);
        Route::put('/cafe/{cafeId}', [CafeController::class, 'updateCafe']);
        Route::delete('/cafe/{cafeId}', [CafeController::class, 'deleteCafe']);
    });
});


