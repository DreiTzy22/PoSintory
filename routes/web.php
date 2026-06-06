<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// React Router SPA fallback (keeps API routes intact)
Route::view('/{any}', 'welcome')->where('any', '.*');
