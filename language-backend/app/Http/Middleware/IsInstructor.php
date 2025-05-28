<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsInstructor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
   // app/Http/Middleware/IsInstructor.php
public function handle($request, Closure $next)
{
    if (auth()->user()->role !== 'instructor') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    return $next($request);
}

}
