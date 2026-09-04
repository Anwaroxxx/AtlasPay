<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaretGroup extends Model
{
    protected $fillable = [
        'name',
        'monthly_amount',
        'cycle_duration_months',
        'current_round',
        'status',
        'creator_id',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->hasMany(DaretMember::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'daret_members');
    }
}
