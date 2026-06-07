<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle user registration request
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'role' => 'required|in:STUDENT,COMPANY,LECTURER',
            'university_id' => 'required_if:role,STUDENT',
            'company_name' => 'required_if:role,COMPANY',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->authService->register($request->all());
            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Handle user login request
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $credentials = $request->only('email', 'password');
            $result = $this->authService->login($credentials['email'], $credentials['password']);

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Refresh access token
     */
    public function refresh(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $refreshToken = $request->input('refresh_token');
            $result = $this->authService->refresh($refreshToken);

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Logout user (stateless invalidate notice)
     */
    public function logout()
    {
        // In a completely stateless JWT authentication, the client deletes the token.
        // We return a success message confirming logout.
        return response()->json([
            'message' => 'Successfully logged out.'
        ], 200);
    }

    /**
     * Get authenticated user details
     */
    public function me()
    {
        $user = Auth::user();

        // Load profile based on user role
        $profile = null;
        if ($user->role === 'STUDENT') {
            $user->load('studentProfile');
        } elseif ($user->role === 'LECTURER') {
            $user->load('lecturerProfile');
        } elseif ($user->role === 'COMPANY') {
            $user->load('companyProfile');
        }

        return response()->json([
            'user' => $user
        ], 200);
    }
}
