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
        $companies = [
            'TechFlow Innovations', 'CloudSync Systems', 'Nexus Security Partners', 
            'DataSphere Analytics', 'Quantum Mobile Labs', 'Apex Fintech Solutions', 
            'Lumina AI Research', 'CodeWave Studios', 'Pinnacle ERP Solutions'
        ];

        $descriptions = [
            "We are a leading provider of enterprise cloud solutions, helping businesses scale their operations through cutting-edge infrastructure and automated DevOps practices. Our team is passionate about performance and reliability.",
            "A fast-growing fintech startup dedicated to democratizing financial services. We build secure, high-performance mobile trading platforms used by millions of users worldwide.",
            "Specializing in artificial intelligence and machine learning, we develop predictive models and computer vision algorithms that solve real-world problems in the healthcare and logistics sectors.",
            "An award-winning digital agency focused on crafting beautiful, accessible, and highly interactive user experiences for global brands. We merge creative design with robust frontend engineering.",
            "We provide top-tier cybersecurity consulting and software. From penetration testing to building zero-trust architectures, our mission is to secure the digital assets of the Fortune 500."
        ];

        return [
            'user_id' => User::factory()->company(),
            'company_name' => fake()->randomElement($companies) . ' ' . fake()->companySuffix(),
            'industry_sector' => fake()->randomElement(['Technology', 'Fintech', 'Cybersecurity', 'Artificial Intelligence', 'Software Consulting', 'E-commerce']),
            'company_size' => fake()->randomElement(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
            'company_website' => 'https://www.' . fake()->domainName(),
            'company_address' => fake()->streetAddress(),
            'company_city' => fake()->city(),
            'company_description' => fake()->randomElement($descriptions),
            'contact_person_name' => fake()->name(),
            'contact_phone' => fake()->phoneNumber(),
            'is_verified' => 1,
            'verified_at' => now(),
            'verified_by' => 1, // Typically set to an Admin user ID when seeded
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
