<?php

namespace App\Http\Controllers;

use App\Services\WeeklyReportService;
use Illuminate\Http\Request;
use Exception;

class WeeklyReportController extends Controller
{
    protected $weeklyReportService;

    public function __construct(WeeklyReportService $weeklyReportService)
    {
        $this->weeklyReportService = $weeklyReportService;
    }

    public function index(Request $request, $internshipId)
    {
        $user = $request->user();

        try {
            $reports = $this->weeklyReportService->getInternshipReports($user, $internshipId);
            return response()->json([
                'reports' => $reports
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function myReports(Request $request)
    {
        $user = $request->user();

        try {
            $reports = $this->weeklyReportService->getStudentReports($user);
            return response()->json([
                'reports' => $reports
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function lecturerReports(Request $request)
    {
        $user = $request->user();

        try {
            $reports = $this->weeklyReportService->getLecturerReports($user);
            return response()->json([
                'reports' => $reports
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $report = \App\Models\WeeklyReport::with(['internship.studentProfile.user', 'internship.companyProfile', 'attachments'])->findOrFail($id);
            return response()->json([
                'report' => $report
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 404;
            if ($code < 100 || $code > 599) $code = 404;
            return response()->json(['error' => 'Report not found'], $code);
        }
    }

    public function save(Request $request, $id)
    {
        $user = $request->user();
        
        $request->validate([
            'status' => 'required|in:DRAFT,SUBMITTED',
            'activities' => 'nullable|string',
            'challenges' => 'nullable|string',
            'learnings' => 'nullable|string',
            'hours_logged' => 'nullable|numeric|min:1|max:80',
        ]);

        try {
            $report = $this->weeklyReportService->saveReport($user, $id, $request->all());
            return response()->json([
                'message' => 'Report saved successfully',
                'report' => $report
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function addAttachment(Request $request, $id)
    {
        $user = $request->user();

        // Debugging the file upload error
        \Log::info('--- File Upload Attempt ---');
        \Log::info('Has file? ' . ($request->hasFile('file') ? 'Yes' : 'No'));
        \Log::info('Files array keys: ' . implode(', ', array_keys($_FILES)));
        \Log::info('Post array keys: ' . implode(', ', array_keys($_POST)));
        
        if ($request->hasFile('file')) {
            \Log::info('Is Valid? ' . ($request->file('file')->isValid() ? 'Yes' : 'No'));
            \Log::error('File upload error code: ' . $request->file('file')->getError());
            \Log::error('File upload error message: ' . $request->file('file')->getErrorMessage());
        }

        $request->validate([
            'file' => 'required|file|max:30720', // Max 30MB
        ]);

        try {
            $attachment = $this->weeklyReportService->addAttachment($user, $id, $request->file('file'));
            return response()->json([
                'message' => 'Attachment uploaded successfully',
                'attachment' => $attachment
            ], 201);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function review(Request $request, $id)
    {
        $user = $request->user();

        $request->validate([
            'decision' => 'required|in:APPROVED,REVISION_REQUESTED,REJECTED',
            'comments' => 'required|string',
        ]);

        try {
            $review = $this->weeklyReportService->reviewReport($user, $id, $request->all());
            return response()->json([
                'message' => 'Review submitted successfully',
                'review' => $review
            ], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function downloadAttachment(Request $request, $id)
    {
        $user = $request->user();
        try {
            return $this->weeklyReportService->downloadAttachment($user, $id);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 404;
            if ($code < 100 || $code > 599) $code = 404;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    public function deleteAttachment(Request $request, $id)
    {
        $user = $request->user();
        try {
            $this->weeklyReportService->deleteAttachment($user, $id);
            return response()->json(['message' => 'Attachment deleted successfully'], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            if ($code < 100 || $code > 599) $code = 400;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }
}
