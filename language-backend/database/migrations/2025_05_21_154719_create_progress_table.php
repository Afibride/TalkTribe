<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade'); // delete progress if user is deleted

            $table->foreignId('lesson_id')
                ->constrained('lessons')
                ->onDelete('cascade'); 

            $table->boolean('completed')->default(false);
            $table->integer('score')->nullable(); 
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('progress');
    }
};
