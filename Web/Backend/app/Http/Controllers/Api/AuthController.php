<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DonneurProfile;
use App\Models\ReceveurProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Carbon\Carbon;

class AuthController extends Controller
{
    private $nameRegex = '/^[a-zA-Zà-ÿ\s\'-]{3,30}$/';
    private $mobileRegex = '/^0[67]\d{8}$/';

    public function registerDonneur(Request $request)
    {
        $messages = [
            'nom.required' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'nom.regex' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'prenom.required' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'prenom.regex' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'email.required' => 'Email non valide, exemple: exemple@domain.com',
            'email.email' => 'Email non valide, exemple: exemple@domain.com',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required' => 'Password doit contenir au moins 8 caractères',
            'password.min' => 'Password doit contenir au moins 8 caractères',
            'password.confirmed' => 'Password confirmation ne correspond pas',
            'sexe.required' => 'Sexe doit être Homme ou Femme',
            'sexe.in' => 'Sexe doit être Homme ou Femme',
            'date_naissance.required' => 'Date invalide, utilisateur doit avoir entre 18 et 60 ans',
            'date_naissance.date' => 'Date invalide, utilisateur doit avoir entre 18 et 60 ans',
            'groupe_sanguin.required' => 'Groupe sanguin doit être A+, A-, B+, B-, AB+, AB-, O+, O-',
            'groupe_sanguin.in' => 'Groupe sanguin doit être A+, A-, B+, B-, AB+, AB-, O+, O-',
            'poids.required' => 'Poids invalide, doit être supérieur à 50',
            'poids.numeric' => 'Poids invalide, doit être supérieur à 50',
            'poids.min' => 'Poids invalide, doit être supérieur à 50',
            'telephone.required' => 'Téléphone invalide, doit commencer par 06 ou 07 et avoir 10 chiffres',
            'telephone.regex' => 'Téléphone invalide, doit commencer par 06 ou 07 et avoir 10 chiffres',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé',
        ];

        $validator = Validator::make($request->all(), [
            'nom' => ['required', 'regex:' . $this->nameRegex],
            'prenom' => ['required', 'regex:' . $this->nameRegex],
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'sexe' => 'required|in:Homme,Femme',
            'date_naissance' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;
                    if ($age < 18 || $age > 60) {
                        $fail('Date invalide, utilisateur doit avoir entre 18 et 60 ans');
                    }
                },
            ],
            'groupe_sanguin' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'poids' => 'required|numeric|min:50.01',
            'telephone' => ['required', 'unique:donneur_profiles', 'regex:' . $this->mobileRegex],
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'donneur',
            ]);

            $user->donneurProfile()->create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'sexe' => $request->sexe,
                'date_naissance' => $request->date_naissance,
                'groupe_sanguin' => $request->groupe_sanguin,
                'poids' => $request->poids,
                'telephone' => $request->telephone,
            ]);

            event(new Registered($user));

            return response()->json([
                'success' => true,
                'message' => 'Donneur enregistré avec succès. Veuillez vérifier votre email.',
                'data' => $user->load('donneurProfile')
            ], 201);
        });
    }

    public function registerReceveur(Request $request)
    {
        $messages = [
            'nom.required' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'nom.regex' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'prenom.required' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'prenom.regex' => 'Nom format invalid, utilisez seulement lettres, accents, espaces ou -\' , 3-30 caractères',
            'email.required' => 'Email non valide, exemple: exemple@domain.com',
            'email.email' => 'Email non valide, exemple: exemple@domain.com',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required' => 'Password doit contenir au moins 8 caractères',
            'password.min' => 'Password doit contenir au moins 8 caractères',
            'password.confirmed' => 'Password confirmation ne correspond pas',
            'telephone.required' => 'Téléphone invalide, doit commencer par 06 ou 07 et avoir 10 chiffres',
            'telephone.regex' => 'Téléphone invalide, doit commencer par 06 ou 07 et avoir 10 chiffres',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé',
            'groupe_sanguin_recherche.required' => 'Groupe sanguin doit être A+, A-, B+, B-, AB+, AB-, O+, O-',
            'groupe_sanguin_recherche.in' => 'Groupe sanguin doit être A+, A-, B+, B-, AB+, AB-, O+, O-',
        ];

        $validator = Validator::make($request->all(), [
            'nom' => ['required', 'regex:' . $this->nameRegex],
            'prenom' => ['required', 'regex:' . $this->nameRegex],
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'telephone' => ['required', 'unique:receveur_profiles', 'regex:' . $this->mobileRegex],
            'groupe_sanguin_recherche' => 'required|in:A+,A-,B+,B-,AB+,AB-,O+,O-,INCONNU',
            'description_maladie' => 'nullable|string',
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'receveur',
            ]);

            $user->receveurProfile()->create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'groupe_sanguin_recherche' => $request->groupe_sanguin_recherche,
                'description_maladie' => $request->description_maladie,
            ]);

            event(new Registered($user));

            return response()->json([
                'success' => true,
                'message' => 'Receveur enregistré avec succès. Veuillez vérifier votre email.',
                'data' => $user->load('receveurProfile')
            ], 201);
        });
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects.',
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vérifier votre adresse email avant de vous connecter.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data' => [
                'user' => $user,
                'role' => $user->role,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Lien de vérification invalide.',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email déjà vérifié.',
            ]);
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return response()->json([
            'success' => true,
            'message' => 'Email vérifié avec succès.',
        ]);
    }

    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email déjà vérifié.',
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Lien de vérification envoyé.',
        ]);
    }

    public function logout(Request $request)
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken $token */
        $token = $request->user()->currentAccessToken();
        $token->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }
}
