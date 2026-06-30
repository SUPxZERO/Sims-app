<?php

use Illuminate\Support\Facades\Route;

// Catch-all route to serve React SPA
// This allows React Router to handle all routes on the frontend
Route::get('{any}', function () {
    // Serve the React index.html from public directory
    // In production, Vite will build to public/dist/index.html
    $indexPath = public_path('dist/index.html');
    
    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }
    
    // Development fallback - point to Vite dev server
    return view('welcome');
})->where('any', '.*');

// API routes are handled by routes/api.php with /api prefix
// Web routes starting with /api will NOT match this catchall


