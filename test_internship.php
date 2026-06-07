<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $internship = App\Models\Internship::with(['studentProfile.user', 'companyProfile.user', 'lecturerProfile.user', 'listing', 'weeklyReports.reviews', 'companyEvaluation.scores', 'lecturerGrade'])->findOrFail(15);
    echo "Success: Found internship 15\n";
} catch (Exception $e) {
    echo get_class($e) . ': ' . $e->getMessage() . "\n";
}
