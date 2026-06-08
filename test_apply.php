<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Assuming student user_id is 4 based on the logs
    app(\App\Services\ApplicationService::class)->apply(4, 41);
    echo "Success\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
