<?php

namespace App\Listeners;

use App\Events\ApplicationStatusChanged;
use App\Jobs\SendNotificationEmailJob;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendStatusChangeNotification
{
    public function handle(ApplicationStatusChanged $event): void
    {
        $application = $event->application;
        $student = $application->student;
        $title = 'Application Update';
        $message = "Your application for the position '{$application->listing->title}' has been updated to {$event->newStatus}.";

        if ($event->newStatus === 'REJECTED' && $event->reason) {
            $message .= " Reason: {$event->reason}";
        }

        // 1. Create In-App Notification (Database sync write)
        Notification::create([
            'user_id' => $student->user_id,
            'type' => 'APPLICATION_STATUS_UPDATE',
            'title' => $title,
            'message' => $message,
            'priority' => 'HIGH',
            'channel' => 'IN_APP_EMAIL',
            'reference_type' => 'application',
            'reference_id' => $application->application_id,
            'is_read' => 0,
        ]);

        // 2. Dispatch Email Notification Job (Async Queue dispatch)
        SendNotificationEmailJob::dispatch($student->email, $title, $message);
    }
}
