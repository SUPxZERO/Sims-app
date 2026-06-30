<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$user = App\Models\User::find(2);
$token = auth()->login($user);
$request = Illuminate\Http\Request::create("/api/reports/attachments/151/download", "GET");
$request->headers->set("Authorization", "Bearer " . $token);
$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Headers: " . json_encode($response->headers->all()) . "\n";
// getContent() fails on BinaryFileResponse, so we use file_exists on the file path inside it
if (method_exists($response, "getFile")) {
    $file = $response->getFile();
    echo "File exists in response: " . ($file->isFile() ? "yes" : "no") . "\n";
    echo "File size in response: " . $file->getSize() . "\n";
} else {
    echo "Content length: " . strlen($response->getContent()) . "\n";
}

