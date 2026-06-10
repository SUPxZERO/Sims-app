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
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SystemConfigController;
use App\Http\Controllers\GradingScaleController;
use App\Http\Controllers\EvaluationCriteriaController;
use App\Http\Controllers\MatchingWeightConfigController;
use App\Http\Controllers\SkillCategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\StudentPreferenceController;
use App\Http\Controllers\SavedListingController;
use App\Http\Controllers\InterviewController;
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
    
    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
    });
    
    // CV Builder Routes
    Route::prefix('cv')->group(function () {
        Route::get('/', [CvController::class, 'show']);
        Route::get('/talent-pool', [CvController::class, 'talentPool']);
        Route::get('/student/{id}', [CvController::class, 'getStudentCv']);
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
        Route::get('/documents/{id}/download', [CvController::class, 'downloadDocument']);
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
        Route::get('/{id}/history', [ApplicationController::class, 'getHistory']);
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

    // Evaluations
    Route::prefix('evaluations')->group(function () {
        Route::get('/criteria', [\App\Http\Controllers\EvaluationController::class, 'getCriteria']);
    });

    // Weekly Reports Routes
    Route::prefix('reports')->group(function () {
        Route::get('/my', [WeeklyReportController::class, 'myReports']);
        Route::get('/lecturer', [WeeklyReportController::class, 'lecturerReports']);
        Route::get('/{id}', [WeeklyReportController::class, 'show']);
        Route::put('/{id}', [WeeklyReportController::class, 'save']);
        Route::post('/{id}/attachments', [WeeklyReportController::class, 'addAttachment']);
        Route::get('/attachments/{id}/download', [WeeklyReportController::class, 'downloadAttachment']);
        Route::delete('/attachments/{id}', [WeeklyReportController::class, 'deleteAttachment']);
        Route::post('/{id}/review', [WeeklyReportController::class, 'review']);
    });

    // Analytics Dashboard
    Route::get('dashboard', [AnalyticsController::class, 'getDashboard']);

    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // Skills
    Route::get('/skills', [SkillController::class, 'index']);

    // Student Preferences & Saved Listings
    Route::prefix('student/preferences')->group(function () {
        Route::get('/', [StudentPreferenceController::class, 'show']);
        Route::put('/', [StudentPreferenceController::class, 'update']);
    });
    
    Route::prefix('student/saved-listings')->group(function () {
        Route::get('/', [SavedListingController::class, 'index']);
    });
    Route::post('/listings/{id}/save', [SavedListingController::class, 'store']);
    Route::delete('/listings/{id}/unsave', [SavedListingController::class, 'destroy']);

    // Interviews
    Route::get('/student/interviews', [InterviewController::class, 'studentInterviews']);
    Route::post('/applications/{applicationId}/interviews', [InterviewController::class, 'store']);
    Route::put('/interviews/{id}', [InterviewController::class, 'update']);

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::patch('/{id}/status', [UserController::class, 'updateStatus']);
    });

    // Admin Settings / Configs
    Route::prefix('admin/system-configs')->group(function () {
        Route::get('/', [SystemConfigController::class, 'index']);
        Route::put('/{id}', [SystemConfigController::class, 'update']);
    });

    Route::prefix('admin/grading-scales')->group(function () {
        Route::get('/', [GradingScaleController::class, 'index']);
        Route::post('/', [GradingScaleController::class, 'store']);
        Route::put('/{id}', [GradingScaleController::class, 'update']);
        Route::delete('/{id}', [GradingScaleController::class, 'destroy']);
    });

    Route::prefix('admin/evaluation-criteria')->group(function () {
        Route::get('/', [EvaluationCriteriaController::class, 'index']);
        Route::post('/', [EvaluationCriteriaController::class, 'store']);
        Route::put('/{id}', [EvaluationCriteriaController::class, 'update']);
        Route::delete('/{id}', [EvaluationCriteriaController::class, 'destroy']);
    });

    Route::prefix('admin/matching-config')->group(function () {
        Route::get('/', [MatchingWeightConfigController::class, 'show']);
        Route::put('/', [MatchingWeightConfigController::class, 'update']);
    });

    Route::prefix('admin/skill-categories')->group(function () {
        Route::get('/', [SkillCategoryController::class, 'index']);
        Route::post('/', [SkillCategoryController::class, 'store']);
        Route::put('/{id}', [SkillCategoryController::class, 'update']);
        Route::delete('/{id}', [SkillCategoryController::class, 'destroy']);
    });

    Route::prefix('admin/skills')->group(function () {
        Route::post('/', [SkillController::class, 'store']);
        Route::put('/{id}', [SkillController::class, 'update']);
        Route::delete('/{id}', [SkillController::class, 'destroy']);
    });

    Route::post('admin/notifications', [NotificationController::class, 'store']);
    Route::get('admin/audit-logs', [AuditLogController::class, 'index']);
});
