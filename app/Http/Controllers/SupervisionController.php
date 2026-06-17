<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\User;
use App\Models\LecturerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class SupervisionController extends Controller
{
    /**
     * List all internships with supervisor info for the admin supervision management page.
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role !== 'ADMIN') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $internships = DB::table('internships')
                ->join('users as su', 'su.user_id', '=', 'internships.student_user_id')
                ->join('users as cu', 'cu.user_id', '=', 'internships.company_user_id')
                ->join('internship_listings', 'internship_listings.listing_id', '=', 'internships.listing_id')
                ->leftJoin('users as lu', 'lu.user_id', '=', 'internships.lecturer_user_id')
                ->leftJoin('lecturer_profiles as lp', 'lp.user_id', '=', 'internships.lecturer_user_id')
                ->select([
                    'internships.internship_id',
                    'internships.status',
                    'internships.start_date',
                    'internships.end_date',
                    'internships.lecturer_user_id',
                    'su.full_name as student_name',
                    'cu.full_name as company_name',
                    'internship_listings.title as position',
                    'lu.full_name as lecturer_name',
                    'lp.department as lecturer_department',
                    'lp.max_supervision_load as lecturer_max_load',
                ])
                ->orderBy('internships.created_at', 'desc')
                ->get()
                ->map(function ($internship) {
                    // Calculate current load for the assigned lecturer
                    if ($internship->lecturer_user_id) {
                        $internship->lecturer_current_load = (int) DB::table('internships')
                            ->where('lecturer_user_id', $internship->lecturer_user_id)
                            ->where('status', 'ACTIVE')
                            ->count();
                    } else {
                        $internship->lecturer_current_load = null;
                    }

                    $internship->lecturer_max_load = (int) ($internship->lecturer_max_load ?? 10);

                    return $internship;
                });

            // Stats
            $totalInternships = $internships->count();
            $unassignedCount = $internships->whereNull('lecturer_user_id')->count();

            // Lecturers at capacity
            $atCapacityLecturers = DB::table('lecturer_profiles')
                ->join('users', 'users.user_id', '=', 'lecturer_profiles.user_id')
                ->where('users.role', 'LECTURER')
                ->where('users.status', 'ACTIVE')
                ->get()
                ->filter(function ($lecturer) {
                    $currentLoad = DB::table('internships')
                        ->where('lecturer_user_id', $lecturer->user_id)
                        ->where('status', 'ACTIVE')
                        ->count();
                    $maxLoad = $lecturer->max_supervision_load ?? 10;
                    return $currentLoad >= $maxLoad;
                })
                ->count();

            return response()->json([
                'internships' => $internships->values(),
                'stats' => [
                    'total_internships' => $totalInternships,
                    'unassigned_count' => $unassignedCount,
                    'at_capacity_lecturers' => $atCapacityLecturers,
                ],
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    /**
     * Get all available lecturers with their current supervision load.
     */
    public function getLecturers(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role !== 'ADMIN') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $lecturers = DB::table('users')
                ->join('lecturer_profiles', 'lecturer_profiles.user_id', '=', 'users.user_id')
                ->where('users.role', 'LECTURER')
                ->where('users.status', 'ACTIVE')
                ->select([
                    'users.user_id',
                    'users.full_name',
                    'lecturer_profiles.department',
                    'lecturer_profiles.specialization',
                    'lecturer_profiles.max_supervision_load',
                ])
                ->orderBy('users.full_name')
                ->get()
                ->map(function ($lecturer) {
                    $lecturer->current_load = (int) DB::table('internships')
                        ->where('lecturer_user_id', $lecturer->user_id)
                        ->where('status', 'ACTIVE')
                        ->count();

                    $lecturer->max_supervision_load = (int) ($lecturer->max_supervision_load ?? 10);

                    return $lecturer;
                });

            return response()->json(['lecturers' => $lecturers]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    /**
     * Assign or reassign a lecturer to supervise a specific internship.
     */
    public function assignSupervisor(Request $request, $internshipId)
    {
        $request->validate([
            'lecturer_user_id' => 'required|integer|exists:users,user_id',
        ]);

        try {
            $user = $request->user();
            if ($user->role !== 'ADMIN') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $internship = Internship::findOrFail($internshipId);
            $lecturer = User::findOrFail($request->lecturer_user_id);

            if ($lecturer->role !== 'LECTURER') {
                throw new Exception('Selected user is not a lecturer.', 422);
            }

            // Check capacity
            $lecturerProfile = LecturerProfile::where('user_id', $lecturer->user_id)->first();
            $maxLoad = $lecturerProfile ? ($lecturerProfile->max_supervision_load ?? 10) : 10;
            $currentLoad = Internship::where('lecturer_user_id', $lecturer->user_id)
                ->where('status', 'ACTIVE')
                ->when($internship->lecturer_user_id === $lecturer->user_id, function ($q) use ($internship) {
                    // If reassigning to the same lecturer, exclude this internship from count
                    $q->where('internship_id', '!=', $internship->internship_id);
                })
                ->count();

            if ($currentLoad >= $maxLoad) {
                throw new Exception('This lecturer has reached their maximum supervision capacity.', 422);
            }

            $internship->lecturer_user_id = $lecturer->user_id;
            $internship->save();

            // Log audit
            DB::table('audit_logs')->insert([
                'changed_by' => $user->user_id,
                'action' => 'ASSIGN_SUPERVISOR',
                'table_name' => 'internships',
                'record_id' => $internship->internship_id,
                'new_values' => json_encode([
                    'lecturer_user_id' => $lecturer->user_id,
                    'lecturer_name' => $lecturer->full_name,
                    'student_internship_id' => $internship->internship_id,
                ]),
                'changed_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'message' => "Supervisor {$lecturer->full_name} assigned successfully.",
                'internship' => $internship,
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    /**
     * Bulk auto-assign unassigned internships to least-loaded lecturers.
     */
    public function bulkAssign(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role !== 'ADMIN') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $unassignedInternships = Internship::whereNull('lecturer_user_id')
                ->where('status', 'ACTIVE')
                ->get();

            if ($unassignedInternships->isEmpty()) {
                return response()->json([
                    'message' => 'No unassigned internships found.',
                    'assigned_count' => 0,
                    'failed_count' => 0,
                ]);
            }

            $assignedCount = 0;
            $failedCount = 0;

            foreach ($unassignedInternships as $internship) {
                $lecturer = $this->findLeastLoadedLecturer();

                if ($lecturer) {
                    $internship->lecturer_user_id = $lecturer->user_id;
                    $internship->save();
                    $assignedCount++;

                    // Log audit
                    DB::table('audit_logs')->insert([
                        'changed_by' => $user->user_id,
                        'action' => 'BULK_ASSIGN_SUPERVISOR',
                        'table_name' => 'internships',
                        'record_id' => $internship->internship_id,
                        'new_values' => json_encode([
                            'lecturer_user_id' => $lecturer->user_id,
                            'lecturer_name' => $lecturer->full_name,
                        ]),
                        'changed_at' => now(),
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ]);
                } else {
                    $failedCount++;
                }
            }

            return response()->json([
                'message' => "Bulk assignment complete: {$assignedCount} assigned, {$failedCount} failed (no available lecturers).",
                'assigned_count' => $assignedCount,
                'failed_count' => $failedCount,
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 500;
            if ($code < 100 || $code > 599) $code = 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    /**
     * Find the lecturer with the least active supervision load who hasn't hit capacity.
     */
    public static function findLeastLoadedLecturer(): ?User
    {
        $lecturers = DB::table('users')
            ->join('lecturer_profiles', 'lecturer_profiles.user_id', '=', 'users.user_id')
            ->where('users.role', 'LECTURER')
            ->where('users.status', 'ACTIVE')
            ->select([
                'users.user_id',
                'users.full_name',
                'lecturer_profiles.max_supervision_load',
            ])
            ->get();

        $bestLecturer = null;
        $lowestLoad = PHP_INT_MAX;

        foreach ($lecturers as $lecturer) {
            $currentLoad = DB::table('internships')
                ->where('lecturer_user_id', $lecturer->user_id)
                ->where('status', 'ACTIVE')
                ->count();

            $maxLoad = $lecturer->max_supervision_load ?? 10;

            if ($currentLoad < $maxLoad && $currentLoad < $lowestLoad) {
                $lowestLoad = $currentLoad;
                $bestLecturer = User::find($lecturer->user_id);
            }
        }

        return $bestLecturer;
    }
}
