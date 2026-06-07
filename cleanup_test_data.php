<?php

use App\Models\WeeklyReport;
use App\Models\Internship;
use App\Models\Application;
use App\Models\Cv;
use App\Models\CvVersion;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\InternshipListing;
use App\Models\ReportReview;

// Find all test users from previous runs
$testUsers = User::where('email', 'like', '%_rpt_%@suims.edu')
    ->orWhere('email', 'like', '%_report_%@suims.edu')
    ->get();

$userIds = $testUsers->pluck('user_id')->toArray();
echo 'Found test users: ' . count($userIds) . PHP_EOL;

if (!empty($userIds)) {
    // Get internship IDs for cleanup
    $internshipIds = Internship::whereIn('student_user_id', $userIds)
        ->pluck('internship_id')->toArray();
    echo 'Found internships: ' . count($internshipIds) . PHP_EOL;

    if (!empty($internshipIds)) {
        // Delete report reviews first
        $reportIds = WeeklyReport::whereIn('internship_id', $internshipIds)
            ->pluck('report_id')->toArray();
        if (!empty($reportIds)) {
            ReportReview::whereIn('report_id', $reportIds)->delete();
        }
        WeeklyReport::whereIn('internship_id', $internshipIds)->delete();
        Internship::whereIn('internship_id', $internshipIds)->delete();
    }

    // Applications
    Application::whereIn('user_id', $userIds)->delete();

    // CVs
    $cvIds = Cv::whereIn('user_id', $userIds)->pluck('cv_id')->toArray();
    if (!empty($cvIds)) {
        CvVersion::whereIn('cv_id', $cvIds)->delete();
        Cv::whereIn('cv_id', $cvIds)->delete();
    }

    // Listings
    InternshipListing::whereIn('company_user_id', $userIds)->delete();

    // Profiles
    StudentProfile::whereIn('user_id', $userIds)->delete();
    CompanyProfile::whereIn('user_id', $userIds)->delete();

    // Users
    User::whereIn('user_id', $userIds)->delete();

    echo 'Cleanup done! Removed ' . count($userIds) . ' test users and related data.' . PHP_EOL;
} else {
    echo 'No test data found to clean up.' . PHP_EOL;
}
