<?php

namespace Database\Factories;

use App\Models\RecommendationScore;
use App\Models\User;
use App\Models\InternshipListing;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecommendationScoreFactory extends Factory
{
    protected $model = RecommendationScore::class;

    public function definition(): array
    {
        $skillScore = fake()->randomFloat(2, 50, 100);
        $gpaScore = fake()->randomFloat(2, 50, 100);
        $prefScore = fake()->randomFloat(2, 50, 100);
        
        $skillWeight = 0.60;
        $gpaWeight = 0.20;
        $prefWeight = 0.20;
        
        $compositeScore = ($skillScore * $skillWeight) + ($gpaScore * $gpaWeight) + ($prefScore * $prefWeight);

        return [
            'user_id' => User::factory()->student(),
            'listing_id' => InternshipListing::factory(),
            'skill_match_score' => $skillScore,
            'gpa_match_score' => $gpaScore,
            'preference_match_score' => $prefScore,
            'composite_score' => $compositeScore,
            'skill_weight_used' => $skillWeight,
            'gpa_weight_used' => $gpaWeight,
            'preference_weight_used' => $prefWeight,
            'matched_skills_count' => fake()->numberBetween(1, 5),
            'total_required_skills' => 5,
            'calculated_at' => now(),
        ];
    }
}
