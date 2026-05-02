<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'from_account_id',
        'to_account_id',
        'amount',
        'type',
        'method',
        'category',
        'status'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
