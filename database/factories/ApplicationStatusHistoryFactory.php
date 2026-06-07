<?php

namespace Database\Factories;

use App\Models\ApplicationStatusHistory;
use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationStatusHistoryFactory extends Factory
{
    protected $model = ApplicationStatusHistory::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'from_status' => null,
            'to_status' => 'SUBMITTED',
            'changed_by' => User::factory()->student(), // usually the student who applied
            'change_reason' => null,
            'changed_at' => now(),
        ];
    }
}
