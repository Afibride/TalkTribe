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
        Schema::table('lessons', function (Blueprint $table) {
            // 1. Drop the existing quiz column
            $table->dropColumn('quiz');
            
            $table->foreignId('quiz_id')
                  ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // 1. Drop the foreign key constraint first
            $table->dropForeign(['quiz_id']);
            $table->dropColumn('quiz_id');
            $table->json('quiz')->nullable();
        });
    }
};