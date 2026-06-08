<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Exception;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $logs = AuditLog::with('user:user_id,full_name,email,role')
                ->orderBy('changed_at', 'desc')
                ->take(100) // limit to recent 100 for performance, could add pagination later
                ->get();

            return response()->json(['logs' => $logs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch audit logs.'], 500);
        }
    }
}
