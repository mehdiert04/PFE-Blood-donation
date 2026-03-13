<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BloodDemand;
use Illuminate\Http\Request;

class PublicBloodDemandController extends Controller
{
    /**
     * List all pending blood demands.
     */
    public function index(Request $request)
    {
        $query = BloodDemand::with(['user.receveurProfile'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        if ($request->filled('blood_type')) {
            $query->where('blood_type', $request->blood_type);
        }

        if ($request->filled('city')) {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        $demands = $query->get();

        return response()->json([
            'success' => true,
            'data' => $demands
        ]);
    }

    /**
     * Show a specific blood demand.
     */
    public function show($id)
    {
        $demand = BloodDemand::with(['user.receveurProfile'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $demand
        ]);
    }
}
