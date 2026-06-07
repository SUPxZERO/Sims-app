<?php

namespace Database\Seeders;

use App\Models\MatchingWeightConfig;
use Illuminate\Database\Seeder;

class MatchingWeightConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MatchingWeightConfig::updateOrCreate(
            ['config_id' => 1],
            [
                'skill_weight' => 0.60,
                'gpa_weight' => 0.20,
                'preference_weight' => 0.20,
                'min_score_threshold' => 30.00,
                'max_recommendations' => 10,
            ]
        );
    }
}
