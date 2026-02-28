<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class HopitalController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('hopitalProfile')->where('role', 'hopital');

        if ($request->filled('ville')) {
            $query->where('ville', $request->ville);
        }

        $hospitals = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des hôpitaux récupérée avec succès.',
            'data' => $hospitals
        ]);
    }
}
