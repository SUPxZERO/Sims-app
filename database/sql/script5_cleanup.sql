-- ============================================================
-- SUIMS — Script 5: CLEANUP / DROP ALL
-- WARNING: This script drops ALL SUIMS objects. Use only in development.
-- ============================================================

-- Drop tables in REVERSE dependency order (Level 6 → Level 0)
BEGIN
    FOR t IN (
        SELECT table_name FROM user_tables 
        WHERE table_name IN (
            'EVALUATION_CRITERIA_SCORES', 'REPORT_REVIEWS', 'REPORT_ATTACHMENTS',
            'FINAL_SCORES', 'LECTURER_GRADES', 'COMPANY_EVALUATIONS', 'WEEKLY_REPORTS',
            'INTERNSHIPS', 'APPLICATION_STATUS_HISTORY',
            'APPLICATIONS',
            'RECOMMENDATION_SCORES', 'LISTING_REQUIRED_SKILLS', 'CV_SKILLS',
            'CV_VERSIONS', 'CV_DOCUMENTS', 'CV_EXPERIENCES', 'CV_EDUCATIONS',
            'AUDIT_LOGS', 'NOTIFICATIONS', 'SYSTEM_CONFIGS', 'MATCHING_WEIGHT_CONFIGS',
            'INTERNSHIP_LISTINGS', 'SKILLS', 'CVS', 'PASSWORD_RESETS',
            'COMPANY_PROFILES', 'LECTURER_PROFILES', 'STUDENT_PROFILES',
            'GRADING_SCALES', 'EVALUATION_CRITERIA', 'SKILL_CATEGORIES', 'USERS'
        )
    ) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS PURGE';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/

-- Drop all sequences
BEGIN
    FOR s IN (
        SELECT sequence_name FROM user_sequences
        WHERE sequence_name LIKE 'SEQ_%'
    ) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
END;
/

COMMIT;
