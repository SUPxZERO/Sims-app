<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\User;
use App\Models\InternshipListing;
use App\Models\CvVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->student(),
            'listing_id' => InternshipListing::factory(),
            'cv_version_id' => CvVersion::factory(),
            'cover_letter' => fake()->randomElement([
                "Dear Hiring Manager,\n\nI am writing to express my strong interest in this internship opportunity. With a solid foundation in computer science principles and hands-on experience with modern frameworks, I am eager to contribute to your team. I am a quick learner, highly motivated, and passionate about building scalable solutions.",
                "To the Recruitment Team,\n\nI am excited to apply for this internship role. During my academic career, I have developed several full-stack projects that showcase my ability to work across the stack. I am particularly drawn to your company's innovative approach and would love the opportunity to learn from your experienced engineering team.",
                "Dear Hiring Team,\n\nI would like to submit my application for the internship position. My coursework has provided me with a strong understanding of data structures, algorithms, and software engineering methodologies. I have also completed several personal projects using React and Node.js. I am enthusiastic about the possibility of bringing my technical skills and proactive attitude to your company.",
                "To Whom It May Concern,\n\nI am a highly motivated computer science student looking for an internship where I can apply my theoretical knowledge to real-world problems. I have experience with Python, Java, and SQL, and I am always eager to learn new technologies. I admire your company's products and would be thrilled to contribute to your success."
            ]),
            'match_score_at_apply' => fake()->randomFloat(2, 50, 100),
            'status' => 'SUBMITTED',
            'submitted_at' => now(),
        ];
    }
    
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'CONFIRMED',
            'reviewed_at' => now()->subDays(3),
            'decided_at' => now()->subDays(2),
            'confirmed_at' => now()->subDay(),
        ]);
    }
}
