<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDonneurRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'donneur') {
            return $next($request);
        }

        return response()->json(['message' => 'Accès refusé. Seuls les donneurs peuvent accéder à cette ressource.'], 403);
    }
}
