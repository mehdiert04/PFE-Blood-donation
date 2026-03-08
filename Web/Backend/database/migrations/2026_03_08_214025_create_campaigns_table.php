<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->string('lieu');
            $table->string('ville');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('image_url')->nullable();
            $table->text('sponsors')->nullable();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->enum('statut', ['A venir', 'En cours', 'Terminé'])->default('A venir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
