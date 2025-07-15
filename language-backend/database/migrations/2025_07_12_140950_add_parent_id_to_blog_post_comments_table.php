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
        Schema::table('blog_post_comments', function (Blueprint $table) {
            // Add parent_id column as nullable foreign key
            $table->foreignId('parent_id')
                  ->nullable()
                  ->after('content')
                  ->constrained('blog_post_comments')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('blog_post_comments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
           
            $table->dropColumn('parent_id');
        });
    }
};