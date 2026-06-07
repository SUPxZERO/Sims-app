<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\InternshipListing;
use App\Models\Application;
use App\Models\Internship;
use App\Models\WeeklyReport;
use App\Models\ReportReview;
use App\Models\Cv;
use App\Models\CvVersion;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class InternshipAndWeeklyReportTest extends TestCase
{
    protected $studentUser;
    protected $studentToken;
    protected $companyUser;
    protected $companyToken;
    protected $lecturerUser;
    protected $lecturerToken;

    // Track test-created user IDs for cleanup
    protected $testUserIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $ts = time();

        // 1. Create Users
        $this->studentUser = User::create([
            'email'         => "student_rpt_{$ts}@suims.edu",
            'password_hash' => Hash::make('Student@123'),
            'role'          => 'STUDENT',
            'full_name'     => 'Report Student',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->studentUser->user_id;

        StudentProfile::create([
            'user_id'           => $this->studentUser->user_id,
            'student_id_number' => "STU_RPT_{$ts}",
            'department'        => 'CS',
            'enrollment_year'   => 2022,
            'gpa'               => 3.50,
        ]);

        $this->companyUser = User::create([
            'email'         => "company_rpt_{$ts}@suims.edu",
            'password_hash' => Hash::make('Company@123'),
            'role'          => 'COMPANY',
            'full_name'     => 'Tech Corp',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->companyUser->user_id;

        CompanyProfile::create([
            'user_id'         => $this->companyUser->user_id,
            'company_name'    => 'Tech Corp',
            'industry_sector' => 'IT',
            'company_size'    => 'MEDIUM',
            'company_address' => '123 Tech Lane',
            'company_city'    => 'Silicon City',
        ]);

        $this->lecturerUser = User::create([
            'email'         => "lecturer_rpt_{$ts}@suims.edu",
            'password_hash' => Hash::make('Lecturer@123'),
            'role'          => 'LECTURER',
            'full_name'     => 'Prof Lecturer',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->lecturerUser->user_id;

        // 2. Obtain tokens via the AuthService login method
        $authService = app('App\Services\AuthService');
        $this->studentToken  = $authService->login("student_rpt_{$ts}@suims.edu", 'Student@123')['access_token'];
        $this->companyToken  = $authService->login("company_rpt_{$ts}@suims.edu", 'Company@123')['access_token'];
        $this->lecturerToken = $authService->login("lecturer_rpt_{$ts}@suims.edu", 'Lecturer@123')['access_token'];
    }

    protected function tearDown(): void
    {
        // Clean up test data in reverse-dependency order
        if (!empty($this->testUserIds)) {
            // WeeklyReports -> cascade from internships
            $internshipIds = Internship::whereIn('student_user_id', $this->testUserIds)
                ->pluck('internship_id')->toArray();

            if (!empty($internshipIds)) {
                WeeklyReport::whereIn('internship_id', $internshipIds)->delete();
                Internship::whereIn('internship_id', $internshipIds)->delete();
            }

            // Applications
            Application::whereIn('user_id', $this->testUserIds)->delete();

            // CVs and versions
            $cvIds = Cv::whereIn('user_id', $this->testUserIds)->pluck('cv_id')->toArray();
            if (!empty($cvIds)) {
                CvVersion::whereIn('cv_id', $cvIds)->delete();
                Cv::whereIn('cv_id', $cvIds)->delete();
            }

            // Listings
            InternshipListing::whereIn('company_user_id', $this->testUserIds)->delete();

            // Profiles
            StudentProfile::whereIn('user_id', $this->testUserIds)->delete();
            CompanyProfile::whereIn('user_id', $this->testUserIds)->delete();

            // Users — delete one-by-one to avoid ORA-04091 trigger mutation
            foreach ($this->testUserIds as $uid) {
                User::where('user_id', $uid)->delete();
            }
        }

        parent::tearDown();
    }

    public function test_internship_and_report_workflow()
    {
        // 1. Build listing -> application -> internship directly
        $listing = InternshipListing::create([
            'company_user_id'      => $this->companyUser->user_id,
            'title'                => 'Software Engineer Intern',
            'description'          => 'Test internship',
            'location'             => 'Remote',
            'work_mode'            => 'REMOTE',
            'duration_weeks'       => 12,
            'quota'                => 2,
            'application_deadline' => now()->addDays(14),
            'status'               => 'PUBLISHED',
        ]);

        $cv = Cv::create([
            'user_id'          => $this->studentUser->user_id,
            'personal_summary' => 'Student summary',
            'status'           => 'COMPLETE',
            'current_version'  => 1,
        ]);

        $cvVer = CvVersion::create([
            'cv_id'          => $cv->cv_id,
            'version_number' => 1,
            'snapshot_data'  => '{}',
        ]);

        $application = Application::create([
            'user_id'        => $this->studentUser->user_id,
            'listing_id'     => $listing->listing_id,
            'cv_version_id'  => $cvVer->cv_version_id,
            'cover_letter'   => 'My cover letter',
            'status'         => 'CONFIRMED',
        ]);

        $internship = Internship::create([
            'application_id'  => $application->application_id,
            'student_user_id' => $this->studentUser->user_id,
            'company_user_id' => $this->companyUser->user_id,
            'lecturer_user_id'=> $this->lecturerUser->user_id,
            'listing_id'      => $listing->listing_id,
            'status'          => 'ACTIVE',
            'start_date'      => now()->startOfWeek(),
            'end_date'        => now()->startOfWeek()->addWeeks(12),
            'total_weeks'     => 12,
            'confirmed_by'    => $this->studentUser->user_id,
        ]);

        // 2. Fetch the week 1 report (automatically created by Oracle trigger TRG_INTERNSHIPS_INIT_REPORTS)
        $report = WeeklyReport::where('internship_id', $internship->internship_id)
            ->where('week_number', 1)
            ->first();

        // 3. Student views their internships list
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->getJson('/api/internships');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('internships'));

        // 4. Student saves a DRAFT
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->putJson('/api/reports/' . $report->report_id, [
                'status'      => 'DRAFT',
                'activities'  => 'Attended onboarding sessions',
                'hours_logged'=> 40,
            ]);
        $response->assertStatus(200);
        $this->assertEquals('DRAFT', $response->json('report.status'));
        $this->assertEquals(40, $response->json('report.hours_logged'));

        // 5. Student SUBMITS the report
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->putJson('/api/reports/' . $report->report_id, [
                'status'     => 'SUBMITTED',
                'activities' => 'Completed onboarding and first task',
                'challenges' => 'Setting up Oracle DB locally',
                'hours_logged'=> 40,
            ]);
        $response->assertStatus(200);
        $this->assertEquals('SUBMITTED', $response->json('report.status'));

        // 6. Attempting to add an attachment to a SUBMITTED report should fail
        Storage::fake('local');
        $file = UploadedFile::fake()->create('week1_report.pdf', 500, 'application/pdf');
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/reports/' . $report->report_id . '/attachments', [
                'file' => $file,
            ]);
        $response->assertStatus(400);

        // 7. Company requests revision
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->postJson('/api/reports/' . $report->report_id . '/review', [
                'decision' => 'REVISION_REQUESTED',
                'comments' => 'Please elaborate on the challenges faced.',
            ]);
        $response->assertStatus(200);
        $this->assertEquals('REVISION_REQUESTED', $response->json('review.decision'));

        // 8. Student resubmits after revision
        $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->putJson('/api/reports/' . $report->report_id, [
                'status'      => 'SUBMITTED',
                'activities'  => 'Completed task 1 and resolved DB issue',
                'challenges'  => 'Oracle listener configuration required TNS adjustment',
                'hours_logged'=> 42,
            ])->assertStatus(200);

        // 9. Company approves
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->postJson('/api/reports/' . $report->report_id . '/review', [
                'decision' => 'APPROVED',
                'comments' => 'Well done, thorough report.',
            ]);
        $response->assertStatus(200);

        // 10. Verify DB state
        $report->refresh();
        $this->assertEquals('APPROVED', $report->status);
        $this->assertEquals(1, $report->revision_count);
        $this->assertNotNull($report->approved_at);

        // 11. Verify report reviews audit trail (2 reviews: REVISION_REQUESTED + APPROVED)
        $reviews = ReportReview::where('report_id', $report->report_id)->get();
        $this->assertCount(2, $reviews);
    }
}
