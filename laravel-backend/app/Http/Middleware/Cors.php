
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        $allowedOrigins = [
            env('FRONTEND_URL', 'http://localhost:3000'),
            'https://*.replit.dev'
        ];

        $origin = $request->header('Origin');
        
        if ($origin && $this->isAllowedOrigin($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Max-Age', '86400');
        }

        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(200);
        }
        
        return $response;
    }

    private function isAllowedOrigin(string $origin, array $allowedOrigins): bool 
    {
        foreach ($allowedOrigins as $allowed) {
            if (str_contains($allowed, '*')) {
                $pattern = str_replace('*', '.*', preg_quote($allowed, '/'));
                if (preg_match('/^' . $pattern . '$/', $origin)) {
                    return true;
                }
            } elseif ($origin === $allowed) {
                return true;
            }
        }
        return false;
    }
}
