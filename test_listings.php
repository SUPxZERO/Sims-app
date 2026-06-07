<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$listingService = app(\App\Services\ListingService::class);
$listings = $listingService->getListings(['status' => 'PENDING_APPROVAL']);
echo $listings->toJson(JSON_PRETTY_PRINT);
