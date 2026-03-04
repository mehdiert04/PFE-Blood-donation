<?php

namespace Database\Seeders;

use App\Models\BloodDemand;
use App\Models\User;
use Illuminate\Database\Seeder;

class BloodDemandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $receveur = User::where('email', 'receveur@example.com')->first();

        if (!$receveur) {
            return;
        }

        $demands = [
            [
                'user_id' => $receveur->id,
                'blood_type' => 'O+',
                'quantity' => 2,
                'hospital_name' => 'CHU Mohammed VI',
                'city' => 'Marrakech',
                'description' => 'Urgent need for surgery.',
                'status' => 'pending',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'user_id' => $receveur->id,
                'blood_type' => 'A-',
                'quantity' => 1,
                'hospital_name' => 'Clinique de l\'Aeroport',
                'city' => 'Casablanca',
                'description' => 'Post-accident stabilization.',
                'status' => 'fulfilled',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(8),
            ],
            [
                'user_id' => $receveur->id,
                'blood_type' => 'B+',
                'quantity' => 3,
                'hospital_name' => 'Hopital Militaire',
                'city' => 'Rabat',
                'description' => 'Chronic condition treatment.',
                'status' => 'cancelled',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(4),
            ],
            [
                'user_id' => $receveur->id,
                'blood_type' => 'AB+',
                'quantity' => 1,
                'hospital_name' => 'Hopital Cheikh Zaid',
                'city' => 'Rabat',
                'description' => 'Needed for regular transfusion.',
                'status' => 'pending',
                'created_at' => now()->subHours(5),
                'updated_at' => now()->subHours(5),
            ],
        ];

        foreach ($demands as $demand) {
            BloodDemand::create($demand);
        }
    }
}
