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

        User::create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'ville' => 'Casablanca',
        ]);

        User::create([
            'email' => 'donneur@example.com',
            'password' => Hash::make('password123'),
            'role' => 'donneur',
            'ville' => 'Rabat',
        ]);

        User::create([
            'email' => 'receveur@example.com',
            'password' => Hash::make('password123'),
            'role' => 'receveur',
            'ville' => 'Marrakech',
        ]);

        $this->call([
            BloodDemandSeeder::class,
        ]);
    }
}
