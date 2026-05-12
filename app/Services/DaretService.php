<?php

namespace App\Services;

use App\Models\Account;
use App\Models\DaretGroup;
use App\Models\DaretMember;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DaretService
{
    /**
     * Automatically deduct Daret contributions from an account if applicable.
     */
    public static function processAutomaticContribution(Account $account)
    {
        $user = $account->user;

        // Find active Daret groups the user is in and hasn't paid for current round
        $memberships = DaretMember::where('user_id', $user->id)
            ->where('has_paid_current_round', false)
            ->where('status', 'accepted')
            ->whereHas('group', function ($query) {
                $query->where('status', 'active');
            })
            ->get();

        foreach ($memberships as $membership) {
            $group = $membership->group;
            $contribution = $group->monthly_amount;

            if ($account->balance >= $contribution) {
                DB::transaction(function () use ($account, $membership, $group, $contribution) {
                    $account->decrement('balance', $contribution);
                    $membership->update(['has_paid_current_round' => true]);

                    Transaction::create([
                        'from_account_id' => $account->id,
                        'to_account_id' => null, // Pool
                        'amount' => $contribution,
                        'method' => 'daret_contribution',
                        'category' => 'savings',
                        'status' => 'completed',
                        'type' => 'withdrawal',
                        'description' => "Automated Daret Contribution: {$group->name}",
                    ]);

                    Log::info("Daret automated contribution processed for user {$account->user_id} in group {$group->id}");

                    self::checkAndProcessPayout($group);
                });
            }
        }
    }

    /**
     * Check if everyone in the group has paid for the current round and process payout if so.
     */
    public static function checkAndProcessPayout(DaretGroup $group)
    {
        $unpaidCount = $group->members()
            ->where('status', 'accepted')
            ->where('has_paid_current_round', false)
            ->count();

        if ($unpaidCount === 0) {
            // Everyone has paid for this round.
            // Pick a random recipient who hasn't received a payout in this cycle.
            $recipient = $group->members()
                ->where('status', 'accepted')
                ->where('has_received_payout', false)
                ->inRandomOrder()
                ->first();

            if ($recipient) {
                $payoutAmount = $group->monthly_amount * $group->members()->where('status', 'accepted')->count();
                $recipientAccount = $recipient->user->accounts()->where('status', 'active')->first();

                if ($recipientAccount) {
                    DB::transaction(function () use ($group, $recipient, $recipientAccount, $payoutAmount) {
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

                        Log::info("Daret payout processed for group {$group->id} to user {$recipient->user_id}");

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
                    });
                }
            }
        }
    }
}
