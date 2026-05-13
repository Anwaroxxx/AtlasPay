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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();

            $table->timestamps();

            $table->foreignId('user_id')
                ->constrained('users');

            $table->string('account_number')->unique();
            // balance data
            $table->decimal('balance', 15, 2)->default(0);

            // account type
            $table->string('type');
            $table->string('currency', 3)->default('MAD');

            // account status(active , frozen , closed)
            $table->string('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
