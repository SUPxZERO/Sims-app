<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\InternshipListing;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\Internship;
use App\Models\WeeklyReport;
use App\Models\ReportAttachment;
use App\Models\ReportReview;
use App\Models\CompanyEvaluation;
use App\Models\EvaluationCriteriaScore;
use App\Models\LecturerGrade;
use App\Models\FinalScore;
use App\Models\RecommendationScore;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'STUDENT')->get();
        $lecturers = User::where('role', 'LECTURER')->get();
        $listings = InternshipListing::where('status', 'PUBLISHED')->get();

        if ($students->isEmpty() || $lecturers->isEmpty() || $listings->isEmpty()) {
            $this->command->warn('Missing prerequisites. Run previous seeders first.');
            return;
        }

        // 1. Recommendations and Applications
        foreach ($students as $student) {
            $cv = \App\Models\Cv::where('user_id', $student->user_id)->first();
            if (!$cv) continue;
            
            $cvVersion = $cv->versions()->first();
            if (!$cvVersion) continue;

            // Pick 1-3 random listings to apply to
            $appliedListings = $listings->random(fake()->numberBetween(1, 3));

            foreach ($appliedListings as $listing) {
                // Generate Recommendation Score
                RecommendationScore::factory()->create([
                    'user_id' => $student->user_id,
                    'listing_id' => $listing->listing_id,
                ]);

                // Decide if this application will be confirmed
                // We ensure quota is respected by checking filled_count
                $willBeConfirmed = fake()->boolean(30) && $listing->filled_count < $listing->quota;

                $appStatus = $willBeConfirmed ? 'CONFIRMED' : fake()->randomElement(['SUBMITTED', 'UNDER_REVIEW', 'REJECTED']);

                $application = Application::factory()->create([
                    'user_id' => $student->user_id,
                    'listing_id' => $listing->listing_id,
                    'cv_version_id' => $cvVersion->cv_version_id,
                    'status' => $appStatus,
                ]);

                // Application History
                ApplicationStatusHistory::factory()->create([
                    'application_id' => $application->application_id,
                    'to_status' => $appStatus,
                    'changed_by' => $student->user_id,
                ]);

                // 2. Internship Lifecycle
                if ($appStatus === 'CONFIRMED') {
                    $lecturer = $lecturers->random();

                    $isCompleted = fake()->boolean(50);
                    
                    $internshipFactory = Internship::factory();
                    if ($isCompleted) {
                        $internshipFactory = $internshipFactory->completed();
                    }

                    $internship = $internshipFactory->create([
                        'application_id' => $application->application_id,
                        'student_user_id' => $student->user_id,
                        'company_user_id' => $listing->company_user_id,
                        'lecturer_user_id' => $lecturer->user_id,
                        'listing_id' => $listing->listing_id,
                    ]);

                    // Weekly Reports are generated automatically by trigger trg_internships_init_reports
                    // So we update the existing ones instead of inserting new ones
                    $weeksToGenerate = $isCompleted ? $internship->total_weeks : fake()->numberBetween(1, 6);
                    
                    $reports = WeeklyReport::where('internship_id', $internship->internship_id)
                        ->where('week_number', '<=', $weeksToGenerate)
                        ->get();

                    foreach ($reports as $report) {
                        $reportStatus = fake()->randomElement(['SUBMITTED', 'APPROVED']);
                        
                        $report->update([
                            'activities' => fake()->paragraph(),
                            'challenges' => fake()->paragraph(),
                            'learnings' => fake()->paragraph(),
                            'hours_logged' => fake()->randomFloat(1, 30, 40),
                            'status' => $reportStatus,
                            'submitted_at' => now(),
                            'approved_at' => $reportStatus === 'APPROVED' ? now() : null,
                        ]);

                        // Report Attachments
                        if (fake()->boolean(70)) {
                            ReportAttachment::factory()->create(['report_id' => $report->report_id]);
                        }

                        // Report Review if approved
                        if ($reportStatus === 'APPROVED') {
                            ReportReview::factory()->create([
                                'report_id' => $report->report_id,
                                'reviewer_user_id' => $lecturer->user_id,
                                'decision' => 'APPROVED'
                            ]);
                        }
                    }

                    // 3. Evaluations and Grading (Only if completed)
                    if ($isCompleted) {
                        $companyEval = CompanyEvaluation::factory()->create([
                            'internship_id' => $internship->internship_id,
                            'evaluator_user_id' => $listing->company_user_id,
                        ]);

                        // Exactly 7 Criteria Scores
                        for ($i = 1; $i <= 7; $i++) {
                            EvaluationCriteriaScore::factory()->create([
                                'evaluation_id' => $companyEval->evaluation_id,
                                'criteria_id' => $i,
                            ]);
                        }

                        $lecturerGrade = LecturerGrade::factory()->create([
                            'internship_id' => $internship->internship_id,
                            'grader_user_id' => $lecturer->user_id,
                        ]);

                        // Final Score
                        FinalScore::factory()->create([
                            'internship_id' => $internship->internship_id,
                        ]);
                    }
                }
            }
        }
    }
}
