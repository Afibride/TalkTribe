<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    // Get all courses (learners + instructors can access)
    public function index()
    {
    }

    // Show a single course
    public function show($id)
    {
        $course = Course::with('instructor')->findOrFail($id);
        return response()->json($course);
    }

    // Instructor adds a new course
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'instructor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'duration' => 'nullable|string|max:100', // e.g., "3 weeks"
            'level' => 'nullable|in:beginner,intermediate,advanced', // validate enum values
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store(
                'course_images/user_' . $user->id,
                'public'
            );
        }

        $course = Course::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'instructor_id' => $user->id,
            'image' => $imagePath,
            'duration' => $validated['duration'] ?? null,
            'level' => $validated['level'] ?? 'beginner', // default if not passed
        ]);

        return response()->json(['message' => 'Course created', 'course' => $course], 201);
    }




    // Instructor updates a course
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $course = Course::findOrFail($id);

        if ($user->id !== $course->instructor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'duration' => 'nullable|string|max:100',
            'level' => 'nullable|in:beginner,intermediate,advanced',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store(
                'course_images/user_' . $user->id,
                'public'
            );
            $validated['image'] = $imagePath;
        }

        $course->update($validated);

        return response()->json(['message' => 'Course updated', 'course' => $course]);
    }

   
    public function destroy($id)
    {
        $user = Auth::user();
        $course = Course::findOrFail($id);
    
        if ($user->id !== $course->instructor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($course->image) {
            Storage::disk('public')->delete($course->image);
        }
    
        $course->delete();
    
        return response()->json(['message' => 'Course deleted']);
    }
    

    // Get courses by category
    public function getCourses()
    {
        $localLanguageCourses = Course::where('category_id', 1)
            ->with(['instructor:id,name'])
            ->get();

        $cultureCourses = Course::where('category_id', 2)
            ->with(['instructor:id,name'])
            ->get();

        return response()->json([
            'localLanguageCourses' => $localLanguageCourses,
            'cultureCourses' => $cultureCourses,
        ]);
    }

   public function mostClickedCourses()
{
    $courses = Course::with('instructor:id,name')
        ->orderByDesc('clicks')
        ->take(6)
        ->get();

    \Log::info('Most Clicked Courses:', $courses->toArray()); // Log the fetched courses

    return response()->json($courses);
}
    public function randomCourses()
    {
        $courses = Course::inRandomOrder()->take(5)->get();
        return response()->json($courses);
    }
}
