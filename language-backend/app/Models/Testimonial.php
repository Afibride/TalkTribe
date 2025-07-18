<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'image',
        'text',
        'rating',
        'reviews'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}