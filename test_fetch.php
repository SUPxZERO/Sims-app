<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$studentId = 2; // Assuming student ID is 2
$scores = App\Models\RecommendationScore::where('user_id', $studentId)->get();

echo "Scores for student $studentId:\n";
foreach ($scores as $score) {
    echo "Listing ID: {$score->listing_id}, Composite Score: {$score->composite_score}\n";
}

$listings = App\Models\InternshipListing::all();
echo "\nAll listings:\n";
foreach ($listings as $listing) {
    echo "Listing ID: {$listing->listing_id}, Title: {$listing->title}, Status: {$listing->status}\n";
}
