<?php

namespace Database\Factories;

use App\Models\CvExperience;
use App\Models\Cv;
use Illuminate\Database\Eloquent\Factories\Factory;

class CvExperienceFactory extends Factory
{
    protected $model = CvExperience::class;

    public function definition(): array
    {
        $startYear = fake()->numberBetween(2021, 2023);
        $startMonth = str_pad(fake()->numberBetween(1, 12), 2, '0', STR_PAD_LEFT);
        
        return [
            'cv_id' => Cv::factory(),
            'company_name' => fake()->company(),
            'position_title' => fake()->jobTitle(),
            'start_date' => "$startYear-$startMonth-01",
            'end_date' => null, // Present
            'description' => fake()->randomElement([
                "• Developed and maintained scalable RESTful APIs using Node.js and Express.\n• Collaborated with frontend developers to integrate APIs into React applications.\n• Participated in code reviews and agile ceremonies.",
                "• Assisted in building and training machine learning models for predictive analytics.\n• Processed and cleaned large datasets using Python and Pandas.\n• Created data visualization dashboards with Tableau.",
                "• Designed and implemented responsive UI components using React and Tailwind CSS.\n• Improved website load time by 20% through code splitting and asset optimization.\n• Worked closely with UI/UX designers to ensure pixel-perfect implementation.",
                "• Managed cloud infrastructure using AWS (EC2, S3, RDS).\n• Automated CI/CD pipelines using GitHub Actions and Docker.\n• Monitored system performance and implemented alerting using Datadog."
            ]),
            'sort_order' => 1,
        ];
    }
}
