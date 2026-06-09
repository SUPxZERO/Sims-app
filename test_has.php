<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$studentId = 2; // Assuming student ID 2
$scores = \App\Models\RecommendationScore::where('user_id', $studentId)
    ->get()
    ->keyBy('listing_id');

$listings = \App\Models\InternshipListing::all();
$listings->each(function($listing) use ($scores) {
    if ($scores->has($listing->listing_id)) {
        echo "Listing {$listing->listing_id} HAS score.\n";
    } else {
        echo "Listing {$listing->listing_id} DOES NOT have score.\n";
    }
});
