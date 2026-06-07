<?php

namespace App\Services;

use App\Models\RecommendationScore;
use App\Models\InternshipListing;
use App\Models\StudentProfile;
use App\Models\Cv;
use App\Models\User;
use App\Models\MatchingWeightConfig;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecommendationService
{
    /**
     * Get recommendation scores for a student
     */
    public function getRecommendationsForStudent(int $userId): array
    {
        return RecommendationScore::with(['listing', 'listing.companyProfile'])
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
        return RecommendationScore::with(['user', 'user.studentProfile'])
            ->where('listing_id', $listingId)
            ->orderBy('composite_score', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Compute recommendations for a student against all published listings
     */
    public function recalculateStudentRecommendations(int $userId): void
    {
        $student = User::with('studentProfile')->find($userId);
        if (!$student || !$student->studentProfile) {
            return;
        }

        $cv = Cv::with('skills')->where('user_id', $userId)->first();
        if (!$cv) {
            return;
        }

        $listings = InternshipListing::with('listingRequiredSkills')->where('status', 'PUBLISHED')->get();
        $config = MatchingWeightConfig::first();

        foreach ($listings as $listing) {
            $this->calculateScoreForStudentAndListing($student, $cv, $listing, $config);
        }
    }

    /**
     * Compute recommendations for a listing against all students with CVs
     */
    public function recalculateListingRecommendations(int $listingId): void
    {
        $listing = InternshipListing::with('listingRequiredSkills')->find($listingId);
        if (!$listing || $listing->status !== 'PUBLISHED') {
            return;
        }

        $students = User::with('studentProfile')->where('role', 'STUDENT')->get();
        $config = MatchingWeightConfig::first();

        foreach ($students as $student) {
            $cv = Cv::with('skills')->where('user_id', $student->user_id)->first();
            if ($cv) {
                $this->calculateScoreForStudentAndListing($student, $cv, $listing, $config);
            }
        }
    }

    /**
     * Recalculate all recommendations (Global refresh)
     */
    public function recalculateAllRecommendations(): void
    {
        $listings = InternshipListing::with('listingRequiredSkills')->where('status', 'PUBLISHED')->get();
        $students = User::with('studentProfile')->where('role', 'STUDENT')->get();
        $config = MatchingWeightConfig::first();

        foreach ($students as $student) {
            $cv = Cv::with('skills')->where('user_id', $student->user_id)->first();
            if (!$cv) {
                continue;
            }

            foreach ($listings as $listing) {
                $this->calculateScoreForStudentAndListing($student, $cv, $listing, $config);
            }
        }
    }

    /**
     * Core matching logic algorithm
     */
    protected function calculateScoreForStudentAndListing(User $student, Cv $cv, InternshipListing $listing, MatchingWeightConfig $config): void
    {
        // 1. Skill Match Score (60%)
        $totalRequiredWeight = 0;
        $matchedWeight = 0;
        $matchedSkillsCount = 0;

        $studentSkills = $cv->skills->keyBy('skill_id');
        $requiredSkills = $listing->listingRequiredSkills;

        foreach ($requiredSkills as $reqSkill) {
            $reqWeight = (float) $reqSkill->importance_weight;
            $totalRequiredWeight += $reqWeight;

            if ($studentSkills->has($reqSkill->skill_id)) {
                $stdSkill = $studentSkills->get($reqSkill->skill_id);
                $stdProficiencyWeight = (float) $stdSkill->pivot->proficiency_weight;
                
                // Student proficiency weight is 0.33, 0.66, or 1.00. Multiply by required weight.
                $matchedWeight += ($reqWeight * $stdProficiencyWeight);
                $matchedSkillsCount++;
            }
        }

        $skillMatchScore = $totalRequiredWeight > 0 ? min(100, ($matchedWeight / $totalRequiredWeight) * 100) : 100;

        // 2. GPA Match Score (20%)
        $studentGpa = (float) $student->studentProfile->gpa;
        $minGpa = (float) $listing->min_gpa;
        
        $gpaMatchScore = 100;
        if ($minGpa > 0) {
            if ($studentGpa >= $minGpa) {
                $gpaMatchScore = 100;
            } else {
                // Partial credit for GPA, dropping off linearly down to 0 at minGpa - 1.0
                $diff = $minGpa - $studentGpa;
                $gpaMatchScore = max(0, 100 - ($diff * 100)); 
            }
        }

        // 3. Preference Match Score (20%)
        $preferenceMatchScore = 100;
        if ($listing->preferred_departments) {
            $prefs = array_map('trim', explode(',', strtolower($listing->preferred_departments)));
            $stdDept = strtolower($student->studentProfile->department);
            
            $foundMatch = false;
            foreach ($prefs as $pref) {
                if (str_contains($stdDept, $pref) || str_contains($pref, $stdDept)) {
                    $foundMatch = true;
                    break;
                }
            }
            if (!$foundMatch) {
                $preferenceMatchScore = 50; // Partial score if department doesn't match preferred
            }
        }

        // 4. Composite Score
        $sw = (float) $config->skill_weight;
        $gw = (float) $config->gpa_weight;
        $pw = (float) $config->preference_weight;

        $compositeScore = ($skillMatchScore * $sw) + ($gpaMatchScore * $gw) + ($preferenceMatchScore * $pw);

        // Update or Create Record
        RecommendationScore::updateOrCreate(
            ['user_id' => $student->user_id, 'listing_id' => $listing->listing_id],
            [
                'skill_match_score' => round($skillMatchScore, 2),
                'gpa_match_score' => round($gpaMatchScore, 2),
                'preference_match_score' => round($preferenceMatchScore, 2),
                'composite_score' => round($compositeScore, 2),
                'skill_weight_used' => $sw,
                'gpa_weight_used' => $gw,
                'preference_weight_used' => $pw,
                'matched_skills_count' => $matchedSkillsCount,
                'total_required_skills' => $requiredSkills->count(),
                'calculated_at' => now(),
            ]
        );
    }
}
