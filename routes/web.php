<?php

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BlogController::class, 'home'])->name('home');
Route::get('/series/{series}', [BlogController::class, 'series'])->name('series');
Route::get('/series/{series}/{chapter}', [BlogController::class, 'chapter'])->name('chapter');
