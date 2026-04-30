<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // Per-user: 2/min burst + 10/hour sustained
        RateLimiter::for('generate', function (Request $request) {
            return [
                Limit::perMinute(2)->by('user:' . $request->user()?->id)
                     ->response(fn() => back()->withErrors([
                         'rate_limit' => 'Too many requests. Please wait a moment.',
                     ])),
                Limit::perHour(10)->by('user:' . $request->user()?->id)
                     ->response(fn() => back()->withErrors([
                         'rate_limit' => 'You have reached the 10 pages/hour limit. Try again later.',
                     ])),
                // IP-level fallback
                Limit::perMinute(20)->by('ip:' . $request->ip()),
            ];
        });
    }
}
