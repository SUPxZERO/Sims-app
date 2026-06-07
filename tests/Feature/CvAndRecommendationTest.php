<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\Skill;
use App\Models\InternshipListing;
use App\Models\Cv;
use App\Models\RecommendationScore;
use App\Helpers\JwtHelper;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CvAndRecommendationTest extends TestCase
{
    use DatabaseTransactions;

    protected $studentUser;
    protected $studentToken;
    protected $companyUser;
    protected $companyToken;
    protected $coordinatorUser;
    protected $coordinatorToken;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create a Student User and Profile
        $this->studentUser = User::create([
            'email' => 'student.test@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'John Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        StudentProfile::create([
            'user_id' => $this->studentUser->user_id,
            'student_id_number' => 'STD12345',
            'department' => 'COMPUTER_SCIENCE',
            'enrollment_year' => 2024,
            'gpa' => 3.85,
        ]);

        $this->studentToken = JwtHelper::generateToken([
            'sub' => $this->studentUser->user_id,
            'role' => 'STUDENT',
            'email' => $this->studentUser->email,
            'type' => 'access'
        ], 60);

        // 2. Create a Company User and Profile
        $this->companyUser = User::create([
            'email' => 'company.test@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Company Manager',
            'role' => 'COMPANY',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        $companyProfile = CompanyProfile::create([
            'user_id' => $this->companyUser->user_id,
            'company_name' => 'TechCorp',
            'industry_sector' => 'Software Development',
            'company_address' => '123 Tech Lane',
            'company_city' => 'Silicon City',
        ]);

        $this->companyToken = JwtHelper::generateToken([
            'sub' => $this->companyUser->user_id,
            'role' => 'COMPANY',
            'email' => $this->companyUser->email,
            'type' => 'access'
        ], 60);

        // 3. Create a Coordinator User
        $this->coordinatorUser = User::create([
            'email' => 'coord.test@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Coordinator User',
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        $this->coordinatorToken = JwtHelper::generateToken([
            'sub' => $this->coordinatorUser->user_id,
            'role' => 'ADMIN',
            'email' => $this->coordinatorUser->email,
            'type' => 'access'
        ], 60);
    }

    /**
     * Test show, update personal summary, update visibility endpoints for CV
     */
    public function test_cv_basic_crud_and_version_snapshots()
    {
        // Get CV (creates CV automatically)
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->getJson('/api/cv');

        $response->assertStatus(200);
        $this->assertEquals('John Student', $this->studentUser->full_name);
        
        $cvId = $response->json('cv_id');
        $this->assertNotNull($cvId);
        $this->assertEquals(1, $response->json('current_version'));

        // Update Personal Summary
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/personal-summary', [
                'personal_summary' => 'Experienced computer science student.'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('Experienced computer science student.', $response->json('personal_summary'));
        $this->assertEquals(2, $response->json('current_version'));

        // Check that a snapshot was created
        $this->assertDatabaseHas('cv_versions', [
            'cv_id' => $cvId,
            'version_number' => 2
        ]);

        // Update Visibility
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/visibility', [
                'visibility' => 'PUBLIC'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('PUBLIC', $response->json('visibility'));
        $this->assertEquals(3, $response->json('current_version'));
    }

    /**
     * Test adding, updating, and deleting educations and experiences
     */
    public function test_cv_educations_and_experiences()
    {
        // 1. Add Education
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/educations', [
                'institution_name' => 'State University',
                'degree' => 'Bachelor of Science',
                'field_of_study' => 'Computer Science',
                'start_date' => '2020-09-01',
                'end_date' => '2024-06-01',
                'gpa' => 3.90,
                'description' => 'Honors program',
                'sort_order' => 1
            ]);

        $response->assertStatus(201);
        $eduId = $response->json('cv_education_id');
        $this->assertNotNull($eduId);

        // Verify CV version incremented
        $cv = Cv::where('user_id', $this->studentUser->user_id)->first();
        $this->assertEquals(2, $cv->current_version);

        // 2. Update Education
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->putJson('/api/cv/educations/' . $eduId, [
                'gpa' => 3.95
            ]);

        $response->assertStatus(200);
        $this->assertEquals(3.95, $response->json('gpa'));
        $this->assertEquals(3, $cv->fresh()->current_version);

        // 3. Add Experience
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/experiences', [
                'company_name' => 'Web Agency',
                'position_title' => 'Frontend Intern',
                'start_date' => '2023-06-01',
                'end_date' => '2023-09-01',
                'description' => 'Developed cool react apps',
                'sort_order' => 1
            ]);

        $response->assertStatus(201);
        $expId = $response->json('cv_experience_id');
        $this->assertNotNull($expId);
        $this->assertEquals(4, $cv->fresh()->current_version);

        // 4. Delete Education and Experience
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->deleteJson('/api/cv/educations/' . $eduId);
        $response->assertStatus(200);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->deleteJson('/api/cv/experiences/' . $expId);
        $response->assertStatus(200);

        $this->assertEquals(6, $cv->fresh()->current_version);
    }

    /**
     * Test CV Skills syncing
     */
    public function test_cv_skills_sync()
    {
        // Let's find some seeded skills
        $skills = Skill::limit(2)->get();
        if ($skills->isEmpty()) {
            // Seed a dummy skill if empty
            $skills = collect([Skill::create([
                'skill_category_id' => 1,
                'name' => 'PHP Development',
                'description' => 'Writing backend php services'
            ])]);
        }

        $skillsPayload = $skills->map(function ($s) {
            return [
                'skill_id' => $s->skill_id,
                'proficiency_level' => 'INTERMEDIATE'
            ];
        })->toArray();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/skills', [
                'skills' => $skillsPayload
            ]);

        $response->assertStatus(200);

        // Verify that relations exist
        $cv = Cv::where('user_id', $this->studentUser->user_id)->first();
        $this->assertNotEmpty($cv->skills);
        $this->assertEquals(0.66, $cv->skills->first()->pivot->proficiency_weight);
    }

    /**
     * Test CV Documents uploading and deletion
     */
    public function test_cv_documents()
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('resume.pdf', 500, 'application/pdf');

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/cv/documents', [
                'file' => $file,
                'document_label' => 'Primary Resume'
            ]);

        $response->assertStatus(201);
        $docId = $response->json('cv_document_id');
        $this->assertNotNull($docId);

        // Check storage
        Storage::disk('local')->assertExists($response->json('file_path'));

        // Delete document
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->deleteJson('/api/cv/documents/' . $docId);
        $response->assertStatus(200);
    }

    /**
     * Test recommendation engine fetching and recalculation
     */
    public function test_recommendations()
    {
        // 1. Create an internship listing for the company
        $listing = InternshipListing::create([
            'company_user_id' => $this->companyUser->user_id,
            'title' => 'Software Engineer Intern',
            'description' => 'Develop clean Laravel and Oracle apps.',
            'location' => 'Silicon Valley',
            'work_mode' => 'HYBRID',
            'duration_weeks' => 12,
            'quota' => 3,
            'application_deadline' => Carbon::now()->addDays(30),
            'status' => 'PUBLISHED',
            'preferred_departments' => 'COMPUTER_SCIENCE,INFORMATION_TECHNOLOGY'
        ]);

        // 2. Build CV with skills for the student
        $cv = Cv::create([
            'user_id' => $this->studentUser->user_id,
            'personal_summary' => 'Talented coder.',
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
            'current_version' => 1
        ]);

        // Find a skill and attach to student and listing
        $skill = Skill::first();
        if ($skill) {
            $cv->skills()->attach($skill->skill_id, [
                'proficiency_level' => 'ADVANCED',
                'proficiency_weight' => 1.00
            ]);

            DB::table('listing_required_skills')->insert([
                'listing_id' => $listing->listing_id,
                'skill_id' => $skill->skill_id,
                'importance' => 'REQUIRED',
                'importance_weight' => 1.00,
            ]);
        }

        // 3. Recalculate student recommendations via endpoint
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->postJson('/api/recommendations/my/recalculate');

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'data']);

        // Assert database has recommendation scores
        $this->assertDatabaseHas('recommendation_scores', [
            'user_id' => $this->studentUser->user_id,
            'listing_id' => $listing->listing_id
        ]);

        // 4. Retrieve recommendations for student
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->studentToken)
            ->getJson('/api/recommendations/my');

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json());
        $this->assertEquals($listing->listing_id, $response->json('0.listing_id'));

        // 5. Retrieve ranked student matches for the listing
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->getJson('/api/recommendations/listings/' . $listing->listing_id);

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json());
        $this->assertEquals($this->studentUser->user_id, $response->json('0.user_id'));

        // 6. Recalculate recommendations for listing
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->companyToken)
            ->postJson('/api/recommendations/listings/' . $listing->listing_id . '/recalculate');

        $response->assertStatus(200);

        // 7. Global recalculate
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->coordinatorToken)
            ->postJson('/api/recommendations/recalculate-all');

        $response->assertStatus(200);
    }
}
