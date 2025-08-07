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
        'user_id',
        'title',
        'content',
        'image',
        'video',
        'likes_count',
        'comments_count',
        'shares_count',
        'views_count',
    ];

    protected $appends = ['image_url', 'video_url', 'excerpt'];

    public function likes()
    {
        return $this->hasMany(BlogPostLike::class);
    }

    public function comments()
    {
        return $this->hasMany(BlogPostComment::class)
            ->whereNull('parent_id')
            ->with(['user:id,name,image', 'replies.user:id,name,image'])
            ->latest();
    }

    public function replies()
    {
        return $this->hasMany(BlogPostComment::class, 'parent_id')
            ->with('user');
    }

    public function user()
    {
        return $this->belongsTo(User::class)->select(['id', 'name', 'image']);
    }

    public function categories()
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_categories');
    }

    public function isLikedBy(User $user = null)
    {
        if (!$user)
            return false;

        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        return Storage::disk('public')->url($this->image);
    }

    public function getVideoUrlAttribute()
    {
        if (!$this->video) {
            return null;
        }

        if (filter_var($this->video, FILTER_VALIDATE_URL)) {
            return $this->video;
        }

        return Storage::disk('public')->url($this->video);
    }

    public function getExcerptAttribute()
    {
        return Str::limit(strip_tags($this->content), 150);
    }

    public function getMediaTypeAttribute()
    {
        if ($this->image) return 'image';
        if ($this->video) return 'video';
        return null;
    }
}