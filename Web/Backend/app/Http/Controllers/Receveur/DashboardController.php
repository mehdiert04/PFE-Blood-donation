<?php

namespace App\Http\Controllers\Receveur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get statistics for the authenticated receveur.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_demands' => $user->bloodDemands()->count(),
            'pending_demands' => $user->bloodDemands()->where('status', 'pending')->count(),
            'fulfilled_demands' => $user->bloodDemands()->where('status', 'fulfilled')->count(),
            'cancelled_demands' => $user->bloodDemands()->where('status', 'cancelled')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
