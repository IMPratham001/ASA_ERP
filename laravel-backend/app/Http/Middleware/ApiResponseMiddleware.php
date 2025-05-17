
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiResponseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $data = $response->getData(true);
            
            $wrapped = [
                'status' => $response->status(),
                'success' => $response->status() < 400,
                'data' => $data,
            ];
            
            $response->setData($wrapped);
        }
        
        return $response;
    }
}
