# PHASE 7: ORACLE SQL IMPLEMENTATION

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 6 (Oracle Database Design & Indexing)  
> **Target Platform:** Oracle Database 19c+  
> **Execution Tool:** SQL*Plus / Oracle SQL Developer  
> **Execution Order:** Script 1 → Script 2 → Script 3 → Script 4

---

## 7.1 Script 1: Sequences

> Execute this script first. All sequences must exist before table triggers or application inserts reference them.

```sql
-- ============================================================
-- SUIMS — Script 1: SEQUENCES
-- Smart University Internship Management System
-- Oracle Database 19c+
-- ============================================================

-- ==================== DROP EXISTING (if re-running) ====================
-- Uncomment the following block to drop sequences before re-creating
/*
BEGIN
    FOR seq_rec IN (
        SELECT sequence_name FROM user_sequences 
        WHERE sequence_name LIKE 'SEQ_%'
    ) LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || seq_rec.sequence_name;
    END LOOP;
END;
/
*/

-- ==================== AUTHENTICATION & USER MANAGEMENT ====================
CREATE SEQUENCE seq_users
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_student_profiles
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_lecturer_profiles
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_company_profiles
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_password_resets
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

-- ==================== CV MANAGEMENT ====================
CREATE SEQUENCE seq_cvs
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_cv_educations
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_cv_experiences
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_cv_documents
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_cv_versions
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

-- ==================== SKILL TAXONOMY ====================
CREATE SEQUENCE seq_skill_categories
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 10;

CREATE SEQUENCE seq_skills
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 10;

CREATE SEQUENCE seq_cv_skills
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 50;

-- ==================== INTERNSHIP LISTINGS ====================
CREATE SEQUENCE seq_internship_listings
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_listing_req_skills
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

-- ==================== RECOMMENDATION ENGINE ====================
CREATE SEQUENCE seq_recommendation_scores
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 100;

-- ==================== APPLICATION WORKFLOW ====================
CREATE SEQUENCE seq_applications
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_app_status_history
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 50;

-- ==================== ACTIVE INTERNSHIPS ====================
CREATE SEQUENCE seq_internships
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

-- ==================== WEEKLY REPORTING ====================
CREATE SEQUENCE seq_weekly_reports
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 50;

CREATE SEQUENCE seq_report_attachments
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_report_reviews
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 50;

-- ==================== EVALUATION & GRADING ====================
CREATE SEQUENCE seq_company_evaluations
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_eval_criteria_scores
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 50;

CREATE SEQUENCE seq_lecturer_grades
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

CREATE SEQUENCE seq_final_scores
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 20;

-- ==================== NOTIFICATIONS ====================
CREATE SEQUENCE seq_notifications
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 100;

-- ==================== SYSTEM CONFIGURATION ====================
CREATE SEQUENCE seq_system_configs
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 5;

CREATE SEQUENCE seq_grading_scales
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 5;

CREATE SEQUENCE seq_evaluation_criteria
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 5;

-- ==================== AUDIT ====================
CREATE SEQUENCE seq_audit_logs
    START WITH 1 INCREMENT BY 1 NOCYCLE CACHE 100;

-- ============================================================
-- Total Sequences Created: 31
-- ============================================================
```

---

## 7.2 Script 2: Tables (Dependency-Ordered)

> Execute after Script 1. Tables are organized by dependency level (Level 0 first, Level 6 last).

