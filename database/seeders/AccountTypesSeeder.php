<?php

namespace Database\Seeders;

use App\Models\AccountTypes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        AccountTypes::insert([
            ['name'=> 'savings'],
            ['name'=> 'code_30'],
            ['name'=> 'tawfir'],
        ]);
    }
}
