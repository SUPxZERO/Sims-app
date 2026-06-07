<?php

namespace Database\Factories;

use App\Models\ReportAttachment;
use App\Models\WeeklyReport;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportAttachmentFactory extends Factory
{
    protected $model = ReportAttachment::class;

    public function definition(): array
    {
        return [
            'report_id' => WeeklyReport::factory(),
            'file_path' => 'reports/attachments/' . fake()->uuid() . '.pdf',
            'file_name' => 'evidence_week.pdf',
            'file_size_bytes' => fake()->numberBetween(102400, 2048000),
            'mime_type' => 'application/pdf',
            'uploaded_at' => now(),
        ];
    }
}
