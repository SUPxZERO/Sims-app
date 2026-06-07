<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\InternshipController;
use App\Http\Controllers\WeeklyReportController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    Route::middleware('auth.jwt')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Protected Business Logic Routes
Route::middleware('auth.jwt')->group(function () {
    
    // CV Builder Routes
    Route::prefix('cv')->group(function () {
        Route::get('/', [CvController::class, 'show']);
        Route::post('/personal-summary', [CvController::class, 'updatePersonalSummary']);
        Route::post('/visibility', [CvController::class, 'updateVisibility']);
        
        Route::post('/educations', [CvController::class, 'addEducation']);
        Route::put('/educations/{id}', [CvController::class, 'updateEducation']);
        Route::delete('/educations/{id}', [CvController::class, 'deleteEducation']);
        
        Route::post('/experiences', [CvController::class, 'addExperience']);
        Route::put('/experiences/{id}', [CvController::class, 'updateExperience']);
        Route::delete('/experiences/{id}', [CvController::class, 'deleteExperience']);
        
        Route::post('/skills', [CvController::class, 'syncSkills']);
        
        Route::post('/documents', [CvController::class, 'addDocument']);
        Route::delete('/documents/{id}', [CvController::class, 'deleteDocument']);
    });

    // Recommendation Engine Routes
    Route::prefix('recommendations')->group(function () {
        Route::get('/my', [RecommendationController::class, 'myRecommendations']);
        Route::post('/my/recalculate', [RecommendationController::class, 'recalculateMyRecommendations']);
        
        Route::get('/listings/{listingId}', [RecommendationController::class, 'listingRecommendations']);
        Route::post('/listings/{listingId}/recalculate', [RecommendationController::class, 'recalculateListingRecommendations']);
        
        Route::post('/recalculate-all', [RecommendationController::class, 'recalculateAll']);
    });

    // Internship Listings Routes
    Route::prefix('listings')->group(function () {
        Route::get('/', [ListingController::class, 'index']);
        Route::post('/', [ListingController::class, 'store']);
        Route::put('/{id}', [ListingController::class, 'update']);
        Route::patch('/{id}/review', [ListingController::class, 'review']);
        
        // Applications mapping (from listing context)
        Route::post('/{listingId}/apply', [ApplicationController::class, 'apply']);
        Route::get('/{listingId}/applications', [ApplicationController::class, 'getForListing']);
    });

    // Applications Routes
    Route::prefix('applications')->group(function () {
        Route::patch('/{id}/status', [ApplicationController::class, 'updateStatus']);
        Route::get('/student', [ApplicationController::class, 'getForStudent']);
        Route::get('/listing/{listingId}', [ApplicationController::class, 'getForListing']);
    });

    // Internships
    Route::prefix('internships')->group(function () {
        Route::get('/', [InternshipController::class, 'index']);
        Route::get('/{id}', [InternshipController::class, 'show']);
        
        // Weekly Reports mapping (from internship context)
        Route::get('/{id}/reports', [WeeklyReportController::class, 'index']);

        // Evaluations & Grading
        Route::post('/{id}/evaluations/company', [\App\Http\Controllers\EvaluationController::class, 'submitCompanyEvaluation']);
        Route::post('/{id}/evaluations/lecturer', [\App\Http\Controllers\EvaluationController::class, 'submitLecturerGrade']);
        Route::get('/{id}/grade', [\App\Http\Controllers\EvaluationController::class, 'getGrade']);
    });

    // Weekly Reports Routes
    Route::prefix('reports')->group(function () {
        Route::get('/my', [WeeklyReportController::class, 'myReports']);
        Route::get('/lecturer', [WeeklyReportController::class, 'lecturerReports']);
        Route::get('/{id}', [WeeklyReportController::class, 'show']);
        Route::put('/{id}', [WeeklyReportController::class, 'save']);
        Route::post('/{id}/attachments', [WeeklyReportController::class, 'addAttachment']);
        Route::post('/{id}/review', [WeeklyReportController::class, 'review']);
    });

    // Analytics Dashboard
    Route::get('dashboard', [AnalyticsController::class, 'getDashboard']);

    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::patch('/{id}/status', [UserController::class, 'updateStatus']);
    });
});
