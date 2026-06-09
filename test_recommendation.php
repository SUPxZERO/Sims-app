<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $studentId = App\Models\User::where('role', 'STUDENT')->first()->user_id;
    echo "Using student ID: $studentId\n";
    
    $service = app(App\Services\RecommendationService::class);
    $service->recalculateStudentRecommendations($studentId);
    
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
