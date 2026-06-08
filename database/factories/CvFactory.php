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
            'personal_summary' => fake()->randomElement([
                "A highly motivated computer science student with a passion for software engineering. Skilled in Python, Java, and JavaScript. Looking for an internship to apply my academic knowledge to real-world challenges.",
                "Detail-oriented data science student with experience in data visualization and statistical analysis. Proficient in Python, R, and SQL. Seeking opportunities to work on impactful data-driven projects.",
                "Creative and driven software engineering major focusing on frontend development. Experienced with React, Tailwind CSS, and TypeScript. Eager to contribute to a dynamic engineering team.",
                "Dedicated cybersecurity student with hands-on experience in network security and ethical hacking. Seeking an internship to develop my skills in securing modern web applications and infrastructure."
            ]),
            'status' => 'COMPLETE',
            'visibility' => 'PUBLIC',
            'current_version' => 1,
        ];
    }
}
