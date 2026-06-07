<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RecommendationService;
use App\Models\InternshipListing;
use Illuminate\Support\Facades\Validator;

class RecommendationController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    /**
     * Get recommendation scores for the currently logged-in student
     */
    public function myRecommendations(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized. Only students can access their recommendations.'], 403);
        }

        $recommendations = $this->recommendationService->getRecommendationsForStudent($user->user_id);
        return response()->json($recommendations, 200);
    }

    /**
     * Trigger recalculation of recommendation scores for the logged-in student
     */
    public function recalculateMyRecommendations(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized. Only students can trigger their own recommendation updates.'], 403);
        }

        try {
            $this->recommendationService->recalculateStudentRecommendations($user->user_id);
            $recommendations = $this->recommendationService->getRecommendationsForStudent($user->user_id);
            return response()->json([
                'message' => 'Recommendations recalculated successfully.',
                'data' => $recommendations
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to recalculate recommendations: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get ranked student recommendations for a specific internship listing
     */
    public function listingRecommendations(Request $request, $listingId)
    {
        $user = $request->user();
        
        // Find the listing
        $listing = InternshipListing::findOrFail($listingId);

        // Authorization: Companies can only view recommendations for their own listings.
        // COORDINATOR or ADMIN can view recommendations for any listing.
        if ($user->role === 'COMPANY') {
            $companyProfile = $user->companyProfile;
            if (!$companyProfile || $listing->company_id !== $companyProfile->company_id) {
                return response()->json(['message' => 'Unauthorized. You can only view recommendations for your own listings.'], 403);
            }
        } elseif ($user->role !== 'COORDINATOR' && $user->role !== 'ADMIN') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $recommendations = $this->recommendationService->getRecommendationsForListing((int)$listingId);
        return response()->json($recommendations, 200);
    }

    /**
     * Trigger recalculation of student matches for a specific internship listing
     */
    public function recalculateListingRecommendations(Request $request, $listingId)
    {
        $user = $request->user();
        
        // Find the listing
        $listing = InternshipListing::findOrFail($listingId);

        // Authorization: Companies can only trigger recalculations for their own listings.
        // COORDINATOR or ADMIN can trigger for any listing.
        if ($user->role === 'COMPANY') {
            $companyProfile = $user->companyProfile;
            if (!$companyProfile || $listing->company_id !== $companyProfile->company_id) {
                return response()->json(['message' => 'Unauthorized. You can only recalculate recommendations for your own listings.'], 403);
            }
        } elseif ($user->role !== 'COORDINATOR' && $user->role !== 'ADMIN') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $this->recommendationService->recalculateListingRecommendations((int)$listingId);
            $recommendations = $this->recommendationService->getRecommendationsForListing((int)$listingId);
            return response()->json([
                'message' => 'Listing recommendations recalculated successfully.',
                'data' => $recommendations
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to recalculate listing recommendations: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Trigger a system-wide recalculation of all student/listing recommendations
     */
    public function recalculateAll(Request $request)
    {
        $user = $request->user();
        
        // Only coordinate and admin can run global recalculations
        if ($user->role !== 'COORDINATOR' && $user->role !== 'ADMIN') {
            return response()->json(['message' => 'Unauthorized. Only coordinators or administrators can run global matching recalculations.'], 403);
        }

        try {
            $this->recommendationService->recalculateAllRecommendations();
            return response()->json(['message' => 'System-wide matching score recalculation triggered successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to trigger global recalculation: ' . $e->getMessage()], 500);
        }
    }
}