```sql
-- ============================================================
-- SUIMS — Script 2: CREATE TABLES
-- Smart University Internship Management System
-- Oracle Database 19c+
-- Execution Order: Level 0 → Level 6 (FK dependency chain)
-- ============================================================

-- ================================================================
-- LEVEL 0: No foreign key dependencies
-- ================================================================

-- -------------------- users --------------------
CREATE TABLE users (
    user_id                 NUMBER(10)      DEFAULT seq_users.NEXTVAL      NOT NULL,
    email                   VARCHAR2(150)                                   NOT NULL,
    password_hash           VARCHAR2(255)                                   NOT NULL,
    full_name               VARCHAR2(200)                                   NOT NULL,
    role                    VARCHAR2(20)                                    NOT NULL,
    status                  VARCHAR2(20)    DEFAULT 'INACTIVE'             NOT NULL,
    email_verified_at       TIMESTAMP,
    failed_login_attempts   NUMBER(2)       DEFAULT 0                      NOT NULL,
    locked_until            TIMESTAMP,
    last_login_at           TIMESTAMP,
    profile_photo_path      VARCHAR2(500),
    created_at              TIMESTAMP       DEFAULT SYSTIMESTAMP            NOT NULL,
    updated_at              TIMESTAMP       DEFAULT SYSTIMESTAMP            NOT NULL,
    --
    CONSTRAINT pk_users PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'STUDENT', 'LECTURER', 'COMPANY')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED'))
);

-- -------------------- skill_categories --------------------
CREATE TABLE skill_categories (
    skill_category_id   NUMBER(5)       DEFAULT seq_skill_categories.NEXTVAL   NOT NULL,
    category_name       VARCHAR2(100)                                           NOT NULL,
    description         VARCHAR2(500),
    is_active           NUMBER(1)       DEFAULT 1                               NOT NULL,
    sort_order          NUMBER(3)       DEFAULT 0                               NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_skill_categories PRIMARY KEY (skill_category_id),
    CONSTRAINT uk_skillcat_name UNIQUE (category_name),
    CONSTRAINT chk_skillcat_active CHECK (is_active IN (0, 1))
);

-- -------------------- evaluation_criteria --------------------
CREATE TABLE evaluation_criteria (
    criteria_id     NUMBER(5)       DEFAULT seq_evaluation_criteria.NEXTVAL  NOT NULL,
    criteria_name   VARCHAR2(100)                                            NOT NULL,
    description     VARCHAR2(500),
    weight          NUMBER(3,2)                                              NOT NULL,
    sort_order      NUMBER(2)                                                NOT NULL,
    is_active       NUMBER(1)       DEFAULT 1                                NOT NULL,
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP                     NOT NULL,
    --
    CONSTRAINT pk_evaluation_criteria PRIMARY KEY (criteria_id),
    CONSTRAINT uk_evalcrit_name UNIQUE (criteria_name),
    CONSTRAINT chk_evalcrit_weight CHECK (weight BETWEEN 0.00 AND 1.00),
    CONSTRAINT chk_evalcrit_active CHECK (is_active IN (0, 1))
);

-- -------------------- grading_scales --------------------
CREATE TABLE grading_scales (
    grade_scale_id  NUMBER(3)       DEFAULT seq_grading_scales.NEXTVAL   NOT NULL,
    letter_grade    VARCHAR2(5)                                          NOT NULL,
    min_score       NUMBER(5,2)                                          NOT NULL,
    max_score       NUMBER(5,2)                                          NOT NULL,
    grade_point     NUMBER(3,2),
    sort_order      NUMBER(2)                                            NOT NULL,
    --
    CONSTRAINT pk_grading_scales PRIMARY KEY (grade_scale_id),
    CONSTRAINT uk_gscale_grade UNIQUE (letter_grade),
    CONSTRAINT chk_gscale_min CHECK (min_score BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_gscale_max CHECK (max_score BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_gscale_range CHECK (max_score >= min_score)
);

-- ================================================================
-- LEVEL 1: Depends on Level 0 (users, skill_categories)
-- ================================================================

-- -------------------- student_profiles --------------------
CREATE TABLE student_profiles (
    student_profile_id  NUMBER(10)      DEFAULT seq_student_profiles.NEXTVAL    NOT NULL,
    user_id             NUMBER(10)                                              NOT NULL,
    student_id_number   VARCHAR2(30)                                            NOT NULL,
    department          VARCHAR2(100)                                           NOT NULL,
    faculty             VARCHAR2(100),
    enrollment_year     NUMBER(4)                                               NOT NULL,
    expected_graduation NUMBER(4),
    gpa                 NUMBER(3,2)                                             NOT NULL,
    phone_number        VARCHAR2(20),
    address             VARCHAR2(500),
    linkedin_url        VARCHAR2(300),
    bio                 CLOB,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_student_profiles PRIMARY KEY (student_profile_id),
    CONSTRAINT uk_sprofiles_user UNIQUE (user_id),
    CONSTRAINT uk_sprofiles_stdid UNIQUE (student_id_number),
    CONSTRAINT fk_sprofiles_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_sprofiles_year CHECK (enrollment_year BETWEEN 2000 AND 2099),
    CONSTRAINT chk_sprofiles_gpa CHECK (gpa BETWEEN 0.00 AND 4.00)
);

-- -------------------- lecturer_profiles --------------------
CREATE TABLE lecturer_profiles (
    lecturer_profile_id NUMBER(10)      DEFAULT seq_lecturer_profiles.NEXTVAL   NOT NULL,
    user_id             NUMBER(10)                                              NOT NULL,
    staff_id_number     VARCHAR2(30)                                            NOT NULL,
    department          VARCHAR2(100)                                           NOT NULL,
    faculty             VARCHAR2(100),
    specialization      VARCHAR2(500),
    max_supervision_load NUMBER(3)      DEFAULT 10                              NOT NULL,
    phone_number        VARCHAR2(20),
    office_location     VARCHAR2(100),
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_lecturer_profiles PRIMARY KEY (lecturer_profile_id),
    CONSTRAINT uk_lprofiles_user UNIQUE (user_id),
    CONSTRAINT uk_lprofiles_staffid UNIQUE (staff_id_number),
    CONSTRAINT fk_lprofiles_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_lprofiles_load CHECK (max_supervision_load BETWEEN 1 AND 30)
);

-- -------------------- company_profiles --------------------
CREATE TABLE company_profiles (
    company_profile_id  NUMBER(10)      DEFAULT seq_company_profiles.NEXTVAL    NOT NULL,
    user_id             NUMBER(10)                                              NOT NULL,
    company_name        VARCHAR2(200)                                           NOT NULL,
    industry_sector     VARCHAR2(100)                                           NOT NULL,
    company_size        VARCHAR2(20),
    company_website     VARCHAR2(300),
    company_address     VARCHAR2(500)                                           NOT NULL,
    company_city        VARCHAR2(100)                                           NOT NULL,
    company_description CLOB,
    contact_person_name VARCHAR2(200),
    contact_phone       VARCHAR2(20),
    is_verified         NUMBER(1)       DEFAULT 0                               NOT NULL,
    verified_at         TIMESTAMP,
    verified_by         NUMBER(10),
    company_logo_path   VARCHAR2(500),
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_company_profiles PRIMARY KEY (company_profile_id),
    CONSTRAINT uk_cprofiles_user UNIQUE (user_id),
    CONSTRAINT fk_cprofiles_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_cprofiles_verifier FOREIGN KEY (verified_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT chk_cprofiles_size CHECK (
        company_size IS NULL OR company_size IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')
    ),
    CONSTRAINT chk_cprofiles_verified CHECK (is_verified IN (0, 1))
);

-- -------------------- password_resets --------------------
CREATE TABLE password_resets (
    reset_id    NUMBER(10)      DEFAULT seq_password_resets.NEXTVAL     NOT NULL,
    user_id     NUMBER(10)                                              NOT NULL,
    token       VARCHAR2(255)                                           NOT NULL,
    expires_at  TIMESTAMP                                               NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_password_resets PRIMARY KEY (reset_id),
    CONSTRAINT uk_presets_token UNIQUE (token),
    CONSTRAINT fk_presets_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

-- -------------------- cvs --------------------
CREATE TABLE cvs (
    cv_id               NUMBER(10)      DEFAULT seq_cvs.NEXTVAL        NOT NULL,
    user_id             NUMBER(10)                                      NOT NULL,
    personal_summary    CLOB,
    status              VARCHAR2(20)    DEFAULT 'INCOMPLETE'            NOT NULL,
    visibility          VARCHAR2(20)    DEFAULT 'PRIVATE'               NOT NULL,
    current_version     NUMBER(5)       DEFAULT 1                       NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP            NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP            NOT NULL,
    --
    CONSTRAINT pk_cvs PRIMARY KEY (cv_id),
    CONSTRAINT uk_cvs_user UNIQUE (user_id),
    CONSTRAINT fk_cvs_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_cvs_status CHECK (status IN ('INCOMPLETE', 'COMPLETE')),
    CONSTRAINT chk_cvs_visibility CHECK (visibility IN ('PUBLIC', 'PRIVATE'))
);

-- -------------------- skills --------------------
CREATE TABLE skills (
    skill_id            NUMBER(5)       DEFAULT seq_skills.NEXTVAL      NOT NULL,
    skill_category_id   NUMBER(5)                                       NOT NULL,
    skill_name          VARCHAR2(100)                                    NOT NULL,
    description         VARCHAR2(500),
    is_active           NUMBER(1)       DEFAULT 1                        NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP             NOT NULL,
    --
    CONSTRAINT pk_skills PRIMARY KEY (skill_id),
    CONSTRAINT uk_skills_cat_name UNIQUE (skill_category_id, skill_name),
    CONSTRAINT fk_skills_cat FOREIGN KEY (skill_category_id)
        REFERENCES skill_categories (skill_category_id) ON DELETE CASCADE,
    CONSTRAINT chk_skills_active CHECK (is_active IN (0, 1))
);

-- -------------------- internship_listings --------------------
CREATE TABLE internship_listings (
    listing_id          NUMBER(10)      DEFAULT seq_internship_listings.NEXTVAL NOT NULL,
    company_user_id     NUMBER(10)                                              NOT NULL,
    title               VARCHAR2(200)                                           NOT NULL,
    description         CLOB                                                    NOT NULL,
    requirements        CLOB,
    location            VARCHAR2(200)                                           NOT NULL,
    work_mode           VARCHAR2(20)                                            NOT NULL,
    duration_weeks      NUMBER(2)                                               NOT NULL,
    quota               NUMBER(3)                                               NOT NULL,
    filled_count        NUMBER(3)       DEFAULT 0                               NOT NULL,
    stipend_info        VARCHAR2(500),
    application_deadline DATE                                                   NOT NULL,
    status              VARCHAR2(25)    DEFAULT 'DRAFT'                         NOT NULL,
    admin_feedback      CLOB,
    approved_by         NUMBER(10),
    published_at        TIMESTAMP,
    min_gpa             NUMBER(3,2),
    preferred_departments VARCHAR2(500),
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_internship_listings PRIMARY KEY (listing_id),
    CONSTRAINT fk_listings_company FOREIGN KEY (company_user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_listings_approver FOREIGN KEY (approved_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT chk_listings_workmode CHECK (work_mode IN ('ONSITE', 'REMOTE', 'HYBRID')),
    CONSTRAINT chk_listings_duration CHECK (duration_weeks BETWEEN 4 AND 24),
    CONSTRAINT chk_listings_quota CHECK (quota BETWEEN 1 AND 50),
    CONSTRAINT chk_listings_filled CHECK (filled_count >= 0),
    CONSTRAINT chk_listings_status CHECK (status IN (
        'DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CHANGES_REQUESTED',
        'REJECTED', 'CLOSED', 'WITHDRAWN'
    )),
    CONSTRAINT chk_listings_mingpa CHECK (min_gpa IS NULL OR min_gpa BETWEEN 0.00 AND 4.00)
);

-- -------------------- matching_weight_configs --------------------
CREATE TABLE matching_weight_configs (
    config_id           NUMBER(1)                                       NOT NULL,
    skill_weight        NUMBER(3,2)     DEFAULT 0.60                    NOT NULL,
    gpa_weight          NUMBER(3,2)     DEFAULT 0.20                    NOT NULL,
    preference_weight   NUMBER(3,2)     DEFAULT 0.20                    NOT NULL,
    min_score_threshold NUMBER(5,2)     DEFAULT 30.00                   NOT NULL,
    max_recommendations NUMBER(3)       DEFAULT 10                      NOT NULL,
    updated_by          NUMBER(10),
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP            NOT NULL,
    --
    CONSTRAINT pk_matching_weight_configs PRIMARY KEY (config_id),
    CONSTRAINT fk_mwc_users FOREIGN KEY (updated_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT chk_mwc_singleton CHECK (config_id = 1),
    CONSTRAINT chk_mwc_sw CHECK (skill_weight BETWEEN 0.00 AND 1.00),
    CONSTRAINT chk_mwc_gw CHECK (gpa_weight BETWEEN 0.00 AND 1.00),
    CONSTRAINT chk_mwc_pw CHECK (preference_weight BETWEEN 0.00 AND 1.00),
    CONSTRAINT chk_mwc_sum CHECK (skill_weight + gpa_weight + preference_weight = 1.00),
    CONSTRAINT chk_mwc_thresh CHECK (min_score_threshold BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_mwc_maxrec CHECK (max_recommendations BETWEEN 1 AND 50)
);

-- -------------------- system_configs --------------------
CREATE TABLE system_configs (
    config_id       NUMBER(5)       DEFAULT seq_system_configs.NEXTVAL   NOT NULL,
    config_key      VARCHAR2(100)                                        NOT NULL,
    config_value    VARCHAR2(500)                                        NOT NULL,
    config_type     VARCHAR2(20)                                         NOT NULL,
    description     VARCHAR2(500),
    updated_by      NUMBER(10),
    updated_at      TIMESTAMP       DEFAULT SYSTIMESTAMP                 NOT NULL,
    --
    CONSTRAINT pk_system_configs PRIMARY KEY (config_id),
    CONSTRAINT uk_sysconf_key UNIQUE (config_key),
    CONSTRAINT fk_sysconf_users FOREIGN KEY (updated_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT chk_sysconf_type CHECK (config_type IN ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN'))
);

-- -------------------- notifications --------------------
CREATE TABLE notifications (
    notification_id     NUMBER(10)      DEFAULT seq_notifications.NEXTVAL   NOT NULL,
    user_id             NUMBER(10)                                          NOT NULL,
    type                VARCHAR2(50)                                        NOT NULL,
    title               VARCHAR2(200)                                       NOT NULL,
    message             CLOB                                                NOT NULL,
    priority            VARCHAR2(10)    DEFAULT 'MEDIUM'                    NOT NULL,
    channel             VARCHAR2(30)    DEFAULT 'IN_APP'                    NOT NULL,
    reference_type      VARCHAR2(50),
    reference_id        NUMBER(10),
    is_read             NUMBER(1)       DEFAULT 0                           NOT NULL,
    read_at             TIMESTAMP,
    email_sent          NUMBER(1)       DEFAULT 0                           NOT NULL,
    email_sent_at       TIMESTAMP,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_notifications PRIMARY KEY (notification_id),
    CONSTRAINT fk_notif_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT chk_notif_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT chk_notif_channel CHECK (channel IN ('IN_APP', 'EMAIL', 'IN_APP_EMAIL')),
    CONSTRAINT chk_notif_read CHECK (is_read IN (0, 1)),
    CONSTRAINT chk_notif_emailsent CHECK (email_sent IN (0, 1))
);

-- -------------------- audit_logs --------------------
CREATE TABLE audit_logs (
    audit_id        NUMBER(15)      DEFAULT seq_audit_logs.NEXTVAL      NOT NULL,
    table_name      VARCHAR2(100)                                       NOT NULL,
    record_id       NUMBER(10)                                          NOT NULL,
    action          VARCHAR2(10)                                        NOT NULL,
    old_values      CLOB,
    new_values      CLOB,
    changed_by      NUMBER(10),
    changed_at      TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    ip_address      VARCHAR2(45),
    user_agent      VARCHAR2(500),
    --
    CONSTRAINT pk_audit_logs PRIMARY KEY (audit_id),
    CONSTRAINT fk_auditlog_users FOREIGN KEY (changed_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT chk_auditlog_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- ================================================================
-- LEVEL 2: Depends on Level 1 (cvs, skills, internship_listings)
-- ================================================================

-- -------------------- cv_educations --------------------
CREATE TABLE cv_educations (
    cv_education_id     NUMBER(10)      DEFAULT seq_cv_educations.NEXTVAL   NOT NULL,
    cv_id               NUMBER(10)                                          NOT NULL,
    institution_name    VARCHAR2(200)                                       NOT NULL,
    degree              VARCHAR2(100)                                       NOT NULL,
    field_of_study      VARCHAR2(200)                                       NOT NULL,
    start_date          DATE                                                NOT NULL,
    end_date            DATE,
    gpa                 NUMBER(3,2),
    description         VARCHAR2(1000),
    sort_order          NUMBER(3)       DEFAULT 0                            NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                 NOT NULL,
    --
    CONSTRAINT pk_cv_educations PRIMARY KEY (cv_education_id),
    CONSTRAINT fk_cvedu_cvs FOREIGN KEY (cv_id)
        REFERENCES cvs (cv_id) ON DELETE CASCADE,
    CONSTRAINT chk_cvedu_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_cvedu_gpa CHECK (gpa IS NULL OR gpa BETWEEN 0.00 AND 4.00)
);

-- -------------------- cv_experiences --------------------
CREATE TABLE cv_experiences (
    cv_experience_id    NUMBER(10)      DEFAULT seq_cv_experiences.NEXTVAL  NOT NULL,
    cv_id               NUMBER(10)                                          NOT NULL,
    company_name        VARCHAR2(200)                                       NOT NULL,
    position_title      VARCHAR2(200)                                       NOT NULL,
    start_date          DATE                                                NOT NULL,
    end_date            DATE,
    description         CLOB,
    sort_order          NUMBER(3)       DEFAULT 0                            NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                 NOT NULL,
    --
    CONSTRAINT pk_cv_experiences PRIMARY KEY (cv_experience_id),
    CONSTRAINT fk_cvexp_cvs FOREIGN KEY (cv_id)
        REFERENCES cvs (cv_id) ON DELETE CASCADE,
    CONSTRAINT chk_cvexp_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- -------------------- cv_documents --------------------
CREATE TABLE cv_documents (
    cv_document_id      NUMBER(10)      DEFAULT seq_cv_documents.NEXTVAL    NOT NULL,
    cv_id               NUMBER(10)                                          NOT NULL,
    document_label      VARCHAR2(200)                                       NOT NULL,
    file_path           VARCHAR2(500)                                       NOT NULL,
    file_name           VARCHAR2(255)                                       NOT NULL,
    file_size_bytes     NUMBER(10)                                          NOT NULL,
    mime_type           VARCHAR2(50)                                        NOT NULL,
    uploaded_at         TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_cv_documents PRIMARY KEY (cv_document_id),
    CONSTRAINT fk_cvdoc_cvs FOREIGN KEY (cv_id)
        REFERENCES cvs (cv_id) ON DELETE CASCADE,
    CONSTRAINT chk_cvdoc_size CHECK (file_size_bytes BETWEEN 1 AND 5242880),
    CONSTRAINT chk_cvdoc_mime CHECK (mime_type = 'application/pdf')
);

-- -------------------- cv_versions --------------------
CREATE TABLE cv_versions (
    cv_version_id       NUMBER(10)      DEFAULT seq_cv_versions.NEXTVAL    NOT NULL,
    cv_id               NUMBER(10)                                          NOT NULL,
    version_number      NUMBER(5)                                           NOT NULL,
    snapshot_data       CLOB                                                NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_cv_versions PRIMARY KEY (cv_version_id),
    CONSTRAINT fk_cvver_cvs FOREIGN KEY (cv_id)
        REFERENCES cvs (cv_id) ON DELETE CASCADE,
    CONSTRAINT uk_cvver_cv_version UNIQUE (cv_id, version_number)
);

-- -------------------- cv_skills --------------------
CREATE TABLE cv_skills (
    cv_skill_id         NUMBER(10)      DEFAULT seq_cv_skills.NEXTVAL      NOT NULL,
    cv_id               NUMBER(10)                                          NOT NULL,
    skill_id            NUMBER(5)                                           NOT NULL,
    proficiency_level   VARCHAR2(20)                                        NOT NULL,
    proficiency_weight  NUMBER(3,2)                                         NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_cv_skills PRIMARY KEY (cv_skill_id),
    CONSTRAINT uk_cvskills_cv_skill UNIQUE (cv_id, skill_id),
    CONSTRAINT fk_cvskills_cvs FOREIGN KEY (cv_id)
        REFERENCES cvs (cv_id) ON DELETE CASCADE,
    CONSTRAINT fk_cvskills_skills FOREIGN KEY (skill_id)
        REFERENCES skills (skill_id) ON DELETE CASCADE,
    CONSTRAINT chk_cvskills_level CHECK (
        proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    ),
    CONSTRAINT chk_cvskills_weight CHECK (proficiency_weight IN (0.33, 0.66, 1.00))
);

-- -------------------- listing_required_skills --------------------
CREATE TABLE listing_required_skills (
    listing_skill_id    NUMBER(10)      DEFAULT seq_listing_req_skills.NEXTVAL  NOT NULL,
    listing_id          NUMBER(10)                                              NOT NULL,
    skill_id            NUMBER(5)                                               NOT NULL,
    importance          VARCHAR2(20)                                            NOT NULL,
    importance_weight   NUMBER(3,2)                                             NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_listing_req_skills PRIMARY KEY (listing_skill_id),
    CONSTRAINT uk_lskills_listing_skill UNIQUE (listing_id, skill_id),
    CONSTRAINT fk_lskills_listings FOREIGN KEY (listing_id)
        REFERENCES internship_listings (listing_id) ON DELETE CASCADE,
    CONSTRAINT fk_lskills_skills FOREIGN KEY (skill_id)
        REFERENCES skills (skill_id) ON DELETE CASCADE,
    CONSTRAINT chk_lskills_imp CHECK (importance IN ('REQUIRED', 'PREFERRED')),
    CONSTRAINT chk_lskills_weight CHECK (importance_weight IN (1.00, 0.50))
);

-- -------------------- recommendation_scores --------------------
CREATE TABLE recommendation_scores (
    recommendation_id       NUMBER(10)      DEFAULT seq_recommendation_scores.NEXTVAL  NOT NULL,
    user_id                 NUMBER(10)                                                  NOT NULL,
    listing_id              NUMBER(10)                                                  NOT NULL,
    skill_match_score       NUMBER(5,2)                                                 NOT NULL,
    gpa_match_score         NUMBER(5,2)                                                 NOT NULL,
    preference_match_score  NUMBER(5,2)                                                 NOT NULL,
    composite_score         NUMBER(5,2)                                                 NOT NULL,
    skill_weight_used       NUMBER(3,2)                                                 NOT NULL,
    gpa_weight_used         NUMBER(3,2)                                                 NOT NULL,
    preference_weight_used  NUMBER(3,2)                                                 NOT NULL,
    matched_skills_count    NUMBER(3)                                                   NOT NULL,
    total_required_skills   NUMBER(3)                                                   NOT NULL,
    calculated_at           TIMESTAMP       DEFAULT SYSTIMESTAMP                        NOT NULL,
    --
    CONSTRAINT pk_recommendation_scores PRIMARY KEY (recommendation_id),
    CONSTRAINT uk_recscore_user_listing UNIQUE (user_id, listing_id),
    CONSTRAINT fk_recscore_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_recscore_listings FOREIGN KEY (listing_id)
        REFERENCES internship_listings (listing_id) ON DELETE CASCADE,
    CONSTRAINT chk_recscore_skill CHECK (skill_match_score BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_recscore_gpa CHECK (gpa_match_score BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_recscore_pref CHECK (preference_match_score BETWEEN 0.00 AND 100.00),
    CONSTRAINT chk_recscore_comp CHECK (composite_score BETWEEN 0.00 AND 100.00)
);

-- ================================================================
-- LEVEL 3: Depends on Level 2 (cv_versions)
-- ================================================================

-- -------------------- applications --------------------
CREATE TABLE applications (
    application_id      NUMBER(10)      DEFAULT seq_applications.NEXTVAL    NOT NULL,
    user_id             NUMBER(10)                                          NOT NULL,
    listing_id          NUMBER(10)                                          NOT NULL,
    cv_version_id       NUMBER(10)                                          NOT NULL,
    cover_letter        CLOB,
    match_score_at_apply NUMBER(5,2),
    status              VARCHAR2(20)    DEFAULT 'SUBMITTED'                 NOT NULL,
    rejection_reason    CLOB,
    submitted_at        TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    reviewed_at         TIMESTAMP,
    decided_at          TIMESTAMP,
    confirmed_at        TIMESTAMP,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_applications PRIMARY KEY (application_id),
    CONSTRAINT uk_apps_user_listing UNIQUE (user_id, listing_id),
    CONSTRAINT fk_apps_users FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_apps_listings FOREIGN KEY (listing_id)
        REFERENCES internship_listings (listing_id) ON DELETE CASCADE,
    CONSTRAINT fk_apps_cvversions FOREIGN KEY (cv_version_id)
        REFERENCES cv_versions (cv_version_id),
    CONSTRAINT chk_apps_status CHECK (status IN (
        'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED',
        'REJECTED', 'CONFIRMED', 'WITHDRAWN', 'AUTO_WITHDRAWN'
    ))
);

-- ================================================================
-- LEVEL 4: Depends on Level 3 (applications)
-- ================================================================

-- -------------------- application_status_history --------------------
CREATE TABLE application_status_history (
    history_id      NUMBER(10)      DEFAULT seq_app_status_history.NEXTVAL  NOT NULL,
    application_id  NUMBER(10)                                              NOT NULL,
    from_status     VARCHAR2(20),
    to_status       VARCHAR2(20)                                            NOT NULL,
    changed_by      NUMBER(10)                                              NOT NULL,
    change_reason   CLOB,
    changed_at      TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_app_status_history PRIMARY KEY (history_id),
    CONSTRAINT fk_apphist_apps FOREIGN KEY (application_id)
        REFERENCES applications (application_id) ON DELETE CASCADE,
    CONSTRAINT fk_apphist_users FOREIGN KEY (changed_by)
        REFERENCES users (user_id)
);

-- -------------------- internships --------------------
CREATE TABLE internships (
    internship_id       NUMBER(10)      DEFAULT seq_internships.NEXTVAL    NOT NULL,
    application_id      NUMBER(10)                                          NOT NULL,
    student_user_id     NUMBER(10)                                          NOT NULL,
    company_user_id     NUMBER(10)                                          NOT NULL,
    lecturer_user_id    NUMBER(10)                                          NOT NULL,
    listing_id          NUMBER(10)                                          NOT NULL,
    start_date          DATE                                                NOT NULL,
    end_date            DATE                                                NOT NULL,
    total_weeks         NUMBER(2)                                           NOT NULL,
    status              VARCHAR2(20)    DEFAULT 'ACTIVE'                    NOT NULL,
    confirmed_by        NUMBER(10)                                          NOT NULL,
    report_deadline_day VARCHAR2(10)    DEFAULT 'SUNDAY'                    NOT NULL,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_internships PRIMARY KEY (internship_id),
    CONSTRAINT uk_intern_app UNIQUE (application_id),
    CONSTRAINT fk_intern_apps FOREIGN KEY (application_id)
        REFERENCES applications (application_id),
    CONSTRAINT fk_intern_student FOREIGN KEY (student_user_id)
        REFERENCES users (user_id),
    CONSTRAINT fk_intern_company FOREIGN KEY (company_user_id)
        REFERENCES users (user_id),
    CONSTRAINT fk_intern_lecturer FOREIGN KEY (lecturer_user_id)
        REFERENCES users (user_id),
    CONSTRAINT fk_intern_listings FOREIGN KEY (listing_id)
        REFERENCES internship_listings (listing_id),
    CONSTRAINT fk_intern_confirmer FOREIGN KEY (confirmed_by)
        REFERENCES users (user_id),
    CONSTRAINT chk_intern_dates CHECK (end_date > start_date),
    CONSTRAINT chk_intern_weeks CHECK (total_weeks BETWEEN 4 AND 24),
    CONSTRAINT chk_intern_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'TERMINATED')),
    CONSTRAINT chk_intern_day CHECK (report_deadline_day IN (
        'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
        'FRIDAY', 'SATURDAY', 'SUNDAY'
    ))
);

-- ================================================================
-- LEVEL 5: Depends on Level 4 (internships)
-- ================================================================

-- -------------------- weekly_reports --------------------
CREATE TABLE weekly_reports (
    report_id           NUMBER(10)      DEFAULT seq_weekly_reports.NEXTVAL  NOT NULL,
    internship_id       NUMBER(10)                                          NOT NULL,
    week_number         NUMBER(2)                                           NOT NULL,
    week_start_date     DATE                                                NOT NULL,
    week_end_date       DATE                                                NOT NULL,
    activities          CLOB,
    challenges          CLOB,
    learnings           CLOB,
    hours_logged        NUMBER(4,1),
    status              VARCHAR2(25)    DEFAULT 'NOT_STARTED'               NOT NULL,
    is_late             NUMBER(1)       DEFAULT 0                           NOT NULL,
    revision_count      NUMBER(1)       DEFAULT 0                           NOT NULL,
    submitted_at        TIMESTAMP,
    approved_at         TIMESTAMP,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_weekly_reports PRIMARY KEY (report_id),
    CONSTRAINT uk_wreports_intern_week UNIQUE (internship_id, week_number),
    CONSTRAINT fk_wreports_intern FOREIGN KEY (internship_id)
        REFERENCES internships (internship_id) ON DELETE CASCADE,
    CONSTRAINT chk_wreports_week CHECK (week_number BETWEEN 1 AND 24),
    CONSTRAINT chk_wreports_hours CHECK (hours_logged IS NULL OR hours_logged BETWEEN 1.0 AND 80.0),
    CONSTRAINT chk_wreports_status CHECK (status IN (
        'NOT_STARTED', 'DRAFT', 'SUBMITTED', 'APPROVED',
        'REVISION_REQUESTED', 'REJECTED'
    )),
    CONSTRAINT chk_wreports_late CHECK (is_late IN (0, 1)),
    CONSTRAINT chk_wreports_revcount CHECK (revision_count BETWEEN 0 AND 2)
);

-- -------------------- company_evaluations --------------------
CREATE TABLE company_evaluations (
    evaluation_id       NUMBER(10)      DEFAULT seq_company_evaluations.NEXTVAL NOT NULL,
    internship_id       NUMBER(10)                                              NOT NULL,
    evaluator_user_id   NUMBER(10)                                              NOT NULL,
    composite_score     NUMBER(5,2),
    strengths           CLOB,
    improvements        CLOB,
    overall_comments    CLOB,
    hiring_recommendation VARCHAR2(20),
    status              VARCHAR2(20)    DEFAULT 'DRAFT'                         NOT NULL,
    is_late             NUMBER(1)       DEFAULT 0                               NOT NULL,
    submitted_at        TIMESTAMP,
    created_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    updated_at          TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_company_evaluations PRIMARY KEY (evaluation_id),
    CONSTRAINT uk_compeval_intern UNIQUE (internship_id),
    CONSTRAINT fk_compeval_intern FOREIGN KEY (internship_id)
        REFERENCES internships (internship_id),
    CONSTRAINT fk_compeval_users FOREIGN KEY (evaluator_user_id)
        REFERENCES users (user_id),
    CONSTRAINT chk_compeval_score CHECK (
        composite_score IS NULL OR composite_score BETWEEN 0.00 AND 100.00
    ),
    CONSTRAINT chk_compeval_hire CHECK (
        hiring_recommendation IS NULL OR 
        hiring_recommendation IN ('WOULD_HIRE', 'WOULD_CONSIDER', 'WOULD_NOT_HIRE')
    ),
    CONSTRAINT chk_compeval_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'LOCKED')),
    CONSTRAINT chk_compeval_late CHECK (is_late IN (0, 1))
);

-- -------------------- lecturer_grades --------------------
CREATE TABLE lecturer_grades (
    grade_id                NUMBER(10)      DEFAULT seq_lecturer_grades.NEXTVAL NOT NULL,
    internship_id           NUMBER(10)                                          NOT NULL,
    grader_user_id          NUMBER(10)                                          NOT NULL,
    report_quality_score    NUMBER(5,2),
    presentation_score      NUMBER(5,2),
    engagement_score        NUMBER(5,2),
    composite_score         NUMBER(5,2),
    overall_comments        CLOB,
    status                  VARCHAR2(20)    DEFAULT 'DRAFT'                     NOT NULL,
    submitted_at            TIMESTAMP,
    created_at              TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    updated_at              TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_lecturer_grades PRIMARY KEY (grade_id),
    CONSTRAINT uk_lgrades_intern UNIQUE (internship_id),
    CONSTRAINT fk_lgrades_intern FOREIGN KEY (internship_id)
        REFERENCES internships (internship_id),
    CONSTRAINT fk_lgrades_users FOREIGN KEY (grader_user_id)
        REFERENCES users (user_id),
    CONSTRAINT chk_lgrades_rqs CHECK (
        report_quality_score IS NULL OR report_quality_score BETWEEN 0.00 AND 100.00
    ),
    CONSTRAINT chk_lgrades_ps CHECK (
        presentation_score IS NULL OR presentation_score BETWEEN 0.00 AND 100.00
    ),
    CONSTRAINT chk_lgrades_es CHECK (
        engagement_score IS NULL OR engagement_score BETWEEN 0.00 AND 100.00
    ),
    CONSTRAINT chk_lgrades_comp CHECK (
        composite_score IS NULL OR composite_score BETWEEN 0.00 AND 100.00
    ),
    CONSTRAINT chk_lgrades_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'LOCKED'))
);

-- -------------------- final_scores --------------------
CREATE TABLE final_scores (
    final_score_id      NUMBER(10)      DEFAULT seq_final_scores.NEXTVAL    NOT NULL,
    internship_id       NUMBER(10)                                          NOT NULL,
    company_eval_score  NUMBER(5,2)                                         NOT NULL,
    lecturer_grade_score NUMBER(5,2)                                        NOT NULL,
    attendance_score    NUMBER(5,2)                                         NOT NULL,
    company_weight      NUMBER(3,2)                                         NOT NULL,
    lecturer_weight     NUMBER(3,2)                                         NOT NULL,
    attendance_weight   NUMBER(3,2)                                         NOT NULL,
    composite_score     NUMBER(5,2)                                         NOT NULL,
    letter_grade        VARCHAR2(5)                                         NOT NULL,
    calculated_at       TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    calculated_by       VARCHAR2(50)    DEFAULT 'SYSTEM'                    NOT NULL,
    --
    CONSTRAINT pk_final_scores PRIMARY KEY (final_score_id),
    CONSTRAINT uk_fscores_intern UNIQUE (internship_id),
    CONSTRAINT fk_fscores_intern FOREIGN KEY (internship_id)
        REFERENCES internships (internship_id),
    CONSTRAINT chk_fscores_comp CHECK (composite_score BETWEEN 0.00 AND 100.00)
);

-- ================================================================
-- LEVEL 6: Depends on Level 5 (weekly_reports, company_evaluations)
-- ================================================================

-- -------------------- report_attachments --------------------
CREATE TABLE report_attachments (
    attachment_id       NUMBER(10)      DEFAULT seq_report_attachments.NEXTVAL  NOT NULL,
    report_id           NUMBER(10)                                              NOT NULL,
    file_path           VARCHAR2(500)                                           NOT NULL,
    file_name           VARCHAR2(255)                                           NOT NULL,
    file_size_bytes     NUMBER(10)                                              NOT NULL,
    mime_type           VARCHAR2(100)                                           NOT NULL,
    uploaded_at         TIMESTAMP       DEFAULT SYSTIMESTAMP                    NOT NULL,
    --
    CONSTRAINT pk_report_attachments PRIMARY KEY (attachment_id),
    CONSTRAINT fk_rattach_reports FOREIGN KEY (report_id)
        REFERENCES weekly_reports (report_id) ON DELETE CASCADE,
    CONSTRAINT chk_rattach_size CHECK (file_size_bytes BETWEEN 1 AND 5242880)
);

-- -------------------- report_reviews --------------------
CREATE TABLE report_reviews (
    review_id           NUMBER(10)      DEFAULT seq_report_reviews.NEXTVAL  NOT NULL,
    report_id           NUMBER(10)                                          NOT NULL,
    reviewer_user_id    NUMBER(10)                                          NOT NULL,
    decision            VARCHAR2(25)                                        NOT NULL,
    comments            CLOB                                                NOT NULL,
    reviewed_at         TIMESTAMP       DEFAULT SYSTIMESTAMP                NOT NULL,
    --
    CONSTRAINT pk_report_reviews PRIMARY KEY (review_id),
    CONSTRAINT fk_rreviews_reports FOREIGN KEY (report_id)
        REFERENCES weekly_reports (report_id) ON DELETE CASCADE,
    CONSTRAINT fk_rreviews_users FOREIGN KEY (reviewer_user_id)
        REFERENCES users (user_id),
    CONSTRAINT chk_rreviews_decision CHECK (
        decision IN ('APPROVED', 'REVISION_REQUESTED', 'REJECTED')
    )
);

-- -------------------- evaluation_criteria_scores --------------------
CREATE TABLE evaluation_criteria_scores (
    criteria_score_id   NUMBER(10)      DEFAULT seq_eval_criteria_scores.NEXTVAL    NOT NULL,
    evaluation_id       NUMBER(10)                                                  NOT NULL,
    criteria_id         NUMBER(5)                                                   NOT NULL,
    score               NUMBER(5,2)                                                 NOT NULL,
    --
    CONSTRAINT pk_eval_criteria_scores PRIMARY KEY (criteria_score_id),
    CONSTRAINT uk_ecscore_eval_criteria UNIQUE (evaluation_id, criteria_id),
    CONSTRAINT fk_ecscore_eval FOREIGN KEY (evaluation_id)
        REFERENCES company_evaluations (evaluation_id) ON DELETE CASCADE,
    CONSTRAINT fk_ecscore_criteria FOREIGN KEY (criteria_id)
        REFERENCES evaluation_criteria (criteria_id),
    CONSTRAINT chk_ecscore_score CHECK (score BETWEEN 0.00 AND 100.00)
);

-- ============================================================
-- Total Tables Created: 32
-- ============================================================
```

