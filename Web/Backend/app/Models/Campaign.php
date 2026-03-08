<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'lieu',
        'ville',
        'date_debut',
        'date_fin',
        'heure_debut',
        'heure_fin',
        'image_url',
        'sponsors',
        'organizer_id',
        'statut'
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }
}
