<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // Rate limiting for API routes
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Rate limiting for authentication routes
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Rate limiting for guest routes (health checks, etc.)
        RateLimiter::for('guest', function (Request $request) {
            return Limit::perMinute(100)->by($request->ip());
        });

        $this->routes(function () {
            // API Routes with middleware
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Web Routes
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}