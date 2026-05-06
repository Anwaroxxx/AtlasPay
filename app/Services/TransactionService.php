<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Transaction;
use App\Services\TransferMoneyService as ServicesTransferMoneyService;
use TransferMoneyService;

class TransactionService
{
    public static function create(array $data):Transaction
    {
        // dd($from->id);

        ServicesTransferMoneyService::sendMoney($data["from"],$data["to"],$data["amount"]);

        return Transaction::create([
            'from_account_id' => $data["from"]->id,
            'to_account_id' => $data["to"]->id,
            "amount" => $data["amount"],
            "method" => $data["method"],
            "type" => $data["type"] ?? "transfer",
        ]);
    }

    public static function update(?array $data):Transaction
    {
        return Transaction::make($data);
    }
} 