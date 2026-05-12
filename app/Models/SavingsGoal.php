<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SavingsGoal extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'current_amount',
        'monthly_deduction',
        'target_date',
        'locked_until',
        'status',
    ];

    protected $casts = [
        'target_date' => 'date',
        'locked_until' => 'date',
        'target_amount' => 'float',
        'current_amount' => 'float',
        'monthly_deduction' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
