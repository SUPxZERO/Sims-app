<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\CompanyProfile;
use App\Models\StudentProfile;
use App\Models\LecturerProfile;
use App\Models\InternshipListing;
use App\Models\Application;
use App\Models\Internship;
use App\Models\WeeklyReport;
use App\Models\CompanyEvaluation;
use App\Models\LecturerGrade;
use App\Models\FinalScore;
use App\Models\Cv;
use App\Models\CvVersion;
use Illuminate\Support\Facades\Hash;

class EvaluationAndGradingTest extends TestCase
{
    protected $companyUser;
    protected $studentUser;
    protected $lecturerUser;
    protected $companyToken;
    protected $studentToken;
    protected $lecturerToken;
    protected $testUserIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $ts = time();

        // 1. Create Company
        $this->companyUser = User::create([
            'email'         => "eval_comp_{$ts}@suims.edu",
            'password_hash' => Hash::make('Company@123'),
            'role'          => 'COMPANY',
            'full_name'     => 'Evaluation Corp',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->companyUser->user_id;

        CompanyProfile::create([
            'user_id'         => $this->companyUser->user_id,
            'company_name'    => 'Evaluation Corp',
            'industry_sector' => 'Technology',
            'company_address' => '123 Eval Street',
            'company_city'    => 'Eval City',
        ]);

        // 2. Create Student
        $this->studentUser = User::create([
            'email'         => "eval_stud_{$ts}@suims.edu",
            'password_hash' => Hash::make('Student@123'),
            'role'          => 'STUDENT',
            'full_name'     => 'Evaluation Student',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->studentUser->user_id;

        StudentProfile::create([
            'user_id'           => $this->studentUser->user_id,
            'student_id_number' => "STU_EVAL_{$ts}",
            'department'        => 'Computer Science',
            'enrollment_year'   => 2022,
            'gpa'               => 3.50,
        ]);

        // 3. Create Lecturer
        $this->lecturerUser = User::create([
            'email'         => "eval_lect_{$ts}@suims.edu",
            'password_hash' => Hash::make('Lecturer@123'),
            'role'          => 'LECTURER',
            'full_name'     => 'Evaluation Lecturer',
            'status'        => 'ACTIVE',
        ]);
        $this->testUserIds[] = $this->lecturerUser->user_id;

        LecturerProfile::create([
            'user_id'         => $this->lecturerUser->user_id,
            'staff_id_number' => "LEC_EVAL_{$ts}",
            'department'      => 'Computer Science',
            'office_location' => 'Room 101',
        ]);

        // 4. Obtain tokens via AuthService
        $authService = app('App\Services\AuthService');
        $this->companyToken  = $authService->login("eval_comp_{$ts}@suims.edu", 'Company@123')['access_token'];
        $this->studentToken  = $authService->login("eval_stud_{$ts}@suims.edu", 'Student@123')['access_token'];
        $this->lecturerToken = $authService->login("eval_lect_{$ts}@suims.edu", 'Lecturer@123')['access_token'];
    }

    protected function tearDown(): void
    {
        if (!empty($this->testUserIds)) {
            $internshipIds = Internship::whereIn('student_user_id', $this->testUserIds)
                ->pluck('internship_id')->toArray();

            if (!empty($internshipIds)) {
                FinalScore::whereIn('internship_id', $internshipIds)->delete();
                CompanyEvaluation::whereIn('internship_id', $internshipIds)->delete();
                LecturerGrade::whereIn('internship_id', $internshipIds)->delete();
                WeeklyReport::whereIn('internship_id', $internshipIds)->delete();
                Internship::whereIn('internship_id', $internshipIds)->delete();
            }

            Application::whereIn('user_id', $this->testUserIds)->delete();

            $cvIds = Cv::whereIn('user_id', $this->testUserIds)->pluck('cv_id')->toArray();
            if (!empty($cvIds)) {
                CvVersion::whereIn('cv_id', $cvIds)->delete();
                Cv::whereIn('cv_id', $cvIds)->delete();
            }

            InternshipListing::whereIn('company_user_id', $this->testUserIds)->delete();
            StudentProfile::whereIn('user_id', $this->testUserIds)->delete();
            CompanyProfile::whereIn('user_id', $this->testUserIds)->delete();
            LecturerProfile::whereIn('user_id', $this->testUserIds)->delete();

            foreach ($this->testUserIds as $uid) {
                User::where('user_id', $uid)->delete();
            }
        }
        parent::tearDown();
    }

    public function test_evaluation_and_grading_workflow()
    {
        // 1. Build listing -> cv -> application -> internship
        $listing = InternshipListing::create([
            'company_user_id'      => $this->companyUser->user_id,
            'title'                => 'Eval Software Intern',
            'description'          => 'Internship for eval test',
            'location'             => 'Remote',
            'work_mode'            => 'REMOTE',
            'duration_weeks'       => 12,
            'quota'                => 1,
            'application_deadline' => now()->addDays(30),
            'status'               => 'PUBLISHED',
        ]);

        $cv = Cv::create([
            'user_id'          => $this->studentUser->user_id,
            'personal_summary' => 'Eval student CV',
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
            'cover_letter'   => 'I want to be evaluated.',
            'status'         => 'CONFIRMED',
        ]);

        $internship = Internship::create([
            'application_id'  => $application->application_id,
            'student_user_id' => $this->studentUser->user_id,
            'company_user_id' => $this->companyUser->user_id,
            'lecturer_user_id'=> $this->lecturerUser->user_id,
            'listing_id'      => $listing->listing_id,
            'start_date'      => now()->subMonths(3),
            'end_date'        => now()->subDays(1),
            'status'          => 'COMPLETED',
            'total_weeks'     => 12,
            'confirmed_by'    => $this->studentUser->user_id,
        ]);

        // 2. Company submits evaluation
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->postJson("/api/internships/{$internship->internship_id}/evaluations/company", [
                'composite_score' => 90.5,
                'strengths' => 'Great coding skills.',
                'improvements' => 'Needs to be more vocal.',
                'hiring_recommendation' => 'WOULD_HIRE',
                'status' => 'SUBMITTED',
            ]);

        $response->assertStatus(200)
                 ->assertJsonPath('evaluation.composite_score', 90.5);

        // 3. Lecturer submits grade
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->lecturerToken)
            ->postJson("/api/internships/{$internship->internship_id}/evaluations/lecturer", [
                'report_quality_score' => 85.0,
                'presentation_score' => 80.0,
                'engagement_score' => 90.0,
                'overall_comments' => 'Good overall performance.',
                'status' => 'SUBMITTED',
            ]);

        $response->assertStatus(200);
        $this->assertEqualsWithDelta(85.0, $response->json('grade.composite_score'), 0.01); // (85+80+90)/3 = 85

        // 4. Fetch grade as student — final grading should have been triggered automatically
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->getJson("/api/internships/{$internship->internship_id}/grade");

        $response->assertStatus(200);
        $finalScore = $response->json('final_score');

        // Both evaluations submitted → pkg_grading_engine should have written a final_scores row
        $this->assertNotNull($finalScore, 'Final score was not generated by pkg_grading_engine');
        $this->assertNotNull($finalScore['company_eval_score'], 'Company eval score missing');
        $this->assertNotNull($finalScore['lecturer_grade_score'], 'Lecturer grade score missing');
        // Internship stays COMPLETED — only ACTIVE/COMPLETED/TERMINATED are valid Oracle statuses
        $internship->refresh();
        $this->assertEquals('COMPLETED', $internship->status);
    }
}
