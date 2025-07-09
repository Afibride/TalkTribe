<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\BlogPost;

class SearchController extends Controller
{
public function search(Request $request)
{
    $query = $request->input('q', '');

    if (empty(trim($query))) {
        return response()->json(['message' => 'Search query is required'], 400);
    }

    $searchQuery = "%{$query}%";

    $results = [
        'users' => User::query()
            ->where('name', 'LIKE', $searchQuery)
            ->orWhere('username', 'LIKE', $searchQuery)
            ->limit(10)
            ->get(),
            
        'courses' => Course::query()
            ->where('title', 'LIKE', $searchQuery)
            ->orWhere('description', 'LIKE', $searchQuery)
            ->limit(10)
            ->get()
            ->each->append('total_lessons'),
            
        'lessons' => Lesson::with('course:id,title')
            ->where('title', 'LIKE', $searchQuery)
            ->orWhere('description', 'LIKE', $searchQuery)
            ->limit(10)
            ->get()
            ->map(fn ($lesson) => tap($lesson, function ($l) {
                $l->course_title = $l->course->title ?? null;
            })),
            
        'blog_posts' => BlogPost::with(['user:id,name,username', 'categories:id,name'])
            ->where(function ($q) use ($searchQuery) {
                $q->where('title', 'LIKE', $searchQuery)
                  ->orWhere('content', 'LIKE', $searchQuery);
            })
            ->orderByRaw("CASE WHEN title LIKE ? THEN 1 ELSE 2 END", [$searchQuery])
            ->limit(10)
            ->get()
            ->each->append(['image_url', 'excerpt'])
    ];

    return response()->json($results);
}
}