---

## 7.3 Script 3: Indexes

> Execute after Script 2. Creates all performance-optimizing indexes.

```sql
-- ============================================================
-- SUIMS — Script 3: INDEXES
-- Smart University Internship Management System
-- Oracle Database 19c+
-- ============================================================

-- ==================== AUTHENTICATION & USER LOOKUP ====================

-- Function-based index for case-insensitive email login
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- Admin dashboard: filter users by role + status
CREATE INDEX idx_users_role_status ON users (role, status);

-- Account lock checking, active user queries
CREATE INDEX idx_users_status ON users (status);

-- ==================== PROFILE LOOKUPS ====================

-- Lecturer assignment filtering by department
CREATE INDEX idx_sprofiles_dept ON student_profiles (department);

-- Recommendation engine GPA range queries
CREATE INDEX idx_sprofiles_gpa ON student_profiles (gpa);

-- Lecturer assignment by department
CREATE INDEX idx_lprofiles_dept ON lecturer_profiles (department);

-- Admin verification queue
CREATE INDEX idx_cprofiles_verified ON company_profiles (is_verified);

-- ==================== CV & SKILL MATCHING ====================

-- Application eligibility check
CREATE INDEX idx_cvs_status ON cvs (status);

-- Company talent pool: public + complete CVs
CREATE INDEX idx_cvs_visibility ON cvs (visibility, status);

-- Recommendation engine: find students by skill
CREATE INDEX idx_cvskills_skill ON cv_skills (skill_id);

-- Load all skills for a CV
CREATE INDEX idx_cvskills_cv ON cv_skills (cv_id);

-- COVERING INDEX: Recommendation engine full skill match
CREATE INDEX idx_cvskills_cv_prof ON cv_skills (cv_id, skill_id, proficiency_weight);

-- ==================== LISTING & RECOMMENDATION ====================

-- Filter published/pending listings
CREATE INDEX idx_listings_status ON internship_listings (status);

-- Company dashboard: "my postings"
CREATE INDEX idx_listings_company ON internship_listings (company_user_id);

-- Student browsing: published + open deadline
CREATE INDEX idx_listings_status_deadline ON internship_listings (status, application_deadline);

-- FK index for approver
CREATE INDEX idx_listings_approved ON internship_listings (approved_by);

-- Recommendation engine: find listings by skill
CREATE INDEX idx_lskills_skill ON listing_required_skills (skill_id);

-- Load all skills for a listing
CREATE INDEX idx_lskills_listing ON listing_required_skills (listing_id);

-- Student dashboard: top-N recommendations by score
CREATE INDEX idx_recscore_user_comp ON recommendation_scores (user_id, composite_score DESC);

-- Company: top students for a listing
CREATE INDEX idx_recscore_listing_comp ON recommendation_scores (listing_id, composite_score DESC);

-- ==================== APPLICATION WORKFLOW ====================

-- Student dashboard: my applications by status
CREATE INDEX idx_apps_user_status ON applications (user_id, status);

-- Company: applications per listing by status
CREATE INDEX idx_apps_listing_status ON applications (listing_id, status);

-- Admin: pending confirmation queue
CREATE INDEX idx_apps_status ON applications (status);

-- FK index for CV version
CREATE INDEX idx_apps_cvversion ON applications (cv_version_id);

-- Application timeline load
CREATE INDEX idx_apphist_app ON application_status_history (application_id);

-- Chronological history
CREATE INDEX idx_apphist_changed ON application_status_history (changed_at);

-- ==================== INTERNSHIP & REPORTING ====================

-- Student: my internship
CREATE INDEX idx_intern_student ON internships (student_user_id);

-- Lecturer: supervised students
CREATE INDEX idx_intern_lecturer ON internships (lecturer_user_id);

-- Company: my interns
CREATE INDEX idx_intern_company ON internships (company_user_id);

-- Active internship queries
CREATE INDEX idx_intern_status ON internships (status);

-- Lecturer: active supervised students (composite)
CREATE INDEX idx_intern_lecturer_status ON internships (lecturer_user_id, status);

-- Report timeline with status filter
CREATE INDEX idx_wreports_intern_status ON weekly_reports (internship_id, status);

-- Lecturer: pending review queue
CREATE INDEX idx_wreports_status ON weekly_reports (status);

-- FK index for report attachments
CREATE INDEX idx_rattach_report ON report_attachments (report_id);

-- Load reviews for a report
CREATE INDEX idx_rreviews_report ON report_reviews (report_id);

-- Lecturer review history
CREATE INDEX idx_rreviews_reviewer ON report_reviews (reviewer_user_id);

-- ==================== EVALUATION & GRADING ====================

-- Pending evaluation queries
CREATE INDEX idx_compeval_status ON company_evaluations (status);

-- FK index for evaluator
CREATE INDEX idx_compeval_evaluator ON company_evaluations (evaluator_user_id);

-- Load scores for an evaluation
CREATE INDEX idx_ecscore_eval ON evaluation_criteria_scores (evaluation_id);

-- FK index for grader
CREATE INDEX idx_lgrades_grader ON lecturer_grades (grader_user_id);

-- ==================== NOTIFICATIONS ====================

-- CRITICAL: Unread count badge + notification feed
CREATE INDEX idx_notif_user_read ON notifications (user_id, is_read);

-- Notification feed with newest-first ordering
CREATE INDEX idx_notif_user_created ON notifications (user_id, created_at DESC);

-- Polymorphic reference lookup
CREATE INDEX idx_notif_ref ON notifications (reference_type, reference_id);

-- ==================== AUDIT LOGS ====================

-- Show all changes to a specific record
CREATE INDEX idx_audit_table_record ON audit_logs (table_name, record_id);

-- Chronological audit browsing
CREATE INDEX idx_audit_changed_at ON audit_logs (changed_at);

-- Changes by a specific user
CREATE INDEX idx_audit_changed_by ON audit_logs (changed_by);

-- ============================================================
-- Total Indexes Created: 47
-- ============================================================
```

