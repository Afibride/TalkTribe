<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'attempt_id',
        'question_id',
        'selected_answer',
        'is_correct'
    ];

    // Relationship with Attempt
    public function attempt()
    {
        return $this->belongsTo(QuizAttempt::class);
    }

    // Relationship with Question
    public function question()
    {
        return $this->belongsTo(QuizQuestion::class);
    }
}