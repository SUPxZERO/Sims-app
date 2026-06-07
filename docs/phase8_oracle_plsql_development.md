# PHASE 8: ORACLE PL/SQL DEVELOPMENT

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 7 (Oracle SQL Implementation)  
> **Database Platform:** Oracle Database 19c+  
> **Objective:** Deliver enterprise-grade, high-performance database-tier automation, business rule enforcement, and computational packages.

---

## 8.1 Trigger Architecture

SUIMS delegates critical transactional and audit rules to Oracle database triggers. This guarantees consistency across all access channels (Laravel REST API, direct database CLI, and administrative dashboards).

### 8.1.1 `trg_users_audit` (Audit Logging)
Captures updates and deletions on the `users` table and writes the state differences to the `audit_logs` table in JSON format.

```sql
CREATE OR REPLACE TRIGGER trg_users_audit
AFTER UPDATE OR DELETE ON users
FOR EACH ROW
DECLARE
    v_old_json CLOB;
    v_new_json CLOB;
    v_action   VARCHAR2(10);
BEGIN
    IF DELETING THEN
        v_action := 'DELETE';
        v_old_json := '{"user_id":' || :old.user_id || 
                      ',"email":"' || :old.email || 
                      '","full_name":"' || :old.full_name || 
                      '","role":"' || :old.role || 
                      '","status":"' || :old.status || '"}';
        v_new_json := NULL;
    ELSIF UPDATING THEN
        v_action := 'UPDATE';
        v_old_json := '{"email":"' || :old.email || 
                      '","full_name":"' || :old.full_name || 
                      '","status":"' || :old.status || '"}';
        v_new_json := '{"email":"' || :new.email || 
                      '","full_name":"' || :new.full_name || 
                      '","status":"' || :new.status || '"}';
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
END;
/
```

### 8.1.2 `trg_applications_history` (Status Tracking)
Maintains a chronological log of application status transitions.

```sql
CREATE OR REPLACE TRIGGER trg_applications_history
AFTER INSERT OR UPDATE OF status ON applications
FOR EACH ROW
BEGIN
    INSERT INTO application_status_history (
        history_id, application_id, from_status, to_status, changed_by, change_reason, changed_at
    ) VALUES (
        seq_app_status_history.NEXTVAL,
        :new.application_id,
        CASE WHEN INSERTING THEN NULL ELSE :old.status END,
        :new.status,
        :new.user_id,
        CASE 
            WHEN INSERTING THEN 'Application submitted.'
            ELSE 'Status updated to ' || :new.status
        END,
        SYSTIMESTAMP
    );
END;
/
```

### 8.1.3 `trg_applications_autowithdraw` (Compound Trigger)
To prevent `ORA-04091: table is mutating` when updating other applications of a student once their placement is confirmed, a **Compound Trigger** is utilized. It collects the student ID in the row-level phase and performs bulk status updates in the statement-level phase.

```sql
CREATE OR REPLACE TRIGGER trg_applications_autowithdraw
FOR UPDATE OF status ON applications
COMPOUND TRIGGER
    TYPE t_student_rec IS RECORD (
        student_user_id NUMBER(10),
        confirmed_app_id NUMBER(10)
    );
    TYPE t_student_list IS TABLE OF t_student_rec;
    v_confirmed_students t_student_list := t_student_list();

    AFTER EACH ROW IS
    BEGIN
        IF :new.status = 'CONFIRMED' AND (:old.status IS NULL OR :old.status != 'CONFIRMED') THEN
            v_confirmed_students.EXTEND;
            v_confirmed_students(v_confirmed_students.LAST).student_user_id := :new.user_id;
            v_confirmed_students(v_confirmed_students.LAST).confirmed_app_id := :new.application_id;
        END IF;
    END AFTER EACH ROW;

    AFTER STATEMENT IS
    BEGIN
        IF v_confirmed_students.COUNT > 0 THEN
            FOR i IN 1..v_confirmed_students.COUNT LOOP
                -- Auto-withdraw other active applications
                UPDATE applications
                SET status = 'AUTO_WITHDRAWN',
                    updated_at = SYSTIMESTAMP
                WHERE user_id = v_confirmed_students(i).student_user_id
                  AND application_id != v_confirmed_students(i).confirmed_app_id
                  AND status IN ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED');
            END LOOP;
        END IF;
    END AFTER STATEMENT;
END trg_applications_autowithdraw;
/
```

