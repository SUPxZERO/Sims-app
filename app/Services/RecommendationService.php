<?php

namespace App\Services;

use App\Models\RecommendationScore;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    /**
     * Get recommendation scores for a student
     */
    public function getRecommendationsForStudent(int $userId): array
    {
        return RecommendationScore::with(['listing', 'listing.company'])
            ->where('user_id', $userId)
            ->orderBy('composite_score', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Get recommendation scores for a listing
     */
    public function getRecommendationsForListing(int $listingId): array
    {
        return RecommendationScore::with('user')
            ->where('listing_id', $listingId)
            ->orderBy('composite_score', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Trigger Oracle PL/SQL routine to compute recommendations for a student
     */
    public function recalculateStudentRecommendations(int $userId): void
    {
        DB::statement('BEGIN pkg_recommendation_engine.calc_student_recommendations(:userId); END;', ['userId' => $userId]);
    }

    /**
     * Trigger Oracle PL/SQL routine to compute recommendations for a listing
     */
    public function recalculateListingRecommendations(int $listingId): void
    {
        DB::statement('BEGIN pkg_recommendation_engine.calc_listing_recommendations(:listingId); END;', ['listingId' => $listingId]);
    }

    /**
     * Trigger Oracle PL/SQL routine to recalculate all recommendations
     */
    public function recalculateAllRecommendations(): void
    {
        DB::statement('BEGIN pkg_recommendation_engine.recalc_all_recommendations; END;');
    }
}
