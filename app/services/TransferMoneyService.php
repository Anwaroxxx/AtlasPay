<?php

// declare(strict_types=1);

namespace App\services;
use App\Models\Account;

class TransferMoneyService
{
    public static function sendMoney($from, $to, $amount)
    {
        $to->increment("balance",$amount);
        $from->decrement("balance",$amount);
    }
}