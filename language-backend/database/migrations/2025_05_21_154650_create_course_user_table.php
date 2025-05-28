<?php

// database/migrations/xxxx_xx_xx_create_course_user_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('course_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // learner
            $table->unsignedBigInteger('course_id');
            $table->timestamps();

        });
    }

    public function down(): void {
        Schema::dropIfExists('course_user');
    }
};
