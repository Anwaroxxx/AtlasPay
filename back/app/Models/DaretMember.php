<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaretMember extends Model
{
    protected $fillable = [
        'daret_group_id',
        'user_id',
        'turn_order',
        'status',
        'has_paid_current_round',
        'has_received_payout',
    ];

    public function group()
    {
        return $this->belongsTo(DaretGroup::class, 'daret_group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
