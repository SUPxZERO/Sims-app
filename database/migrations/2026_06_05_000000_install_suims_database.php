<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only run for Oracle connection
        if (DB::getDriverName() !== 'oracle') {
            return;
        }

        // 1. Install Sequences
        $script1 = File::get(database_path('sql/script1_sequences.sql'));
        $this->executeSqlScript($script1);

        // 2. Install Tables
        $script2 = File::get(database_path('sql/script2_tables.sql'));
        $this->executeSqlScript($script2);

        // 3. Install Indexes
        $script3 = File::get(database_path('sql/script3_indexes.sql'));
        $this->executeSqlScript($script3);

        // 4. Seeding Config Data
        $script4 = File::get(database_path('sql/script4_seed_data.sql'));
        $this->executeSqlScript($script4);

        // 5. Install PL/SQL Objects (Triggers & Packages)
        $script6 = File::get(database_path('oracle/script6_plsql_objects.sql'));
        $this->executeSqlScript($script6);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'oracle') {
            return;
        }

        // Run cleanup
        $cleanup = File::get(database_path('sql/script5_cleanup.sql'));
        $this->executeSqlScript($cleanup);
    }

    /**
     * Helper to split SQL script by commands (handling PL/SQL blocks and standard statements)
     */
    private function executeSqlScript(string $scriptContent): void
    {
        // Normalize line endings
        $scriptContent = str_replace("\r\n", "\n", $scriptContent);

        // Split standard SQL commands by semicolon, but do NOT split inside PL/SQL blocks (which use BEGIN/END and are terminated by /)
        // A simple approach is to look for PL/SQL blocks ending with / on a new line.
        // Let's parse the script into tokens separated by '/' for PL/SQL, and ';' for standard SQL.
        
        // Let's use a regex split or basic parsing
        // Since our scripts are structured cleanly:
        // - Sequences, Tables, Indexes, Seeds are terminated by ';'
        // - PL/SQL blocks are terminated by '/' on a new line.
        // Let's split using a custom parser:
        
        $statements = [];
        $currentStatement = '';
        $lines = explode("\n", $scriptContent);
        $inPlSql = false;

        foreach ($lines as $line) {
            // Skip comments
            if (str_starts_with(trim($line), '--')) {
                continue;
            }
            // Skip SQL*Plus commands (e.g. SET DEFINE OFF, SHOW ERRORS)
            if (preg_match('/^\s*(SET\s+(DEFINE|SERVEROUTPUT)\b|SHOW\s+ERRORS\b)/i', $line)) {
                continue;
            }
            if (empty(trim($line))) {
                continue;
            }

            $currentStatement .= $line . "\n";

            // Detect PL/SQL block start
            if (preg_match('/^\s*(BEGIN|CREATE OR REPLACE TRIGGER|CREATE OR REPLACE PACKAGE)/i', $line)) {
                $inPlSql = true;
            }

            if ($inPlSql) {
                // PL/SQL ends with '/' on a line by itself
                if (trim($line) === '/') {
                    $statements[] = rtrim(trim($currentStatement), '/');
                    $currentStatement = '';
                    $inPlSql = false;
                }
            } else {
                // Standard SQL ends with ';'
                if (str_ends_with(trim($line), ';')) {
                    $statements[] = rtrim(trim($currentStatement), ';');
                    $currentStatement = '';
                }
            }
        }

        // Execute each parsed statement
        foreach ($statements as $statement) {
            if (!empty(trim($statement))) {
                DB::unprepared($statement);
            }
        }
    }
};
