<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Validator;

class UserController extends Controller
{
    public function show($username)
    {
        $user = User::withCount(['posts'])
            ->with(['posts' => function($query) {
                $query->latest()
                    ->withCount(['likes', 'comments'])
                    ->with(['likes' => function($q) {
                        $q->where('user_id', Auth::id());
                    }, 'comments' => function($q) {
                        $q->whereNull('parent_id')
                           ->with(['user:id,name,image', 'replies.user:id,name,image'])
                           ->latest();
                    }])
                    ->limit(5);
            }])
            ->where('username', $username)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'user' => $user,
            'posts' => $user->posts,
        ]);
    }

    public function update(Request $request, $username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'bio', 'location']);

            if ($request->hasFile('profile_pic')) {
                if ($user->image && !filter_var($user->image, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($user->image);
                }
                $path = $request->file('profile_pic')->store('profile_pics', 'public');
                $data['image'] = $path;
            }

            if ($request->hasFile('cover_photo')) {
                if ($user->cover_photo && !filter_var($user->cover_photo, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($user->cover_photo);
                }
                $path = $request->file('cover_photo')->store('cover_photos', 'public');
                $data['cover_photo'] = $path;
            }

            $user->update($data);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserPosts($username)
    {
        $user = User::where('username', $username)->firstOrFail();

        $posts = BlogPost::where('user_id', $user->id)
            ->withCount(['likes', 'comments'])
            ->with(['likes' => function($query) {
                $query->where('user_id', Auth::id());
            }])
            ->with(['comments' => function($query) {
                $query->whereNull('parent_id')
                      ->with(['user:id,name,image', 'replies.user:id,name,image'])
                      ->latest();
            }])
            ->latest()
            ->get();

        return response()->json($posts);
    }
}
