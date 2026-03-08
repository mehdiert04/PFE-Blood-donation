<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Campaign;

class CampaignController extends Controller
{
    /**
     * Display a listing of active and upcoming campaigns.
     */
    public function index()
    {
        $campaigns = Campaign::with('organizer.hopitalProfile')
            ->where('statut', '!=', 'Terminé')
            ->orderBy('date_debut', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $campaigns
        ]);
    }

    /**
     * Display the specified campaign.
     */
    public function show($id)
    {
        $campaign = Campaign::with('organizer.hopitalProfile')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $campaign
        ]);
    }
}
