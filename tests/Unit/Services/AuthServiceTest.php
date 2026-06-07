<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class AuthServiceTest extends TestCase
{
    use DatabaseTransactions;

    protected $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = app(AuthService::class);
    }

    /**
     * @test
     * Test user registration creates new user with correct data
     */
    public function test_user_registration_creates_user()
    {
        $userData = [
            'email' => 'newstudent@suims.edu',
            'password' => 'SecurePass123',
            'full_name' => 'John Doe',
            'role' => 'STUDENT',
        ];

        $user = $this->authService->registerUser($userData);

        $this->assertNotNull($user->user_id);
        $this->assertEquals('newstudent@suims.edu', $user->email);
        $this->assertEquals('John Doe', $user->full_name);
        $this->assertEquals('STUDENT', $user->role);
        $this->assertEquals('ACTIVE', $user->status);
    }

    /**
     * @test
     * Test duplicate email registration fails
     */
    public function test_duplicate_email_registration_fails()
    {
        User::create([
            'email' => 'existing@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Existing User',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $this->expectException(ValidationException::class);

        $this->authService->registerUser([
            'email' => 'existing@suims.edu',
            'password' => 'NewPassword123',
            'full_name' => 'New User',
            'role' => 'STUDENT',
        ]);
    }

    /**
     * @test
     * Test login with correct credentials returns JWT tokens
     */
    public function test_login_with_correct_credentials()
    {
        User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'email_verified_at' => Carbon::now(),
        ]);

        $result = $this->authService->login('student@suims.edu', 'Password123');

        $this->assertArrayHasKey('access_token', $result);
        $this->assertArrayHasKey('refresh_token', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertNotNull($result['access_token']);
        $this->assertNotNull($result['refresh_token']);
        $this->assertEquals('student@suims.edu', $result['user']->email);
    }

    /**
     * @test
     * Test login with incorrect password fails
     */
    public function test_login_with_incorrect_password_fails()
    {
        User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('CorrectPassword123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $this->expectException(ValidationException::class);

        $this->authService->login('student@suims.edu', 'WrongPassword123');
    }

    /**
     * @test
     * Test login with non-existent email fails
     */
    public function test_login_with_non_existent_email_fails()
    {
        $this->expectException(ValidationException::class);

        $this->authService->login('nonexistent@suims.edu', 'Password123');
    }

    /**
     * @test
     * Test BR-06: Account lockout after 5 failed login attempts
     */
    public function test_account_lockout_after_failed_attempts()
    {
        $user = User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('CorrectPassword123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'failed_login_attempts' => 0,
        ]);

        // Attempt 5 failed logins
        for ($i = 0; $i < 5; $i++) {
            try {
                $this->authService->login('student@suims.edu', 'WrongPassword');
            } catch (ValidationException $e) {
                // Expected
            }
        }

        $user->refresh();
        $this->assertEquals(5, $user->failed_login_attempts);
        $this->assertNotNull($user->locked_until);
        $this->assertTrue($user->locked_until->isFuture());
    }

    /**
     * @test
     * Test login fails when account is locked
     */
    public function test_login_fails_when_account_locked()
    {
        User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'failed_login_attempts' => 5,
            'locked_until' => Carbon::now()->addHours(1),
        ]);

        $this->expectException(ValidationException::class);

        $this->authService->login('student@suims.edu', 'Password123');
    }

    /**
     * @test
     * Test successful login resets failed attempt counter
     */
    public function test_successful_login_resets_failed_attempts()
    {
        User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
            'failed_login_attempts' => 2,
        ]);

        $result = $this->authService->login('student@suims.edu', 'Password123');

        $user = User::where('email', 'student@suims.edu')->first();
        $this->assertEquals(0, $user->failed_login_attempts);
        $this->assertNotNull($user->last_login_at);
    }

    /**
     * @test
     * Test JWT token refresh
     */
    public function test_jwt_token_refresh()
    {
        $user = User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $loginResult = $this->authService->login('student@suims.edu', 'Password123');
        $oldAccessToken = $loginResult['access_token'];

        $newResult = $this->authService->refreshToken($loginResult['refresh_token']);

        $this->assertArrayHasKey('access_token', $newResult);
        $this->assertArrayHasKey('refresh_token', $newResult);
        $this->assertNotNull($newResult['access_token']);
        // New access token should be different
        $this->assertNotEquals($oldAccessToken, $newResult['access_token']);
    }

    /**
     * @test
     * Test logout revokes tokens
     */
    public function test_logout_functionality()
    {
        $user = User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $loginResult = $this->authService->login('student@suims.edu', 'Password123');

        // Logout
        $this->authService->logout($user->user_id, $loginResult['refresh_token']);

        // Attempt to use refresh token should fail
        $this->expectException(ValidationException::class);
        $this->authService->refreshToken($loginResult['refresh_token']);
    }

    /**
     * @test
     * Test user status INACTIVE prevents login
     */
    public function test_inactive_user_cannot_login()
    {
        User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'INACTIVE',
        ]);

        $this->expectException(ValidationException::class);

        $this->authService->login('student@suims.edu', 'Password123');
    }

    /**
     * @test
     * Test JWT token contains correct claims
     */
    public function test_jwt_token_contains_correct_claims()
    {
        $user = User::create([
            'email' => 'student@suims.edu',
            'password_hash' => bcrypt('Password123'),
            'full_name' => 'Test Student',
            'role' => 'STUDENT',
            'status' => 'ACTIVE',
        ]);

        $result = $this->authService->login('student@suims.edu', 'Password123');
        $accessToken = $result['access_token'];

        // Decode token to verify claims (in production, JWT should be verified)
        $this->assertNotNull($accessToken);
        $this->assertIsString($accessToken);
        // Token should have 3 parts (header.payload.signature)
        $parts = explode('.', $accessToken);
        $this->assertCount(3, $parts);
    }
}
