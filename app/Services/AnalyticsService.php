<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Admin dashboard metrics: system-wide overview
     */
    public function getAdminDashboard(): array
    {
        // Active internship placements (ACTIVE status)
        $activePlacements = DB::table('internships')
            ->where('status', 'ACTIVE')
            ->count();

        // Pending listings awaiting admin approval
        $pendingListings = DB::table('internship_listings')
            ->where('status', 'PENDING_APPROVAL')
            ->count();

        // Total audit log entries
        $auditLogCount = DB::table('audit_logs')->count();

        // User distribution by role
        $userDistribution = DB::table('users')
            ->select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->get()
            ->keyBy('role')
            ->map(fn($r) => (int) $r->count);

        // Total users
        $totalUsers = DB::table('users')->count();

        // Completed internships
        $completedInternships = DB::table('internships')
            ->where('status', 'COMPLETED')
            ->count();

        // Monthly placement growth (last 6 months)
        $placementGrowth = DB::table('internships')
            ->select(
                DB::raw("TO_CHAR(created_at, 'YYYY-MM') as month"),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', DB::raw("ADD_MONTHS(SYSDATE, -6)"))
            ->groupBy(DB::raw("TO_CHAR(created_at, 'YYYY-MM')"))
            ->orderBy('month')
            ->get();

        // Grade distribution across completed internships
        $gradeDistribution = DB::table('final_scores')
            ->select('letter_grade', DB::raw('COUNT(*) as count'))
            ->groupBy('letter_grade')
            ->orderBy('letter_grade')
            ->get()
            ->keyBy('letter_grade')
            ->map(fn($r) => (int) $r->count);

        // Recent pending listing details (for review board)
        $pendingListingDetails = DB::table('internship_listings')
            ->join('company_profiles', 'internship_listings.company_user_id', '=', 'company_profiles.user_id')
            ->join('users', 'users.user_id', '=', 'internship_listings.company_user_id')
            ->select([
                'internship_listings.listing_id',
                'internship_listings.title',
                'internship_listings.quota',
                'internship_listings.location',
                'internship_listings.created_at',
                'users.full_name as company_name',
                'company_profiles.company_name as company_official_name',
            ])
            ->where('internship_listings.status', 'PENDING_APPROVAL')
            ->orderBy('internship_listings.created_at', 'asc')
            ->limit(10)
            ->get();

        return [
            'kpis' => [
                'active_placements'     => (int) $activePlacements,
                'pending_listings'      => (int) $pendingListings,
                'audit_log_count'       => (int) $auditLogCount,
                'total_users'           => (int) $totalUsers,
                'completed_internships' => (int) $completedInternships,
            ],
            'user_distribution'     => $userDistribution,
            'grade_distribution'    => $gradeDistribution,
            'placement_growth'      => $placementGrowth,
            'pending_listing_board' => $pendingListingDetails,
        ];
    }

    /**
     * Student dashboard metrics: personal academic progress
     */
    public function getStudentDashboard(int $userId): array
    {
        // CV completeness info
        $cv = DB::table('cvs')->where('user_id', $userId)->first();
        $cvStatus    = $cv ? $cv->status : 'INCOMPLETE';
        $cvVersions  = $cv ? DB::table('cv_versions')->where('cv_id', $cv->cv_id)->count() : 0;

        // Active applications count
        $activeApps = DB::table('applications')
            ->where('user_id', $userId)
            ->whereIn('status', ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED'])
            ->count();

        // All applications pipeline
        $applicationsPipeline = DB::table('applications')
            ->join('internship_listings', 'applications.listing_id', '=', 'internship_listings.listing_id')
            ->join('users as cu', 'cu.user_id', '=', 'internship_listings.company_user_id')
            ->select([
                'applications.application_id',
                'applications.status',
                'applications.match_score_at_apply',
                'applications.submitted_at',
                'internship_listings.title as listing_title',
                'cu.full_name as company_name',
            ])
            ->where('applications.user_id', $userId)
            ->orderBy('applications.submitted_at', 'desc')
            ->limit(10)
            ->get();

        // Active internship info
        $internship = DB::table('internships')
            ->join('internship_listings', 'internships.listing_id', '=', 'internship_listings.listing_id')
            ->join('users as cu', 'cu.user_id', '=', 'internships.company_user_id')
            ->select([
                'internships.internship_id',
                'internships.status',
                'internships.start_date',
                'internships.end_date',
                'internships.total_weeks',
                'internship_listings.title as listing_title',
                'cu.full_name as company_name',
            ])
            ->where('internships.student_user_id', $userId)
            ->whereIn('internships.status', ['ACTIVE', 'COMPLETED'])
            ->orderBy('internships.created_at', 'desc')
            ->first();

        // Weekly reports progress (if active internship exists)
        $weeklyReportStats = null;
        $weeksLogged       = 0;
        $totalWeeks        = 0;

        if ($internship) {
            $totalWeeks  = (int) $internship->total_weeks;
            $weeksLogged = DB::table('weekly_reports')
                ->where('internship_id', $internship->internship_id)
                ->whereIn('status', ['SUBMITTED', 'APPROVED'])
                ->count();

            $weeklyReportStats = DB::table('weekly_reports')
                ->where('internship_id', $internship->internship_id)
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get()
                ->keyBy('status')
                ->map(fn($r) => (int) $r->count);
        }

        // Top 5 recommendations
        $recommendations = DB::table('recommendation_scores')
            ->join('internship_listings', 'recommendation_scores.listing_id', '=', 'internship_listings.listing_id')
            ->join('users as cu', 'cu.user_id', '=', 'internship_listings.company_user_id')
            ->select([
                'recommendation_scores.listing_id',
                'recommendation_scores.composite_score',
                'recommendation_scores.skill_match_score',
                'recommendation_scores.gpa_match_score',
                'internship_listings.title',
                'internship_listings.location',
                'internship_listings.work_mode',
                'internship_listings.application_deadline',
                'cu.full_name as company_name',
            ])
            ->where('recommendation_scores.user_id', $userId)
            ->orderBy('recommendation_scores.composite_score', 'desc')
            ->limit(5)
            ->get();

        return [
            'kpis' => [
                'cv_status'       => $cvStatus,
                'cv_versions'     => (int) $cvVersions,
                'active_apps'     => (int) $activeApps,
                'weeks_logged'    => $weeksLogged,
                'total_weeks'     => $totalWeeks,
            ],
            'applications_pipeline' => $applicationsPipeline,
            'internship'            => $internship,
            'weekly_report_stats'   => $weeklyReportStats,
            'top_recommendations'   => $recommendations,
        ];
    }

    /**
     * Lecturer dashboard metrics: supervision workload and grading board
     */
    public function getLecturerDashboard(int $userId): array
    {
        // Number of active supervised students
        $activeSupervisedCount = DB::table('internships')
            ->where('lecturer_user_id', $userId)
            ->where('status', 'ACTIVE')
            ->count();

        // Pending weekly report reviews
        $pendingReviews = DB::table('weekly_reports')
            ->join('internships', 'weekly_reports.internship_id', '=', 'internships.internship_id')
            ->where('internships.lecturer_user_id', $userId)
            ->where('weekly_reports.status', 'SUBMITTED')
            ->count();

        // Supervision capacity (from config, default 10)
        $maxCapacity = (int) DB::table('system_configs')
            ->where('config_key', 'MAX_SUPERVISOR_LOAD')
            ->value('config_value') ?? 10;

        // Student roster with report progress
        $studentRoster = DB::table('internships')
            ->join('users as su', 'su.user_id', '=', 'internships.student_user_id')
            ->join('users as cu', 'cu.user_id', '=', 'internships.company_user_id')
            ->join('internship_listings', 'internship_listings.listing_id', '=', 'internships.listing_id')
            ->leftJoin('final_scores', 'final_scores.internship_id', '=', 'internships.internship_id')
            ->select([
                'internships.internship_id',
                'internships.status',
                'internships.total_weeks',
                'internship_listings.title as position',
                'su.full_name as student_name',
                'cu.full_name as company_name',
                'final_scores.letter_grade',
                'final_scores.composite_score as final_score',
            ])
            ->where('internships.lecturer_user_id', $userId)
            ->orderBy('internships.status')
            ->get()
            ->map(function ($internship) {
                $approvedReports = DB::table('weekly_reports')
                    ->where('internship_id', $internship->internship_id)
                    ->where('status', 'APPROVED')
                    ->count();
                $internship->reports_approved = (int) $approvedReports;
                return $internship;
            });

        // Pending report details for review queue
        $pendingReportDetails = DB::table('weekly_reports')
            ->join('internships', 'weekly_reports.internship_id', '=', 'internships.internship_id')
            ->join('users as su', 'su.user_id', '=', 'internships.student_user_id')
            ->select([
                'weekly_reports.report_id',
                'weekly_reports.week_number',
                'weekly_reports.submitted_at',
                'weekly_reports.activities',
                'weekly_reports.is_late',
                'internships.internship_id',
                'su.full_name as student_name',
            ])
            ->where('internships.lecturer_user_id', $userId)
            ->where('weekly_reports.status', 'SUBMITTED')
            ->orderBy('weekly_reports.submitted_at', 'asc')
            ->limit(10)
            ->get();

        return [
            'kpis' => [
                'active_supervised' => (int) $activeSupervisedCount,
                'pending_reviews'   => (int) $pendingReviews,
                'max_capacity'      => $maxCapacity,
            ],
            'student_roster'         => $studentRoster,
            'pending_report_details' => $pendingReportDetails,
        ];
    }

    /**
     * Company dashboard metrics: listings, applicants, active interns
     */
    public function getCompanyDashboard(int $userId): array
    {
        // Active listings count
        $activeListings = DB::table('internship_listings')
            ->where('company_user_id', $userId)
            ->where('status', 'PUBLISHED')
            ->count();

        // Total pending applicants across all listings
        $pendingApplicants = DB::table('applications')
            ->join('internship_listings', 'applications.listing_id', '=', 'internship_listings.listing_id')
            ->where('internship_listings.company_user_id', $userId)
            ->whereIn('applications.status', ['SUBMITTED', 'UNDER_REVIEW'])
            ->count();

        // Active interns count
        $activeInterns = DB::table('internships')
            ->where('company_user_id', $userId)
            ->where('status', 'ACTIVE')
            ->count();

        // All listings with application metrics
        $listingsOverview = DB::table('internship_listings')
            ->where('company_user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($listing) {
                $appCounts = DB::table('applications')
                    ->where('listing_id', $listing->listing_id)
                    ->select('status', DB::raw('COUNT(*) as count'))
                    ->groupBy('status')
                    ->get()
                    ->keyBy('status')
                    ->map(fn($r) => (int) $r->count);

                $listing->application_counts = $appCounts;
                return $listing;
            });

        // Active intern details (for evaluation section)
        $activeInternDetails = DB::table('internships')
            ->join('users as su', 'su.user_id', '=', 'internships.student_user_id')
            ->join('internship_listings', 'internship_listings.listing_id', '=', 'internships.listing_id')
            ->leftJoin('company_evaluations', 'company_evaluations.internship_id', '=', 'internships.internship_id')
            ->select([
                'internships.internship_id',
                'internships.status',
                'internships.end_date',
                'internship_listings.title as position',
                'su.full_name as student_name',
                'company_evaluations.status as evaluation_status',
            ])
            ->where('internships.company_user_id', $userId)
            ->whereIn('internships.status', ['ACTIVE', 'COMPLETED'])
            ->orderBy('internships.end_date', 'asc')
            ->get();

        // Applicant funnel pipeline summary
        $applicationFunnel = DB::table('applications')
            ->join('internship_listings', 'applications.listing_id', '=', 'internship_listings.listing_id')
            ->where('internship_listings.company_user_id', $userId)
            ->select('applications.status', DB::raw('COUNT(*) as count'))
            ->groupBy('applications.status')
            ->get()
            ->keyBy('status')
            ->map(fn($r) => (int) $r->count);

        return [
            'kpis' => [
                'active_listings'   => (int) $activeListings,
                'pending_applicants'=> (int) $pendingApplicants,
                'active_interns'    => (int) $activeInterns,
            ],
            'listings_overview'    => $listingsOverview,
            'active_intern_details'=> $activeInternDetails,
            'application_funnel'   => $applicationFunnel,
        ];
    }
}
