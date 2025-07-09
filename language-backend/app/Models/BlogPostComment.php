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
        'content'
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id', 'name', 'avatar']);
    }

    public function post()
    {
        return $this->belongsTo(BlogPost::class);
    }
}