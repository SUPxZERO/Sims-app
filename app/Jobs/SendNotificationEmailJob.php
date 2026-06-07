<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Mail; // Uncomment when Mail is fully configured

class SendNotificationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $emailAddress,
        public string $title,
        public string $message
    ) {}

    public function handle(): void
    {
        // For now, simulate email sending by logging it
        Log::info("Sending Email to {$this->emailAddress}");
        Log::info("Subject: {$this->title}");
        Log::info("Body: {$this->message}");

        /*
        Mail::raw($this->message, function ($message) {
            $message->to($this->emailAddress)
                    ->subject($this->title);
        });
        */
    }
}
