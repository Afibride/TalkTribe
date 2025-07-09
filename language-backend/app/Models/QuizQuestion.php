<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question',
        'options',
        'correct_answer',
        'explanation',
        'order'
    ];

    // Relationship with Quiz
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    // Relationship with Answers
    public function answers()
    {
        return $this->hasMany(QuizAnswer::class);
    }

    // Cast JSON fields
    protected $casts = [
        'options' => 'array',
    ];
}