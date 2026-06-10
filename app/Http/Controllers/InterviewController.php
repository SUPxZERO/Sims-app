<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Interview;
use App\Models\Application;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class InterviewController extends Controller
{
    public function studentInterviews()
    {
        $user = Auth::user();
        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $interviews = Interview::with('application.listing.company')
            ->whereHas('application', function ($query) use ($user) {
                $query->where('user_id', $user->user_id);
            })
            ->get();

        return response()->json(['interviews' => $interviews]);
    }

    public function store(Request $request, $applicationId)
    {
        $user = Auth::user();
        if ($user->role !== 'COMPANY') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application = Application::with('listing')->findOrFail($applicationId);
        if ($application->listing->company_user_id !== $user->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date',
            'meeting_link' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
        ]);

        $validated['application_id'] = $applicationId;
        $validated['status'] = 'SCHEDULED';

        $interview = Interview::create($validated);

        // Notify the student
        Notification::create([
            'user_id' => $application->user_id,
            'type' => 'INTERVIEW_SCHEDULED',
            'title' => 'Interview Scheduled',
            'message' => 'An interview has been scheduled for your application to ' . $application->listing->title,
            'priority' => 'HIGH',
            'channel' => 'IN_APP',
            'reference_type' => 'INTERVIEW',
            'reference_id' => $interview->id,
            'is_read' => 0,
            'email_sent' => 0,
        ]);

        return response()->json([
            'message' => 'Interview scheduled successfully',
            'interview' => $interview
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'COMPANY') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $interview = Interview::with('application.listing')->findOrFail($id);
        if ($interview->application->listing->company_user_id !== $user->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'scheduled_at' => 'nullable|date',
            'meeting_link' => 'nullable|string',
            'duration_minutes' => 'nullable|integer',
            'feedback' => 'nullable|string',
            'status' => 'nullable|string|in:SCHEDULED,COMPLETED,CANCELLED',
        ]);

        $interview->update($validated);

        // Notify the student about the update
        $action = isset($validated['status']) && $validated['status'] === 'CANCELLED' ? 'cancelled' : 'updated';
        Notification::create([
            'user_id' => $interview->application->user_id,
            'type' => 'INTERVIEW_UPDATED',
            'title' => 'Interview ' . ucfirst($action),
            'message' => 'Your interview for ' . $interview->application->listing->title . ' has been ' . $action . '.',
            'priority' => 'HIGH',
            'channel' => 'IN_APP',
            'reference_type' => 'INTERVIEW',
            'reference_id' => $interview->id,
            'is_read' => 0,
            'email_sent' => 0,
        ]);

        return response()->json([
            'message' => 'Interview updated successfully',
            'interview' => $interview
        ]);
    }
}
