<?php

namespace App\Console\Commands;

use App\Models\Account;
use App\Models\SavingsGoal;
use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessAutoCut extends Command
{
    protected $signature = 'app:process-autocut';

    protected $description = 'Process monthly savings deductions for all active goals';

    public function handle()
    {
        $goals = SavingsGoal::where('status', 'active')->get();

        foreach ($goals as $goal) {
            DB::transaction(function () use ($goal) {
                $user = $goal->user;
                $account = $user->accounts()->where('status', 'active')->first();

                if ($account && $account->balance >= $goal->monthly_deduction) {
                    // Deduct from account
                    $account->decrement('balance', $goal->monthly_deduction);

                    // Add to goal
                    $goal->increment('current_amount', $goal->monthly_deduction);

                    // Create transaction record
                    Transaction::create([
                        'from_account_id' => $account->id,
                        'to_account_id' => null, // Vault transfer
                        'amount' => $goal->monthly_deduction,
                        'method' => 'autocut_vault',
                        'category' => 'savings',
                        'status' => 'completed',
                        'type' => 'transfer',
                    ]);

                    if ($goal->current_amount >= $goal->target_amount) {
                        $goal->update(['status' => 'completed']);
                    }

                    $this->info("Processed AutoCut for goal: {$goal->name}");
                } else {
                    $this->warn("Insufficient liquidity for goal: {$goal->name}");
                }
            });
        }
    }
}
