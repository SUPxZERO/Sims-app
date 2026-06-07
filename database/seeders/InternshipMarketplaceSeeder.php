<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\InternshipListing;
use App\Models\ListingRequiredSkill;
use App\Models\Skill;

class InternshipMarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $companies = User::where('role', 'COMPANY')->get();
        $admin = User::where('role', 'ADMIN')->first();
        $skills = Skill::all();

        if ($companies->isEmpty() || !$admin || $skills->isEmpty()) {
            $this->command->warn('Companies, Admin, or Skills missing. Run CoreUserSeeder and SkillCategoryAndSkillSeeder first.');
            return;
        }

        foreach ($companies as $company) {
            // Each company creates 2 listings
            $listings = InternshipListing::factory()
                ->count(2)
                ->published() // Sets to PUBLISHED with admin approval
                ->create([
                    'company_user_id' => $company->user_id,
                    'approved_by' => $admin->user_id,
                ]);

            foreach ($listings as $listing) {
                // Attach 2-4 required skills to each published listing
                $randomSkills = $skills->random(fake()->numberBetween(2, 4));
                foreach ($randomSkills as $skill) {
                    ListingRequiredSkill::factory()->create([
                        'listing_id' => $listing->listing_id,
                        'skill_id' => $skill->skill_id,
                    ]);
                }
            }

            // Also create 1 pending listing for each company
            $pendingListing = InternshipListing::factory()
                ->create([
                    'company_user_id' => $company->user_id,
                    'status' => 'PENDING_APPROVAL',
                    'approved_by' => null,
                ]);

            // Attach 2-4 required skills to the pending listing
            $pendingRandomSkills = $skills->random(fake()->numberBetween(2, 4));
            foreach ($pendingRandomSkills as $skill) {
                ListingRequiredSkill::factory()->create([
                    'listing_id' => $pendingListing->listing_id,
                    'skill_id' => $skill->skill_id,
                ]);
            }
        }
    }
}
