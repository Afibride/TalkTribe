<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $search = $request->get('search');
        $tag = $request->get('tag');

        $query = News::published()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($tag) {
            $query->where('tag', $tag);
        }

        $news = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $news
        ]);
    }

    public function show($slug)
    {
        $news = News::published()->where('slug', $slug)->firstOrFail();

        // Increment views
        $news->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $news
        ]);
    }

    public function featured()
    {
        $featuredNews = News::published()
            ->latest()
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $featuredNews
        ]);
    }

    public function tags()
    {
        $tags = News::published()
            ->select('tag')
            ->distinct()
            ->pluck('tag');

        return response()->json([
            'success' => true,
            'data' => $tags
        ]);
    }
}