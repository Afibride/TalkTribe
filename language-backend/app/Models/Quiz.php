<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['title', 'lesson_id'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}

