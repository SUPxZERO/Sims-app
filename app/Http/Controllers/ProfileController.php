<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's full profile including role-specific data.
     */
    public function show(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            // Load the appropriate profile relation based on the user's role
            switch ($user->role) {
                case 'STUDENT':
                    $user->load('studentProfile');
                    break;
                case 'COMPANY':
                    $user->load('companyProfile');
                    break;
                case 'LECTURER':
                    $user->load('lecturerProfile');
                    break;
            }

            return response()->json(['user' => $user], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch profile: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            // Validate and update base user fields
            $request->validate([
                'full_name' => 'sometimes|required|string|max:200',
            ]);

            if ($request->has('full_name')) {
                $user->full_name = $request->full_name;
                $user->save();
            }

            // Update role-specific profile fields
            if ($user->role === 'STUDENT') {
                $profile = $user->studentProfile;
                if ($profile) {
                    $request->validate([
                        'phone_number' => 'nullable|string|max:20',
                        'address' => 'nullable|string|max:500',
                        'linkedin_url' => 'nullable|string|max:300',
                        'bio' => 'nullable|string',
                        'department' => 'sometimes|required|string|max:100',
                        'expected_graduation' => 'nullable|integer',
                    ]);

                    $profile->update($request->only([
                        'phone_number',
                        'address',
                        'linkedin_url',
                        'bio',
                        'department',
                        'expected_graduation'
                    ]));
                }
            } elseif ($user->role === 'COMPANY') {
                $profile = $user->companyProfile;
                if ($profile) {
                    $request->validate([
                        'company_name' => 'sometimes|required|string|max:200',
                        'industry_sector' => 'sometimes|required|string|max:100',
                        'company_size' => 'nullable|string|max:20',
                        'company_website' => 'nullable|string|max:300',
                        'company_address' => 'sometimes|required|string|max:500',
                        'company_city' => 'sometimes|required|string|max:100',
                        'company_description' => 'nullable|string',
                        'contact_person_name' => 'nullable|string|max:200',
                        'contact_phone' => 'nullable|string|max:20',
                    ]);

                    $profile->update($request->only([
                        'company_name',
                        'industry_sector',
                        'company_size',
                        'company_website',
                        'company_address',
                        'company_city',
                        'company_description',
                        'contact_person_name',
                        'contact_phone'
                    ]));
                }
            } elseif ($user->role === 'LECTURER') {
                $profile = $user->lecturerProfile;
                if ($profile) {
                    $request->validate([
                        'department' => 'sometimes|required|string|max:100',
                        'specialization' => 'nullable|string|max:500',
                        'phone_number' => 'nullable|string|max:20',
                        'office_location' => 'nullable|string|max:100',
                        'max_supervision_load' => 'nullable|integer|min:1|max:50',
                    ]);

                    $profile->update($request->only([
                        'department',
                        'specialization',
                        'phone_number',
                        'office_location',
                        'max_supervision_load'
                    ]));
                }
            }

            // Reload user with updated profile
            switch ($user->role) {
                case 'STUDENT':
                    $user->load('studentProfile');
                    break;
                case 'COMPANY':
                    $user->load('companyProfile');
                    break;
                case 'LECTURER':
                    $user->load('lecturerProfile');
                    break;
            }

            return response()->json(['message' => 'Profile updated successfully', 'user' => $user], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update profile: ' . $e->getMessage()], 500);
        }
    }
}
