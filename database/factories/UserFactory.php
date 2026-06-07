<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password_hash' => static::$password ??= Hash::make('password'),
            'role' => fake()->randomElement(['STUDENT', 'LECTURER', 'COMPANY']),
            'status' => 'ACTIVE',
            'email_verified_at' => now(),
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => null,
            'profile_photo_path' => null,
        ];
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'STUDENT',
        ]);
    }

    public function lecturer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'LECTURER',
        ]);
    }

    public function company(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'COMPANY',
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'ADMIN',
        ]);
    }
}
