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
        Schema::table('questions', function (Blueprint $table) {
            $table->string('option_a')->after('question_text');
            $table->string('option_b')->after('option_a');
            $table->string('option_c')->after('option_b');
            $table->string('option_d')->after('option_c');
            $table->string('correct_answer')->after('option_d'); // Expected: A, B, C, D
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']);
        });
    }
};
