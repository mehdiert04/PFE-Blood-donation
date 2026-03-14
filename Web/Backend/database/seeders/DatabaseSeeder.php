<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'ville' => 'Casablanca',
            ]
        );

        $donneur = User::updateOrCreate(
            ['email' => 'donneur@example.com'],
            [
                'name' => 'Donneur Profile',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'donneur',
                'ville' => 'Rabat',
            ]
        );
        $donneur->donneurProfile()->updateOrCreate([], [
            'nom' => 'Donneur',
            'prenom' => 'User',
            'groupe_sanguin' => 'A+',
            'poids' => 75.5,
            'telephone' => '0600000001'
        ]);

        $receveur = User::updateOrCreate(
            ['email' => 'receveur@example.com'],
            [
                'name' => 'Receveur Profile',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'receveur',
                'ville' => 'Marrakech',
            ]
        );
        $receveur->receveurProfile()->updateOrCreate([], [
            'nom' => 'Receveur',
            'prenom' => 'User',
            'telephone' => '0600000002',
            'date_naissance' => '1990-01-01',
            'sexe' => 'Homme',
            'groupe_sanguin' => 'O+'
        ]);

        $hopital = User::updateOrCreate(
            ['email' => 'hopital@example.com'],
            [
                'name' => 'Hopital Casablanca',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'hopital',
                'ville' => 'Casablanca',
            ]
        );
        $hopital->hopitalProfile()->updateOrCreate([], [
            'nom_etablissement' => 'CHU Casablanca',
            'nom_responsable' => 'Dr. Ahmed',
            'telephone_fixe' => '0522000001',
            'latitude' => 33.5731,
            'longitude' => -7.5898
        ]);

        $this->call([
            BloodDemandSeeder::class,
            CampaignSeeder::class,
        ]);
    }
}
