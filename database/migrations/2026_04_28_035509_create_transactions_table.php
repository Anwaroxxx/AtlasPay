<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('from_account_id')
                    ->constrained("accounts");
            
            $table->foreignId('to_account_id')
                    ->constrained("accounts");
            
            $table->decimal('amount',15,2);
            // type is whether the moyed is in or out of the account (credit or debit)
            $table->string('type');
            // transaction method QR-code, transfer, atm,..
            $table->string('method');
            // status (pending, completed, failed);
            $table->string("status")->default("pending");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
