<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = new Illuminate\Http\Request();
$req->merge(['user_id' => 'all', 'title' => 'Test', 'message' => 'Msg', 'type' => 'INFO', 'priority' => 'NORMAL']);
$c = new App\Http\Controllers\NotificationController();
$req->setUserResolver(function() { return App\Models\User::where('role', 'ADMIN')->first(); });
echo json_encode($c->store($req)->getData());
