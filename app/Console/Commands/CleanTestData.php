<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WeeklyReport;
use App\Models\ReportReview;
use App\Models\Internship;
use App\Models\Application;
use App\Models\Cv;
use App\Models\CvVersion;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\InternshipListing;

class CleanTestData extends Command
{
    protected $signature   = 'test:clean';
    protected $description = 'Remove orphaned test data left from failed PHPUnit runs';

    public function handle()
    {
        $patterns = ['%_rpt_%@suims.edu', '%_report_%@suims.edu', 'eval_%@suims.edu'];

        $userIds = collect();
        foreach ($patterns as $pattern) {
            $userIds = $userIds->merge(
                User::where('email', 'like', $pattern)->pluck('user_id')
            );
        }
        $userIds = $userIds->unique()->values()->toArray();

        $this->info('Found ' . count($userIds) . ' test user(s) to clean up.');

        if (empty($userIds)) {
            $this->info('Nothing to clean.');
            return 0;
        }

        // Internships and related records
        $internshipIds = Internship::whereIn('student_user_id', $userIds)
            ->pluck('internship_id')->toArray();

        if (!empty($internshipIds)) {
            // Evaluations
            \App\Models\FinalScore::whereIn('internship_id', $internshipIds)->delete();
            \App\Models\CompanyEvaluation::whereIn('internship_id', $internshipIds)->delete();
            \App\Models\LecturerGrade::whereIn('internship_id', $internshipIds)->delete();

            // Weekly Reports
            $reportIds = WeeklyReport::whereIn('internship_id', $internshipIds)
                ->pluck('report_id')->toArray();
            if (!empty($reportIds)) {
                $deleted = ReportReview::whereIn('report_id', $reportIds)->delete();
                $this->info("Deleted {$deleted} report review(s).");
            }
            $deleted = WeeklyReport::whereIn('internship_id', $internshipIds)->delete();
            $this->info("Deleted {$deleted} weekly report(s).");
            
            // Internships
            $deleted = Internship::whereIn('internship_id', $internshipIds)->delete();
            $this->info("Deleted {$deleted} internship(s).");
        }

        // Applications
        $deleted = Application::whereIn('user_id', $userIds)->delete();
        $this->info("Deleted {$deleted} application(s).");

        // CVs
        $cvIds = Cv::whereIn('user_id', $userIds)->pluck('cv_id')->toArray();
        if (!empty($cvIds)) {
            CvVersion::whereIn('cv_id', $cvIds)->delete();
            Cv::whereIn('cv_id', $cvIds)->delete();
        }

        // Listings
        $deleted = InternshipListing::whereIn('company_user_id', $userIds)->delete();
        $this->info("Deleted {$deleted} listing(s).");

        // Profiles
        StudentProfile::whereIn('user_id', $userIds)->delete();
        CompanyProfile::whereIn('user_id', $userIds)->delete();
        \App\Models\LecturerProfile::whereIn('user_id', $userIds)->delete();

        // Users — delete one-by-one to avoid ORA-04091 trigger mutation
        $deleted = 0;
        foreach ($userIds as $uid) {
            User::where('user_id', $uid)->delete();
            $deleted++;
        }
        $this->info("Deleted {$deleted} user(s). Cleanup complete!");

        return 0;
    }
}
