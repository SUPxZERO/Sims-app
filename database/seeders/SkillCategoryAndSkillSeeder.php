<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillCategoryAndSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $taxonomy = [
            'Programming Languages' => [
                'description' => 'General-purpose and specialized programming languages',
                'sort_order' => 1,
                'skills' => [
                    'Python' => 'General-purpose programming language',
                    'Java' => 'Object-oriented programming language',
                    'JavaScript' => 'Web scripting language',
                    'TypeScript' => 'Typed superset of JavaScript',
                    'PHP' => 'Server-side scripting language',
                    'C#' => 'Microsoft .NET programming language',
                    'C++' => 'Systems and application programming language',
                ]
            ],
            'Web Frameworks' => [
                'description' => 'Frontend and backend web development frameworks',
                'sort_order' => 2,
                'skills' => [
                    'React' => 'Frontend JavaScript library by Meta',
                    'Laravel' => 'PHP web application framework',
                    'Node.js' => 'JavaScript runtime environment',
                    'Django' => 'Python web framework',
                ]
            ],
            'Databases' => [
                'description' => 'Relational and NoSQL database systems',
                'sort_order' => 3,
                'skills' => [
                    'Oracle Database' => 'Enterprise relational database system',
                    'MySQL' => 'Open-source relational database',
                    'PostgreSQL' => 'Advanced open-source relational database',
                    'SQL' => 'Structured Query Language',
                ]
            ],
            'DevOps & Cloud' => [
                'description' => 'Cloud platforms, CI/CD, and containerization',
                'sort_order' => 4,
                'skills' => [
                    'Docker' => 'Container platform',
                    'Kubernetes' => 'Container orchestration',
                    'AWS' => 'Amazon Web Services cloud platform',
                    'Git' => 'Version control system',
                ]
            ],
            'Design & Multimedia' => [
                'description' => 'UI/UX design and multimedia tools',
                'sort_order' => 5,
                'skills' => [
                    'Figma' => 'Collaborative UI design tool',
                    'UI/UX Design' => 'User interface and experience design',
                ]
            ],
            'Data Science & AI' => [
                'description' => 'Machine learning and data analysis technologies',
                'sort_order' => 6,
                'skills' => [
                    'Machine Learning' => 'Algorithms and statistical models',
                    'Data Analysis' => 'Statistical analysis and interpretation',
                ]
            ],
            'Business & Communication' => [
                'description' => 'Professional and business skills',
                'sort_order' => 7,
                'skills' => [
                    'Project Management' => 'Planning and executing projects',
                    'Technical Writing' => 'Documentation and technical communication',
                ]
            ],
            'Networking & Security' => [
                'description' => 'Network administration and cybersecurity',
                'sort_order' => 8,
                'skills' => [
                    'Network Administration' => 'Managing computer networks',
                    'Cybersecurity' => 'Information security practices',
                ]
            ],
        ];

        foreach ($taxonomy as $catName => $catData) {
            $category = SkillCategory::updateOrCreate(
                ['category_name' => $catName],
                [
                    'category_name' => $catName,
                    'description' => $catData['description'],
                    'sort_order' => $catData['sort_order'],
                    'is_active' => true,
                ]
            );

            foreach ($catData['skills'] as $skillName => $skillDesc) {
                Skill::updateOrCreate(
                    [
                        'skill_category_id' => $category->skill_category_id,
                        'skill_name' => $skillName
                    ],
                    [
                        'skill_category_id' => $category->skill_category_id,
                        'skill_name' => $skillName,
                        'description' => $skillDesc,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