### 8.1.4 `trg_internships_init_reports` (Report Generation)
Generates the expected weekly report placeholders chronologically when an internship begins.

```sql
CREATE OR REPLACE TRIGGER trg_internships_init_reports
AFTER INSERT ON internships
FOR EACH ROW
DECLARE
    v_start_date DATE;
    v_end_date   DATE;
BEGIN
    FOR w IN 1..:new.total_weeks LOOP
        v_start_date := :new.start_date + (w - 1) * 7;
        v_end_date   := v_start_date + 6;
        
        INSERT INTO weekly_reports (
            report_id, internship_id, week_number, week_start_date, week_end_date, status, is_late, revision_count, created_at, updated_at
        ) VALUES (
            seq_weekly_reports.NEXTVAL,
            :new.internship_id,
            w,
            v_start_date,
            v_end_date,
            'NOT_STARTED',
            0,
            0,
            SYSTIMESTAMP,
            SYSTIMESTAMP
        );
    END LOOP;
END;
/
```

### 8.1.5 `trg_internship_quota` (Quota Management)
Increments listing filled counts on internship activation. If the quota is filled, the listing is automatically marked as `CLOSED`.

```sql
CREATE OR REPLACE TRIGGER trg_internship_quota
AFTER INSERT ON internships
FOR EACH ROW
DECLARE
    v_quota        NUMBER(3);
    v_filled_count NUMBER(3);
BEGIN
    -- Update listing filled count
    UPDATE internship_listings
    SET filled_count = filled_count + 1,
        updated_at = SYSTIMESTAMP
    WHERE listing_id = :new.listing_id;

    -- Fetch updated details
    SELECT quota, filled_count INTO v_quota, v_filled_count
    FROM internship_listings
    WHERE listing_id = :new.listing_id;

    -- Auto-close if quota is reached
    IF v_filled_count >= v_quota THEN
        UPDATE internship_listings
        SET status = 'CLOSED',
            updated_at = SYSTIMESTAMP
        WHERE listing_id = :new.listing_id;
    END IF;
END;
/
```

### 8.1.6 `trg_weekly_reports_late_check` (Submission Compliance)
Intercepts report updates to set `is_late` flags based on the configured weekly submission deadlines.

```sql
CREATE OR REPLACE TRIGGER trg_weekly_reports_late_check
BEFORE UPDATE OF status ON weekly_reports
FOR EACH ROW
BEGIN
    IF :new.status = 'SUBMITTED' AND (:old.status IS NULL OR :old.status != 'SUBMITTED') THEN
        :new.submitted_at := SYSTIMESTAMP;
        
        -- Late if current date is greater than the report week end date
        IF TRUNC(SYSDATE) > TRUNC(:new.week_end_date) THEN
            :new.is_late := 1;
        ELSE
            :new.is_late := 0;
        END IF;
    END IF;
END;
/
```

---

## 8.2 Package 1: `pkg_recommendation_engine`

The SUIMS Recommendation Engine uses dynamic multi-criteria weighted matching to compute real-time compatibility profiles.

### 8.2.1 Package Specification
```sql
CREATE OR REPLACE PACKAGE pkg_recommendation_engine AS
    -- Computes recommendations for a single student profile
    PROCEDURE calculate_student_recommendations(p_user_id IN NUMBER);
    
    -- Computes recommendations for all students against a new listing
    PROCEDURE calculate_listing_recommendations(p_listing_id IN NUMBER);
    
    -- Triggers a global system-wide recalculation (typically runs during config updates)
    PROCEDURE recalculate_all_recommendations;
    
    -- Helper functions (exposed for testing)
    FUNCTION calculate_skill_match_score(p_cv_id IN NUMBER, p_listing_id IN NUMBER) RETURN NUMBER;
    FUNCTION calculate_gpa_match_score(p_gpa IN NUMBER, p_min_gpa IN NUMBER) RETURN NUMBER;
    FUNCTION calculate_preference_match_score(p_department IN VARCHAR2, p_listing_id IN NUMBER) RETURN NUMBER;
END pkg_recommendation_engine;
/
```

