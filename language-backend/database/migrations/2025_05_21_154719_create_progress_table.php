<?php

// database/migrations/xxxx_xx_xx_create_progress_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // learner
            $table->unsignedBigInteger('lesson_id');
            $table->boolean('completed')->default(false);
            $table->integer('score')->nullable(); // from quiz
            $table->timestamps();
            $table->unique(['user_id', 'lesson_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('progress');
    }
};
