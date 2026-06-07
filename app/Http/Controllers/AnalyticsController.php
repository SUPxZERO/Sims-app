<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Exception;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getDashboard(Request $request)
    {
        $user = $request->user();

        try {
            $data = [];
            
            switch ($user->role) {
                case 'ADMIN':
                    $data = $this->analyticsService->getAdminDashboard();
                    break;
                case 'STUDENT':
                    $data = $this->analyticsService->getStudentDashboard($user->user_id);
                    break;
                case 'LECTURER':
                    $data = $this->analyticsService->getLecturerDashboard($user->user_id);
                    break;
                case 'COMPANY':
                    $data = $this->analyticsService->getCompanyDashboard($user->user_id);
                    break;
                default:
                    throw new Exception("Invalid user role for analytics.", 403);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);

        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }
}