### 8.2.2 Package Body
```sql
CREATE OR REPLACE PACKAGE BODY pkg_recommendation_engine AS

    FUNCTION calculate_skill_match_score(p_cv_id IN NUMBER, p_listing_id IN NUMBER) RETURN NUMBER IS
        v_numerator   NUMBER(8,4) := 0;
        v_denominator NUMBER(8,4) := 0;
    BEGIN
        -- Numerator: Sum (student proficiency_weight * listing importance_weight) for matching skills
        SELECT NVL(SUM(cs.proficiency_weight * lrs.importance_weight), 0)
        INTO v_numerator
        FROM listing_required_skills lrs
        JOIN cv_skills cs ON cs.skill_id = lrs.skill_id
        WHERE lrs.listing_id = p_listing_id
          AND cs.cv_id = p_cv_id;

        -- Denominator: Sum (listing importance_weight) for all required/preferred skills
        SELECT NVL(SUM(importance_weight), 0)
        INTO v_denominator
        FROM listing_required_skills
        WHERE listing_id = p_listing_id;

        IF v_denominator = 0 THEN
            RETURN 100.00; -- No skill requirements listed -> 100% baseline match
        END IF;

        RETURN ROUND((v_numerator / v_denominator) * 100, 2);
    END calculate_skill_match_score;

    FUNCTION calculate_gpa_match_score(p_gpa IN NUMBER, p_min_gpa IN NUMBER) RETURN NUMBER IS
    BEGIN
        IF p_min_gpa IS NULL OR p_min_gpa = 0 THEN
            RETURN 100.00;
        END IF;

        IF p_gpa >= p_min_gpa THEN
            RETURN 100.00;
        ELSE
            RETURN ROUND(GREATEST(0, (p_gpa / p_min_gpa) * 100), 2);
        END IF;
    END calculate_gpa_match_score;

    FUNCTION calculate_preference_match_score(p_department IN VARCHAR2, p_listing_id IN NUMBER) RETURN NUMBER IS
        v_pref_depts VARCHAR2(500);
    BEGIN
        SELECT preferred_departments INTO v_pref_depts
        FROM internship_listings
        WHERE listing_id = p_listing_id;

        IF v_pref_depts IS NULL OR TRIM(v_pref_depts) = '' THEN
            RETURN 100.00; -- No preferences set -> 100% baseline match
        END IF;

        -- Check department in comma-separated list
        IF INSTR(',' || REPLACE(v_pref_depts, ' ', '') || ',', ',' || p_department || ',') > 0 THEN
            RETURN 100.00;
        ELSE
            RETURN 25.00; -- Standard penalty for non-matching department
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0.00;
    END calculate_preference_match_score;

    PROCEDURE calculate_student_recommendations(p_user_id IN NUMBER) IS
        v_cv_id         NUMBER(10);
        v_gpa           NUMBER(3,2);
        v_dept          VARCHAR2(100);
        v_skill_w       NUMBER(3,2);
        v_gpa_w         NUMBER(3,2);
        v_pref_w        NUMBER(3,2);
        v_threshold     NUMBER(5,2);
        v_max_rec       NUMBER(3);
        
        v_s_score       NUMBER(5,2);
        v_g_score       NUMBER(5,2);
        v_p_score       NUMBER(5,2);
        v_composite     NUMBER(5,2);
        v_skills_matched NUMBER(3);
        v_skills_total  NUMBER(3);
    BEGIN
        -- 1. Fetch Student Profile and CV Info
        SELECT sp.gpa, sp.department, cv.cv_id
        INTO v_gpa, v_dept, v_cv_id
        FROM student_profiles sp
        JOIN cvs cv ON cv.user_id = sp.user_id
        WHERE sp.user_id = p_user_id;

        -- 2. Fetch Matching Config Weights
        SELECT skill_weight, gpa_weight, preference_weight, min_score_threshold, max_recommendations
        INTO v_skill_w, v_gpa_w, v_pref_w, v_threshold, v_max_rec
        FROM matching_weight_configs
        WHERE config_id = 1;

        -- 3. Delete existing recommendations for this student
        DELETE FROM recommendation_scores WHERE user_id = p_user_id;

        -- 4. Calculate scores for all published and active listings
        FOR lst IN (
            SELECT listing_id, min_gpa
            FROM internship_listings
            WHERE status = 'PUBLISHED'
              AND application_deadline >= TRUNC(SYSDATE)
        ) LOOP
            v_s_score := calculate_skill_match_score(v_cv_id, lst.listing_id);
            v_g_score := calculate_gpa_match_score(v_gpa, lst.min_gpa);
            v_p_score := calculate_preference_match_score(v_dept, lst.listing_id);

            v_composite := ROUND(
                (v_s_score * v_skill_w) + (v_g_score * v_gpa_w) + (v_p_score * v_pref_w), 2
            );

            -- Calculate auxiliary metadata
            SELECT COUNT(*) INTO v_skills_total
            FROM listing_required_skills WHERE listing_id = lst.listing_id;

            SELECT COUNT(*) INTO v_skills_matched
            FROM listing_required_skills lrs
            JOIN cv_skills cs ON cs.skill_id = lrs.skill_id
            WHERE lrs.listing_id = lst.listing_id AND cs.cv_id = v_cv_id;

            -- Save if composite score meets the configured threshold
            IF v_composite >= v_threshold THEN
                INSERT INTO recommendation_scores (
                    recommendation_id, user_id, listing_id, skill_match_score, gpa_match_score,
                    preference_match_score, composite_score, skill_weight_used, gpa_weight_used,
                    preference_weight_used, matched_skills_count, total_required_skills, calculated_at
                ) VALUES (
                    seq_recommendation_scores.NEXTVAL, p_user_id, lst.listing_id, v_s_score, v_g_score,
                    v_p_score, v_composite, v_skill_w, v_gpa_w, v_pref_w, v_skills_matched, v_skills_total,
                    SYSTIMESTAMP
                );
            END IF;
        END LOOP;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            NULL; -- Student does not have a complete profile or CV -> skip
    END calculate_student_recommendations;

    PROCEDURE calculate_listing_recommendations(p_listing_id IN NUMBER) IS
        v_skill_w       NUMBER(3,2);
        v_gpa_w         NUMBER(3,2);
        v_pref_w        NUMBER(3,2);
        v_threshold     NUMBER(5,2);
        v_max_rec       NUMBER(3);
        v_min_gpa       NUMBER(3,2);
        v_skills_total  NUMBER(3);

        v_s_score       NUMBER(5,2);
        v_g_score       NUMBER(5,2);
        v_p_score       NUMBER(5,2);
        v_composite     NUMBER(5,2);
        v_skills_matched NUMBER(3);
    BEGIN
        -- Fetch weights
        SELECT skill_weight, gpa_weight, preference_weight, min_score_threshold, max_recommendations
        INTO v_skill_w, v_gpa_w, v_pref_w, v_threshold, v_max_rec
        FROM matching_weight_configs
        WHERE config_id = 1;

        SELECT min_gpa INTO v_min_gpa
        FROM internship_listings
        WHERE listing_id = p_listing_id;

        SELECT COUNT(*) INTO v_skills_total
        FROM listing_required_skills WHERE listing_id = p_listing_id;

        -- Clear existing recommendations for this listing
        DELETE FROM recommendation_scores WHERE listing_id = p_listing_id;

        -- Loop through students who have a CV
        FOR std IN (
            SELECT sp.user_id, sp.gpa, sp.department, cv.cv_id
            FROM student_profiles sp
            JOIN cvs cv ON cv.user_id = sp.user_id
        ) LOOP
            v_s_score := calculate_skill_match_score(std.cv_id, p_listing_id);
            v_g_score := calculate_gpa_match_score(std.gpa, v_min_gpa);
            v_p_score := calculate_preference_match_score(std.department, p_listing_id);

            v_composite := ROUND(
                (v_s_score * v_skill_w) + (v_g_score * v_gpa_w) + (v_p_score * v_pref_w), 2
            );

            SELECT COUNT(*) INTO v_skills_matched
            FROM listing_required_skills lrs
            JOIN cv_skills cs ON cs.skill_id = lrs.skill_id
            WHERE lrs.listing_id = p_listing_id AND cs.cv_id = std.cv_id;

            IF v_composite >= v_threshold THEN
                INSERT INTO recommendation_scores (
                    recommendation_id, user_id, listing_id, skill_match_score, gpa_match_score,
                    preference_match_score, composite_score, skill_weight_used, gpa_weight_used,
                    preference_weight_used, matched_skills_count, total_required_skills, calculated_at
                ) VALUES (
                    seq_recommendation_scores.NEXTVAL, std.user_id, p_listing_id, v_s_score, v_g_score,
                    v_p_score, v_composite, v_skill_w, v_gpa_w, v_pref_w, v_skills_matched, v_skills_total,
                    SYSTIMESTAMP
                );
            END IF;
        END LOOP;
    END calculate_listing_recommendations;

    PROCEDURE recalculate_all_recommendations IS
    BEGIN
        FOR std IN (SELECT user_id FROM student_profiles) LOOP
            calculate_student_recommendations(std.user_id);
        END LOOP;
    END recalculate_all_recommendations;

END pkg_recommendation_engine;
/
```

