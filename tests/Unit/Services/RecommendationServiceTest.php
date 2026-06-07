<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\RecommendationService;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CV;
use App\Models\CvSkill;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\InternshipListing;
use App\Models\ListingRequiredSkill;
use App\Models\RecommendationScore;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;

class RecommendationServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected $recommendationService;
    protected $studentUser;
    protected $cv;
    protected $listing;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->recommendationService = app(RecommendationService::class);

        // Create student user with CV
        $this->studentUser = User::create([
            'email' => 'student@test.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'John Doe',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        StudentProfile::create([
            'user_id' => $this->studentUser->user_id,
            'student_id_number' => 'STU123',
            'department' => 'Computer Science',
            'enrollment_year' => 2024,
            'gpa' => 3.7,
        ]);

        $this->cv = CV::create([
            'user_id' => $this->studentUser->user_id,
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
        ]);

        // Create company and listing
        $companyUser = User::create([
            'email' => 'company@test.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Tech Company',
            'role' => 'COMPANY',
            'status' => 'ACTIVE',
        ]);

        $this->listing = InternshipListing::create([
            'company_user_id' => $companyUser->user_id,
            'title' => 'Software Developer',
            'description' => 'Develop web apps',
            'location' => 'Kuala Lumpur',
            'work_mode' => 'HYBRID',
            'duration_weeks' => 12,
            'quota' => 5,
            'filled_count' => 0,
            'status' => 'PUBLISHED',
            'application_deadline' => Carbon::now()->addMonths(2),
            'min_gpa' => 3.5,
            'preferred_departments' => 'Computer Science,Software Engineering',
        ]);
    }

    /**
     * @test
     * Test skill match score calculation (100% when all required skills present)
     */
    public function test_skill_match_score_with_all_required_skills()
    {
        // Create PHP skill (required)
        $phpSkill = Skill::create([
            'skill_name' => 'PHP',
            'category' => 'Programming Language',
        ]);

        // Add to listing as REQUIRED
        ListingRequiredSkill::create([
            'listing_id' => $this->listing->listing_id,
            'skill_id' => $phpSkill->skill_id,
            'importance_level' => 'REQUIRED',
        ]);

        // Add to student CV as ADVANCED
        CvSkill::create([
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $phpSkill->skill_id,
            'proficiency_level' => 'ADVANCED',
        ]);

        $score = $this->recommendationService->calculateSkillMatchScore(
            $this->cv->cv_id,
            $this->listing->listing_id
        );

        $this->assertEquals(100.0, $score);
    }

    /**
     * @test
     * Test skill match score with partial skill match
     */
    public function test_skill_match_score_with_partial_match()
    {
        // Create 2 skills: PHP (required), MySQL (preferred)
        $phpSkill = Skill::create(['skill_name' => 'PHP', 'category' => 'Language']);
        $mysqlSkill = Skill::create(['skill_name' => 'MySQL', 'category' => 'Database']);

        // Add to listing
        ListingRequiredSkill::create([
            'listing_id' => $this->listing->listing_id,
            'skill_id' => $phpSkill->skill_id,
            'importance_level' => 'REQUIRED',
        ]);
        ListingRequiredSkill::create([
            'listing_id' => $this->listing->listing_id,
            'skill_id' => $mysqlSkill->skill_id,
            'importance_level' => 'PREFERRED',
        ]);

        // Student has PHP (INTERMEDIATE) but not MySQL
        CvSkill::create([
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $phpSkill->skill_id,
            'proficiency_level' => 'INTERMEDIATE',
        ]);

        $score = $this->recommendationService->calculateSkillMatchScore(
            $this->cv->cv_id,
            $this->listing->listing_id
        );

        // Score should be between 33% and 66% (intermediate prof with 1 of 2 skills)
        $this->assertGreaterThan(30, $score);
        $this->assertLessThan(70, $score);
    }

    /**
     * @test
     * Test GPA match score when student meets minimum
     */
    public function test_gpa_match_score_meets_minimum()
    {
        $score = $this->recommendationService->calculateGpaMatchScore(
            3.7, // Student GPA
            3.5  // Minimum requirement
        );

        $this->assertEquals(100.0, $score);
    }

    /**
     * @test
     * Test GPA match score when student does not meet minimum (penalty)
     */
    public function test_gpa_match_score_below_minimum_applies_penalty()
    {
        $score = $this->recommendationService->calculateGpaMatchScore(
            3.0, // Student GPA
            3.5  // Minimum requirement
        );

        // Score should be (3.0 / 3.5) * 100 = 85.71%
        $expected = round((3.0 / 3.5) * 100, 2);
        $this->assertEquals($expected, $score);
    }

    /**
     * @test
     * Test preference match score when student in preferred department
     */
    public function test_preference_match_score_in_preferred_department()
    {
        $score = $this->recommendationService->calculatePreferenceMatchScore(
            'Computer Science',
            'Computer Science,Software Engineering'
        );

        $this->assertEquals(100.0, $score);
    }

    /**
     * @test
     * Test preference match score when student not in preferred department
     */
    public function test_preference_match_score_not_in_preferred_department()
    {
        $score = $this->recommendationService->calculatePreferenceMatchScore(
            'Business',
            'Computer Science,Software Engineering'
        );

        // Should return 25% baseline
        $this->assertEquals(25.0, $score);
    }

    /**
     * @test
     * Test preference match score when no preferences specified
     */
    public function test_preference_match_score_with_no_preferences()
    {
        $score = $this->recommendationService->calculatePreferenceMatchScore(
            'Any Department',
            null
        );

        $this->assertEquals(100.0, $score);
    }

    /**
     * @test
     * Test composite match score aggregation
     */
    public function test_composite_match_score_calculation()
    {
        // Create skill
        $skill = Skill::create(['skill_name' => 'PHP', 'category' => 'Language']);
        
        ListingRequiredSkill::create([
            'listing_id' => $this->listing->listing_id,
            'skill_id' => $skill->skill_id,
            'importance_level' => 'REQUIRED',
        ]);

        CvSkill::create([
            'cv_id' => $this->cv->cv_id,
            'skill_id' => $skill->skill_id,
            'proficiency_level' => 'ADVANCED',
        ]);

        $compositeScore = $this->recommendationService->calculateCompositeMatchScore(
            $this->studentUser->user_id,
            $this->listing->listing_id
        );

        // Score should be between 0 and 100
        $this->assertGreaterThanOrEqual(0, $compositeScore);
        $this->assertLessThanOrEqual(100, $compositeScore);

        // Verify it's stored in database
        $this->assertDatabaseHas('recommendation_scores', [
            'student_user_id' => $this->studentUser->user_id,
            'listing_id' => $this->listing->listing_id,
            'composite_score' => $compositeScore,
        ]);
    }

    /**
     * @test
     * Test that scores below threshold are filtered
     */
    public function test_recommendation_threshold_filtering()
    {
        // Get config
        $config = app('matching_config');
        $threshold = $config['min_score_threshold'] ?? 40;

        $scores = $this->recommendationService->getRecommendationsForStudent(
            $this->studentUser->user_id,
            $threshold
        );

        // All returned scores should meet threshold
        foreach ($scores as $score) {
            $this->assertGreaterThanOrEqual($threshold, $score->composite_score);
        }
    }
}
