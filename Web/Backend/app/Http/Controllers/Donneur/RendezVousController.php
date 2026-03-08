<?php

namespace App\Http\Controllers\Donneur;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RendezVousController extends Controller
{
    private const DONATION_INTERVALS = [
        'Sang Total'  => 56,
        'Plasma'      => 28,
        'Plaquettes'  => 2,
    ];

    /**
     * List appointments for the authenticated donor.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $appointments = RendezVous::where('donneur_id', $user->id)
            ->with('hopital.hopitalProfile')
            ->latest('date_rdv')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Book a new appointment.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'hopital_id' => 'required|exists:users,id',
            'date_rdv'   => 'required|date|after_or_equal:today',
            'heure_rdv'  => 'required|date_format:H:i',
            'type_don'   => 'required|in:Sang Total,Plasma,Plaquettes',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Eligibility check
        $lastDonation = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->latest('date_rdv')
            ->first();

        if ($lastDonation) {
            $requiredDays = self::DONATION_INTERVALS[$request->type_don];
            $eligibleDate = Carbon::parse($lastDonation->date_rdv)->addDays($requiredDays);

            if (Carbon::today()->lt($eligibleDate)) {
                return response()->json([
                    'success' => false,
                    'message' => "Vous n'êtes pas encore éligible. Prochaine date : " . $eligibleDate->format('d/m/Y'),
                ], 400);
            }
        }

        $rendezVous = RendezVous::create([
            'donneur_id' => $user->id,
            'hopital_id' => $request->hopital_id,
            'date_rdv'   => $request->date_rdv,
            'heure_rdv'  => $request->heure_rdv,
            'type_don'   => $request->type_don,
            'statut'     => 'En attente',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous réservé avec succès.',
            'data' => $rendezVous
        ], 201);
    }

    /**
     * Cancel an appointment.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $rendezVous = RendezVous::where('donneur_id', $user->id)->findOrFail($id);

        if ($rendezVous->statut === 'Terminé') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler un rendez-vous déjà terminé.'
            ], 400);
        }

        $rendezVous->update(['statut' => 'Annulé']);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous annulé.',
            'data' => $rendezVous
        ]);
    }
}
