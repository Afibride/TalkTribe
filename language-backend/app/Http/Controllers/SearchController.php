<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json(['message' => 'Empty search'], 400);
        }

        // Users: match name or username
        $users = User::where('name', 'LIKE', "%{$query}%")
                    ->orWhere('username', 'LIKE', "%{$query}%")
                    ->take(10)
                    ->get();

        // Courses: match title or description, then append total_lessons
        $courses = Course::where('title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->take(10)
            ->get()
            ->each->append('total_lessons');

        // Lessons: match title or content, include course title
        $lessons = Lesson::with('course:id,title')
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->take(10)
            ->get()
            ->map(function ($lesson) {
                $lesson->course_title = $lesson->course->title ?? null;
                return $lesson;
            });

        return response()->json([
            'users' => $users,
            'courses' => $courses,
            'lessons' => $lessons,
        ]);
    }
}