---

## 7.4 Script 4: Seed Data

> Execute after Script 3. Populates configuration and reference tables with initial data.

```sql
-- ============================================================
-- SUIMS — Script 4: SEED DATA
-- Smart University Internship Management System
-- Oracle Database 19c+
-- ============================================================

-- ==================== GRADING SCALES ====================
INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'A',  85.00, 100.00, 4.00, 1);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'B+', 80.00, 84.99,  3.50, 2);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'B',  75.00, 79.99,  3.00, 3);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'C+', 70.00, 74.99,  2.50, 4);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'C',  65.00, 69.99,  2.00, 5);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'D',  60.00, 64.99,  1.50, 6);

INSERT INTO grading_scales (grade_scale_id, letter_grade, min_score, max_score, grade_point, sort_order)
VALUES (seq_grading_scales.NEXTVAL, 'F',  0.00,  59.99,  0.00, 7);

-- ==================== EVALUATION CRITERIA ====================
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Technical Competence',
        'Ability to apply technical skills and knowledge to assigned tasks', 0.20, 1, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Communication Skills',
        'Effectiveness in verbal and written communication', 0.15, 2, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Teamwork & Collaboration',
        'Ability to work effectively in teams and collaborate with colleagues', 0.15, 3, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Professionalism & Work Ethic',
        'Demonstrates responsibility, punctuality, and professional behavior', 0.15, 4, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Initiative & Problem Solving',
        'Proactively identifies and resolves problems, shows self-motivation', 0.15, 5, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Attendance & Punctuality',
        'Regularity of attendance and adherence to work schedules', 0.10, 6, 1);

INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Overall Performance',
        'General assessment of intern overall contribution and growth', 0.10, 7, 1);

-- ==================== MATCHING WEIGHT CONFIGURATION (Singleton) ====================
INSERT INTO matching_weight_configs (config_id, skill_weight, gpa_weight, preference_weight,
    min_score_threshold, max_recommendations)
VALUES (1, 0.60, 0.20, 0.20, 30.00, 10);

-- ==================== SYSTEM CONFIGURATION ====================
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REPORT_DEADLINE_DAY', 'SUNDAY', 'STRING',
        'Default day of the week for weekly report submission deadline');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REPORT_DEADLINE_TIME', '23:59', 'STRING',
        'Time of day for weekly report submission deadline');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_ACTIVE_APPLICATIONS', '3', 'INTEGER',
        'Maximum number of active (non-finalized) applications per student');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_REVISION_REQUESTS', '2', 'INTEGER',
        'Maximum number of revision requests per weekly report');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'COMPANY_EVAL_DEADLINE_DAYS', '14', 'INTEGER',
        'Number of days after internship end for company evaluation submission');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REMINDER_HOURS_BEFORE', '24', 'INTEGER',
        'Hours before deadline to send reminder notification');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'COMPANY_EVAL_WEIGHT', '0.40', 'DECIMAL',
        'Weight of company evaluation in final score calculation');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'LECTURER_GRADE_WEIGHT', '0.40', 'DECIMAL',
        'Weight of lecturer grade in final score calculation');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'ATTENDANCE_WEIGHT', '0.20', 'DECIMAL',
        'Weight of attendance score in final score calculation');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'ACCOUNT_LOCK_DURATION_MINUTES', '30', 'INTEGER',
        'Duration in minutes for account lockout after failed login attempts');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_FAILED_LOGIN_ATTEMPTS', '5', 'INTEGER',
        'Number of consecutive failed login attempts before account lock');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'JWT_ACCESS_TOKEN_EXPIRY_MINUTES', '60', 'INTEGER',
        'JWT access token expiry time in minutes');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'JWT_REFRESH_TOKEN_EXPIRY_DAYS', '7', 'INTEGER',
        'JWT refresh token expiry time in days');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_FILE_SIZE_BYTES', '5242880', 'INTEGER',
        'Maximum file upload size in bytes (5 MB)');

INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_REPORT_ATTACHMENTS', '3', 'INTEGER',
        'Maximum number of file attachments per weekly report');

-- ==================== SKILL TAXONOMY ====================

-- Category 1: Programming Languages
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Programming Languages', 'General-purpose and specialized programming languages', 1, 1);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'Python', 'General-purpose programming language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'Java', 'Object-oriented programming language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'JavaScript', 'Web scripting language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'TypeScript', 'Typed superset of JavaScript', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'PHP', 'Server-side scripting language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'C#', 'Microsoft .NET programming language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'C++', 'Systems and application programming language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'Kotlin', 'Modern JVM language for Android', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Programming Languages'), 'Swift', 'Apple platforms programming language', 1);

-- Category 2: Web Frameworks
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Web Frameworks', 'Frontend and backend web development frameworks', 1, 2);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'React', 'Frontend JavaScript library by Meta', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Angular', 'Frontend framework by Google', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Vue.js', 'Progressive JavaScript framework', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Laravel', 'PHP web application framework', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Node.js', 'JavaScript runtime environment', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Django', 'Python web framework', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Spring Boot', 'Java enterprise framework', 1);

-- Category 3: Databases
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Databases', 'Relational and NoSQL database systems', 1, 3);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'Oracle Database', 'Enterprise relational database system', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'MySQL', 'Open-source relational database', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'PostgreSQL', 'Advanced open-source relational database', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'MongoDB', 'NoSQL document database', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'SQL', 'Structured Query Language', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'Redis', 'In-memory data store', 1);

-- Category 4: DevOps & Cloud
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'DevOps & Cloud', 'Cloud platforms, CI/CD, and containerization', 1, 4);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'Docker', 'Container platform', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'Kubernetes', 'Container orchestration', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'AWS', 'Amazon Web Services cloud platform', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'Git', 'Version control system', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'Linux', 'Operating system administration', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'DevOps & Cloud'), 'CI/CD', 'Continuous Integration and Deployment', 1);

-- Category 5: Design & Multimedia
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Design & Multimedia', 'UI/UX design, graphic design, and multimedia tools', 1, 5);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'Figma', 'Collaborative UI design tool', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'Adobe Photoshop', 'Raster graphics editor', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'Adobe Illustrator', 'Vector graphics editor', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'UI/UX Design', 'User interface and experience design', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'Video Editing', 'Video production and post-production', 1);

-- Category 6: Data Science & AI
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Data Science & AI', 'Machine learning, data analysis, and AI technologies', 1, 6);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Machine Learning', 'Algorithms and statistical models', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Data Analysis', 'Statistical analysis and interpretation', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'TensorFlow', 'Deep learning framework', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Power BI', 'Business analytics and visualization', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Tableau', 'Data visualization platform', 1);

-- Category 7: Business & Communication
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Business & Communication', 'Professional and business skills', 1, 7);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Project Management', 'Planning and executing projects', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Technical Writing', 'Documentation and technical communication', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Public Speaking', 'Presentation and communication skills', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Agile/Scrum', 'Agile project methodology', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Business Analysis', 'Requirements gathering and analysis', 1);

-- Category 8: Networking & Security
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Networking & Security', 'Network administration and cybersecurity', 1, 8);

INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Network Administration', 'Managing computer networks', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Cybersecurity', 'Information security practices', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Penetration Testing', 'Security vulnerability assessment', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Firewall Management', 'Network security infrastructure', 1);

-- ==================== DEFAULT ADMIN USER ====================
-- Password: Admin@123 (bcrypt hash - cost factor 12)
INSERT INTO users (user_id, email, password_hash, full_name, role, status, email_verified_at)
VALUES (seq_users.NEXTVAL, 'admin@suims.edu',
    '$2y$12$LJ3m4ys3Gm0lK8Kq5v9xQOkZ0/VpWEhQq5LKnG8eW.rTz7cFq6gW6',
    'System Administrator', 'ADMIN', 'ACTIVE', SYSTIMESTAMP);

COMMIT;

-- ============================================================
-- Seed Data Summary:
--   Grading Scales:       7 rows
--   Evaluation Criteria:  7 rows
--   Matching Config:      1 row (singleton)
--   System Configs:       15 rows
--   Skill Categories:     8 categories
--   Skills:              53 skills
--   Default Admin:        1 user
-- ============================================================
```

