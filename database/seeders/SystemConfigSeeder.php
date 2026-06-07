<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            [
                'config_key' => 'REPORT_DEADLINE_DAY',
                'config_value' => 'SUNDAY',
                'config_type' => 'STRING',
                'description' => 'Default day of the week for weekly report submission deadline',
            ],
            [
                'config_key' => 'REPORT_DEADLINE_TIME',
                'config_value' => '23:59',
                'config_type' => 'STRING',
                'description' => 'Time of day for weekly report submission deadline',
            ],
            [
                'config_key' => 'MAX_ACTIVE_APPLICATIONS',
                'config_value' => '3',
                'config_type' => 'INTEGER',
                'description' => 'Maximum number of active applications per student',
            ],
            [
                'config_key' => 'MAX_REVISION_REQUESTS',
                'config_value' => '2',
                'config_type' => 'INTEGER',
                'description' => 'Maximum number of revision requests per weekly report',
            ],
            [
                'config_key' => 'COMPANY_EVAL_DEADLINE_DAYS',
                'config_value' => '14',
                'config_type' => 'INTEGER',
                'description' => 'Days after internship end for company evaluation submission',
            ],
            [
                'config_key' => 'REMINDER_HOURS_BEFORE',
                'config_value' => '24',
                'config_type' => 'INTEGER',
                'description' => 'Hours before deadline to send reminder notification',
            ],
            [
                'config_key' => 'COMPANY_EVAL_WEIGHT',
                'config_value' => '0.40',
                'config_type' => 'DECIMAL',
                'description' => 'Weight of company evaluation in final score',
            ],
            [
                'config_key' => 'LECTURER_GRADE_WEIGHT',
                'config_value' => '0.40',
                'config_type' => 'DECIMAL',
                'description' => 'Weight of lecturer grade in final score',
            ],
            [
                'config_key' => 'ATTENDANCE_WEIGHT',
                'config_value' => '0.20',
                'config_type' => 'DECIMAL',
                'description' => 'Weight of attendance score in final score',
            ],
            [
                'config_key' => 'ACCOUNT_LOCK_DURATION_MINUTES',
                'config_value' => '30',
                'config_type' => 'INTEGER',
                'description' => 'Duration for account lock on failed login attempts',
            ],
            [
                'config_key' => 'MAX_FAILED_LOGIN_ATTEMPTS',
                'config_value' => '5',
                'config_type' => 'INTEGER',
                'description' => 'Failed login attempts before account lock',
            ],
            [
                'config_key' => 'JWT_ACCESS_TOKEN_EXPIRY_MINUTES',
                'config_value' => '60',
                'config_type' => 'INTEGER',
                'description' => 'JWT access token expiry in minutes',
            ],
            [
                'config_key' => 'JWT_REFRESH_TOKEN_EXPIRY_DAYS',
                'config_value' => '7',
                'config_type' => 'INTEGER',
                'description' => 'JWT refresh token expiry in days',
            ],
            [
                'config_key' => 'MAX_FILE_SIZE_BYTES',
                'config_value' => '5242880',
                'config_type' => 'INTEGER',
                'description' => 'Maximum file upload size in bytes (5 MB)',
            ],
            [
                'config_key' => 'MAX_REPORT_ATTACHMENTS',
                'config_value' => '3',
                'config_type' => 'INTEGER',
                'description' => 'Maximum number of file attachments per weekly report',
            ],
        ];

        foreach ($configs as $config) {
            SystemConfig::updateOrCreate(
                ['config_key' => $config['config_key']],
                $config
            );
        }
    }
}
