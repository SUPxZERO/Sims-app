<?php

namespace Database\Factories;

use App\Models\InternshipListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipListingFactory extends Factory
{
    protected $model = InternshipListing::class;

    public function definition(): array
    {
        $titles = [
            'Software Engineering Intern', 'Frontend Developer Intern', 'Backend Developer Intern', 
            'Data Science Intern', 'Machine Learning Intern', 'DevOps Engineering Intern', 
            'Cybersecurity Intern', 'Cloud Architecture Intern', 'Mobile App Dev Intern',
            'UI/UX Design Intern', 'Product Management Intern', 'QA Automation Intern'
        ];

        $descriptions = [
            "Join our fast-paced engineering team to build scalable web applications. You will be working closely with senior developers to design, develop, and deploy new features. You'll gain hands-on experience with modern frameworks and agile methodologies in a production environment.",
            "We are looking for a passionate intern to help us process and analyze large datasets. You will assist in building data pipelines, creating dashboards, and deriving actionable insights that drive our business strategy. Great opportunity to work with Big Data technologies.",
            "As an intern on our cloud infrastructure team, you will help automate our CI/CD pipelines, optimize server performance, and maintain our Kubernetes clusters. You will learn the ins and outs of site reliability engineering and cloud-native deployments.",
            "Help us build the next generation of our mobile applications. You will collaborate with our design and product teams to implement pixel-perfect user interfaces and robust state management for both iOS and Android platforms.",
            "Security is our top priority. As a security intern, you will assist in vulnerability scanning, penetration testing, and implementing security protocols across our microservices architecture. A great role for someone looking to jumpstart a career in cybersecurity."
        ];

        $requirements = [
            "• Currently pursuing a BS/MS in Computer Science or related field\n• Strong understanding of Data Structures and Algorithms\n• Familiarity with Git and version control\n• Excellent problem-solving skills\n• Ability to work independently and in a team",
            "• Proficiency in at least one object-oriented programming language (Java, C++, Python)\n• Basic understanding of RESTful APIs and web architecture\n• Passion for writing clean, maintainable code\n• Strong communication skills",
            "• Experience with JavaScript/TypeScript and modern frontend frameworks (React, Vue, or Angular)\n• Solid understanding of HTML5/CSS3 and responsive design\n• Familiarity with state management libraries\n• An eye for design and user experience",
            "• Strong foundation in SQL and relational databases\n• Experience with Python and data analysis libraries (Pandas, NumPy)\n• Basic understanding of machine learning concepts is a plus\n• Strong analytical and mathematical skills"
        ];

        return [
            'company_user_id' => User::factory()->company(),
            'title' => fake()->randomElement($titles),
            'description' => fake()->randomElement($descriptions),
            'requirements' => fake()->randomElement($requirements),
            'location' => fake()->city() . ', ' . fake()->stateAbbr(),
            'work_mode' => fake()->randomElement(['ONSITE', 'REMOTE', 'HYBRID']),
            'duration_weeks' => fake()->randomElement([8, 12, 16, 24]),
            'quota' => fake()->numberBetween(1, 5),
            'filled_count' => 0,
            'stipend_info' => fake()->randomElement(['Unpaid', '$15/hr', '$20/hr', '$25/hr', '$3000 Monthly Stipend', '$4500 Monthly Stipend']),
            'application_deadline' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'status' => 'DRAFT',
            'min_gpa' => fake()->randomElement([null, 2.5, 3.0, 3.2, 3.5]),
            'preferred_departments' => fake()->randomElement(['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cybersecurity']),
        ];
    }
    
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'PUBLISHED',
            'published_at' => now(),
            'approved_by' => 1,
        ]);
    }
}
