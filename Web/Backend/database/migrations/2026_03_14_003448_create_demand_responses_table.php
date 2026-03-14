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
        Schema::create('demand_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donneur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('blood_demand_id')->constrained('blood_demands')->onDelete('cascade');
            $table->enum('status', ['pending', 'accepted', 'contacted', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demand_responses');
    }
};
