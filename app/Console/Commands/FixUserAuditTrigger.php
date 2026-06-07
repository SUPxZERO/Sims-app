<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixUserAuditTrigger extends Command
{
    protected $signature   = 'db:fix-user-trigger';
    protected $description = 'Rebuild trg_users_audit with PRAGMA AUTONOMOUS_TRANSACTION to fix ORA-04091';

    public function handle()
    {
        // Drop the foreign key constraint that causes mutating table errors
        try {
            DB::unprepared("ALTER TABLE audit_logs DROP CONSTRAINT fk_auditlog_users");
            $this->info("Dropped constraint fk_auditlog_users.");
        } catch (\Exception $e) {
            $this->info("Constraint fk_auditlog_users may not exist: " . $e->getMessage());
        }

        // Recreate trigger without PRAGMA AUTONOMOUS_TRANSACTION
        $sql = "CREATE OR REPLACE TRIGGER trg_users_audit
AFTER UPDATE OR DELETE ON users
FOR EACH ROW
DECLARE
    v_old_json CLOB;
    v_new_json CLOB;
    v_action   VARCHAR2(10);
BEGIN
    IF DELETING THEN
        v_action   := 'DELETE';
        v_old_json := '{\"user_id\":' || :old.user_id ||
                      ',\"email\":\"' || :old.email ||
                      '\",\"full_name\":\"' || :old.full_name ||
                      '\",\"role\":\"' || :old.role ||
                      '\",\"status\":\"' || :old.status || '\"}';
        v_new_json := NULL;
    ELSIF UPDATING THEN
        v_action   := 'UPDATE';
        v_old_json := '{\"email\":\"' || :old.email ||
                      '\",\"full_name\":\"' || :old.full_name ||
                      '\",\"status\":\"' || :old.status || '\"}';
        v_new_json := '{\"email\":\"' || :new.email ||
                      '\",\"full_name\":\"' || :new.full_name ||
                      '\",\"status\":\"' || :new.status || '\"}';
    END IF;

    INSERT INTO audit_logs (
        audit_id, table_name, record_id, action, old_values, new_values, changed_by, changed_at
    ) VALUES (
        seq_audit_logs.NEXTVAL, 'USERS', :old.user_id, v_action, v_old_json, v_new_json,
        COALESCE(
            SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'),
            TO_CHAR(NVL(:new.user_id, :old.user_id))
        ),
        SYSTIMESTAMP
    );
END;";

        DB::unprepared($sql);
        $this->info('Trigger trg_users_audit rebuilt successfully WITHOUT autonomous transaction.');

        return 0;
    }
}
