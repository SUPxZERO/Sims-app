<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Execute exactly in this order to respect strict foreign key hierarchies
        
        $this->command->info('--- Starting Tier 0 (Lookup Data) ---');
        $this->call([
            GradingScaleSeeder::class,
            EvaluationCriteriaSeeder::class,
            MatchingWeightConfigSeeder::class,
            SystemConfigSeeder::class,
            SkillCategoryAndSkillSeeder::class,
        ]);

        $this->command->info('--- Starting Tier 1 (Core Users) ---');
        $this->call([
            CoreUserSeeder::class, // Replaces AdminUserSeeder
        ]);

        $this->command->info('--- Starting Tier 2 (Student Assets) ---');
        $this->call([
            StudentAssetSeeder::class,
        ]);

        $this->command->info('--- Starting Tier 3 (Marketplace) ---');
        $this->call([
            InternshipMarketplaceSeeder::class,
        ]);

        $this->command->info('--- Starting Tier 4-7 (Transactions & Demo Data) ---');
        $this->call([
            DemoDataSeeder::class,
        ]);

        $this->command->info('Seeding completed successfully!');
    }
}
