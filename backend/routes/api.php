<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendorAuthController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SubitemController;

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

        // ==================== ITEM ROUTES ====================
        Route::post('/cafe/{cafeId}/item/add', [ItemController::class, 'addItem']);
        Route::get('/cafe/{cafeId}/items', [ItemController::class, 'getItems']);
        Route::get('/cafe/{cafeId}/item/{itemId}', [ItemController::class, 'getItem']);
        Route::put('/cafe/{cafeId}/item/{itemId}', [ItemController::class, 'updateItem']);
        Route::delete('/cafe/{cafeId}/item/{itemId}', [ItemController::class, 'deleteItem']);

        // ==================== SUBITEM ROUTES ====================
        Route::post('/cafe/{cafeId}/item/{itemId}/subitem/add', [SubitemController::class, 'addSubitem']);
        Route::get('/cafe/{cafeId}/item/{itemId}/subitems', [SubitemController::class, 'getSubitems']);
        Route::get('/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}', [SubitemController::class, 'getSubitem']);
        Route::put('/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}', [SubitemController::class, 'updateSubitem']);
        Route::delete('/cafe/{cafeId}/item/{itemId}/subitem/{subitemId}', [SubitemController::class, 'deleteSubitem']);
    });
});


