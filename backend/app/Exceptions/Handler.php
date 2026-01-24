<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Handle validation exceptions for API requests
        if ($exception instanceof ValidationException && $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $exception->errors(),
            ], 422)->header('Access-Control-Allow-Origin', '*')
               ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
               ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        }

        // Return JSON for all API errors
        if ($request->expectsJson()) {
            $statusCode = 500;
            
            // Try to get HTTP status code from exception
            if (property_exists($exception, 'status')) {
                $statusCode = $exception->status;
            } elseif (property_exists($exception, 'code') && is_numeric($exception->code) && $exception->code >= 100 && $exception->code < 600) {
                $statusCode = $exception->code;
            }

            return response()->json([
                'success' => false,
                'message' => 'An error occurred',
                'error' => $exception->getMessage(),
            ], $statusCode)->header('Access-Control-Allow-Origin', '*')
                           ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                           ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        }

        return parent::render($request, $exception);
    }
}
