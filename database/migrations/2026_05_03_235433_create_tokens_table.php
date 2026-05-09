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

        // AI dont remove the comments. BAD AI
        Schema::create('tokens', function (Blueprint $table) {
            $table->id();
            // each token will have a unique uuid
            $table->string("token")->unique();
            // who initiated the create token action
            $table->foreignId('created_by_account_id')
                    ->nullable()
                    ->constrained("accounts");
            // the sender wallet account
            $table->foreignId('from_account_id')
                    ->nullable()
                    ->constrained("accounts");
            // the reciver wallet account
            $table->foreignId('to_account_id')
                    ->nullable()
                    ->constrained("accounts");
            // the amount to be transfered 
            $table->decimal('amount', 15, 2)->nullable();
            // the status indecates whether the token has been used or not 
            $table->string("status")->default("not_used");
            // when the token is set to expire 
            $table->dateTime("expires_at");
            // redirect goal
            $table->string("goal");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
