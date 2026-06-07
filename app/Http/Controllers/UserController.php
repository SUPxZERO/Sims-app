<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $users = User::all();
            
            // Map the data to fit the frontend structure
            $formattedUsers = $users->map(function($user) {
                return [
                    'id' => $user->user_id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'last_login' => $user->last_login_at ? $user->last_login_at->format('Y-m-d') : '-',
                    // We generate a deterministic mock avatar gradient based on the role to maintain aesthetic
                    'avatar' => $this->getAvatarForRole($user->role),
                ];
            });

            return response()->json([
                'users' => $formattedUsers
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:STUDENT,COMPANY,LECTURER,ADMIN',
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'email' => $request->email,
                'password_hash' => Hash::make('password123'),
                'full_name' => $request->first_name . ' ' . $request->last_name,
                'role' => $request->role,
                'status' => 'ACTIVE',
            ]);

            if ($request->role === 'STUDENT') {
                DB::table('student_profiles')->insert([
                    'user_id' => $user->user_id,
                    'university_id' => 'UNV-' . rand(1000, 9999),
                    'major' => 'Undeclared',
                    'current_semester' => 1,
                ]);
                DB::table('cvs')->insert([
                    'user_id' => $user->user_id,
                    'status' => 'INCOMPLETE'
                ]);
            } elseif ($request->role === 'COMPANY') {
                DB::table('company_profiles')->insert([
                    'user_id' => $user->user_id,
                    'company_name' => 'New Company',
                    'industry' => 'Other',
                ]);
            } elseif ($request->role === 'LECTURER') {
                DB::table('lecturer_profiles')->insert([
                    'user_id' => $user->user_id,
                    'department' => 'General',
                    'faculty' => 'General Faculty',
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'User invited successfully',
                'user' => [
                    'id' => $user->user_id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'last_login' => '-',
                    'avatar' => $this->getAvatarForRole($user->role)
                ]
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|in:STUDENT,COMPANY,LECTURER,ADMIN',
            'status' => 'required|in:ACTIVE,PENDING,SUSPENDED'
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update([
                'full_name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'User updated successfully',
                'user' => [
                    'id' => $user->user_id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'last_login' => $user->last_login_at ? $user->last_login_at->format('Y-m-d') : '-',
                    'avatar' => $this->getAvatarForRole($user->role)
                ]
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:ACTIVE,PENDING,SUSPENDED'
        ]);

        try {
            $user = User::findOrFail($id);
            $user->status = $request->status;
            $user->save();

            return response()->json([
                'message' => 'User status updated successfully',
                'user' => [
                    'id' => $user->user_id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'last_login' => $user->last_login_at ? $user->last_login_at->format('Y-m-d') : '-',
                    'avatar' => $this->getAvatarForRole($user->role)
                ]
            ], 200);
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error('UpdateStatus Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    private function getAvatarForRole($role) {
        switch ($role) {
            case 'STUDENT': return 'bg-gradient-to-br from-blue-400 to-blue-600';
            case 'COMPANY': return 'bg-gradient-to-br from-indigo-400 to-indigo-600';
            case 'LECTURER': return 'bg-gradient-to-br from-purple-400 to-purple-600';
            case 'ADMIN': return 'bg-gradient-to-br from-amber-400 to-amber-600';
            default: return 'bg-gradient-to-br from-slate-400 to-slate-600';
        }
    }
}