---

## 8.3 Package 2: `pkg_grading_engine`

Automates internship attendance evaluation and composite grading in compliance with university academic guidelines.

### 8.3.1 Package Specification
```sql
CREATE OR REPLACE PACKAGE pkg_grading_engine AS
    -- Calculates and saves final scores and letter grade for an internship
    PROCEDURE calculate_final_score(p_internship_id IN NUMBER);
    
    -- Computes attendance score from weekly reports (exposed for testing)
    FUNCTION calculate_attendance_score(p_internship_id IN NUMBER, p_total_weeks IN NUMBER) RETURN NUMBER;
END pkg_grading_engine;
/
```

### 8.3.2 Package Body
```sql
CREATE OR REPLACE PACKAGE BODY pkg_grading_engine AS

    FUNCTION calculate_attendance_score(p_internship_id IN NUMBER, p_total_weeks IN NUMBER) RETURN NUMBER IS
        v_on_time_count NUMBER(3) := 0;
        v_late_count    NUMBER(3) := 0;
    BEGIN
        -- Count report compliance
        SELECT COUNT(*) INTO v_on_time_count
        FROM weekly_reports
        WHERE internship_id = p_internship_id
          AND status IN ('APPROVED', 'SUBMITTED', 'REVISION_REQUESTED')
          AND is_late = 0;

        SELECT COUNT(*) INTO v_late_count
        FROM weekly_reports
        WHERE internship_id = p_internship_id
          AND status IN ('APPROVED', 'SUBMITTED', 'REVISION_REQUESTED')
          AND is_late = 1;

        IF p_total_weeks = 0 THEN
            RETURN 0.00;
        END IF;

        -- Attendance logic: On-time reports get 100% credit, late reports get 50% credit
        RETURN ROUND(
            (((v_on_time_count * 1.0) + (v_late_count * 0.5)) / p_total_weeks) * 100,
            2
        );
    END calculate_attendance_score;

    PROCEDURE calculate_final_score(p_internship_id IN NUMBER) IS
        v_total_weeks        NUMBER(2);
        v_attendance_score   NUMBER(5,2);
        v_company_score      NUMBER(5,2);
        v_lecturer_score     NUMBER(5,2);
        v_composite_score    NUMBER(5,2);
        
        -- Default Grading Config Weights
        v_company_weight     NUMBER(3,2) := 0.40;
        v_lecturer_weight    NUMBER(3,2) := 0.40;
        v_attendance_weight  NUMBER(3,2) := 0.20;
        
        v_letter_grade       VARCHAR2(5) := 'F';
    BEGIN
        -- 1. Fetch total internship weeks
        SELECT total_weeks INTO v_total_weeks
        FROM internships
        WHERE internship_id = p_internship_id;

        -- 2. Calculate Report Attendance Score
        v_attendance_score := calculate_attendance_score(p_internship_id, v_total_weeks);

        -- 3. Fetch Company Evaluation Score (must be locked/submitted)
        BEGIN
            SELECT composite_score INTO v_company_score
            FROM company_evaluations
            WHERE internship_id = p_internship_id
              AND status IN ('SUBMITTED', 'LOCKED');
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_company_score := 0.00; -- Set to 0 if not yet evaluated
        END;

        -- 4. Fetch Lecturer Grade Score
        BEGIN
            SELECT composite_score INTO v_lecturer_score
            FROM lecturer_grades
            WHERE internship_id = p_internship_id
              AND status IN ('SUBMITTED', 'LOCKED');
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_lecturer_score := 0.00; -- Set to 0 if not yet graded
        END;

        -- 5. Fetch config overrides if they exist in system_configs
        BEGIN
            SELECT TO_NUMBER(config_value) INTO v_company_weight 
            FROM system_configs WHERE config_key = 'WEIGHT_COMPANY_EVAL';
            SELECT TO_NUMBER(config_value) INTO v_lecturer_weight 
            FROM system_configs WHERE config_key = 'WEIGHT_LECTURER_GRADE';
            SELECT TO_NUMBER(config_value) INTO v_attendance_weight 
            FROM system_configs WHERE config_key = 'WEIGHT_ATTENDANCE';
        EXCEPTION
            WHEN OTHERS THEN
                NULL; -- Keep defaults if config query fails
        END;

        -- 6. Calculate Final Score (CE * CW + LG * LW + AT * AW)
        v_composite_score := ROUND(
            (v_company_score * v_company_weight) +
            (v_lecturer_score * v_lecturer_weight) +
            (v_attendance_score * v_attendance_weight),
            2
        );

        -- 7. Convert composite score to Letter Grade using grading_scales
        BEGIN
            SELECT letter_grade INTO v_letter_grade
            FROM grading_scales
            WHERE v_composite_score BETWEEN min_score AND max_score;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                -- Graceful fallback check
                IF v_composite_score >= 85.00 THEN v_letter_grade := 'A';
                ELSIF v_composite_score >= 80.00 THEN v_letter_grade := 'B+';
                ELSIF v_composite_score >= 75.00 THEN v_letter_grade := 'B';
                ELSIF v_composite_score >= 70.00 THEN v_letter_grade := 'C+';
                ELSIF v_composite_score >= 65.00 THEN v_letter_grade := 'C';
                ELSIF v_composite_score >= 60.00 THEN v_letter_grade := 'D';
                ELSE v_letter_grade := 'F';
                END IF;
        END;

        -- 8. Save final score (Merge pattern for repeatability)
        MERGE INTO final_scores fs
        USING (SELECT p_internship_id AS internship_id FROM dual) src
        ON (fs.internship_id = src.internship_id)
        WHEN MATCHED THEN
            UPDATE SET 
                company_eval_score   = v_company_score,
                lecturer_grade_score = v_lecturer_score,
                attendance_score     = v_attendance_score,
                company_weight       = v_company_weight,
                lecturer_weight      = v_lecturer_weight,
                attendance_weight    = v_attendance_weight,
                composite_score      = v_composite_score,
                letter_grade         = v_letter_grade,
                calculated_at        = SYSTIMESTAMP
        WHEN NOT MATCHED THEN
            INSERT (
                final_score_id, internship_id, company_eval_score, lecturer_grade_score,
                attendance_score, company_weight, lecturer_weight, attendance_weight,
                composite_score, letter_grade, calculated_at, calculated_by
            ) VALUES (
                seq_final_scores.NEXTVAL, p_internship_id, v_company_score, v_lecturer_score,
                v_attendance_score, v_company_weight, v_lecturer_weight, v_attendance_weight,
                v_composite_score, v_letter_grade, SYSTIMESTAMP, 'SYSTEM'
            );
    END calculate_final_score;

END pkg_grading_engine;
/
```

