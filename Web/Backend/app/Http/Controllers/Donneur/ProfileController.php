<?php

namespace App\Http\Controllers\Donneur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('donneurProfile');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'email' => $user->email,
                    'ville' => $user->ville,
                ],
                'profile' => $user->donneurProfile
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->donneurProfile;

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
                Rule::unique('donneur_profiles')->ignore($profile->id),
            ],
            'ville' => 'required|string|max:255',
            'groupe_sanguin' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'poids' => 'required|numeric|min:50',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => 'required|date',
            'current_password' => 'nullable|required_with:new_password|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'errors' => ['current_password' => ['Mot de passe actuel incorrect.']]
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->email = $request->email;
        $user->ville = $request->ville;
        $user->save();

        $profile->update($request->only([
            'nom',
            'prenom',
            'telephone',
            'groupe_sanguin',
            'poids',
            'sexe',
            'date_naissance'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour.',
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
