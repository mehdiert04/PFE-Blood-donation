<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Campaign;
use App\Models\User;
use App\Models\HopitalProfile;
use Carbon\Carbon;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hopitalUser = User::where('role', 'hopital')->first();

        if ($hopitalUser) {
            // Ensure profile exists
            HopitalProfile::updateOrCreate(
                ['user_id' => $hopitalUser->id],
                [
                    'nom_etablissement' => 'Hôpital Militaire d’Instruction Mohammed V',
                    'nom_responsable' => 'Dr. Ahmed Bensouda',
                    'telephone_fixe' => '0537123456',
                    'latitude' => 33.9716,
                    'longitude' => -6.8498,
                ]
            );

            Campaign::create([
                'titre' => 'Don du Sang : Un Geste pour la Vie',
                'description' => 'Rejoignez-nous pour une journée de solidarité. Votre don peut sauver jusqu\'à trois vies.',
                'lieu' => 'Place Mohammed V',
                'ville' => 'Casablanca',
                'date_debut' => Carbon::now()->addDays(2),
                'date_fin' => Carbon::now()->addDays(2),
                'heure_debut' => '09:00:00',
                'heure_fin' => '18:00:00',
                'image_url' => '/1.jpg',
                'sponsors' => 'Fondation Mohammed V pour la Solidarité, Lions Club',
                'organizer_id' => $hopitalUser->id,
                'statut' => 'A venir',
            ]);

            Campaign::create([
                'titre' => 'Grande Collecte de Printemps',
                'description' => 'Le Centre National de Transfusion Sanguine organise une collecte massive. Nous comptons sur vous.',
                'lieu' => 'Esplanade de la Bibliothèque Nationale',
                'ville' => 'Rabat',
                'date_debut' => Carbon::now()->addDays(5),
                'date_fin' => Carbon::now()->addDays(7),
                'heure_debut' => '10:00:00',
                'heure_fin' => '19:00:00',
                'image_url' => '/2.jpg',
                'sponsors' => 'Ministère de la Santé, Croix-Rouge Marocaine',
                'organizer_id' => $hopitalUser->id,
                'statut' => 'A venir',
            ]);
        }
    }
}
