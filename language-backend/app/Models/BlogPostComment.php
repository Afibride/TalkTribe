<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPostComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blog_post_id',
        'content',
        'parent_id'
    ];

   public function user()
{
    return $this->belongsTo(User::class)->select(['id', 'name', 'image']);
}

public function replies()
{
    return $this->hasMany(BlogPostComment::class, 'parent_id')
        ->with('user:id,name,image');
}

    public function post()
    {
        return $this->belongsTo(BlogPost::class);
    }


    public function parent()
    {
        return $this->belongsTo(BlogPostComment::class, 'parent_id');
    }
}