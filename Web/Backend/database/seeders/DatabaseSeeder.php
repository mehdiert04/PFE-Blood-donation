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
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'ville' => 'Casablanca',
            ]
        );

        User::updateOrCreate(
            ['email' => 'donneur@example.com'],
            [
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'donneur',
                'ville' => 'Rabat',
            ]
        );

        User::updateOrCreate(
            ['email' => 'receveur@example.com'],
            [
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'receveur',
                'ville' => 'Marrakech',
            ]
        );

        User::updateOrCreate(
            ['email' => 'hopital@example.com'],
            [
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'role' => 'hopital',
                'ville' => 'Casablanca',
            ]
        );

        $this->call([
            BloodDemandSeeder::class,
            CampaignSeeder::class,
        ]);
    }
}
