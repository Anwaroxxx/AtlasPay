<?php

namespace App\Models;

use App\Services\DaretService;
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
        'description',
        'status',
    ];

    protected static function booted()
    {
        static::created(function ($transaction) {
            if ($transaction->status === 'completed' && $transaction->to_account_id) {
                $account = Account::find($transaction->to_account_id);
                if ($account) {
                    // Avoid recursion: don't trigger for Daret-related transactions
                    if (! in_array($transaction->method, ['daret_payout', 'daret_contribution'])) {
                        // We use the service here. We must be careful about circular dependencies
                        // but since Service is just a class with static methods, it's fine.
                        DaretService::processAutomaticContribution($account);
                    }
                }
            }
        });
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
