<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'total_questions',
        'completed_at'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    // Calculate percentage score
    public function getPercentageAttribute()
    {
        return round(($this->score / $this->total_questions) * 100, 2);
    }

    // Cast dates
    protected $casts = [
        'completed_at' => 'datetime',
    ];
}