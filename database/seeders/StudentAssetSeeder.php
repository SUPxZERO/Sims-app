<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cv;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvSkill;
use App\Models\CvDocument;
use App\Models\CvVersion;
use App\Models\Skill;

class StudentAssetSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'STUDENT')->get();
        $skills = Skill::all();

        if ($skills->isEmpty()) {
            $this->command->warn('No skills found. Please run SkillCategoryAndSkillSeeder first.');
            return;
        }

        foreach ($students as $student) {
            // Ensure student has exactly one CV
            $cv = Cv::firstOrCreate(
                ['user_id' => $student->user_id],
                [
                    'personal_summary' => fake()->paragraph(),
                    'status' => 'COMPLETE',
                    'visibility' => 'PUBLIC',
                    'current_version' => 1,
                ]
            );

            // Add Education (1-2 entries)
            if ($cv->educations()->count() === 0) {
                CvEducation::factory()->count(fake()->numberBetween(1, 2))->create([
                    'cv_id' => $cv->cv_id,
                ]);
            }

            // Add Experience (0-2 entries)
            if ($cv->experiences()->count() === 0) {
                $expCount = fake()->numberBetween(0, 2);
                if ($expCount > 0) {
                    CvExperience::factory()->count($expCount)->create([
                        'cv_id' => $cv->cv_id,
                    ]);
                }
            }

            // Add Skills (3-7 entries)
            if ($cv->cvSkills()->count() === 0) {
                $randomSkills = $skills->random(fake()->numberBetween(3, 7));
                foreach ($randomSkills as $skill) {
                    CvSkill::factory()->create([
                        'cv_id' => $cv->cv_id,
                        'skill_id' => $skill->skill_id,
                    ]);
                }
            }

            // Add Document (1 entry)
            if ($cv->documents()->count() === 0) {
                CvDocument::factory()->create([
                    'cv_id' => $cv->cv_id,
                ]);
            }

            // Create Snapshot Version
            if ($cv->versions()->count() === 0) {
                $snapshotData = [
                    'personal_summary' => $cv->personal_summary,
                    'educations' => $cv->educations->toArray(),
                    'experiences' => $cv->experiences->toArray(),
                    'skills' => $cv->cvSkills->load('skill')->toArray(),
                ];

                CvVersion::factory()->create([
                    'cv_id' => $cv->cv_id,
                    'version_number' => 1,
                    'snapshot_data' => $snapshotData,
                ]);
            }
        }
    }
}
