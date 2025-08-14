<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade'); // delete progress when user is deleted

            $table->foreignId('course_id')
                ->constrained('courses')
                ->onDelete('cascade'); // delete progress when course is deleted

            $table->unsignedInteger('completed_lessons')->default(0);
            $table->unsignedInteger('total_lessons');

            $table->decimal('progress_percent', 5, 2)->default(0.00);

            $table->foreignId('last_lesson_id')
                ->nullable()
                ->constrained('lessons')
                ->onDelete('set null'); 

            $table->timestamps();

            $table->unique(['user_id', 'course_id']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_progress');
    }
};
