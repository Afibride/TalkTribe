<?php

namespace App\Models;

use App\Helpers\SupabaseUploadHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'video_url',
        'notes_file',
        'course_id',
        'created_by',
        'thumbnail',
        'order',
        'quiz_id', 
    ];

    protected $appends = ['video_url_full', 'notes_file_url_full', 'thumbnail_url'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    public function lessonProgress()
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function getVideoUrlFullAttribute()
    {
        if (!$this->video_url) {
            return null;
        }

        if (filter_var($this->video_url, FILTER_VALIDATE_URL)) {
            return $this->video_url;
        }

        $uploadHelper = new SupabaseUploadHelper();
        return $uploadHelper->getUrl($this->video_url);
    }

    public function getNotesFileUrlFullAttribute()
    {
        if (!$this->notes_file) {
            return null;
        }

        if (filter_var($this->notes_file, FILTER_VALIDATE_URL)) {
            return $this->notes_file;
        }

        $uploadHelper = new SupabaseUploadHelper();
        return $uploadHelper->getUrl($this->notes_file);
    }

    public function getThumbnailUrlAttribute()
    {
        if (!$this->thumbnail) {
            return null;
        }

        if (filter_var($this->thumbnail, FILTER_VALIDATE_URL)) {
            return $this->thumbnail;
        }

        $uploadHelper = new SupabaseUploadHelper();
        return $uploadHelper->getUrl($this->thumbnail);
    }


    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function generatedQuiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    protected static function booted()
    {
        static::created(function ($lesson) {
            dispatch(function () use ($lesson) {
                try {
                    $quiz = app(\App\Http\Controllers\QuizController::class)->generateQuizFromNotes($lesson->id);

                    if ($quiz) {
                        $lesson->update(['quiz_id' => $quiz->id]);
                    }

                } catch (\Exception $e) {
                    Log::error("Auto quiz generation failed: " . $e->getMessage());
                }
            })->delay(now()->addSeconds(10));
        });

        static::updated(function ($lesson) {
            if ($lesson->isDirty('notes_file')) {
                dispatch(function () use ($lesson) {
                    try {
                        $lesson->quizzes()->delete();
                        $quiz = app(\App\Http\Controllers\QuizController::class)->generateQuizFromNotes($lesson->id);
                        if ($quiz) {
                            $lesson->update(['quiz_id' => $quiz->id]);
                        }
                    } catch (\Exception $e) {
                        Log::error("Auto quiz regeneration failed: " . $e->getMessage());
                    }
                })->delay(now()->addSeconds(10));
            }
        });
    }
}
