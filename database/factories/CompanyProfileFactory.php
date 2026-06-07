<?php

namespace Database\Factories;

use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyProfileFactory extends Factory
{
    protected $model = CompanyProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->company(),
            'company_name' => fake()->company(),
            'industry_sector' => fake()->randomElement(['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Consulting']),
            'company_size' => fake()->randomElement(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
            'company_website' => fake()->url(),
            'company_address' => fake()->streetAddress(),
            'company_city' => fake()->city(),
            'company_description' => fake()->paragraph(),
            'contact_person_name' => fake()->name(),
            'contact_phone' => fake()->phoneNumber(),
            'is_verified' => 1,
            'verified_at' => now(),
            'verified_by' => null, // Typically set to an Admin user ID when seeded
            'company_logo_path' => null,
        ];
    }
    
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => 0,
            'verified_at' => null,
            'verified_by' => null,
        ]);
    }
}
