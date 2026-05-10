<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Transaction;
use App\Services\TransferMoneyService as ServicesTransferMoneyService;
use TransferMoneyService;

class TransactionService
{
    public static function create(array $data): Transaction
    {
        if (($data["status"] ?? "completed") === "completed") {
            ServicesTransferMoneyService::sendMoney($data["from"], $data["to"], $data["amount"]);
        }

        $transaction = Transaction::create([
            'from_account_id' => $data["from"]->id,
            'to_account_id' => $data["to"]->id,
            "amount" => $data["amount"],
            "method" => $data["method"],
            "type" => $data["type"] ?? "transfer",
            "status" => $data["status"] ?? "completed",
            "description" => $data["description"] ?? null,
        ]);

        if ($transaction->status === 'completed') {
            // Notify Sender
            event(new \App\Events\TransactionCreated($transaction, $data["from"]->user_id, false));

            // Notify Receiver
            event(new \App\Events\TransactionCreated($transaction, $data["to"]->user_id, true));
        }

        return $transaction;
    }

    public static function update(?array $data):Transaction
    {
        return Transaction::make($data);
    }
} 