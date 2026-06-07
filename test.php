<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$report = App\Models\WeeklyReport::find(210);
echo "Status: " . $report->status . "\n";
echo "Submitted At: " . $report->submitted_at . "\n";
