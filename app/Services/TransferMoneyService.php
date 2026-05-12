<?php

// declare(strict_types=1);

namespace App\Services;

class TransferMoneyService
{
    public static function sendMoney($from, $to, $amount)
    {
        $to->increment('balance', $amount);
        $from->decrement('balance', $amount);
    }
}
