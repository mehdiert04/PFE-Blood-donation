<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RendezVous;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RendezVousController extends Controller
{
    /**
     * Minimum intervals (in days) between donations by type.
     */
    private const DONATION_INTERVALS = [
        'Sang Total'  => 56,
        'Plasma'      => 28,
        'Plaquettes'  => 2,
    ];

    /**
     * POST /api/rendez-vous
     *
     * Book a new appointment. Only donors are allowed.
     * Enforces medical eligibility intervals before creating.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // ── Guard: only donors may book ──────────────────────────────
        if ($user->role !== 'donneur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les donneurs peuvent prendre un rendez-vous.',
                'data'    => null,
            ], 403);
        }

        // ── Validation ──────────────────────────────────────────────
        $validated = $request->validate([
            'hopital_id' => 'required|exists:users,id',
            'date_rdv'   => 'required|date|after_or_equal:today',
            'heure_rdv'  => 'required|date_format:H:i',
            'type_don'   => 'required|in:Sang Total,Plasma,Plaquettes',
        ]);

        // ── Medical eligibility check ───────────────────────────────
        $lastDonation = RendezVous::where('donneur_id', $user->id)
            ->where('statut', 'Terminé')
            ->latest('date_rdv')
            ->first();

        if ($lastDonation) {
            $requiredDays   = self::DONATION_INTERVALS[$validated['type_don']];
            $lastDate       = Carbon::parse($lastDonation->date_rdv);
            $eligibleDate   = $lastDate->copy()->addDays($requiredDays);

            if (Carbon::today()->lt($eligibleDate)) {
                return response()->json([
                    'success' => false,
                    'message' => "Désolé, vous ne pouvez pas encore donner. Votre prochaine date d'éligibilité pour ce type de don est le " . $eligibleDate->format('d/m/Y') . ".",
                    'data'    => null,
                ], 400);
            }
        }

        // ── Create the appointment ──────────────────────────────────
        $rendezVous = RendezVous::create([
            'donneur_id' => $user->id,
            'hopital_id' => $validated['hopital_id'],
            'date_rdv'   => $validated['date_rdv'],
            'heure_rdv'  => $validated['heure_rdv'],
            'type_don'   => $validated['type_don'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous créé avec succès.',
            'data'    => $rendezVous,
        ], 201);
    }

    /**
     * GET /api/rendez-vous
     *
     * List appointments for the authenticated user.
     * – Donors see their own appointments with hospital details.
     * – Hospitals see appointments at their facility with donor details.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'donneur') {
            $rendezVous = RendezVous::where('donneur_id', $user->id)
                ->with('hopital.hopitalProfile')
                ->latest('date_rdv')
                ->get();
        } elseif ($user->role === 'hopital') {
            $rendezVous = RendezVous::where('hopital_id', $user->id)
                ->with('donneur.donneurProfile')
                ->latest('date_rdv')
                ->get();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé.',
                'data'    => null,
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Liste des rendez-vous récupérée avec succès.',
            'data'    => $rendezVous,
        ]);
    }

    /**
     * GET /api/appointments/next
     *
     * Return the single closest future appointment for the authenticated donor.
     */
    public function next(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'donneur') {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux donneurs.',
                'data'    => null,
            ], 403);
        }

        $nextRdv = RendezVous::where('donneur_id', $user->id)
            ->whereIn('statut', ['En attente', 'Confirmé'])
            ->where('date_rdv', '>=', Carbon::today())
            ->with('hopital.hopitalProfile')
            ->orderBy('date_rdv')
            ->orderBy('heure_rdv')
            ->first();

        return response()->json([
            'success' => true,
            'message' => $nextRdv
                ? 'Prochain rendez-vous récupéré avec succès.'
                : 'Aucun rendez-vous à venir.',
            'data'    => $nextRdv,
        ]);
    }
}
