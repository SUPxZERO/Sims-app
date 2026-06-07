<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('role', 'ADMIN')->first();
$token = \App\Helpers\JwtHelper::generateToken([
    'sub' => $user->user_id,
    'role' => $user->role,
    'email' => $user->email,
    'exp' => time() + 3600
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/api/listings?status=PENDING_APPROVAL");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json",
    "Accept: application/json"
]);

$result = curl_exec($ch);
echo "Response:\n$result\n";
