<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;

class StatsController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'learner')->count();
        $successRate = 75; // Assuming a static success rate for demonstration purposes
        $questions = Lesson::count();
        $experts = User::where('role', 'instructor')->count();
        // Calculate years since the first course was created
        $firstCourse = Course::orderBy('created_at')->first();
        $years = $firstCourse
            ? now()->diffInYears($firstCourse->created_at) + 1 
            : 1;

        return response()->json([
            'students' => $students,
            'successRate' => $successRate,
            'questions' => $questions,
            'experts' => $experts,
            'years' => $years,
        ]);
    }
}