<?php
// app/Helpers/SupabaseUploadHelper.php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class SupabaseUploadHelper
{
    protected $storage;
    protected $bucket;

    public function __construct($bucket = 'public')
    {
        $this->bucket = $bucket;
        $this->storage = Storage::disk('supabase');
    }

    /**
     * Upload a file to Supabase storage
     */
    public function upload(UploadedFile $file, $path, $fileName = null)
    {
        try {
            $fileName = $fileName ?: time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $fullPath = trim($path . '/' . $fileName, '/');
            
            $this->storage->put($fullPath, file_get_contents($file));
            
            return $fullPath;
        } catch (\Exception $e) {
            \Log::error('Supabase upload error: ' . $e->getMessage());
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
            return $this->storage->url($path);
        } catch (\Exception $e) {
            \Log::error('Supabase URL error: ' . $e->getMessage());
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
            return $this->storage->delete($path);
        } catch (\Exception $e) {
            \Log::error('Supabase delete error: ' . $e->getMessage());
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