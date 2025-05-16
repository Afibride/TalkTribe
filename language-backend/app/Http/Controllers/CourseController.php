<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        // Sample data for courses
        $courses = [
            ['id' => 1, 'title' => 'Yoruba Basics', 'level' => 'Beginner'],
            ['id' => 2, 'title' => 'Igbo Grammar', 'level' => 'Intermediate'],
        ];

        return response()->json($courses);
    }

    public function show($id)
    {
        return response()->json([
            'id' => $id,
            'title' => 'Sample Course',
            'description' => 'Details about the selected course.',
        ]);
    }
}
