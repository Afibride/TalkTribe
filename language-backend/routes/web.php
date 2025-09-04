<?php

use App\Http\Controllers\NewsletterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/newsletter/unsubscribe', [NewsletterController::class, 'showUnsubscribeForm'])->name('newsletter.unsubscribe.form');
Route::view('/newsletter/resubscribe', 'newsletter.resubscribe')->name('newsletter.resubscribe.form');
