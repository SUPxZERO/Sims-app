<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$versions = App\Models\CvVersion::all();
$updated = 0;
foreach($versions as $version) {
    $data = $version->snapshot_data;
    if(isset($data['skills'])) {
        $changed = false;
        foreach($data['skills'] as &$s) {
            if(empty($s['name']) && isset($s['skill_id'])) {
                $skill = App\Models\Skill::find($s['skill_id']);
                if($skill) {
                    $s['name'] = $skill->skill_name;
                    $changed = true;
                }
            }
        }
        if($changed) {
            $version->snapshot_data = $data;
            $version->save();
            $updated++;
        }
    }
}
echo "Updated $updated CV versions.\n";
