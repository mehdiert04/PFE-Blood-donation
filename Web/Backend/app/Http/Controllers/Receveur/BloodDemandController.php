<?php

namespace App\Http\Controllers\Receveur;

use App\Http\Controllers\Controller;
use App\Models\BloodDemand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BloodDemandController extends Controller
{
    /**
     * Display a listing of the authenticated receveur's demands.
     */
    public function index(Request $request)
    {
        $demands = $request->user()->bloodDemands()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $demands
        ]);
    }

    /**
     * Store a newly created demand in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'blood_type' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'quantity' => 'required|integer|min:1',
            'hospital_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $demand = $request->user()->bloodDemands()->create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Demande de sang créée avec succès.',
            'data' => $demand
        ], 201);
    }

    /**
     * Display the specified demand with ownership check.
     */
    public function show(Request $request, $id)
    {
        $demand = BloodDemand::findOrFail($id);

        if ($demand->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $demand
        ]);
    }

    /**
     * Update the status of a demand (cancellation).
     */
    public function update(Request $request, $id)
    {
        $demand = BloodDemand::findOrFail($id);

        if ($demand->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($demand->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les demandes en attente peuvent être annulées.'
            ], 422);
        }

        $demand->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Demande annulée avec succès.',
            'data' => $demand
        ]);
    }
}
