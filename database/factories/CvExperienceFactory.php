<?php

namespace Database\Factories;

use App\Models\CvExperience;
use App\Models\Cv;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvExperienceFactory extends Factory
{
    protected $model = CvExperience::class;

    public function definition(): array
    {
        $startYear = fake()->numberBetween(2021, 2023);
        $startMonth = str_pad(fake()->numberBetween(1, 12), 2, '0', STR_PAD_LEFT);
        
        return [
            'cv_id' => Cv::factory(),
            'company_name' => fake()->company(),
            'position_title' => fake()->jobTitle(),
            'start_date' => "$startYear-$startMonth-01",
            'end_date' => null, // Present
            'description' => fake()->paragraph(),
            'sort_order' => 1,
        ];
    }
}
