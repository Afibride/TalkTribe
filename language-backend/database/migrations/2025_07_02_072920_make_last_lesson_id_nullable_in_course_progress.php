<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
   public function up()
{
    Schema::table('course_progress', function (Blueprint $table) {
        $table->foreignId('last_lesson_id')->nullable()->change();
    });
}

public function down()
{
    Schema::table('course_progress', function (Blueprint $table) {
        $table->foreignId('last_lesson_id')->nullable(false)->change();
    });
}
};
