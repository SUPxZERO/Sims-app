<?php

$dir = __DIR__ . '/app/Models';
$files = scandir($dir);

foreach ($files as $file) {
    if (str_ends_with($file, '.php')) {
        $path = $dir . '/' . $file;
        $content = file_get_contents($path);
        
        // Skip if already has HasFactory
        if (str_contains($content, 'use HasFactory;')) {
            continue;
        }

        // We only want to add it to models that extend Eloquent or Authenticatable
        if (str_contains($content, 'class ') && (str_contains($content, 'extends Eloquent') || str_contains($content, 'extends Authenticatable'))) {
            
            // 1. Add import
            $import = "use Illuminate\Database\Eloquent\Factories\HasFactory;\n";
            if (!str_contains($content, 'use Illuminate\Database\Eloquent\Factories\HasFactory;')) {
                // Add right before class declaration
                $content = preg_replace('/(class \w+ extends)/', $import . "$1", $content);
            }

            // 2. Add trait use
            $content = preg_replace('/(class \w+ extends[^{]+\{\n)/', "$1    use HasFactory;\n\n", $content);
            
            file_put_contents($path, $content);
            echo "Added HasFactory to $file\n";
        }
    }
}
