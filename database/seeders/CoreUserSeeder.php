<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\CompanyProfile;
use App\Models\LecturerProfile;
use Illuminate\Support\Facades\Hash;

class CoreUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // 1. Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@suims.edu'],
            [
                'full_name' => 'System Administrator',
                'password_hash' => $password,
                'role' => 'ADMIN',
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
            ]
        );

        // 2. Demo Base Users (for easy login)
        $this->createDemoUser('student@suims.edu', 'STUDENT', 'Demo Student', $password);
        $demoCompany = $this->createDemoUser('company@suims.edu', 'COMPANY', 'Demo Company', $password);
        $this->createDemoUser('lecturer@suims.edu', 'LECTURER', 'Demo Lecturer', $password);
        
        // Ensure Demo Company is verified
        $demoCompanyProfile = $demoCompany->companyProfile;
        if ($demoCompanyProfile) {
            $demoCompanyProfile->update(['is_verified' => 1, 'verified_by' => $admin->user_id]);
        }

        // 3. Generate Bulk Users using Factories
        // 10 Companies
        User::factory()->count(10)->company()->create()->each(function ($user) use ($admin) {
            CompanyProfile::factory()->create([
                'user_id' => $user->user_id,
                'verified_by' => $admin->user_id,
                'is_verified' => 1,
            ]);
        });

        // 15 Lecturers
        User::factory()->count(15)->lecturer()->create()->each(function ($user) {
            LecturerProfile::factory()->create(['user_id' => $user->user_id]);
        });

        // 50 Students
        User::factory()->count(50)->student()->create()->each(function ($user) {
            StudentProfile::factory()->create(['user_id' => $user->user_id]);
        });
    }

    private function createDemoUser(string $email, string $role, string $name, string $password): User
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'full_name' => $name,
                'password_hash' => $password,
                'role' => $role,
                'status' => 'ACTIVE',
                'email_verified_at' => now(),
            ]
        );

        // Create exactly one profile based on role
        if ($role === 'STUDENT' && !$user->studentProfile()->exists()) {
            StudentProfile::factory()->create(['user_id' => $user->user_id]);
        } elseif ($role === 'COMPANY' && !$user->companyProfile()->exists()) {
            CompanyProfile::factory()->create(['user_id' => $user->user_id]);
        } elseif ($role === 'LECTURER' && !$user->lecturerProfile()->exists()) {
            LecturerProfile::factory()->create(['user_id' => $user->user_id]);
        }

        return $user;
    }
}
