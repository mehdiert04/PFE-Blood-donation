<?php

namespace App\Http\Controllers\Api\Donneur;

use App\Http\Controllers\Controller;
use App\Models\BloodDemand;
use App\Models\DemandResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandResponseController extends Controller
{
    /**
     * List all pending blood demands that the donor can help with.
     * Optionally exclude demands already responded to by this donor.
     */
    public function availableDemands(Request $request)
    {
        $donneurId = Auth::id();

        // Get demands that are pending and NOT already responded to by this donor
        $demands = BloodDemand::with(['user.receveurProfile'])
            ->where('status', 'pending')
            ->whereDoesntHave('responses', function ($query) use ($donneurId) {
                $query->where('donneur_id', $donneurId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $demands
        ]);
    }

    /**
     * Store a "help" request from a donor for a specific blood demand.
     */
    public function help(Request $request, $demandId)
    {
        $donneurId = Auth::id();

        // Check if already responded
        $exists = DemandResponse::where('donneur_id', $donneurId)
            ->where('blood_demand_id', $demandId)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà proposé votre aide pour cette demande.'
            ], 400);
        }

        $response = DemandResponse::create([
            'donneur_id' => $donneurId,
            'blood_demand_id' => $demandId,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre proposition d\'aide a été enregistrée. Vous recevrez une notification bientôt.',
            'data' => $response
        ]);
    }
}
