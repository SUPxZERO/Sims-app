<?php

namespace Database\Factories;

use App\Models\CvVersion;
use App\Models\Cv;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvVersionFactory extends Factory
{
    protected $model = CvVersion::class;

    public function definition(): array
    {
        return [
            'cv_id' => Cv::factory(),
            'version_number' => 1,
            'snapshot_data' => [
                'personal_summary' => fake()->paragraph(),
                'educations' => [],
                'experiences' => [],
                'skills' => []
            ],
        ];
    }
}
