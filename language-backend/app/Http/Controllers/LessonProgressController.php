<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\CourseProgress;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class LessonProgressController extends Controller
{
    /**
     * Update or create lesson progress
     */
    public function updateLessonProgress(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'is_completed' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();

            $userId = auth()->id();
            $lesson = Lesson::with('course')->findOrFail($validated['lesson_id']);

            // Update lesson progress
            LessonProgress::updateOrCreate(
                ['user_id' => $userId, 'lesson_id' => $validated['lesson_id']],
                ['completed' => $validated['is_completed']]
            );

            // Update course progress
            $courseProgress = $this->updateCourseProgress($userId, $lesson->course_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lesson progress updated',
                'course_progress' => $courseProgress
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Progress update failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update progress',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Start a course (mark first lesson as completed)
     */
    public function startCourse($courseId)
    {
        try {
            $userId = auth()->id();
            $course = Course::with('lessons')->findOrFail($courseId);

            if ($course->lessons->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course has no lessons'
                ], 400);
            }

            // Mark first lesson as completed
            $firstLesson = $course->lessons->first();
            
            LessonProgress::updateOrCreate(
                ['user_id' => $userId, 'lesson_id' => $firstLesson->id],
                ['completed' => true]
            );

            // Initialize course progress
            $courseProgress = $this->updateCourseProgress($userId, $courseId);

            return response()->json([
                'success' => true,
                'message' => 'Course started successfully',
                'course_progress' => $courseProgress
            ]);

        } catch (\Exception $e) {
            Log::error("Start course failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to start course'
            ], 500);
        }
    }

    /**
     * Get user's progress for all courses
     */
    public function getUserCourseProgress()
    {
        try {
            $userId = auth()->id();

            $progressData = CourseProgress::where('user_id', $userId)
                ->with(['course', 'lastLesson'])
                ->get()
                ->map(function($progress) {
                    return [
                        'course_id' => $progress->course_id,
                        'course_title' => $progress->course->title,
                        'course_image' => $progress->course->image_url,
                        'total_lessons' => $progress->total_lessons,
                        'completed_lessons' => $progress->completed_lessons,
                        'progress_percent' => $progress->progress_percent,
                        'last_lesson_id' => $progress->last_lesson_id,
                        'last_lesson_title' => $progress->lastLesson->title ?? null,
                        'is_last_lesson_completed' => (bool)$progress->last_lesson_id,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $progressData
            ]);

        } catch (\Exception $e) {
            Log::error("Get user progress failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get progress data'
            ], 500);
        }
    }

    /**
     * Get progress for a specific course
     */
    public function getCourseProgress($courseId)
    {
        try {
            $userId = auth()->id();
            $progress = $this->calculateCourseProgress($userId, $courseId);

            return response()->json([
                'success' => true,
                'data' => $progress
            ]);

        } catch (\Exception $e) {
            Log::error("Get course progress failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get course progress'
            ], 500);
        }
    }

    /**
     * Get progress for a specific lesson
     */
    public function getLessonProgress($lessonId)
    {
        try {
            $progress = LessonProgress::where('user_id', auth()->id())
                ->where('lesson_id', $lessonId)
                ->first();

            if (!$progress) {
                return response()->json([
                    'success' => false,
                    'message' => 'No progress found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $progress
            ]);

        } catch (\Exception $e) {
            Log::error("Get lesson progress failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get lesson progress'
            ], 500);
        }
    }

    /**
     * Initialize progress for all courses (admin tool)
     */
    public function initializeAllCourseProgress($userId = null)
    {
        try {
            $userId = $userId ?? auth()->id();
            $courses = Course::has('lessons')->get();
            
            foreach ($courses as $course) {
                $this->updateCourseProgress($userId, $course->id);
            }

            return response()->json([
                'success' => true,
                'message' => 'All course progress records initialized'
            ]);

        } catch (\Exception $e) {
            Log::error("Initialize progress failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize progress'
            ], 500);
        }
    }

    /**
     * Helper method to update course progress
     */
    protected function updateCourseProgress($userId, $courseId)
    {
        $course = Course::with('lessons')->findOrFail($courseId);
        $totalLessons = $course->lessons->count();
        
        $completedLessons = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
            ->where('completed', true)
            ->count();

        $lastCompletedLesson = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
            ->where('completed', true)
            ->with('lesson')
            ->orderByDesc('updated_at')
            ->first();

        $progressData = [
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'progress_percent' => $totalLessons > 0 
                ? round(($completedLessons / $totalLessons) * 100, 2)
                : 0,
            'last_lesson_id' => $lastCompletedLesson->lesson_id ?? null,
        ];

        return CourseProgress::updateOrCreate(
            ['user_id' => $userId, 'course_id' => $courseId],
            $progressData
        );
    }

    /**
     * Helper method to calculate course progress
     */
    protected function calculateCourseProgress($userId, $courseId)
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        $completedLessons = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
            ->where('completed', true)
            ->count();

        $lastCompletedLesson = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', fn($q) => $q->where('course_id', $courseId))
            ->where('completed', true)
            ->with('lesson')
            ->orderByDesc('updated_at')
            ->first();

        return [
            'course_id' => $courseId,
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'progress_percent' => $totalLessons > 0 
                ? round(($completedLessons / $totalLessons) * 100, 2)
                : 0,
            'last_lesson_id' => $lastCompletedLesson->lesson_id ?? null,
            'last_lesson_title' => $lastCompletedLesson->lesson->title ?? null,
        ];
    }

    /**
 * Get the next lesson for a course
 */
// app/Http/Controllers/LessonProgressController.php

public function getNextLesson($courseId)
{
    DB::beginTransaction();
    try {
        // Verify user is authenticated
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Verify course exists with lessons
        $course = Course::with(['lessons' => function($query) {
            $query->orderBy('order', 'asc');
        }])->find($courseId);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        if ($course->lessons->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Course has no lessons'
            ], 400);
        }

        // Get completed lessons
        $completedLessons = LessonProgress::where('user_id', $userId)
            ->where('completed', true)
            ->whereHas('lesson', function($q) use ($courseId) {
                $q->where('course_id', $courseId);
            })
            ->pluck('lesson_id')
            ->toArray();

        // Find next incomplete lesson
        $nextLesson = $course->lessons->first(function($lesson) use ($completedLessons) {
            return !in_array($lesson->id, $completedLessons);
        });

        // If all completed, return first lesson
        if (!$nextLesson) {
            $nextLesson = $course->lessons->first();
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'next_lesson_id' => $nextLesson->id,
            'is_completed' => in_array($nextLesson->id, $completedLessons),
            'message' => 'Next lesson retrieved'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error("Next lesson error", [
            'course_id' => $courseId,
            'user_id' => auth()->id(),
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}
}