---

## 8.4 Execution & Verification Script

To verify that the PL/SQL objects compile correctly and are fully operational within the Oracle instance:

```sql
-- Check Compilation Errors
SHOW ERRORS TRIGGER trg_users_audit;
SHOW ERRORS TRIGGER trg_applications_history;
SHOW ERRORS TRIGGER trg_applications_autowithdraw;
SHOW ERRORS TRIGGER trg_internships_init_reports;
SHOW ERRORS TRIGGER trg_internship_quota;
SHOW ERRORS TRIGGER trg_weekly_reports_late_check;
SHOW ERRORS PACKAGE pkg_recommendation_engine;
SHOW ERRORS PACKAGE BODY pkg_recommendation_engine;
SHOW ERRORS PACKAGE pkg_grading_engine;
SHOW ERRORS PACKAGE BODY pkg_grading_engine;

-- Query invalid objects (should return zero rows)
SELECT object_name, object_type
FROM user_objects
WHERE status = 'INVALID';
```

---

## 8.5 Phase 8 — State Summary

> [!IMPORTANT]
> **Critical Outcomes Carried Forward:**
> - **6 key triggers** implement database-tier automation and isolation. Mutating table issues on the `applications` status changes are solved via the `trg_applications_autowithdraw` compound trigger.
> - **`pkg_recommendation_engine`** computes comprehensive matching metrics for Skill, GPA, and Preference factors, using dynamic weights snapshotting.
> - **`pkg_grading_engine`** calculates reports compliance (attendance score) and runs final grade aggregations, linking dynamically with system configurations and academic scales.
> - Source scripts must be located at [script6_plsql_objects.sql](file:///E:/promgramming/sims-app/database/oracle/script6_plsql_objects.sql) for execution.

---

✅ **Phase 8 completed.** Reply **CONTINUE** to proceed to Phase 9 (Laravel 12 Service Layer Architecture & API Design), or provide feedback to revise.
