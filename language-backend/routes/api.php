<?php


use App\Http\Controllers\API\PasswordResetController;
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


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});



Route::middleware('auth:sanctum')->group(function () {              // All courses for learners
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::get('/courses-by-category', [CourseController::class, 'getCourses']);          // Individual course
    Route::get('/most-clicked-courses', [CourseController::class, 'mostClickedCourses']);
    Route::get('/random-courses', [CourseController::class, 'randomCourses']);
    Route::get('/courses?limit=12', [CourseController::class, 'index']);

    
    Route::middleware('is_instructor')->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);         // Add new course
        Route::put('/courses/{id}', [CourseController::class, 'update']);    // Update course
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']); // Delete course
    });
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/lessonss', [LessonController::class, 'index']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::get('/courses/{courseId}/lessons', [LessonController::class, 'getLessonsByCourse']);

    
    Route::middleware('role:instructor')->group(function () {
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::post('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/quiz/submit', [QuizSubmissionController::class, 'submit']);
    Route::get('/lesson-progress/{lesson}', [LessonProgressController::class, 'show']);
    Route::post('/lesson-progress', [LessonProgressController::class, 'update']);
        
    
    Route::prefix('progress')->group(function () {
        Route::get('/user-courses', [LessonProgressController::class, 'userCourseProgress']);
        Route::post('/start-course/{courseId}', [LessonProgressController::class, 'startCourse']);
        Route::post('/update-lesson', [LessonProgressController::class, 'update']);
        Route::get('/course/{courseId}', [LessonProgressController::class, 'getCourseProgress']);
    });
});

Route::get('/stats', [StatsController::class, 'index']);

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);




