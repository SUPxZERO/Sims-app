<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvFactory extends Factory
{
    protected $model = Cv::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'personal_summary' => fake()->paragraph(),
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
            'current_version' => 1,
        ];
    }
}