---

## 7.5 Script 5: Cleanup / Drop Script

> Use this script to reset the database during development. **CAUTION: Destroys all data.**

```sql
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
```

---

## 7.6 Execution Verification Queries

> Run these after executing Scripts 1–4 to verify the installation.

```sql
-- Verify table count (expected: 32)
SELECT COUNT(*) AS table_count FROM user_tables;

-- Verify sequence count (expected: 31)
SELECT COUNT(*) AS sequence_count FROM user_sequences WHERE sequence_name LIKE 'SEQ_%';

-- Verify index count (expected: 47 custom + PK/UK auto-indexes)
SELECT COUNT(*) AS index_count FROM user_indexes WHERE index_name LIKE 'IDX_%';

-- Verify constraint counts
SELECT constraint_type, COUNT(*) AS constraint_count
FROM user_constraints
WHERE table_name NOT LIKE 'BIN$%'
GROUP BY constraint_type
ORDER BY constraint_type;
-- Expected: P (PK) = 32, R (FK) = 45, U (UK) = 16, C (CHECK) = 55+

-- Verify seed data
SELECT 'grading_scales' AS tbl, COUNT(*) AS cnt FROM grading_scales
UNION ALL SELECT 'evaluation_criteria', COUNT(*) FROM evaluation_criteria
UNION ALL SELECT 'matching_weight_configs', COUNT(*) FROM matching_weight_configs
UNION ALL SELECT 'system_configs', COUNT(*) FROM system_configs
UNION ALL SELECT 'skill_categories', COUNT(*) FROM skill_categories
UNION ALL SELECT 'skills', COUNT(*) FROM skills
UNION ALL SELECT 'users (admin)', COUNT(*) FROM users WHERE role = 'ADMIN';

-- Verify evaluation criteria weights sum to 1.00
SELECT SUM(weight) AS total_weight FROM evaluation_criteria WHERE is_active = 1;
-- Expected: 1.00

-- Verify matching weights sum to 1.00
SELECT skill_weight + gpa_weight + preference_weight AS total_weight
FROM matching_weight_configs WHERE config_id = 1;
-- Expected: 1.00
```

