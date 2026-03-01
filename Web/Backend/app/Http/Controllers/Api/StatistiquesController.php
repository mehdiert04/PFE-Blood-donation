<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use Illuminate\Http\Request;

class StatistiquesController extends Controller
{
    /**
     * GET /api/stats
     *
     * Return donation statistics for the authenticated donor.
     * Medical reality: 1 donation = 3 lives saved, 0.45L volume.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'donneur') {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux donneurs.',
                'data'    => null,
            ], 403);
        }

        $totalDons = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Statistiques récupérées avec succès.',
            'data'    => [
                'total_dons'   => $totalDons,
                'volume_total' => round($totalDons * 0.45, 2),
                'vies_sauvees' => $totalDons * 3,
            ],
        ]);
    }
}
