<?php

namespace App\Services;

use App\Models\Internship;
use App\Models\User;
use Exception;

class InternshipService
{
    /**
     * Get internships based on user role
     */
    public function getInternships(User $user)
    {
        $query = Internship::with(['studentProfile.user', 'companyProfile.user', 'lecturerProfile.user', 'listing', 'lecturerGrade']);

        if ($user->role === 'STUDENT') {
            $query->where('student_user_id', $user->user_id);
        } elseif ($user->role === 'COMPANY') {
            $query->where('company_user_id', $user->user_id);
        } elseif ($user->role === 'LECTURER') {
            $query->where('lecturer_user_id', $user->user_id);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get a specific internship by ID ensuring access rights
     */
    public function getInternshipById(User $user, int $internshipId): Internship
    {
        $internship = Internship::with(['studentProfile.user', 'companyProfile.user', 'lecturerProfile.user', 'listing', 'weeklyReports.reviews', 'companyEvaluation.criteriaScores', 'lecturerGrade'])->findOrFail($internshipId);

        // Check permissions
        if ($user->role === 'STUDENT' && $internship->student_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access to this internship.", 403);
        }
        if ($user->role === 'COMPANY' && $internship->company_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access to this internship.", 403);
        }
        if ($user->role === 'LECTURER' && $internship->lecturer_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access to this internship.", 403);
        }

        return $internship;
    }
}
