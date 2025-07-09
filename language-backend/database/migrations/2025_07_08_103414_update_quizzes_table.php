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
        Schema::table('quizzes', function (Blueprint $table) {
            // Change lesson_id to proper foreign key if it wasn't already
            $table->foreignId('lesson_id')->change();
            
            // Add new columns
            $table->text('description')->nullable()->after('title');
            $table->integer('duration')->default(15)->comment('Duration in minutes')->after('type');
            $table->boolean('is_published')->default(false)->after('duration');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quizzes', function (Blueprint $table) {
            
            $table->dropColumn(['description', 'duration', 'is_published']);
        
            $table->enum('type', ['multiple_choice', 'true_false'])->default('multiple_choice')->change();
       });
    }
};