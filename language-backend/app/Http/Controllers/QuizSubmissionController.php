<?php

namespace App\Http\Controllers;

use App\Models\QuizSubmission;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Quiz;


class QuizSubmissionController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'answers' => 'required|array',
        ]);

        $questions = Question::where('quiz_id', $request->quiz_id)->get();
        $score = 0;

        foreach ($questions as $question) {
            if (
                isset($request->answers[$question->id]) &&
                $request->answers[$question->id] == $question->correct_answer
            ) {
                $score++;
            }
        }

        $submission = QuizSubmission::create([
            'user_id' => auth()->id(),
            'quiz_id' => $request->quiz_id,
            'answers' => $request->answers,
            'score' => $score,
        ]);

        return response()->json(['message' => 'Quiz submitted', 'score' => $score, 'data' => $submission]);
    }
}
