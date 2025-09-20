<?php

namespace App\Http\Controllers;

use App\Helpers\SupabaseUploadHelper;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{

     protected $uploadHelper;

    public function __construct()
    {
        $this->uploadHelper = new SupabaseUploadHelper();
    }

    
    // Get all courses (learners + instructors can access)
public function index(Request $request)
{
    $limit = $request->query('limit', 12);

    $courses = Course::with(['instructor:id,name'])
        ->where('is_public', true) // ✅ Only public courses
        ->inRandomOrder()
        ->take($limit)
        ->get()
        ->each->append('total_lessons');

    return response()->json($courses);
}

    // Show a single course
    public function show($id)
    {
        $course = Course::with('instructor')->findOrFail($id);
$course->append('total_lessons');
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
            'duration' => 'nullable|string|max:100',
            'level' => 'nullable|in:beginner,intermediate,advanced',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $this->uploadHelper->uploadCourseImage(
                $request->file('image'), 
                $user->id
            );
        }

        $course = Course::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'instructor_id' => $user->id,
            'image' => $imagePath,
            'duration' => $validated['duration'] ?? null,
            'level' => $validated['level'] ?? 'beginner',
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
            // Delete old image from Supabase
            if ($course->image) {
                $this->uploadHelper->delete($course->image);
            }
            
            $imagePath = $this->uploadHelper->uploadCourseImage(
                $request->file('image'), 
                $user->id
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
        
        // Delete image from Supabase
        if ($course->image) {
            $this->uploadHelper->delete($course->image);
        }
    
        $course->delete();
    
        return response()->json(['message' => 'Course deleted']);
    }
    

    // Get courses by category
public function getCourses()
{
    $categories = Category::with(['courses' => function($query) {
        $query->with(['instructor:id,name']);
    }])->get();

    return response()->json($categories);
}

   public function mostClickedCourses()
{
    $courses = Course::with('instructor:id,name')
        ->orderByDesc('clicks')
        ->take(6)
        ->get();

    Log::info('Most Clicked Courses:', $courses->toArray()); 
    return response()->json($courses);
}
    public function randomCourses()
    {
        $courses = Course::inRandomOrder()->take(5)->get();
        return response()->json($courses);
    }

    
public function getInstructorCourses(Request $request)
{
    $user = $request->user();
    
    if ($user->role !== 'instructor') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    
    $courses = Course::where('instructor_id', $user->id)
        ->with(['category', 'lessons'])
        ->latest()
        ->get();
        
    return response()->json($courses);
}
}
