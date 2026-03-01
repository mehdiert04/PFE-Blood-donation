<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RendezVous extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'rendez_vous';

    /**
     * The attributes that are not mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_rdv' => 'date',
        ];
    }

    /**
     * Get the donor (donneur) that owns the appointment.
     */
    public function donneur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donneur_id');
    }

    /**
     * Get the hospital (hopital) where the appointment is booked.
     */
    public function hopital(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hopital_id');
    }
}
