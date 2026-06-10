<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\StudentPreference;
use Illuminate\Support\Facades\Auth;

class StudentPreferenceController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $preference = StudentPreference::firstOrCreate(
            ['student_id' => $user->user_id],
            [
                'preferred_locations' => [],
                'preferred_work_modes' => [],
                'preferred_industries' => [],
            ]
        );

        return response()->json(['preference' => $preference]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'preferred_locations' => 'nullable|array',
            'preferred_work_modes' => 'nullable|array',
            'preferred_industries' => 'nullable|array',
        ]);

        $preference = StudentPreference::updateOrCreate(
            ['student_id' => $user->user_id],
            $validated
        );

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preference' => $preference
        ]);
    }
}
