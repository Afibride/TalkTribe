<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Storage;
use Str;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'content', 'image', 
        'likes_count', 'comments_count', 'shares_count', 'views_count',
    ];

    protected $appends = ['image_url', 'excerpt'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(BlogPostLike::class);
    }

    public function comments()
    {
        return $this->hasMany(BlogPostComment::class)->latest();
    }

    public function categories()
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_categories');
    }

    public function isLikedBy(User $user = null)
    {
        if (!$user) return false;
        
        return $this->likes()->where('user_id', $user->id)->exists();
    }

// In BlogPost model

public function getImageUrlAttribute()
{
    if (!$this->image) {
        return null; // or return a default image URL if you prefer
    }
    
    // Check if the image is already a full URL (e.g., from external sources)
    if (filter_var($this->image, FILTER_VALIDATE_URL)) {
        return $this->image;
    }
    
    return Storage::disk('public')->url($this->image);
}

public function getExcerptAttribute()
{
    return Str::limit(strip_tags($this->content), 150);
}


}