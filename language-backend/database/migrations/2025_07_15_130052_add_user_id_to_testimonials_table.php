<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserIdToTestimonialsTable extends Migration
{
    public function up()
    {
        Schema::table('testimonials', function (Blueprint $table) {
            // Add the user_id column as foreign key
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null'); 
        });
    }

    public function down()
    {
        Schema::table('testimonials', function (Blueprint $table) {
            
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
}