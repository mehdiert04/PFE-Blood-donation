<?php

namespace App\Http\Controllers\Donneur;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get statistics and overview for the donor dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Stats
        $totalDons = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->count();

        $volumeTotal = round($totalDons * 0.45, 2);
        $viesSauvees = $totalDons * 3;

        // Next Appointment
        $nextRdv = RendezVous::where('donneur_id', $user->id)
            ->whereIn('statut', ['En attente', 'Confirmé'])
            ->where('date_rdv', '>=', Carbon::today())
            ->with('hopital.hopitalProfile')
            ->orderBy('date_rdv')
            ->orderBy('heure_rdv')
            ->first();

        // Recent History (confirmed/completed donations)
        $recentHistory = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->with('hopital.hopitalProfile')
            ->latest('date_rdv')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_dons' => $totalDons,
                    'volume_total' => $volumeTotal,
                    'vies_sauvees' => $viesSauvees,
                ],
                'next_appointment' => $nextRdv,
                'recent_history' => $recentHistory,
            ]
        ]);
    }
}
