<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo json_encode(\DB::select("SELECT search_condition FROM user_constraints WHERE constraint_name = 'CHK_NOTIF_PRIORITY'"));
