<?php

namespace Database\Factories;

use App\Models\ListingRequiredSkill;
use App\Models\InternshipListing;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingRequiredSkillFactory extends Factory
{
    protected $model = ListingRequiredSkill::class;

    public function definition(): array
    {
        $importance = fake()->randomElement(['REQUIRED', 'PREFERRED']);
        $weight = $importance === 'REQUIRED' ? 1.00 : 0.50;
        
        return [
            'listing_id' => InternshipListing::factory(),
            'skill_id' => Skill::inRandomOrder()->first()?->skill_id ?? 1,
            'importance' => $importance,
            'importance_weight' => $weight,
        ];
    }
}
