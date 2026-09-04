<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\TransactionCreated;
use App\Models\Transaction;
use App\Services\TransferMoneyService as ServicesTransferMoneyService;

class TransactionService
{
    public static function create(array $data): Transaction
    {
        $from = $data['from'] ?? null;
        $to = $data['to'] ?? null;
        $status = $data['status'] ?? 'completed';

        if ($status === 'completed' && $from && $to && (float) $data['amount'] > 0) {
            ServicesTransferMoneyService::sendMoney($from, $to, $data['amount']);
        }

        $transaction = Transaction::create([
            'from_account_id' => $from?->id,
            'to_account_id' => $to?->id,
            'amount' => $data['amount'],
            'method' => $data['method'],
            'type' => $data['type'] ?? 'transfer',
            'status' => $status,
            'description' => $data['description'] ?? null,
        ]);

        if ($transaction->status === 'completed') {
            if ($from) {
                // Notify Sender
                event(new TransactionCreated($transaction, $from->user_id, false));
            }

            if ($to && (! $from || $to->user_id !== $from->user_id)) {
                // Notify Receiver (skip duplicate when same owner)
                event(new TransactionCreated($transaction, $to->user_id, true));
            }
        }

        return $transaction;
    }

    public static function update(?array $data): Transaction
    {
        return Transaction::make($data);
    }
}
