<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are not mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the donor profile associated with the user.
     */
    public function donneurProfile(): HasOne
    {
        return $this->hasOne(DonneurProfile::class);
    }

    /**
     * Get the receiver profile associated with the user.
     */
    public function receveurProfile(): HasOne
    {
        return $this->hasOne(ReceveurProfile::class);
    }

    /**
     * Get the hospital profile associated with the user.
     */
    public function hopitalProfile(): HasOne
    {
        return $this->hasOne(HopitalProfile::class);
    }
}
