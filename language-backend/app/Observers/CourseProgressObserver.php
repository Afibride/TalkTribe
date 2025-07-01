<?php

namespace App\Observers;

use App\Models\LessonProgress;

class CourseProgressObserver
{
    /**
     * Handle the LessonProgress "created" event.
     *
     * @param  \App\Models\LessonProgress  $lessonProgress
     * @return void
     */
    public function created(LessonProgress $lessonProgress)
    {
        //
    }

    /**
     * Handle the LessonProgress "updated" event.
     *
     * @param  \App\Models\LessonProgress  $lessonProgress
     * @return void
     */
    public function updated(LessonProgress $lessonProgress)
    {
        //
    }

    /**
     * Handle the LessonProgress "deleted" event.
     *
     * @param  \App\Models\LessonProgress  $lessonProgress
     * @return void
     */
    public function deleted(LessonProgress $lessonProgress)
    {
        //
    }

    /**
     * Handle the LessonProgress "restored" event.
     *
     * @param  \App\Models\LessonProgress  $lessonProgress
     * @return void
     */
    public function restored(LessonProgress $lessonProgress)
    {
        //
    }

    /**
     * Handle the LessonProgress "force deleted" event.
     *
     * @param  \App\Models\LessonProgress  $lessonProgress
     * @return void
     */
    public function forceDeleted(LessonProgress $lessonProgress)
    {
        //
    }
}
