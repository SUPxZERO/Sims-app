<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ApplicationService;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CV;
use App\Models\InternshipListing;
use App\Models\Skill;
use App\Models\CvSkill;
use App\Models\Application;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class ApplicationServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected $applicationService;
    protected $studentUser;
    protected $studentProfile;
    protected $companyUser;
    protected $listing;
    protected $cv;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->applicationService = app(ApplicationService::class);

        // Create a student user
        $this->studentUser = User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        // Create student profile
        $this->studentProfile = StudentProfile::create([
            'user_id' => $this->studentUser->user_id,
            'student_id_number' => 'STU001',
            'department' => 'Computer Science',
            'enrollment_year' => 2024,
            'gpa' => 3.85,
        ]);

        // Create CV
        $this->cv = CV::create([
            'user_id' => $this->studentUser->user_id,
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
        ]);

        // Create company and listing
        $this->companyUser = User::create([
            'email' => 'company@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Company',
            'role' => 'COMPANY',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        $this->listing = InternshipListing::create([
            'company_user_id' => $this->companyUser->user_id,
            'title' => 'Software Developer',
            'description' => 'Develop web applications',
            'location' => 'Kuala Lumpur',
            'work_mode' => 'HYBRID',
            'duration_weeks' => 12,
            'quota' => 5,
            'filled_count' => 0,
            'status' => 'PUBLISHED',
            'application_deadline' => Carbon::now()->addMonths(2),
            'min_gpa' => 3.0,
        ]);
    }

    /**
     * @test
     * BR-11: Test that student cannot exceed 3 active applications
     */
    public function test_student_cannot_exceed_max_active_applications()
    {
        // Create 3 active applications
        for ($i = 0; $i < 3; $i++) {
            $listing = InternshipListing::create([
                'company_user_id' => $this->companyUser->user_id,
                'title' => "Position $i",
                'description' => 'Test position',
                'location' => 'KL',
                'work_mode' => 'ONSITE',
                'duration_weeks' => 12,
                'quota' => 5,
                'filled_count' => 0,
                'status' => 'PUBLISHED',
                'application_deadline' => Carbon::now()->addMonths(2),
            ]);

            Application::create([
                'user_id' => $this->studentUser->user_id,
                'listing_id' => $listing->listing_id,
                'cv_version_id' => $this->cv->cv_id,
                'status' => 'SUBMITTED',
                'submitted_at' => Carbon::now(),
            ]);
        }

        // Fourth application should fail
        $this->expectException(ValidationException::class);
        
        $this->applicationService->submitApplication(
            $this->studentUser->user_id,
            $this->listing->listing_id,
            'Cover letter'
        );
    }

    /**
     * @test
     * BR-05: Test that student must have COMPLETE CV to apply
     */
    public function test_student_with_incomplete_cv_cannot_apply()
    {
        // Mark CV as incomplete
        $this->cv->update(['status' => 'INCOMPLETE']);

        $this->expectException(ValidationException::class);
        
        $this->applicationService->submitApplication(
            $this->studentUser->user_id,
            $this->listing->listing_id,
            'Cover letter'
        );
    }

    /**
     * @test
     * Test that student can successfully apply to a listing
     */
    public function test_student_can_successfully_apply()
    {
        $application = $this->applicationService->submitApplication(
            $this->studentUser->user_id,
            $this->listing->listing_id,
            'I am interested in this position'
        );

        $this->assertNotNull($application->application_id);
        $this->assertEquals('SUBMITTED', $application->status);
        $this->assertDatabaseHas('applications', [
            'application_id' => $application->application_id,
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $this->listing->listing_id,
            'status' => 'SUBMITTED',
        ]);
    }

    /**
     * @test
     * Test that recommendation score is calculated on application
     */
    public function test_recommendation_score_is_calculated_on_application()
    {
        // Add skill to CV
        $skill = Skill::create([
            'skill_name' => 'PHP',
            'category' => 'Programming Language',
        ]);

        CvSkill::create([
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $skill->skill_id,
            'proficiency_level' => 'ADVANCED',
        ]);

        $application = $this->applicationService->submitApplication(
            $this->studentUser->user_id,
            $this->listing->listing_id,
            'Cover letter'
        );

        $this->assertNotNull($application->match_score_at_apply);
        $this->assertGreaterThanOrEqual(0, $application->match_score_at_apply);
        $this->assertLessThanOrEqual(100, $application->match_score_at_apply);
    }

    /**
     * @test
     * Test application status cannot be updated to invalid status
     */
    public function test_application_status_update_validates_valid_statuses()
    {
        $application = Application::create([
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $this->listing->listing_id,
            'cv_version_id' => $this->cv->cv_id,
            'status' => 'SUBMITTED',
            'submitted_at' => Carbon::now(),
        ]);

        $this->expectException(ValidationException::class);
        
        $this->applicationService->updateApplicationStatus(
            $application->application_id,
            'INVALID_STATUS'
        );
    }

    /**
     * @test
     * BR-12: Test that when application is confirmed, internship record is created
     */
    public function test_confirming_application_creates_internship()
    {
        $application = Application::create([
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $this->listing->listing_id,
            'cv_version_id' => $this->cv->cv_id,
            'status' => 'ACCEPTED',
            'match_score_at_apply' => 85.5,
            'submitted_at' => Carbon::now(),
        ]);

        // Confirm the application (simulate final status)
        $this->applicationService->confirmApplication($application->application_id);

        // Verify internship was created
        $this->assertDatabaseHas('internships', [
            'application_id' => $application->application_id,
        ]);
    }

    /**
     * @test
     * BR-13: Test auto-withdraw logic when student confirms one placement
     */
    public function test_auto_withdraw_other_applications_on_confirmation()
    {
        // Create 2 active applications
        $listing2 = InternshipListing::create([
            'company_user_id' => $this->companyUser->user_id,
            'title' => 'Another Position',
            'description' => 'Test position',
            'location' => 'KL',
            'work_mode' => 'REMOTE',
            'duration_weeks' => 12,
            'quota' => 5,
            'filled_count' => 0,
            'status' => 'PUBLISHED',
            'application_deadline' => Carbon::now()->addMonths(2),
        ]);

        $app1 = Application::create([
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $this->listing->listing_id,
            'cv_version_id' => $this->cv->cv_id,
            'status' => 'ACCEPTED',
            'match_score_at_apply' => 85.5,
            'submitted_at' => Carbon::now(),
        ]);

        $app2 = Application::create([
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $listing2->listing_id,
            'cv_version_id' => $this->cv->cv_id,
            'status' => 'ACCEPTED',
            'match_score_at_apply' => 75.0,
            'submitted_at' => Carbon::now(),
        ]);

        // Confirm first application
        $this->applicationService->confirmApplication($app1->application_id);

        // Verify second application is auto-withdrawn
        $app2->refresh();
        $this->assertEquals('AUTO_WITHDRAWN', $app2->status);
    }
}
