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
        Schema::table('courses', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('description');
            $table->dropColumn('category'); // remove old string-based category
        });
    }
    
    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->dropColumn('category_id');
        });
    }
    
};
