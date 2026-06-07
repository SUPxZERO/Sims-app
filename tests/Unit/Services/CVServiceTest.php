<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\CVService;
use App\Models\User;
use App\Models\CV;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvSkill;
use App\Models\Skill;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class CVServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected $cvService;
    protected $user;
    protected $cv;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->cvService = app(CVService::class);

        $this->user = User::create([
            'email' => 'student@test.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $this->cv = CV::create([
            'user_id' => $this->user->user_id,
            'status' => 'INCOMPLETE',
            'visibility' => 'PRIVATE',
        ]);
    }

    /**
     * @test
     * Test CV creation for new user
     */
    public function test_cv_is_created_for_new_user()
    {
        $newUser = User::create([
            'email' => 'newstudent@test.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'New Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $cv = $this->cvService->getOrCreateCVForUser($newUser->user_id);

        $this->assertNotNull($cv->cv_id);
        $this->assertEquals('INCOMPLETE', $cv->status);
        $this->assertEquals('PRIVATE', $cv->visibility);
    }

    /**
     * @test
     * Test adding education record
     */
    public function test_add_education_to_cv()
    {
        $education = $this->cvService->addEducation($this->cv->cv_id, [
            'institution_name' => 'Technology University',
            'degree_level' => 'Bachelor',
            'field_of_study' => 'Computer Science',
            'start_date' => '2020-01-15',
            'end_date' => '2024-06-15',
            'gpa' => 3.85,
        ]);

        $this->assertNotNull($education->education_id);
        $this->assertEquals('Technology University', $education->institution_name);
        $this->assertDatabaseHas('cv_educations', [
            'cv_id' => $this->cv->cv_id,
            'institution_name' => 'Technology University',
        ]);
    }

    /**
     * @test
     * Test adding work experience
     */
    public function test_add_work_experience_to_cv()
    {
        $experience = $this->cvService->addExperience($this->cv->cv_id, [
            'company_name' => 'Tech Corp',
            'job_title' => 'Junior Developer',
            'employment_type' => 'INTERNSHIP',
            'start_date' => '2023-06-01',
            'end_date' => '2023-08-31',
            'description' => 'Developed web features using PHP and React',
        ]);

        $this->assertNotNull($experience->experience_id);
        $this->assertEquals('Tech Corp', $experience->company_name);
        $this->assertEquals('Junior Developer', $experience->job_title);
    }

    /**
     * @test
     * Test syncing skills to CV
     */
    public function test_sync_skills_to_cv()
    {
        $php = Skill::create(['skill_name' => 'PHP', 'category' => 'Language']);
        $react = Skill::create(['skill_name' => 'React', 'category' => 'Framework']);

        $this->cvService->syncSkills($this->cv->cv_id, [
            ['skill_id' => $php->skill_id, 'proficiency_level' => 'ADVANCED'],
            ['skill_id' => $react->skill_id, 'proficiency_level' => 'INTERMEDIATE'],
        ]);

        $this->assertDatabaseHas('cv_skills', [
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $php->skill_id,
            'proficiency_level' => 'ADVANCED',
        ]);

        $this->assertDatabaseHas('cv_skills', [
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $react->skill_id,
            'proficiency_level' => 'INTERMEDIATE',
        ]);
    }

    /**
     * @test
     * BR-05: Test CV completeness calculation
     */
    public function test_cv_completeness_status()
    {
        // Empty CV should be INCOMPLETE
        $this->assertEquals('INCOMPLETE', $this->cvService->checkCVCompleteness($this->cv->cv_id));

        // Add personal summary
        $this->cvService->updatePersonalSummary($this->cv->cv_id, 'I am a passionate developer');

        // Add education
        $this->cvService->addEducation($this->cv->cv_id, [
            'institution_name' => 'University',
            'degree_level' => 'Bachelor',
            'field_of_study' => 'CS',
            'start_date' => '2020-01-01',
            'end_date' => '2024-06-15',
        ]);

        // Add experience
        $this->cvService->addExperience($this->cv->cv_id, [
            'company_name' => 'Company',
            'job_title' => 'Developer',
            'employment_type' => 'FULLTIME',
            'start_date' => '2023-06-01',
            'end_date' => '2023-08-31',
        ]);

        // Add at least 3 skills
        for ($i = 0; $i < 3; $i++) {
            $skill = Skill::create(['skill_name' => "Skill $i", 'category' => 'Tech']);
            CvSkill::create([
                'cv_id' => $this->cv->cv_id,
                'skill_id' => $skill->skill_id,
                'proficiency_level' => 'INTERMEDIATE',
            ]);
        }

        // Now should be COMPLETE
        $this->cv->refresh();
        $status = $this->cvService->checkCVCompleteness($this->cv->cv_id);
        $this->assertEquals('COMPLETE', $status);
    }

    /**
     * @test
     * Test CV visibility toggle
     */
    public function test_update_cv_visibility()
    {
        $this->cvService->updateVisibility($this->cv->cv_id, 'PUBLIC');

        $this->cv->refresh();
        $this->assertEquals('PUBLIC', $this->cv->visibility);
    }

    /**
     * @test
     * Test CV creation version history
     */
    public function test_cv_version_history()
    {
        // Get current version
        $version1 = $this->cvService->getCurrentCVVersion($this->cv->cv_id);

        // Make significant update
        $this->cvService->updatePersonalSummary($this->cv->cv_id, 'New summary');

        // Check version incremented
        $version2 = $this->cvService->getCurrentCVVersion($this->cv->cv_id);
        $this->assertGreaterThan($version1, $version2);
    }

    /**
     * @test
     * Test CV cannot be updated if user is not owner
     */
    public function test_cv_authorization_check()
    {
        $otherUser = User::create([
            'email' => 'other@test.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Other Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $this->expectException(\Illuminate\Auth\AuthorizationException::class);

        $this->cvService->updateVisibility($this->cv->cv_id, 'PUBLIC');
        // Should fail authorization since user is different
    }

    /**
     * @test
     * Test removing education from CV
     */
    public function test_delete_education_from_cv()
    {
        $education = $this->cvService->addEducation($this->cv->cv_id, [
            'institution_name' => 'University',
            'degree_level' => 'Bachelor',
            'field_of_study' => 'CS',
            'start_date' => '2020-01-01',
            'end_date' => '2024-06-15',
        ]);

        $this->cvService->deleteEducation($education->education_id);

        $this->assertDatabaseMissing('cv_educations', [
            'education_id' => $education->education_id,
        ]);
    }

    /**
     * @test
     * Test removing experience from CV
     */
    public function test_delete_experience_from_cv()
    {
        $experience = $this->cvService->addExperience($this->cv->cv_id, [
            'company_name' => 'Company',
            'job_title' => 'Developer',
            'employment_type' => 'INTERNSHIP',
            'start_date' => '2023-06-01',
            'end_date' => '2023-08-31',
        ]);

        $this->cvService->deleteExperience($experience->experience_id);

        $this->assertDatabaseMissing('cv_experiences', [
            'experience_id' => $experience->experience_id,
        ]);
    }
}
