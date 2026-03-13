<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDonneurRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'donneur') {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Accès refusé. Seuls les donneurs peuvent accéder à cette ressource.'
        ], 403);
    }
}