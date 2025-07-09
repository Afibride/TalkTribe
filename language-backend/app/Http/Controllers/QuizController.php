<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    protected $guzzleClient;

     public function __construct()
    {
        $this->guzzleClient = new Client([
            'base_uri' => 'https://openrouter.ai/api/v1/',
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                'HTTP-Referer' => env('APP_URL', 'http://localhost'),
                'X-Title' => env('APP_NAME', 'talktribe'),
                'Content-Type' => 'application/json',
            ],
            'timeout' => 30,
        ]);
    }

    /**
     * GET /api/quizzes - Only shows quizzes for authenticated user
     */
    public function index()
    {
        $quizzes = Quiz::with(['lesson', 'questions'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $quizzes->each(function ($quiz) {
            $quiz->questions->each(function ($q) {
                $q->options = json_decode($q->options);
            });
        });

        return response()->json($quizzes);
    }

    /**
     * GET /api/quiz/{id} - Only shows quiz if owned by user
     */
    public function show($id)
    {
        $quiz = Quiz::with('questions')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        $quiz->questions->each(function ($q) {
            $q->options = json_decode($q->options);
        });

        return response()->json($quiz);
    }

    /**
     * POST /api/quiz/generate - Creates quiz for current user
     */
    public function generateQuiz(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id'
        ]);

        $quiz = $this->generateQuizFromNotes($request->lesson_id);
        
        if (!$quiz) {
            return response()->json([
                'error' => 'Failed to generate quiz. Please try again later.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quiz generated successfully',
            'quiz_id' => $quiz->id,
            'should_refresh' => true
        ]);
    }

    /**
     * GET /api/quizzes/lesson/{lesson} - Only user's quizzes for lesson
     */
    public function lessonQuizzes(Lesson $lesson)
    {
        $quizzes = $lesson->quizzes()
            ->where('user_id', Auth::id())
            ->with('questions')
            ->get();

        $quizzes->each(function ($quiz) {
            $quiz->questions->each(function ($q) {
                $q->options = json_decode($q->options);
            });
        });

        return response()->json($quizzes);
    }

    /**
     * POST /api/quiz/{quiz}/submit - Only allow submission for user's quizzes
     */
    public function submitQuiz(Request $request, Quiz $quiz)
    {
        // Verify quiz ownership
        if ($quiz->user_id !== Auth::id()) {
            return response()->json([
                'error' => 'Unauthorized access to quiz'
            ], 403);
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:quiz_questions,id',
            'answers.*.selected_option' => 'required|integer',
        ]);

        $score = 0;
        $total = $quiz->questions()->count();

        foreach ($request->answers as $ans) {
            $question = QuizQuestion::find($ans['question_id']);
            if ($question->correct_answer == $ans['selected_option']) {
                $score++;
            }
        }

        return response()->json([
            'score' => $score,
            'total' => $total,
            'percentage' => round(($score / $total) * 100, 2),
        ]);
    }

    /**
     * Generate quiz and associate with current user
     */
    public function generateQuizFromNotes($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        try {
            $pages = $this->getContentForQuizGeneration($lesson);
            shuffle($pages);
            $selectedPages = array_slice($pages, 0, min(3, count($pages)));
            $content = implode("\n\n", array_map(fn ($p) => $p['content'], $selectedPages));

            if (empty($content)) {
                throw new \Exception('No content for quiz generation');
            }

            $quizData = $this->generateQuizWithAI($lesson->title, $content);
            
            if (!$quizData) {
                $quizData = $this->generateSimpleQuiz($lesson->title, $content);
            }

            $quiz = Quiz::create([
                'lesson_id' => $lesson->id,
                'user_id' => Auth::id(), // Associate with current user
                'title' => $quizData['title'] ?? "Quiz: " . $lesson->title,
                'description' => "Auto-generated quiz for " . $lesson->title,
                'duration' => 15,
                'is_published' => true,
            ]);

            foreach ($quizData['questions'] as $q) {
                QuizQuestion::create([
                    'quiz_id' => $quiz->id,
                    'question' => $q['question'],
                    'options' => json_encode($q['options']),
                    'correct_answer' => $q['correct_answer'],
                    'explanation' => $q['explanation'] ?? null,
                ]);
            }

            $lesson->quiz_id = $quiz->id;
            $lesson->save();

            return $quiz;

        } catch (\Exception $e) {
            Log::error("Quiz generation failed for Lesson {$lessonId}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Use OpenRouter AI to generate quiz with better answer options
     */
    protected function generateQuizWithAI($lessonTitle, $content)
    {
        $prompt = <<<PROMPT
Generate a high-quality multiple-choice quiz about the Lamnso language based on the provided notes.
Create 5 questions with these requirements:

1. Each question should test specific knowledge from the content
2. Provide 4 answer options per question:
   - One completely correct answer
   - Two plausible but incorrect answers related to the content
   - One clearly wrong answer
3. Format options as complete sentences/phrases
4. Mark correct answer index (0-3)
5. Include brief explanation of why the answer is correct

Return ONLY valid JSON in this exact format:
{
    "title": "Descriptive Quiz Title",
    "questions": [
        {
            "question": "Clear, specific question",
            "options": [
                "Complete correct answer sentence",
                "Plausible but incorrect answer",
                "Related but wrong answer",
                "Clearly incorrect option"
            ],
            "correct_answer": 0,
            "explanation": "Brief explanation of correct answer"
        }
    ]
}

Lesson Title: $lessonTitle
Content: $content
PROMPT;

        try {
            $response = $this->guzzleClient->post('chat/completions', [
                'json' => [
                    'model' => 'mistralai/mistral-7b-instruct',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a linguistics expert creating detailed language quizzes.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 2500
                ]
            ]);

            $result = json_decode($response->getBody(), true);
            $content = $result['choices'][0]['message']['content'] ?? '';

            // Extract JSON from response
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');
            $jsonString = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);

            $quiz = json_decode($jsonString, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON from AI: ' . json_last_error_msg());
            }

            // Validate the quiz structure
            if (!$this->validateQuizStructure($quiz)) {
                throw new \Exception('Invalid quiz structure from AI');
            }

            return $quiz;

        } catch (\Exception $e) {
            Log::error("AI quiz generation failed: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate quiz structure from AI
     */
    protected function validateQuizStructure($quiz)
    {
        if (!isset($quiz['questions']) || !is_array($quiz['questions'])) {
            return false;
        }

        foreach ($quiz['questions'] as $question) {
            if (!isset($question['question']) || 
                !isset($question['options']) || 
                !is_array($question['options']) ||
                count($question['options']) !== 4 ||
                !isset($question['correct_answer']) ||
                !isset($question['explanation'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Improved fallback quiz generator with meaningful options
     */
    protected function generateSimpleQuiz($lessonTitle, $content)
    {
        // Extract key concepts for questions
        $phrases = $this->extractKeyPhrases($content);
        $questions = [];
        
        foreach (array_slice($phrases, 0, 5) as $phrase) {
            $options = $this->generateQualityOptions($phrase, $phrases);
            
            $questions[] = [
                'question' => "What does '" . trim($phrase) . "' mean in Lamnso?",
                'options' => $options,
                'correct_answer' => 0,
                'explanation' => "This is the correct meaning of the phrase in Lamnso."
            ];
        }

        return [
            'title' => "Lamnso Knowledge Check: " . $lessonTitle,
            'questions' => $questions
        ];
    }

    /**
     * Extract key phrases from content
     */
    protected function extractKeyPhrases($content)
    {
        // Split by sentences and filter
        $sentences = array_filter(array_map('trim', preg_split('/[.!?]+/', $content)));
        
        // Filter for meaningful phrases (3+ words)
        return array_filter($sentences, fn($s) => count(explode(' ', $s)) > 2);
    }

    /**
     * Generate high-quality multiple choice options
     */
    protected function generateQualityOptions($correctPhrase, $allPhrases)
    {
        $options = [];
        
        // 1. Correct answer (simplified)
        $options[] = "It means '" . $this->simplifyPhrase($correctPhrase) . "'";
        
        // 2. Plausible alternative from other phrases
        $otherPhrases = array_diff($allPhrases, [$correctPhrase]);
        if (count($otherPhrases) > 0) {
            $similar = $otherPhrases[array_rand($otherPhrases)];
            $options[] = "It means '" . $this->simplifyPhrase($similar) . "'";
        } else {
            $options[] = "It refers to a cultural concept";
        }
        
        // 3. Partially correct but wrong
        $options[] = "It's similar to '" . $this->simplifyPhrase($correctPhrase, true) . "' but not exact";
        
        // 4. Clearly wrong
        $options[] = "This phrase doesn't have a specific meaning";
        
        // Shuffle but keep correct answer first
        $correct = $options[0];
        shuffle($options);
        array_unshift($options, $correct); // Ensure correct is first
        $options = array_slice(array_unique($options), 0, 4); // Ensure 4 unique options
        
        return $options;
    }

    /**
     * Simplify phrase for answer options
     */
    protected function simplifyPhrase($phrase, $partial = false)
    {
        $words = explode(' ', $phrase);
        if ($partial && count($words) > 3) {
            return implode(' ', array_slice($words, 0, 3)) . '...';
        }
        return implode(' ', array_slice($words, 0, min(5, count($words))));
    }

    /**
     * Extract lesson content for quiz generation
     */
    protected function getContentForQuizGeneration(Lesson $lesson)
    {
        try {
            if ($lesson->notes_file) {
                $response = app()->call(
                    'App\Http\Controllers\LessonController@getLessonNotesContent',
                    ['lessonId' => $lesson->id]
                );
                $data = json_decode($response->getContent(), true);

                if (isset($data['pages'])) return $data['pages'];
            }

            if (!empty($lesson->description)) {
                return [['marker' => 'Description', 'content' => $lesson->description]];
            }

            return [['marker' => 'Title', 'content' => $lesson->title]];

        } catch (\Exception $e) {
            Log::warning("Failed to get lesson notes for quiz: " . $e->getMessage());
            return [['marker' => 'Fallback', 'content' => $lesson->description ?: $lesson->title]];
        }
    }

    // ... [Keep all other existing methods unchanged]

}