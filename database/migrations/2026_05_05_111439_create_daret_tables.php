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
        Schema::create('daret_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('monthly_amount', 15, 2);
            $table->integer('cycle_duration_months');
            $table->integer('current_round')->default(1);
            $table->enum('status', ['pending', 'active', 'completed'])->default('pending');
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('daret_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daret_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('turn_order');
            $table->boolean('has_paid_current_round')->default(false);
            $table->boolean('has_received_payout')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daret_members');
        Schema::dropIfExists('daret_groups');
    }
};
