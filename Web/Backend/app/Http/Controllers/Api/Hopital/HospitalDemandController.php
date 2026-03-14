<?php

namespace App\Http\Controllers\Api\Hopital;

use App\Http\Controllers\Controller;
use App\Models\DemandResponse;
use App\Models\RendezVous;
use App\Models\BloodDemand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HospitalDemandController extends Controller
{
    /**
     * List all donor responses to blood demands linked to this hospital.
     */
    public function index()
    {
        $hospitalId = Auth::id();

        $responses = DemandResponse::with(['donneur', 'bloodDemand.user'])
            ->whereHas('bloodDemand', function($query) use ($hospitalId) {
                $query->where('hopital_id', $hospitalId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $responses
        ]);
    }

    /**
     * Approve a donor response and create a Rendez-vous.
     */
    public function approve(Request $request, $id)
    {
        $request->validate([
            'date_rdv' => 'required|date|after_or_equal:today',
            'heure_rdv' => 'required',
            'type_don' => 'required|in:Sang Total,Plasma,Plaquettes',
        ]);

        $hospitalId = Auth::id();
        $response = DemandResponse::with('bloodDemand')->findOrFail($id);

        // Security check: ensure this demand belongs to this hospital
        if ($response->bloodDemand->hopital_id !== $hospitalId) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();
        try {
            // Update response status
            $response->update(['status' => 'accepted']);

            // Create Rendez-vous
            $rdv = RendezVous::create([
                'donneur_id' => $response->donneur_id,
                'hopital_id' => $hospitalId,
                'date_rdv' => $request->date_rdv,
                'heure_rdv' => $request->heure_rdv,
                'type_don' => $request->type_don,
                'statut' => 'En attente'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réponse approuvée et rendez-vous créé.',
                'data' => $rdv
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
