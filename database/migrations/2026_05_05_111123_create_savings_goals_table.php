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
        Schema::create('savings_goals', function (Blueprint $class) {
            $class->id();
            $class->foreignId('user_id')->constrained()->onDelete('cascade');
            $class->string('name');
            $class->decimal('target_amount', 15, 2);
            $class->decimal('current_amount', 15, 2)->default(0);
            $class->decimal('monthly_deduction', 15, 2);
            $class->date('target_date');
            $class->date('locked_until');
            $class->enum('status', ['active', 'completed', 'unlocked'])->default('active');
            $class->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_goals');
    }
};
