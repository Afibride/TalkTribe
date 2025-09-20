<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'image',
        'tag',
        'author',
        'published_at',
        'is_published',
        'views'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean' // This ensures proper casting
    ];

    protected $appends = ['image_url'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug)) {
                $news->slug = Str::slug($news->title);
            }
            
            // Ensure is_published is boolean
            if (!is_bool($news->is_published)) {
                $news->is_published = (bool) $news->is_published;
            }
        });

        static::updating(function ($news) {
            // Ensure is_published is boolean during updates too
            if ($news->isDirty('is_published') && !is_bool($news->is_published)) {
                $news->is_published = (bool) $news->is_published;
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->where('published_at', '<=', now());
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    public function incrementViews()
    {
        $this->views++;
        $this->save();
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return asset('images/culture1.jpg');
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        if (Storage::disk('public')->exists($this->image)) {
            return Storage::url($this->image);
        }

        return $this->image;
    }
}