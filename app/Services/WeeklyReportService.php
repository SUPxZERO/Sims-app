<?php

namespace App\Services;

use App\Models\WeeklyReport;
use App\Models\ReportReview;
use App\Models\ReportAttachment;
use App\Models\Internship;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class WeeklyReportService
{
    /**
     * Submit or Update a Weekly Report (Draft/Submit)
     */
    public function saveReport(User $user, int $reportId, array $data): WeeklyReport
    {
        return DB::transaction(function () use ($user, $reportId, $data) {
            $report = WeeklyReport::with('internship')->findOrFail($reportId);

            if ($report->internship->student_user_id !== $user->user_id) {
                throw new Exception("Unauthorized to modify this report.", 403);
            }

            if (!in_array($report->status, ['NOT_STARTED', 'DRAFT', 'REVISION_REQUESTED'])) {
                throw new Exception("Report cannot be modified in its current status.");
            }

            // Ensure status is valid for saving
            $status = $data['status'] ?? 'DRAFT';
            if (!in_array($status, ['DRAFT', 'SUBMITTED'])) {
                throw new Exception("Invalid save status. Must be DRAFT or SUBMITTED.");
            }

            $report->activities = $data['activities'] ?? $report->activities;
            $report->challenges = $data['challenges'] ?? $report->challenges;
            $report->learnings = $data['learnings'] ?? $report->learnings;
            $report->hours_logged = $data['hours_logged'] ?? $report->hours_logged;

            $report->status = $status;
            
            if ($status === 'SUBMITTED') {
                $report->submitted_at = now();
                // Basic logic to determine if late (compare submitted_at to week_end_date)
                $report->is_late = now()->greaterThan($report->week_end_date->addDays(2)) ? 1 : 0;
            }

            $report->save();

            return $report;
        });
    }

    /**
     * Add an attachment to a report
     */
    public function addAttachment(User $user, int $reportId, UploadedFile $file): ReportAttachment
    {
        $report = WeeklyReport::with('internship')->findOrFail($reportId);

        if ($report->internship->student_user_id !== $user->user_id) {
            throw new Exception("Unauthorized to add attachments to this report.", 403);
        }

        if (!in_array($report->status, ['NOT_STARTED', 'DRAFT', 'REVISION_REQUESTED'])) {
            throw new Exception("Cannot attach files to a submitted report.");
        }

        $path = $file->store('reports/attachments', 'local');

        $attachment = ReportAttachment::create([
            'report_id' => $reportId,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size_bytes' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return $attachment;
    }

    /**
     * Review a Weekly Report
     */
    public function reviewReport(User $user, int $reportId, array $data): ReportReview
    {
        return DB::transaction(function () use ($user, $reportId, $data) {
            $report = WeeklyReport::with('internship')->findOrFail($reportId);

            // Must be COMPANY or LECTURER associated with internship
            if ($user->role === 'STUDENT' || 
                ($user->role === 'COMPANY' && $report->internship->company_user_id !== $user->user_id) ||
                ($user->role === 'LECTURER' && $report->internship->lecturer_user_id !== $user->user_id)
            ) {
                throw new Exception("Unauthorized to review this report.", 403);
            }

            if ($report->status !== 'SUBMITTED') {
                throw new Exception("Only submitted reports can be reviewed.");
            }

            $decision = $data['decision'];
            if (!in_array($decision, ['APPROVED', 'REVISION_REQUESTED', 'REJECTED'])) {
                throw new Exception("Invalid decision.");
            }

            $review = ReportReview::create([
                'report_id' => $reportId,
                'reviewer_user_id' => $user->user_id,
                'decision' => $decision,
                'comments' => $data['comments'],
                'reviewed_at' => now(),
            ]);

            $report->status = $decision;
            if ($decision === 'APPROVED') {
                $report->approved_at = now();
            } elseif ($decision === 'REVISION_REQUESTED') {
                $report->revision_count += 1;
            }

            $report->save();

            return $review;
        });
    }

    /**
     * Get all reports for an internship
     */
    public function getInternshipReports(User $user, int $internshipId)
    {
        $internship = Internship::findOrFail($internshipId);

        if ($user->role === 'STUDENT' && $internship->student_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }
        if ($user->role === 'COMPANY' && $internship->company_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }
        if ($user->role === 'LECTURER' && $internship->lecturer_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }

        return WeeklyReport::where('internship_id', $internshipId)
            ->with(['attachments', 'reviews.reviewer'])
            ->orderBy('week_number', 'asc')
            ->get();
    }

    /**
     * Get all reports for the authenticated student
     */
    public function getStudentReports(User $user)
    {
        if ($user->role !== 'STUDENT') {
            throw new Exception("Unauthorized access.", 403);
        }

        return WeeklyReport::whereHas('internship', function($q) use ($user) {
                $q->where('student_user_id', $user->user_id);
            })
            ->with(['attachments', 'reviews.reviewer'])
            ->orderBy('week_number', 'asc')
            ->get();
    }

    /**
     * Get all reports for the authenticated lecturer
     */
    public function getLecturerReports(User $user)
    {
        if ($user->role !== 'LECTURER') {
            throw new Exception("Unauthorized access.", 403);
        }

        return WeeklyReport::whereHas('internship', function($q) use ($user) {
                $q->where('lecturer_user_id', $user->user_id);
            })
            ->with(['internship.studentProfile.user', 'internship.companyProfile'])
            ->orderBy('submitted_at', 'desc')
            ->get();
    }

    /**
     * Download an attachment
     */
    public function downloadAttachment(User $user, int $attachmentId)
    {
        $attachment = ReportAttachment::findOrFail($attachmentId);
        $report = WeeklyReport::with('internship')->findOrFail($attachment->report_id);

        if ($user->role === 'STUDENT' && $report->internship->student_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }
        if ($user->role === 'COMPANY' && $report->internship->company_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }
        if ($user->role === 'LECTURER' && $report->internship->lecturer_user_id !== $user->user_id) {
            throw new Exception("Unauthorized access.", 403);
        }

        if (!Storage::disk('local')->exists($attachment->file_path)) {
            throw new Exception("File not found on disk.", 404);
        }

        return response()->download(Storage::disk('local')->path($attachment->file_path), $attachment->file_name);
    }

    /**
     * Delete an attachment
     */
    public function deleteAttachment(User $user, int $attachmentId)
    {
        $attachment = ReportAttachment::findOrFail($attachmentId);
        $report = WeeklyReport::with('internship')->findOrFail($attachment->report_id);

        if ($report->internship->student_user_id !== $user->user_id) {
            throw new Exception("Unauthorized to delete this attachment.", 403);
        }

        if (!in_array($report->status, ['NOT_STARTED', 'DRAFT', 'REVISION_REQUESTED'])) {
            throw new Exception("Cannot delete files from a submitted report.");
        }

        Storage::disk('local')->delete($attachment->file_path);
        $attachment->delete();
    }
}
