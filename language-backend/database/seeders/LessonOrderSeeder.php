<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;

class LessonOrderSeeder extends Seeder
{
    public function run()
    {
        Lesson::chunk(200, function ($lessons) {
            foreach ($lessons as $lesson) {
                // Set order equal to ID if not set
                if (empty($lesson->order)) {
                    $lesson->update(['order' => $lesson->id]);
                }
            }
        });
    }
}