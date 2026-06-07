<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Hash;
use App\Models\User;

$user = User::where('email', 'admin@suims.edu')->first();
echo "Stored Hash: " . $user->password_hash . "\n";
echo "Match password123? " . (Hash::check('password123', $user->password_hash) ? 'YES' : 'NO') . "\n";

// Let's create a new hash right now
$newHash = Hash::make('password123');
echo "New Hash: " . $newHash . "\n";
echo "Match new hash? " . (Hash::check('password123', $newHash) ? 'YES' : 'NO') . "\n";

// Update the user with the new hash
$user->password_hash = $newHash;
$user->save();

// Read it back
$user2 = User::where('email', 'admin@suims.edu')->first();
echo "Stored New Hash: " . $user2->password_hash . "\n";
echo "Match password123 after saving? " . (Hash::check('password123', $user2->password_hash) ? 'YES' : 'NO') . "\n";
