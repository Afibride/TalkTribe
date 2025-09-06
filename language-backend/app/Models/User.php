<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Storage;

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
        'image',
        'cover_photo',
        'bio',
        'location'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = ['profile_pic_url', 'cover_photo_url'];

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

public function getProfilePicUrlAttribute()
{
    if (!$this->image) {
        return null; 
    }
    
    if (filter_var($this->image, FILTER_VALIDATE_URL)) {
        return $this->image;
    }
    
    return Storage::disk('supabase')->url($this->image);
}

public function getCoverPhotoUrlAttribute()
{
    if (!$this->cover_photo) {
        return null;
    }

    if (filter_var($this->cover_photo, FILTER_VALIDATE_URL)) {
        return $this->cover_photo;
    }

    return Storage::disk('supabase')->url($this->cover_photo);
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


    public function posts()
    {
        return $this->hasMany(BlogPost::class, 'user_id');
    }

      public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }
}