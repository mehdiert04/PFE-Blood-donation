<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckHopitalRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'hopital') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. Only hospitals can access this.'], 403);
    }
}