---

## 7.7 Phase 7 — State Summary

> [!IMPORTANT]
> **Critical Decisions Carried Forward to Subsequent Phases:**

- **5 executable SQL scripts** are production-ready: Sequences (31), Tables (32 in dependency order), Indexes (47), Seed Data (grading scales, evaluation criteria, matching config, 15 system configs, 8 skill categories with 53 skills, 1 default admin user), and a Cleanup script for development.
- **All tables use `DEFAULT seq_xxx.NEXTVAL`** for primary keys — this is an Oracle 12c+ feature that eliminates the need for BEFORE INSERT triggers for auto-incrementing IDs. Laravel's OCI8 driver will work with this pattern via the `$sequence` property on Eloquent models.
- **Seed data establishes the operational baseline**: The `matching_weight_configs` singleton (60/20/20 weights), `grading_scales` (7 grades from A to F), and `evaluation_criteria` (7 criteria summing to weight 1.00) are required for the Recommendation Engine and `CalculateFinalScore` procedure (Phase 8).
- **The default admin account** (`admin@suims.edu`) is created with bcrypt password hash and `ACTIVE` status. This account is needed for initial system bootstrap — all other accounts are created through the registration API (Phase 9).

---

✅ **Phase 7 completed.** Reply **CONTINUE** to proceed to Phase 8 (PL/SQL Development), or provide feedback to revise this phase.
