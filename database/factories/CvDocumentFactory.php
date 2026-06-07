<?php

namespace Database\Factories;

use App\Models\CvDocument;
use App\Models\Cv;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvDocumentFactory extends Factory
{
    protected $model = CvDocument::class;

    public function definition(): array
    {
        return [
            'cv_id' => Cv::factory(),
            'document_label' => 'Resume - ' . fake()->year(),
            'file_path' => 'cvs/' . fake()->uuid() . '.pdf',
            'file_name' => 'resume.pdf',
            'file_size_bytes' => fake()->numberBetween(102400, 2048000), // 100KB to 2MB
            'mime_type' => 'application/pdf',
            'uploaded_at' => now(),
        ];
    }
}
