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
    Schema::create('lesson_progress', function (Blueprint $table) {
        $table->id();
        $table->integer('user_id');
        $table->integer('lesson_id');
        $table->boolean('completed')->default(false);
        $table->integer('progress_percent')->default(0);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lesson_progress');
    }
};
