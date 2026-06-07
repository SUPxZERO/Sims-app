<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\Skill;
use App\Models\InternshipListing;
use App\Models\Cv;
use App\Models\Application;
use App\Models\Internship;
use App\Helpers\JwtHelper;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ListingAndApplicationTest extends TestCase
{
    use DatabaseTransactions;

    protected $studentUser;
    protected $studentToken;
    protected $companyUser;
    protected $companyToken;
    protected $adminUser;
    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create a Student User and Profile
        $this->studentUser = User::create([
            'email' => 'student.app@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'John Applicant',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        StudentProfile::create([
            'user_id' => $this->studentUser->user_id,
            'student_id_number' => 'STD98765',
            'department' => 'COMPUTER_SCIENCE',
            'enrollment_year' => 2024,
            'gpa' => 3.95,
        ]);

        $this->studentToken = JwtHelper::generateToken([
            'sub' => $this->studentUser->user_id,
            'role' => 'STUDENT',
            'email' => $this->studentUser->email,
            'type' => 'access'
        ], 60);

        // Complete Student CV
        $cv = Cv::create([
            'user_id' => $this->studentUser->user_id,
            'personal_summary' => 'Ready to work',
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
            'current_version' => 1,
        ]);

        \App\Models\CvVersion::create([
            'cv_id' => $cv->cv_id,
            'version_number' => 1,
            'snapshot_data' => '{}',
        ]);

        // 2. Create a Company User and Profile
        $this->companyUser = User::create([
            'email' => 'company.app@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Company Recruiter',
            'role' => 'COMPANY',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        CompanyProfile::create([
            'user_id' => $this->companyUser->user_id,
            'company_name' => 'Global Tech',
            'industry_sector' => 'Technology',
            'company_address' => '123 Market St',
            'company_city' => 'Metropolis',
        ]);

        $this->companyToken = JwtHelper::generateToken([
            'sub' => $this->companyUser->user_id,
            'role' => 'COMPANY',
            'email' => $this->companyUser->email,
            'type' => 'access'
        ], 60);

        // 3. Create an Admin User
        $this->adminUser = User::create([
            'email' => 'admin.app@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'System Admin',
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        $this->adminToken = JwtHelper::generateToken([
            'sub' => $this->adminUser->user_id,
            'role' => 'ADMIN',
            'email' => $this->adminUser->email,
            'type' => 'access'
        ], 60);
    }

    public function test_listing_and_application_workflow()
    {
        // 1. Company creates a listing
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->postJson('/api/listings', [
                'title' => 'Backend Developer Intern',
                'description' => 'Work with PHP and Oracle.',
                'location' => 'Metropolis',
                'work_mode' => 'REMOTE',
                'duration_weeks' => 10,
                'quota' => 2,
                'application_deadline' => Carbon::now()->addDays(14)->format('Y-m-d'),
            ]);

        if ($response->status() !== 201) {
            dump($response->json());
        }
        $response->assertStatus(201);
        $listingId = $response->json('listing.listing_id');
        $this->assertNotNull($listingId);
        $this->assertEquals('PENDING_APPROVAL', $response->json('listing.status'));

        // 2. Admin approves the listing
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->adminToken)
            ->patchJson('/api/listings/' . $listingId . '/review', [
                'status' => 'PUBLISHED',
                'feedback' => 'Looks good to go.'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('PUBLISHED', $response->json('listing.status'));
        $this->assertNotNull($response->json('listing.published_at'));

        // 3. Student applies to the approved listing
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/listings/' . $listingId . '/apply', [
                'listing_id' => $listingId,
                'cover_letter' => 'I am very interested in this role.'
            ]);

        if ($response->status() !== 201) {
            dump($response->json());
        }
        $response->assertStatus(201);
        $applicationId = $response->json('application.application_id');
        $this->assertNotNull($applicationId);
        $this->assertEquals('SUBMITTED', $response->json('application.status'));

        // 4. Company accepts the application
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->patchJson('/api/applications/' . $applicationId . '/status', [
                'status' => 'ACCEPTED'
            ]);

        dump('Accept Response:', $response->json());
        $response->assertStatus(200);
        $this->assertEquals('ACCEPTED', $response->json('application.status'));

        // 5. Student confirms the application (or company confirms placement)
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->patchJson('/api/applications/' . $applicationId . '/status', [
                'status' => 'CONFIRMED'
            ]);

        dump('Confirm Response:', $response->json());
        $response->assertStatus(200);
        $this->assertEquals('CONFIRMED', $response->json('application.status'));

        // Verify that Internship record was created
        $this->assertDatabaseHas('internships', [
            'application_id' => $applicationId,
            'student_user_id' => $this->studentUser->user_id,
            'company_user_id' => $this->companyUser->user_id,
            'status' => 'ACTIVE'
        ]);

        // Verify listing filled_count incremented
        $this->assertDatabaseHas('internship_listings', [
            'listing_id' => $listingId,
            'filled_count' => 1
        ]);
    }
}
