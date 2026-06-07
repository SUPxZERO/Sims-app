<?php

namespace Database\Factories;

use App\Models\EvaluationCriteriaScore;
use App\Models\CompanyEvaluation;
use App\Models\EvaluationCriteria;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvaluationCriteriaScoreFactory extends Factory
{
    protected $model = EvaluationCriteriaScore::class;

    public function definition(): array
    {
        return [
            'evaluation_id' => CompanyEvaluation::factory(),
            'criteria_id' => EvaluationCriteria::inRandomOrder()->first()?->criteria_id ?? 1,
            'score' => fake()->randomFloat(2, 70, 100),
        ];
    }
}
