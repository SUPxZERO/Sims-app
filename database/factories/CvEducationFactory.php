<?php

namespace Database\Factories;

use App\Models\CvEducation;
use App\Models\Cv;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvEducationFactory extends Factory
{
    protected $model = CvEducation::class;

    public function definition(): array
    {
        $startYear = fake()->numberBetween(2018, 2022);
        return [
            'cv_id' => Cv::factory(),
            'institution_name' => fake()->company() . ' University',
            'degree' => fake()->randomElement(['Bachelor of Science', 'Bachelor of Arts', 'Master of Science', 'Diploma']),
            'field_of_study' => fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering']),
            'start_date' => "$startYear-09-01",
            'end_date' => ($startYear + 4) . "-06-30",
            'gpa' => fake()->randomFloat(2, 2.5, 4.0),
            'description' => fake()->sentence(),
            'sort_order' => 1,
        ];
    }
}
