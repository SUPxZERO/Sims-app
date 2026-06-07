<?php

namespace App\Services;

use App\Models\Application;
use App\Models\InternshipListing;
use App\Models\ApplicationStatusHistory;
use App\Models\Cv;
use App\Models\Internship;
use Illuminate\Support\Facades\DB;
use Exception;

class ApplicationService
{
    /**
     * Submit a new application.
     */
    public function apply(int $userId, int $listingId, string $coverLetter = null): Application
    {
        return DB::transaction(function () use ($userId, $listingId, $coverLetter) {
            $listing = InternshipListing::findOrFail($listingId);

            if ($listing->status !== 'PUBLISHED') {
                throw new Exception("Cannot apply to a listing that is not approved.");
            }

            if ($listing->filled_count >= $listing->quota) {
                throw new Exception("Quota for this listing has been reached.");
            }

            // Check if already applied
            $existingApplication = Application::where('user_id', $userId)
                                              ->where('listing_id', $listingId)
                                              ->first();
            if ($existingApplication) {
                throw new Exception("You have already applied for this listing.");
            }

            // Cap check: Check number of active applications (PENDING or REVIEWING)
            $activeApplicationsCount = Application::where('user_id', $userId)
                                                  ->whereIn('status', ['PENDING', 'REVIEWING'])
                                                  ->count();
            
            // Assume cap is 5
            if ($activeApplicationsCount >= 5) {
                throw new Exception("You have reached the maximum number of active applications (5).");
            }

            // Check if the user already has a CONFIRMED placement
            $confirmedPlacement = Application::where('user_id', $userId)
                                             ->where('status', 'CONFIRMED')
                                             ->first();
            if ($confirmedPlacement) {
                throw new Exception("You already have a confirmed internship placement.");
            }

            // Get current active CV version
            $cv = Cv::where('user_id', $userId)->first();
            if (!$cv || $cv->status !== 'COMPLETE') {
                throw new Exception("You must have a completed and active CV version to apply.");
            }

            $latestCvVersion = \App\Models\CvVersion::where('cv_id', $cv->cv_id)
                                    ->orderBy('version_number', 'desc')
                                    ->first();

            if (!$latestCvVersion) {
                throw new Exception("CV version not found.");
            }

            // Optional: Get match score if available from RecommendationScore or calculate it.
            // For now, default to 0.0 or trigger PL/SQL if needed.
            $matchScore = 0.0;

            $application = Application::create([
                'user_id' => $userId,
                'listing_id' => $listingId,
                'cv_version_id' => $latestCvVersion->cv_version_id,
                'cover_letter' => $coverLetter,
                'match_score_at_apply' => $matchScore,
                'status' => 'SUBMITTED',
                'submitted_at' => now(),
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->application_id,
                'changed_by' => $userId,
                'from_status' => null,
                'to_status' => 'SUBMITTED',
                'change_reason' => 'Application submitted.',
                'changed_at' => now(),
            ]);

            return $application;
        });
    }

    /**
     * Update application status (Company or Admin).
     */
    public function updateStatus(int $applicationId, int $changedByUserId, string $newStatus, string $reason = null): Application
    {
        return DB::transaction(function () use ($applicationId, $changedByUserId, $newStatus, $reason) {
            $application = Application::findOrFail($applicationId);
            $oldStatus = $application->status;

            if ($oldStatus === $newStatus) {
                return $application;
            }

            $application->status = $newStatus;

            if ($newStatus === 'UNDER_REVIEW') {
                $application->reviewed_at = now();
            } elseif (in_array($newStatus, ['ACCEPTED', 'REJECTED'])) {
                $application->decided_at = now();
                if ($newStatus === 'REJECTED') {
                    $application->rejection_reason = $reason;
                }
            } elseif ($newStatus === 'CONFIRMED') {
                $application->confirmed_at = now();
                
                // Triggers handle the internship creation and auto-withdrawal of other applications,
                // but we might want to manually invoke or verify them here if needed.
                // We'll create the internship record explicitly to be safe if trigger doesn't do it.
                // Auto-assign a lecturer (for demo purposes)
                $lecturer = \App\Models\User::where('role', 'LECTURER')->first() ?? \App\Models\User::where('role', 'ADMIN')->first();

                Internship::create([
                    'application_id' => $application->application_id,
                    'student_user_id' => $application->user_id,
                    'listing_id' => $application->listing_id,
                    'company_user_id' => $application->listing->company_user_id,
                    'lecturer_user_id' => $lecturer->user_id,
                    'status' => 'ACTIVE',
                    'start_date' => now(),
                    'end_date' => now()->addWeeks($application->listing->duration_weeks),
                    'total_weeks' => $application->listing->duration_weeks,
                    'confirmed_by' => $changedByUserId,
                ]);

                // Increment filled_count
                $listing = $application->listing;
                $listing->filled_count += 1;
                $listing->save();

                // Auto-withdraw other active applications
                $otherApplications = Application::where('user_id', $application->user_id)
                                                ->where('application_id', '!=', $application->application_id)
                                                ->whereIn('status', ['PENDING', 'REVIEWING', 'ACCEPTED'])
                                                ->get();
                
                foreach ($otherApplications as $otherApp) {
                    $otherApp->status = 'WITHDRAWN';
                    $otherApp->save();

                    ApplicationStatusHistory::create([
                        'application_id' => $otherApp->application_id,
                        'changed_by' => $changedByUserId,
                        'from_status' => $otherApp->getOriginal('status'),
                        'to_status' => 'WITHDRAWN',
                        'change_reason' => 'Auto-withdrawn due to another confirmed placement.',
                        'changed_at' => now(),
                    ]);
                }
            } elseif ($newStatus === 'WITHDRAWN') {
                // Do nothing specific except log
            } else {
                throw new Exception("Invalid status transition.");
            }

            $application->save();

            ApplicationStatusHistory::create([
                'application_id' => $application->application_id,
                'changed_by' => $changedByUserId,
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'change_reason' => $reason,
                'changed_at' => now(),
            ]);

            return $application;
        });
    }

    /**
     * Get applications for a listing.
     */
    public function getApplicationsForListing(int $listingId)
    {
        return Application::with(['user', 'studentProfile', 'cvVersion'])
                          ->where('listing_id', $listingId)
                          ->orderBy('created_at', 'desc')
                          ->get();
    }

    /**
     * Get applications for a student.
     */
    public function getApplicationsForStudent(int $userId)
    {
        return Application::with(['listing.companyProfile'])
                          ->where('user_id', $userId)
                          ->orderBy('created_at', 'desc')
                          ->get();
    }
}
