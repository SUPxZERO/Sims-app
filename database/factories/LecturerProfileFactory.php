<?php

namespace Database\Factories;

use App\Models\LecturerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LecturerProfileFactory extends Factory
{
    protected $model = LecturerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->lecturer(),
            'staff_id_number' => 'LEC_' . fake()->unique()->numerify('#####'),
            'department' => fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cybersecurity']),
            'faculty' => 'Faculty of Computing',
            'specialization' => fake()->jobTitle(),
            'max_supervision_load' => fake()->numberBetween(5, 15),
            'phone_number' => fake()->phoneNumber(),
            'office_location' => 'Room ' . fake()->numerify('###'),
        ];
    }
}
