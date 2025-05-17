
<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {
            if ($exception instanceof ModelNotFoundException) {
                return response()->json([
                    'status' => 404,
                    'success' => false,
                    'message' => 'Resource not found'
                ], 404);
            }
            
            if ($exception instanceof ValidationException) {
                return response()->json([
                    'status' => 422,
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $exception->errors()
                ], 422);
            }
        }

        return parent::render($request, $exception);
    }
}
