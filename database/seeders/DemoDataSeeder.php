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

        $this->createShowcaseInternship();

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
                            'activities' => fake()->randomElement([
                                "Set up the local development environment. Attended onboarding sessions and met the engineering team. Started reading the system architecture documentation.",
                                "Assigned my first Jira ticket. Implemented a new REST endpoint for user profile retrieval. Wrote unit tests for the new endpoint using PHPUnit.",
                                "Participated in sprint planning. Refactored the legacy authentication module to use JWT tokens. Collaborated with the frontend team to integrate the new auth flow.",
                                "Worked on optimizing database queries that were causing performance bottlenecks. Created new indexes and rewrote several complex JOINs."
                            ]),
                            'challenges' => fake()->randomElement([
                                "Struggled initially with setting up Docker and understanding the networking between the local containers. Reached out to a senior developer for help.",
                                "Found it challenging to understand the legacy codebase without much documentation. Had to trace the execution flow step by step.",
                                "Ran into some Git merge conflicts when rebasing my branch onto the latest main. Managed to resolve them after carefully reviewing the diffs.",
                                "Had difficulty figuring out the right assertions to use for a complex integration test, but eventually found the solution in the framework's documentation."
                            ]),
                            'learnings' => fake()->randomElement([
                                "Learned how to properly use Docker Compose for local environment orchestration. Gained a better understanding of microservices architecture.",
                                "Deepened my knowledge of Laravel's Eloquent ORM, specifically how to use eager loading to prevent N+1 query problems.",
                                "Gained practical experience with Git workflow in a team setting, including creating pull requests and responding to code reviews.",
                                "Learned about the importance of writing clean, maintainable code and the principles of SOLID design."
                            ]),
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

    private function createShowcaseInternship(): void
    {
        $student = User::where('email', 'student@suims.edu')->first();
        $company = User::where('email', 'company@suims.edu')->first();
        $lecturer = User::where('email', 'lecturer@suims.edu')->first();

        if (!$student || !$company || !$lecturer) return;

        $cv = \App\Models\Cv::where('user_id', $student->user_id)->first();
        if (!$cv) return;
        $cvVersion = $cv->versions()->first();

        $listing = InternshipListing::factory()->create([
            'company_user_id' => $company->user_id,
            'title' => 'Software Engineering Intern (Showcase)',
            'status' => 'PUBLISHED',
            'quota' => 5,
        ]);

        $application = Application::factory()->create([
            'user_id' => $student->user_id,
            'listing_id' => $listing->listing_id,
            'cv_version_id' => $cvVersion->cv_version_id,
            'status' => 'CONFIRMED',
        ]);
        
        ApplicationStatusHistory::factory()->create([
            'application_id' => $application->application_id,
            'to_status' => 'CONFIRMED',
            'changed_by' => $student->user_id,
        ]);

        $internship = Internship::factory()->create([
            'application_id' => $application->application_id,
            'student_user_id' => $student->user_id,
            'company_user_id' => $company->user_id,
            'lecturer_user_id' => $lecturer->user_id,
            'listing_id' => $listing->listing_id,
        ]);

        $reports = WeeklyReport::where('internship_id', $internship->internship_id)
            ->orderBy('week_number', 'asc')
            ->get();
            
        $statuses = [
            1 => 'APPROVED',
            2 => 'APPROVED',
            3 => 'SUBMITTED',
            4 => 'REVISION_REQUESTED',
            5 => 'REJECTED',
            6 => 'DRAFT',
        ];

        foreach ($reports as $report) {
            $week = $report->week_number;
            if (isset($statuses[$week])) {
                $status = $statuses[$week];
                $report->update([
                    'activities' => 'Showcase activities for week ' . $week . '. Working heavily on the new features as requested.',
                    'challenges' => 'Showcase challenges for week ' . $week . '. Encountered some issues with the database indexing.',
                    'learnings' => 'Showcase learnings for week ' . $week . '. Learned how to optimize the queries properly.',
                    'hours_logged' => 40,
                    'status' => $status,
                    'submitted_at' => in_array($status, ['SUBMITTED', 'APPROVED', 'REVISION_REQUESTED', 'REJECTED']) ? now() : null,
                    'approved_at' => $status === 'APPROVED' ? now() : null,
                ]);

                if (in_array($status, ['APPROVED', 'REVISION_REQUESTED', 'REJECTED'])) {
                    ReportReview::factory()->create([
                        'report_id' => $report->report_id,
                        'reviewer_user_id' => $lecturer->user_id,
                        'decision' => $status,
                        'comments' => 'Showcase review comment for ' . $status,
                    ]);
                }
            }
        }
    }
}
