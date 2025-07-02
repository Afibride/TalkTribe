<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->unsignedInteger('order')
                  ->default(0)
                  ->after('id') // Or specify where you want the column
                  ->comment('Determines display order of lessons');
        });

        // Optional: Set initial order based on existing IDs
        DB::statement('UPDATE lessons SET `order` = id');
    }

    public function down()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
};