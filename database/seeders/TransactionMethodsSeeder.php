<?php

namespace Database\Seeders;

use App\Models\TransactionMethods as ModelsTransactionMethods;
use Illuminate\Database\Seeder;

class TransactionMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ModelsTransactionMethods::insert([
            ['method' => 'card'],
            ['method' => 'qr'],
            ['method' => 'cash'],
            ['method' => 'transfer'],
        ]);
    }
}
