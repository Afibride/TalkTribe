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
    Schema::table('lessons', function (Blueprint $table) {
        $table->unsignedBigInteger('created_by')->after('id'); 
    });
}

public function down()
{
    Schema::table('lessons', function (Blueprint $table) {
        $table->dropColumn('created_by');
    });
}
};
