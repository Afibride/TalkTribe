<?php

// database/migrations/xxxx_xx_xx_create_lessons_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable(); // YouTube or hosted video
            $table->string('notes_file')->nullable(); // path to notes PDF/file
            $table->json('quiz')->nullable(); // we'll expand this later
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('lessons');
    }
};
