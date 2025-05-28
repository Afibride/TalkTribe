<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Course extends Model
{
   // App\Models\Course.php
protected $fillable = [
    'title',
    'description',
    'category_id',
    'instructor_id',
    'image',
    'duration',
    'level',
    'clicks',
];


    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function category()
{
    return $this->belongsTo(Category::class);
}

public function lessons()
{
    return $this->hasMany(Lesson::class);
}

public function notes()
{
    return $this->hasMany(Note::class);
}

public function quizzes()
{
    return $this->hasMany(Quiz::class);
}

    public function users()
    {
        return $this->belongsToMany(User::class, 'course_user')->withTimestamps();
    }

}
