<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'donneur_id',
        'blood_demand_id',
        'status'
    ];

    public function donneur()
    {
        return $this->belongsTo(User::class, 'donneur_id');
    }

    public function bloodDemand()
    {
        return $this->belongsTo(BloodDemand::class);
    }
}
