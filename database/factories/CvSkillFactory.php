<?php

namespace Database\Factories;

use App\Models\CvSkill;
use App\Models\Cv;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvSkillFactory extends Factory
{
    protected $model = CvSkill::class;

    public function definition(): array
    {
        $level = fake()->randomElement(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);
        $weight = match($level) {
            'BEGINNER' => 0.33,
            'INTERMEDIATE' => 0.66,
            'ADVANCED' => 1.00,
        };
        
        return [
            'cv_id' => Cv::factory(),
            // Assuming skills are already seeded, we just pick one randomly, or the seeder provides it.
            'skill_id' => Skill::inRandomOrder()->first()?->skill_id ?? 1,
            'proficiency_level' => $level,
            'proficiency_weight' => $weight,
        ];
    }
}
