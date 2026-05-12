<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = ['first_name', 'last_name', 'phone', 'email', 'password', 'address', 'government_id', 'credit_score', 'profile_photo'];

    protected $hidden = ['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'];

    protected $appends = ['name'];

    public function getNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

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
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function wallet()
    {
        return $this->hasOne(Account::class)->where('type', 'wallet');
    }

    public function credits()
    {
        return $this->hasMany(Credit::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function savingsGoals()
    {
        return $this->hasMany(SavingsGoal::class);
    }

    public function daretGroups()
    {
        return $this->belongsToMany(DaretGroup::class, 'daret_members');
    }
}
