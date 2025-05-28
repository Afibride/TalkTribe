<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class LessonProgressController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'progress_percent' => 'required|integer|min:0|max:100',
        ]);

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => auth()->id(), 'lesson_id' => $request->lesson_id],
            [
                'progress_percent' => $request->progress_percent,
                'completed' => $request->progress_percent == 100,
            ]
        );

        return response()->json(['message' => 'Lesson progress updated', 'data' => $progress]);
    }

    public function userCourseProgress()
    {
        $userId = auth()->id();

        // Get all lesson progresses for the user, with lesson and course info
        $progresses = LessonProgress::with(['lesson.course'])
            ->where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get();

        // Group by course
        $courses = [];
        foreach ($progresses as $progress) {
            $courseId = $progress->lesson->course->id;
            if (!isset($courses[$courseId])) {
                $courses[$courseId] = [
                    'course_id' => $courseId,
                    'course_title' => $progress->lesson->course->title,
                    'course_image' => $progress->lesson->course->image,
                    'last_lesson_title' => $progress->lesson->title,
                    'progress_percent' => $progress->progress_percent,
                    'lesson_id' => $progress->lesson->id,
                ];
            }
        }

        // Return as a list
        return response()->json(array_values($courses));
    }

    public function show($lessonId)
    {
        $progress = LessonProgress::where('user_id', auth()->id())
            ->where('lesson_id', $lessonId)
            ->first();

        if (!$progress) {
            return response()->json(['message' => 'No progress found'], 404);
        }

        return response()->json($progress);
    }
}

