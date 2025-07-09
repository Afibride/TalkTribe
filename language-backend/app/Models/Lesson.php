<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->video_url ? url('storage/' . $this->video_url) : null;
    }

    public function getNotesFileUrlFullAttribute()
    {
        return $this->notes_file ? url('storage/' . $this->notes_file) : null;
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? url('storage/' . $this->thumbnail) : null;
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
                    \Log::error("Auto quiz generation failed: " . $e->getMessage());
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
                        \Log::error("Auto quiz regeneration failed: " . $e->getMessage());
                    }
                })->delay(now()->addSeconds(10));
            }
        });
    }
}
