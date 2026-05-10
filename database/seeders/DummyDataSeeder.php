<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\DaretGroup;
use App\Models\DaretMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'first_name' => 'Anwar',
                'last_name' => 'Demo',
                'email' => 'demo@atlaspay.ma',
                'password' => bcrypt('password'),
                'phone' => '+212600000000',
                'address' => 'Casablanca, Morocco',
                'government_id' => 'AB123456',
                'credit_score' => 750,
            ]);
        }

        $account = $user->accounts()->first();
        if (!$account) {
            $account = Account::create([
                'user_id' => $user->id,
                'account_number' => 'MA' . rand(1000000000000000, 9999999999999999),
                'balance' => 25000,
                'type' => 'checking',
                'currency' => 'MAD',
                'status' => 'active',
            ]);
        }

        // Create some other users for Daret and transfers
        $users = User::factory(5)->create();

        // Create 20 random transactions for the last 30 days
        $categories = ['Food', 'Shopping', 'Bills', 'Transport', 'Café', 'General'];
        $methods = ['mobile_payment', 'card_payment', 'bank_transfer', 'cash_withdrawal'];

        for ($i = 0; $i < 20; $i++) {
            $type = rand(0, 10) > 3 ? 'withdrawal' : 'deposit'; // More withdrawals for realism
            $amount = rand(50, 2000);
            $date = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23));

            Transaction::create([
                'from_account_id' => $type === 'withdrawal' ? $account->id : null,
                'to_account_id' => $type === 'deposit' ? $account->id : null,
                'amount' => $amount,
                'type' => $type === 'withdrawal' ? 'transfer' : 'deposit',
                'method' => $methods[array_rand($methods)],
                'category' => $categories[array_rand($categories)],
                'status' => 'completed',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // Create a Daret group where the user is a member
        $daretGroup = DaretGroup::create([
            'name' => 'Family Circle',
            'monthly_amount' => 1000,
            'cycle_duration_months' => 6,
            'creator_id' => $users[0]->id,
            'status' => 'active',
        ]);

        // Add members
        DaretMember::create([
            'daret_group_id' => $daretGroup->id,
            'user_id' => $users[0]->id,
            'turn_order' => 1,
            'status' => 'accepted',
        ]);

        DaretMember::create([
            'daret_group_id' => $daretGroup->id,
            'user_id' => $user->id,
            'turn_order' => 2,
            'status' => 'accepted',
            'has_paid_current_round' => true,
        ]);

        foreach ($users->slice(1) as $index => $u) {
            DaretMember::create([
                'daret_group_id' => $daretGroup->id,
                'user_id' => $u->id,
                'turn_order' => $index + 3,
                'status' => 'accepted',
            ]);
        }
    }
}
