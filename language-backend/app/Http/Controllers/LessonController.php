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
        try {
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
                \Log::info('Video file detected in request.');
                $videoPath = $request->file('video_file')->store("videos/course_{$request->course_id}", 'public');
            } else {
                \Log::warning('No video file found in request.');
            }

            // Save notes file if provided
            if ($request->hasFile('notes_file')) {
                $notesPath = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'public');
            }

            // Generate thumbnail for the video
            if ($videoPath) {
                $thumbnailName = 'thumbnails/' . uniqid('thumb_') . '.jpg';
                $this->generateVideoThumbnail($videoPath, $thumbnailName);
            } else {
                $thumbnailName = null;
            }

            // Create the lesson
            $lesson = Lesson::create([
                'title' => $request->title,
                'description' => $request->description,
                'video_url' => $videoPath,
                'notes_file' => $notesPath,
                'thumbnail' => $thumbnailName,
                'course_id' => $request->course_id,
                'created_by' => auth()->id(),
            ]);

            return response()->json($lesson, 201);
        } catch (\Exception $e) {
            \Log::error('Lesson store error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Generate video thumbnail (placeholder function, implement actual logic)
    protected function generateVideoThumbnail($videoPath, $thumbnailPath)
    {
        $ffmpeg = 'ffmpeg';
        $fullVideoPath = str_replace('\\', '/', storage_path('app/public/' . $videoPath));
        $fullThumbnailPath = str_replace('\\', '/', storage_path('app/public/' . $thumbnailPath));

        if (!file_exists(dirname($fullThumbnailPath))) {
            mkdir(dirname($fullThumbnailPath), 0755, true);
        }

        $command = "\"$ffmpeg\" -i \"$fullVideoPath\" -ss 00:00:02 -vframes 1 \"$fullThumbnailPath\" 2>&1";
        \Log::info("Running FFmpeg command: $command");

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            \Log::error("FFmpeg failed to generate thumbnail. Output: " . implode("\n", $output));
        } else {
            \Log::info("Thumbnail successfully generated at $fullThumbnailPath");
        }
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

        $videoPath = $lesson->video_url;
        $notesPath = $lesson->notes_file;
        $thumbnailName = $lesson->thumbnail;

        // Update video file if provided
        if ($request->hasFile('video_file')) {
            // Delete old video
            if ($lesson->video_url && Storage::disk('public')->exists($lesson->video_url)) {
                Storage::disk('public')->delete($lesson->video_url);
            }
            $videoPath = $request->file('video_file')->store("videos/course_{$request->course_id}", 'public');

            // Generate new thumbnail
            if ($thumbnailName && Storage::disk('public')->exists($thumbnailName)) {
                Storage::disk('public')->delete($thumbnailName);
            }
            $thumbnailName = 'thumbnails/' . uniqid('thumb_') . '.jpg';
            $this->generateVideoThumbnail($videoPath, $thumbnailName);
        }

        // Update notes file if provided
        if ($request->hasFile('notes_file')) {
            if ($lesson->notes_file && Storage::disk('public')->exists($lesson->notes_file)) {
                Storage::disk('public')->delete($lesson->notes_file);
            }
            $notesPath = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'public');
        }

        // Update lesson fields
        $lesson->update([
            'title' => $request->title,
            'description' => $request->description,
            'video_url' => $videoPath,
            'notes_file' => $notesPath,
            'thumbnail' => $thumbnailName,
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
        if ($lesson->thumbnail && Storage::disk('public')->exists($lesson->thumbnail)) {
            Storage::disk('public')->delete($lesson->thumbnail);
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
