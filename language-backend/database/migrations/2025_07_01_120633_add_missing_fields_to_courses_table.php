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
        Schema::table('courses', function (Blueprint $table) {
            // Add slug first (alphabetical order is better for schema management)
            $table->string('slug')->unique()->nullable()->after('title');
            
            // Add total lessons count
            $table->unsignedInteger('total_lessons')->default(0)->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Drop in reverse order
            $table->dropColumn('total_lessons');
            $table->dropColumn('slug');
        });
    }
};