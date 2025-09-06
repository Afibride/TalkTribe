<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class LogApiResponseTime
{
    public function handle($request, Closure $next)
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = round((microtime(true) - $start) * 1000, 2); // ms

        // Log response time
        Log::info('API Response Time: ' . $duration . ' ms', [
            'path' => $request->path(),
            'method' => $request->method(),
        ]);

        // Add it as a response header
        $response->headers->set('X-Response-Time-ms', $duration);

        return $response;
    }
}
