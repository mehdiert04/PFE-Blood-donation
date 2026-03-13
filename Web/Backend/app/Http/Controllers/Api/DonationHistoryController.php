<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use Illuminate\Http\Request;

class DonationHistoryController extends Controller
{
    /**
     * GET /api/donations
     *
     * Return completed donations for the authenticated donor,
     * formatted with French keys for the frontend.
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

        // Eager-load the hospital profile for the "lieu" field
        $donations = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->with('hopital.hopitalProfile')
            ->latest('date_rdv')
            ->get();

        // Get the donor's blood group once
        $groupeSanguin = optional($user->donneurProfile)->groupe_sanguin;

        $formatted = $donations->map(function ($rdv) use ($groupeSanguin) {
            return [
                'id'             => $rdv->id,
                'type'           => $rdv->type_don,
                'date'           => $rdv->date_rdv->format('Y-m-d'),
                'lieu'           => optional($rdv->hopital->hopitalProfile)->nom_etablissement,
                'groupeSanguin'  => $groupeSanguin,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Historique des dons récupéré avec succès.',
            'data'    => $formatted,
        ]);
    }
}
