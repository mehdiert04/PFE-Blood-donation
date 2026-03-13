<?php

namespace App\Http\Controllers\Receveur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Get the authenticated receveur's profile.
     */
    public function show(Request $request)
    {
        $user = $request->user()->load('receveurProfile');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'email' => $user->email,
                    'ville' => $user->ville,
                ],
                'profile' => $user->receveurProfile
            ]
        ]);
    }

    /**
     * Update the authenticated receveur's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->receveurProfile;

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'telephone' => [
                'required',
                'string',
                Rule::unique('receveur_profiles')->ignore($profile->id),
            ],
            'ville' => 'required|string|max:255',
            'groupes_sanguins_recherches' => 'required|array',
            'groupes_sanguins_recherches.*' => 'in:A+,A-,B+,B-,AB+,AB-,O+,O-,INCONNU',
            'description_maladie' => 'nullable|string',
            'current_password' => 'nullable|required_with:new_password|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle password update if provided
        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'current_password' => ['Le mot de passe actuel est incorrect.']
                    ]
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        // Update User info
        $user->email = $request->email;
        $user->ville = $request->ville;
        $user->save();

        // Update Profile info
        $profile->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'telephone' => $request->telephone,
            'groupe_sanguin_recherche' => $request->groupe_sanguin_recherche,
            'description_maladie' => $request->description_maladie,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès.',
            'data' => [
                'user' => [
                    'email' => $user->email,
                    'ville' => $user->ville,
                ],
                'profile' => $profile
            ]
        ]);
    }
}
