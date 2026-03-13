<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();
        
        $data = [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'ville' => $user->ville,
        ];
        
        if ($user->role === 'donneur') {
            $profile = $user->donneurProfile;
            $data['prenom'] = $profile ? $profile->prenom : null;
            $data['nom'] = $profile ? $profile->nom : null;
            $data['groupe_sanguin'] = $profile ? $profile->groupe_sanguin : null;
        } elseif ($user->role === 'receveur') {
            $profile = $user->receveurProfile;
            $data['prenom'] = $profile ? $profile->prenom : null;
            $data['nom'] = $profile ? $profile->nom : null;
            $data['groupe_sanguin'] = $profile ? $profile->groupe_sanguin : null;
        } elseif ($user->role === 'hopital') {
            $profile = $user->hopitalProfile;
            $data['Responsable'] = $profile ? $profile->nom_responsable : null;
            $data['Etablissement'] = $profile ? $profile->nom_etablissement : null;
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Profil utilisateur récupéré avec succès.',
            'data' => $data
        ]);
    }
}
