<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ApplicationService;
use Exception;

class ApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    public function apply(Request $request, $listingId)
    {
        $request->validate([
            'cover_letter' => 'nullable|string'
        ]);

        try {
            $studentId = auth()->user()->user_id;

            if (auth()->user()->role !== 'STUDENT') {
                return response()->json(['error' => 'Only students can apply for listings.'], 403);
            }

            $application = $this->applicationService->apply($studentId, $listingId, $request->cover_letter);
            return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:UNDER_REVIEW,SHORTLISTED,ACCEPTED,REJECTED,CONFIRMED,WITHDRAWN',
            'reason' => 'nullable|string'
        ]);

        try {
            $userId = auth()->user()->user_id;

            // Simple authorization check for demonstration. Real implementation would check 
            // if COMPANY owns the listing or STUDENT owns the application for CONFIRMED/WITHDRAWN.
            $application = $this->applicationService->updateStatus($id, $userId, $request->status, $request->reason);
            return response()->json(['message' => 'Application status updated', 'application' => $application]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getForListing($listingId)
    {
        try {
            $applications = $this->applicationService->getApplicationsForListing($listingId);
            return response()->json(['applications' => $applications]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getForStudent()
    {
        try {
            $studentId = auth()->user()->user_id;
            $applications = $this->applicationService->getApplicationsForStudent($studentId);
            return response()->json(['applications' => $applications]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
