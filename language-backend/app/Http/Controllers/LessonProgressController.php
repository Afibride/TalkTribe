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
        'is_completed' => 'required|boolean',
    ]);

    try {
        $userId = auth()->id();
        $lesson = Lesson::with('course')->findOrFail($request->lesson_id);

        \Log::info("Updating progress for user {$userId} on lesson {$lesson->id}");

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $userId, 'lesson_id' => $request->lesson_id],
            ['completed' => $request->is_completed]
        );

        $courseProgress = $this->calculateCourseProgress($userId, $lesson->course_id);

        \Log::info("Course progress updated", [
            'user_id' => $userId,
            'course_id' => $lesson->course_id,
            'progress' => $courseProgress
        ]);

        return response()->json([
            'message' => 'Lesson progress updated',
            'course_progress' => $courseProgress
        ]);

    } catch (\Exception $e) {
        \Log::error("Progress update failed: " . $e->getMessage());
        return response()->json(['message' => 'Update failed'], 500);
    }
}

public function userCourseProgress()
{
    $userId = auth()->id();
    
    $courses = Course::whereHas('lessons.progress', function($query) use ($userId) {
        $query->where('user_id', $userId);
    })
    ->with(['lessons' => function($query) use ($userId) {
        $query->with(['progress' => function($query) use ($userId) {
            $query->where('user_id', $userId);
        }]);
    }])
    ->get();

    $progressData = $courses->map(function($course) use ($userId) {
        $totalLessons = $course->lessons->count();
        $completedLessons = $course->lessons->filter(function($lesson) {
            return $lesson->progress && $lesson->progress->completed;
        })->count();
        
        $progressPercent = $totalLessons > 0 
            ? round(($completedLessons / $totalLessons) * 100) 
            : 0;

        $lastLesson = $course->lessons->sortByDesc(function($lesson) {
            return $lesson->progress ? $lesson->progress->updated_at : null;
        })->first();

        return [
            'course_id' => $course->id,
            'course_title' => $course->title,
            'course_image' => $course->image_url,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress_percent' => $progressPercent,
            'last_lesson_id' => $lastLesson->id,
            'last_lesson_title' => $lastLesson->title,
            'is_last_lesson_completed' => $lastLesson->progress ? $lastLesson->progress->completed : false,
        ];
    });

    return response()->json($progressData);
}

public function startCourse($courseId)
{
    $course = Course::with('lessons')->findOrFail($courseId);
    
    if ($course->lessons->isEmpty()) {
        return response()->json(['message' => 'Course has no lessons'], 400);
    }

    $firstLesson = $course->lessons->first();
    
    $progress = LessonProgress::updateOrCreate(
        ['user_id' => auth()->id(), 'lesson_id' => $firstLesson->id],
        ['completed' => true]
    );

    $courseProgress = $this->calculateCourseProgress(auth()->id(), $courseId);

    return response()->json([
        'message' => 'Course started successfully',
        'course_progress' => $courseProgress
    ]);
}

    protected function calculateCourseProgress($userId, $courseId)
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        $completedLessons = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', function($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->where('completed', true)
            ->count();

        return [
            'course_id' => $courseId,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress_percent' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0,
        ];
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


public function getCourseProgress($courseId)
{
    return response()->json(
        $this->calculateCourseProgress(auth()->id(), $courseId)
    );
}
}