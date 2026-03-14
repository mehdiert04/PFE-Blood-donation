<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class BloodDemand extends Model
{
    /** @use HasFactory<\Database\Factories\BloodDemandFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blood_type',
        'hospital_name',
        'city',
        'description',
        'status',
        'hopital_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hospital()
    {
        return $this->belongsTo(User::class, 'hopital_id');
    }

    public function responses()
    {
        return $this->hasMany(DemandResponse::class, 'blood_demand_id');
    }
}
