<?php
// app/Helpers/SupabaseUploadHelper.php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SupabaseUploadHelper
{
    protected $projectRef;
    protected $accessKey;
    protected $bucket;

    public function __construct($bucket = null)
    {
        $this->projectRef = config('services.supabase.project_ref');
        $this->accessKey = config('services.supabase.access_key');
        $this->bucket = $bucket ?: config('services.supabase.bucket', 'public');
    }

    /**
     * Upload a file to Supabase storage using direct API calls
     */
    public function upload(UploadedFile $file, $path, $fileName = null)
    {
        try {
            $fileName = $fileName ?: time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $fullPath = trim($path . '/' . $fileName, '/');
            
            $url = "https://{$this->projectRef}.supabase.co/storage/v1/object/{$this->bucket}/{$fullPath}";
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessKey,
                'Content-Type' => $file->getMimeType(),
            ])->put($url, file_get_contents($file));
            
            if ($response->successful()) {
                return $fullPath;
            }
            
            Log::error('Supabase upload failed: ' . $response->body());
            return null;
            
        } catch (\Exception $e) {
            Log::error('Supabase upload error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get public URL for a file
     */
    public function getUrl($path)
    {
        if (!$path) return null;
        
        try {
            return "https://{$this->projectRef}.supabase.co/storage/v1/object/public/{$this->bucket}/{$path}";
        } catch (\Exception $e) {
            Log::error('Supabase URL error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete a file from Supabase storage
     */
    public function delete($path)
    {
        if (!$path) return false;
        
        try {
            $url = "https://{$this->projectRef}.supabase.co/storage/v1/object/{$this->bucket}/{$path}";
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessKey,
            ])->delete($url);
            
            return $response->successful();
            
        } catch (\Exception $e) {
            Log::error('Supabase delete error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Upload course image
     */
    public function uploadCourseImage(UploadedFile $file, $instructorId)
    {
        $path = "course_images/user_{$instructorId}";
        return $this->upload($file, $path);
    }

    /**
     * Upload lesson video
     */
    public function uploadLessonVideo(UploadedFile $file, $courseId, $lessonId = null)
    {
        $path = "course_videos/course_{$courseId}";
        if ($lessonId) {
            $path .= "/lesson_{$lessonId}";
        }
        return $this->upload($file, $path);
    }

    /**
     * Upload lecture note
     */
    public function uploadLectureNote(UploadedFile $file, $courseId, $lessonId = null)
    {
        $path = "lecture_notes/course_{$courseId}";
        if ($lessonId) {
            $path .= "/lesson_{$lessonId}";
        }
        return $this->upload($file, $path);
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(UploadedFile $file, $userId)
    {
        $path = "profile_pictures/user_{$userId}";
        return $this->upload($file, $path);
    }

    /**
     * Upload post image/video
     */
    public function uploadPostMedia(UploadedFile $file, $postId, $type = 'image')
    {
        $path = "post_media/post_{$postId}";
        return $this->upload($file, $path);
    }

    /**
     * Upload blog image
     */
    public function uploadBlogImage(UploadedFile $file, $userId)
    {
        $path = "blog_images/user_{$userId}";
        return $this->upload($file, $path);
    }

    /**
     * Upload blog video
     */
    public function uploadBlogVideo(UploadedFile $file, $userId)
    {
        $path = "blog_videos/user_{$userId}";
        return $this->upload($file, $path);
    }

    /**
     * Upload cover photo
     */
    public function uploadCoverPhoto(UploadedFile $file, $userId)
    {
        $path = "cover_photos/user_{$userId}";
        return $this->upload($file, $path);
    }
}