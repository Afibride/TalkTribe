<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Auth;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    // Only instructors can create lessons
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi|max:10240', // Max size 10MB
            'notes_file' => 'nullable|file|mimes:pdf,xlsx,xls,ppt,pptx,doc,docx|max:5120', // Max size 5MB
            'course_id' => 'required|exists:courses,id',
        ]);

        $videoPath = null;
        $notesPath = null;

        // Save video file if provided
        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store("videos/course_{$request->course_id}", 'public');
        }

        // Save notes file if provided
        if ($request->hasFile('notes_file')) {
            $notesPath = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'public');
        }

        // Create the lesson
        $lesson = Lesson::create([
            'title' => $request->title,
            'description' => $request->description,
            'video_url' => $videoPath,
            'notes_file' => $notesPath,
            'course_id' => $request->course_id,
        ]);

        return response()->json($lesson, 201);
    }

    // List all lessons (public or learner view)
    public function index()
    {
        return Lesson::all();
    }

    // Show one lesson
    public function show($id)
    {
        return Lesson::findOrFail($id);
    }

    // Update lesson (only instructor who created it)
    public function update(Request $request, $id)
    {
        
        $lesson = Lesson::findOrFail($id);
    
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi|max:10240', // Max 10MB
            'notes_file' => 'nullable|file|mimes:pdf,xlsx,xls,ppt,pptx,doc,docx|max:5120', // Max 5MB
            'course_id' => 'required|exists:courses,id',
        ]);
    
        // Store new files if provided
        if ($request->hasFile('video_file')) {
            // Delete old file
            if ($lesson->video_url && Storage::disk('public')->exists($lesson->video_url)) {
                Storage::disk('public')->delete($lesson->video_url);
            }
    
            // Store new video
            $lesson->video_url = $request->file('video_file')->store("videos/course_{$request->course_id}", 'public');
        }
    
        if ($request->hasFile('notes_file')) {
            // Delete old notes file
            if ($lesson->notes_file && Storage::disk('public')->exists($lesson->notes_file)) {
                Storage::disk('public')->delete($lesson->notes_file);
            }
    
            // Store new notes file
            $lesson->notes_file = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'public');
        }
    
        // Update other fields
        $lesson->update([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $request->course_id,
        ]);
    
        return response()->json($lesson);
    }
    

    // Delete lesson (only instructor who created it)
    public function destroy($id)
    {
        $lesson = Lesson::where('id', $id)
                        ->where('created_by', Auth::id())
                        ->firstOrFail();
    
        // Delete associated files
        if ($lesson->video_url && Storage::disk('public')->exists($lesson->video_url)) {
            Storage::disk('public')->delete($lesson->video_url);
        }
    
        if ($lesson->notes_file && Storage::disk('public')->exists($lesson->notes_file)) {
            Storage::disk('public')->delete($lesson->notes_file);
        }
    
        $lesson->delete();
    
        return response()->json(['message' => 'Lesson deleted']);
    }

    

    public function getLessonsByCourse($courseId)
    {
        \Log::info("Fetching all course data for course ID: $courseId");

        $course = Course::with(['lessons'])->findOrFail($courseId);

        \Log::info("Clicks before increment: " . $course->clicks);
        $course->increment('clicks');
        $course->refresh();
        \Log::info("Clicks after increment: " . $course->clicks);


        return response()->json($course);
    }

}
