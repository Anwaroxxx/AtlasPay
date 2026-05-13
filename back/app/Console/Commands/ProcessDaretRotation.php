<?php

namespace App\Console\Commands;

use App\Models\DaretGroup;
use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessDaretRotation extends Command
{
    protected $signature = 'app:process-daret';

    protected $description = 'Rotate Daret groups and process payouts';

    public function handle()
    {
        $groups = DaretGroup::where('status', 'active')->get();

        foreach ($groups as $group) {
            DB::transaction(function () use ($group) {
                // 1. Check if everyone paid for the current round
                $unpaid = $group->members()->where('has_paid_current_round', false)->count();

                if ($unpaid === 0) {
                    // Everyone paid, pick a random recipient who hasn't received payout
                    $recipient = $group->members()
                        ->where('status', 'accepted')
                        ->where('has_received_payout', false)
                        ->inRandomOrder()
                        ->first();

                    if ($recipient) {
                        $payoutAmount = $group->monthly_amount * $group->members()->where('status', 'accepted')->count();
                        $recipientAccount = $recipient->user->accounts()->where('status', 'active')->first();

                        if ($recipientAccount) {
                            $recipientAccount->increment('balance', $payoutAmount);
                            $recipient->update(['has_received_payout' => true]);

                            Transaction::create([
                                'from_account_id' => null, // Circle payout
                                'to_account_id' => $recipientAccount->id,
                                'amount' => $payoutAmount,
                                'method' => 'daret_payout',
                                'category' => 'savings',
                                'status' => 'completed',
                                'type' => 'deposit',
                                'description' => "Daret Pool Payout: {$group->name}",
                            ]);
                        }
                    }

                    // Check if cycle is finished (everyone received payout)
                    $remainingRecipients = $group->members()
                        ->where('status', 'accepted')
                        ->where('has_received_payout', false)
                        ->count();

                    if ($remainingRecipients === 0) {
                        $group->update(['status' => 'completed']);
                    } else {
                        $group->increment('current_round');
                        // Reset payment status for next round
                        $group->members()->update(['has_paid_current_round' => false]);
                    }

                    $this->info("Rotated Daret group: {$group->name} to round {$group->current_round}");
                } else {
                    $this->warn("Daret group: {$group->name} has {$unpaid} unpaid members. Rotation stalled.");
                }
            });
        }
    }
}
