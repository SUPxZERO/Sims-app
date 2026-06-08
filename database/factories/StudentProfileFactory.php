<?php

namespace Database\Factories;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentProfileFactory extends Factory
{
    protected $model = StudentProfile::class;

    public function definition(): array
    {
        $enrollmentYear = fake()->numberBetween(2021, 2025);
        return [
            // Ensure a user exists if not explicitly passed
            'user_id' => User::factory()->student(),
            'student_id_number' => 'STD_' . fake()->unique()->numerify('#####'),
            'department' => fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cybersecurity']),
            'faculty' => 'Faculty of Computing',
            'enrollment_year' => $enrollmentYear,
            'expected_graduation' => $enrollmentYear + 4,
            'gpa' => fake()->randomFloat(2, 2.0, 4.0),
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'linkedin_url' => 'https://linkedin.com/in/' . fake()->slug(),
            'bio' => fake()->randomElement([
                "I am a passionate software engineering student with a strong interest in backend development and cloud architecture. In my free time, I enjoy participating in hackathons and contributing to open-source projects.",
                "Data Science enthusiast with a solid foundation in mathematics and statistics. I love uncovering patterns in complex datasets and building predictive models using Python.",
                "Aspiring frontend developer who loves creating intuitive and beautiful user interfaces. Experienced with React, Tailwind, and Figma.",
                "Cybersecurity student dedicated to learning about network defense, ethical hacking, and secure coding practices. Always looking for new CTF challenges."
            ]),
        ];
    }
}
