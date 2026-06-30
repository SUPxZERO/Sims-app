<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Login as student
$user = App\Models\User::where("email", "student@suims.edu")->first();
$token = auth()->login($user);

// Fetch the download
$request = Illuminate\Http\Request::create("/api/reports/attachments/151/download", "GET");
$request->headers->set("Authorization", "Bearer " . $token);
$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Type: " . get_class($response) . "\n";

