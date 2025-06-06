<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $posts = [
            ['id' => 1, 'title' => 'Learning African Languages', 'author' => 'Admin'],
            ['id' => 2, 'title' => 'Why Culture Matters in Language', 'author' => 'Contributor'],
        ];

        return response()->json($posts);
    }
}
