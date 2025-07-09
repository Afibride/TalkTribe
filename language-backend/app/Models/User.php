<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'phone',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_user')->withTimestamps();
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    public function lessonProgress()
    {
        return $this->hasMany(LessonProgress::class);
    }

public function courseProgress()
{
    return $this->hasMany(CourseProgress::class);
}

   public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function completedQuizzes()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_attempts')
                   ->withPivot('score', 'completed_at')
                   ->withTimestamps();
    }
}
