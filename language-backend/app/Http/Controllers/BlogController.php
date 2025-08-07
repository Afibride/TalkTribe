<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogPostLike;
use App\Models\BlogPostComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Schema;

class BlogController extends Controller
{

    public function index()
    {
        $posts = BlogPost::with([
            'user:id,name,username,image',
            'categories',
            'comments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with(['user:id,name,username,image', 'replies.user:id,name,username,image']) // Add username here
                    ->latest();
            }
        ])
            ->withCount([
                'likes as liked' => function ($query) {
                    $query->where('user_id', Auth::id());
                }
            ])
            ->latest()
            ->paginate(10);

        return response()->json($posts);
    }

    // Similarly update the show() method:
    public function show($id)
    {
        try {
            $userId = Auth::id() ?? 0;

            $post = BlogPost::with([
                'user:id,name,username,image',
                'categories',
                'comments' => function ($query) {
                    $query->whereNull('parent_id')
                        ->with([
                            'user:id,name,username,image',
                            'replies.user:id,name,username,image'
                        ])
                        ->latest();
                }
            ])
                ->withCount([
                    'likes as liked' => function ($query) use ($userId) {
                        $query->where('user_id', $userId);
                    }
                ])
                ->findOrFail($id);

            // Avoid checking schema every time
            static $hasViewsColumn = null;
            if ($hasViewsColumn === null) {
                $hasViewsColumn = Schema::hasColumn('blog_posts', 'views_count');
            }
            if ($hasViewsColumn) {
                $post->increment('views_count');
            }

            return response()->json($post);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch blog post: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch post',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function trackView($id)
    {
        try {
            $post = BlogPost::findOrFail($id);

            if (Schema::hasColumn('blog_posts', 'views_count')) {
                $post->increment('views_count');
                return response()->json(['success' => true]);
            }

            return response()->json(['success' => false, 'message' => 'Tracking not available']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    // Create a new blog post
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'video' => 'nullable|mimetypes:video/mp4,video/quicktime,video/webm|max:10240', // 10MB max
            'categories' => 'nullable|array',
            'categories.*' => 'exists:blog_categories,id',
        ]);

        $imagePath = null;
        $videoPath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blog_images', 'public');
        }

        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('blog_videos', 'public');
        }

        $post = BlogPost::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'image' => $imagePath,
            'video' => $videoPath,
        ]);

        if ($request->categories) {
            $post->categories()->sync($request->categories);
        }

        // Load relationships and append media URLs
        $post->load('user', 'categories');
        $post->append(['image_url', 'video_url']);

        return response()->json([
            'message' => 'Blog post created successfully',
            'post' => $post
        ], 201);
    }

    // Toggle like on a post
    public function toggleLike($postId)
    {
        $post = BlogPost::findOrFail($postId);
        $like = BlogPostLike::where('user_id', Auth::id())
            ->where('blog_post_id', $postId)
            ->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            return response()->json(['liked' => false, 'likes_count' => $post->fresh()->likes_count]);
        } else {
            BlogPostLike::create([
                'user_id' => Auth::id(),
                'blog_post_id' => $postId,
            ]);
            $post->increment('likes_count');
            return response()->json(['liked' => true, 'likes_count' => $post->fresh()->likes_count]);
        }
    }

    // Add a comment to a post
    public function addComment(Request $request, $postId)
    {
        try {
            $request->validate([
                'content' => 'required|string|max:1000',
                'parent_id' => 'nullable|exists:blog_post_comments,id'
            ]);

            $post = BlogPost::findOrFail($postId);

            $commentData = [
                'user_id' => Auth::id(),
                'content' => $request->input('content'),
            ];

            if ($request->has('parent_id')) {
                $commentData['parent_id'] = $request->parent_id;
            }

            $comment = $post->comments()->create($commentData);

            // Only increment comments_count for top-level comments
            if (!$request->has('parent_id')) {
                $post->increment('comments_count');
            }

            // Load the user and replies relationships
            $comment->load([
                'user' => function ($query) {
                    $query->select('id', 'name', 'image');
                },
                'replies'
            ]);

            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error adding comment: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to add comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get related posts (by category)
    public function relatedPosts($postId)
    {
        $post = BlogPost::findOrFail($postId);

        $related = BlogPost::whereHas('categories', function ($query) use ($post) {
            $query->whereIn('id', $post->categories->pluck('id'));
        })
            ->where('id', '!=', $post->id)
            ->with('user')
            ->limit(4)
            ->get();

        return response()->json($related);
    }


    public function popularPosts(Request $request)
    {
        $limit = $request->query('limit', 4); // Default to 4 posts if limit not specified

        $posts = BlogPost::with(['user', 'categories'])
            ->orderBy('likes_count', 'desc')
            ->orderBy('comments_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->each->append('image_url');

        return response()->json($posts);
    }
}