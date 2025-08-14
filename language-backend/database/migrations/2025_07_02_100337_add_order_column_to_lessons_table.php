<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->unsignedInteger('lesson_order')
                  ->default(0)
                  ->after('id')
                  ->comment('Determines display order of lessons');
        });

        // Set initial order based on existing IDs
        DB::statement('UPDATE lessons SET lesson_order = id');
    }

    public function down()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('lesson_order');
        });
    }
};
