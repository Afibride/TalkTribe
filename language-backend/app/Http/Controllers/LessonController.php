<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;

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
                $videoPath = $request->file('video_file')->store("videos/course_{$request->course_id}", 'supabase');
            }

            // Save notes file if provided
            if ($request->hasFile('notes_file')) {
                $notesPath = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'supabase');
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

            // Automatically generate quiz after lesson is created
            try {
                app()->call('App\Http\Controllers\QuizController@generateQuizFromNotes', ['lessonId' => $lesson->id]);
            } catch (\Exception $e) {
                // Optionally log or handle quiz generation errors
                Log::error('Quiz auto-generation failed: ' . $e->getMessage());
            }

            return response()->json($lesson, 201);
        } catch (\Exception $e) {
            Log::error('Lesson store error: ' . $e->getMessage());
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
        Log::info("Running FFmpeg command: $command");

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            Log::error("FFmpeg failed to generate thumbnail. Output: " . implode("\n", $output));
        } else {
            Log::info("Thumbnail successfully generated at $fullThumbnailPath");
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
    if ($lesson->video_url && Storage::disk('supabase')->exists($lesson->video_url)) {
        Storage::disk('supabase')->delete($lesson->video_url);
    }
    $videoPath = $request->file('video_file')->store("videos/course_{$request->course_id}", 'supabase');
}

if ($request->hasFile('notes_file')) {
    if ($lesson->notes_file && Storage::disk('supabase')->exists($lesson->notes_file)) {
        Storage::disk('supabase')->delete($lesson->notes_file);
    }
    $notesPath = $request->file('notes_file')->store("notes/course_{$request->course_id}", 'supabase');
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
       if ($lesson->video_url && Storage::disk('supabase')->exists($lesson->video_url)) {
    Storage::disk('supabase')->delete($lesson->video_url);
}
if ($lesson->notes_file && Storage::disk('supabase')->exists($lesson->notes_file)) {
    Storage::disk('supabase')->delete($lesson->notes_file);
}
if ($lesson->thumbnail && Storage::disk('supabase')->exists($lesson->thumbnail)) {
    Storage::disk('supabase')->delete($lesson->thumbnail);
}

        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted']);
    }

    public function getLessonsByCourse($courseId)
    {
        $course = Course::with(['lessons'])->findOrFail($courseId);
        $course->increment('clicks');
        $course->refresh();
        return response()->json($course);
    }

    public function downloadNotes($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        if (!$lesson->notes_file) {
            return response()->json(['error' => 'No notes file attached'], 404);
        }
    $fileUrl = Storage::disk('supabase')->url($lesson->notes_file);
    
    return response()->json(['url' => $fileUrl]);
    }


    public function getLessonNotesContent($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        if (!$lesson->notes_file) {
            return response()->json(['error' => 'No notes file attached'], 404);
        }

        $filePath = storage_path('app/public/' . $lesson->notes_file);

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $content = '';

        try {
            switch ($ext) {
                case 'txt':
                    $content = file_get_contents($filePath);
                    break;

                case 'pdf':
                    $parser = new \Smalot\PdfParser\Parser();
                    $pdf = $parser->parseFile($filePath);
                    $content = $pdf->getText();
                    break;

                case 'doc':
                case 'docx':
                    $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath);
                    foreach ($phpWord->getSections() as $section) {
                        foreach ($section->getElements() as $element) {
                            // Paragraphs
                            if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                foreach ($element->getElements() as $childElement) {
                                    if ($childElement instanceof \PhpOffice\PhpWord\Element\Text) {
                                        $content .= $childElement->getText() . " ";
                                    }
                                }
                                $content .= "\n";
                            } elseif ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                                $content .= $element->getText() . "\n";
                            }
                            // You can add more element types as needed
                        }
                    }
                    break;

                default:
                    return response()->json(['error' => 'Preview not supported for .' . $ext], 400);
            }
        } catch (\Throwable $e) {
            Log::error("Notes parsing failed: " . $e->getMessage());
            return response()->json(['error' => 'Failed to parse notes file'], 500);
        }

        if (!$content) {
            return response()->json(['error' => 'No readable content found'], 204);
        }

        $pages = preg_split('/\n?Page\s+\d+(\s+of\s+\d+)?\n?/i', $content, -1, PREG_SPLIT_NO_EMPTY);
        preg_match_all('/Page\s+\d+(\s+of\s+\d+)?/i', $content, $matches);
        $markers = $matches[0];

        $pagesWithMarkers = [];
        foreach ($pages as $i => $pageContent) {
            $marker = $markers[$i] ?? 'Page ' . ($i + 1);
            $pagesWithMarkers[] = [
                'marker' => $marker,
                'content' => trim($pageContent)
            ];
        }

        return response()->json(['pages' => $pagesWithMarkers]);
    }

}
