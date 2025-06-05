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
        'video_url' ,
        'notes_file',
        'course_id' ,
        'created_by',
        'thumbnail',
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
        if ($this->video_url) {
            return url('storage/' . $this->video_url);
        }
        return null;
    }

    public function getNotesFileUrlFullAttribute()
    {
        if ($this->notes_file) {
            return url('storage/' . $this->notes_file);
        }
        return null;
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? url('storage/' . $this->thumbnail) : null;
    }
}
