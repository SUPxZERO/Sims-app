<?php

namespace App\Services;

use App\Models\InternshipListing;
use App\Models\ListingRequiredSkill;
use Illuminate\Support\Facades\DB;
use Exception;

class ListingService
{
    /**
     * Create a new internship listing with required skills.
     */
    public function createListing(array $data, int $companyUserId): InternshipListing
    {
        return DB::transaction(function () use ($data, $companyUserId) {
            $listing = InternshipListing::create([
                'company_user_id' => $companyUserId,
                'title' => $data['title'],
                'description' => $data['description'],
                'requirements' => $data['requirements'] ?? null,
                'location' => $data['location'],
                'work_mode' => $data['work_mode'],
                'duration_weeks' => $data['duration_weeks'],
                'quota' => $data['quota'],
                'filled_count' => 0,
                'stipend_info' => $data['stipend_info'] ?? null,
                'application_deadline' => $data['application_deadline'],
                'status' => 'PENDING_APPROVAL', // Default status is PENDING_APPROVAL for admin approval
                'min_gpa' => $data['min_gpa'] ?? null,
                'preferred_departments' => $data['preferred_departments'] ?? null,
            ]);

            if (!empty($data['skills'])) {
                foreach ($data['skills'] as $skillData) {
                    ListingRequiredSkill::create([
                        'listing_id' => $listing->listing_id,
                        'skill_id' => $skillData['skill_id'],
                        'importance' => $skillData['importance'], // MANDATORY, HIGH, MEDIUM, LOW
                        'importance_weight' => $skillData['importance_weight'] ?? 1.0,
                    ]);
                }
            }

            return $listing->load('listingRequiredSkills.skill');
        });
    }

    /**
     * Admin approves or rejects a listing.
     */
    public function reviewListing(int $listingId, int $adminId, string $status, ?string $feedback = null): InternshipListing
    {
        if (!in_array($status, ['PUBLISHED', 'REJECTED'])) {
            throw new Exception("Invalid status. Must be PUBLISHED or REJECTED.");
        }

        $listing = InternshipListing::findOrFail($listingId);
        $listing->status = $status;
        $listing->admin_feedback = $feedback;
        $listing->approved_by = $adminId;

        if ($status === 'PUBLISHED') {
            $listing->published_at = now();
        }

        $listing->save();

        // Automatically calculate match scores for all students when the listing is published
        if ($status === 'PUBLISHED') {
            try {
                app(\App\Services\RecommendationService::class)->recalculateListingRecommendations($listing->listing_id);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to recalculate listing recommendations after publish: ' . $e->getMessage());
            }
        }

        return $listing;
    }

    /**
     * Get listings with filters
     */
    public function getListings(array $filters = [])
    {
        $query = InternshipListing::with(['companyProfile', 'listingRequiredSkills.skill']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['company_user_id'])) {
            $query->where('company_user_id', $filters['company_user_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
