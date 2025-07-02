<?php

// app/Console/Commands/BackfillCourseProgress.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Http\Controllers\LessonProgressController;

class BackfillCourseProgress extends Command
{
    protected $signature = 'backfill:course-progress';
    protected $description = 'Backfill course progress for all users';

    public function handle()
    {
        $users = User::all();
        
        foreach ($users as $user) {
            app(LessonProgressController::class)->initializeAllCourseProgress($user->id);
            $this->info("Processed user {$user->id}");
        }
        
        $this->info('All course progress records updated!');
        return 0;
    }
}

