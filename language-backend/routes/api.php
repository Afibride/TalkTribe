<?php


use App\Http\Controllers\BlogController;
use App\Http\Controllers\API\PasswordResetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\QuizSubmissionController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\TestimonialController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
Route::get('/home-courses', [CourseController::class, 'index']);
Route::get('/search', [SearchController::class, 'search']); // Search for courses, lessons, and users   
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

Route::get('/users/{username}', [UserController::class, 'show']);
Route::get('/users/{username}/posts', [UserController::class, 'getUserPosts']);
Route::post('/users/{username}', [UserController::class, 'update']);
});



Route::middleware('auth:sanctum')->group(function () {              // All courses for learners
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::get('/courses-by-category', [CourseController::class, 'getCourses']);          // Individual course
    Route::get('/most-clicked-courses', [CourseController::class, 'mostClickedCourses']);
    Route::get('/random-courses', [CourseController::class, 'randomCourses']);
  Route::get('/categories', [CategoryController::class, 'index']);
    
    Route::middleware('is_instructor')->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);         // Add new course
        Route::put('/courses/{id}', [CourseController::class, 'update']);    // Update course
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']); // Delete course
    });

    Route::middleware(['auth:sanctum', 'is_instructor'])->get('/instructor/courses', [CourseController::class, 'getInstructorCourses']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/lessonss', [LessonController::class, 'index']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::get('/courses/{courseId}/lessons', [LessonController::class, 'getLessonsByCourse']);
    Route::get('/lessons/{lesson}/notes-content', [LessonController::class, 'getLessonNotesContent']);
   

    Route::middleware('role:instructor')->group(function () {
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::post('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('progress')->group(function () {
        // Lesson progress
        Route::get('/lesson/{lessonId}', [LessonProgressController::class, 'getLessonProgress']);
        Route::post('/lesson', [LessonProgressController::class, 'updateLessonProgress']);
        
        // Course progress
        Route::get('/user-courses', [LessonProgressController::class, 'getUserCourseProgress']);
        Route::post('/start-course/{courseId}', [LessonProgressController::class, 'startCourse']);
        Route::get('/course/{courseId}', [LessonProgressController::class, 'getCourseProgress']);
         Route::get('/next-lesson/{courseId}', [LessonProgressController::class, 'getNextLesson'])->name('progress.next-lesson');
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Quiz routes
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{quizId}', [QuizController::class, 'show']);
    Route::get('/quizzes/lesson/{lessonId}', [QuizController::class, 'lessonQuizzes']);
    Route::post('/quizzes/generate', [QuizController::class, 'generateQuiz']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submitQuiz']);
});


Route::middleware('auth:sanctum')->group(function () {
    // Blog routes
    Route::get('/blog/posts', [BlogController::class, 'index']);
    Route::post('/blog/posts', [BlogController::class, 'store']);
    Route::post('/blog/posts/{post}/like', [BlogController::class, 'toggleLike']);
    Route::post('/blog/posts/{id}/comment', [BlogController::class, 'addComment']);
    Route::get('/blog/posts/{post}/related', [BlogController::class, 'relatedPosts']);
    Route::get('/blog/posts/popular', [BlogController::class, 'popularPosts']);
    Route::get('/blog/posts/{id}', [BlogController::class, 'show']);
Route::post('/blog/posts/{id}/view', [BlogController::class, 'trackView']);
});
Route::get('/stats', [StatsController::class, 'index']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/testimonials', [TestimonialController::class, 'store']);
});



