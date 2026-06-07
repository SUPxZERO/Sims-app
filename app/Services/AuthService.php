<?php

namespace App\Services;

use App\Models\User;
use App\Helpers\JwtHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class AuthService
{
    /**
     * Register a new user
     */
    public function register(array $data): array
    {
        $user = User::create([
            'email' => $data['email'],
            'password_hash' => Hash::make($data['password']),
            'full_name' => $data['first_name'] . ' ' . $data['last_name'],
            'role' => $data['role'],
            'status' => 'PENDING',
        ]);

        if ($data['role'] === 'STUDENT') {
            \Illuminate\Support\Facades\DB::table('student_profiles')->insert([
                'user_id' => $user->user_id,
                'university_id' => $data['university_id'] ?? 'UNV-' . rand(1000, 9999),
                'major' => 'Undeclared',
                'current_semester' => 1,
            ]);
            // Also initialize empty CV
            \Illuminate\Support\Facades\DB::table('cvs')->insert([
                'user_id' => $user->user_id,
                'status' => 'INCOMPLETE'
            ]);
        } elseif ($data['role'] === 'COMPANY') {
            \Illuminate\Support\Facades\DB::table('company_profiles')->insert([
                'user_id' => $user->user_id,
                'company_name' => $data['company_name'] ?? 'Pending Company',
                'industry' => 'Other',
            ]);
        } elseif ($data['role'] === 'LECTURER') {
            \Illuminate\Support\Facades\DB::table('lecturer_profiles')->insert([
                'user_id' => $user->user_id,
                'department' => 'General',
                'faculty' => 'General Faculty',
            ]);
        }

        return $this->login($data['email'], $data['password']);
    }

    /**
     * Authenticate user and return tokens
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception("Invalid credentials.");
        }

        // Lockout Check
        $now = Carbon::now();
        if ($user->locked_until && $user->locked_until->gt($now)) {
            $minutes = ceil($user->locked_until->diffInMinutes($now));
            throw new \Exception("This account is locked. Please try again in {$minutes} minutes.");
        }

        // Password Verification
        if (!Hash::check($password, $user->password_hash)) {
            $user->increment('failed_login_attempts');

            if ($user->failed_login_attempts >= 5) {
                $user->update([
                    'locked_until' => Carbon::now()->addMinutes(30)
                ]);
                throw new \Exception("Invalid credentials. Account locked for 30 minutes due to multiple failed attempts.");
            }

            throw new \Exception("Invalid credentials.");
        }

        // Status Check
        if ($user->status !== 'ACTIVE') {
            throw new \Exception("Your account is not active. Please contact the administrator.");
        }

        // Success - Reset Failed Attempts
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => Carbon::now()
        ]);

        // Generate JWT Access & Refresh Tokens
        $accessToken = JwtHelper::generateToken([
            'sub' => $user->user_id,
            'role' => $user->role,
            'email' => $user->email,
            'type' => 'access'
        ], 60); // 60 minutes expiry

        $refreshToken = JwtHelper::generateToken([
            'sub' => $user->user_id,
            'type' => 'refresh'
        ], 10080); // 7 days (10080 minutes) expiry

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'user' => [
                'user_id' => $user->user_id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'role' => $user->role,
                'profile_photo_path' => $user->profile_photo_path,
            ]
        ];
    }

    /**
     * Refresh access token using a valid refresh token
     */
    public function refresh(string $refreshToken): array
    {
        $payload = JwtHelper::verifyToken($refreshToken);

        if (!$payload || !isset($payload['sub']) || ($payload['type'] ?? '') !== 'refresh') {
            throw new \Exception("Invalid or expired refresh token.");
        }

        $user = User::find($payload['sub']);

        if (!$user || $user->status !== 'ACTIVE') {
            throw new \Exception("User is no longer active or exists.");
        }

        // Generate New Access Token
        $accessToken = JwtHelper::generateToken([
            'sub' => $user->user_id,
            'role' => $user->role,
            'email' => $user->email,
            'type' => 'access'
        ], 60); // 60 minutes expiry

        return [
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
        ];
    }
}
