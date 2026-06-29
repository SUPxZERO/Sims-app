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
    CONSTRAINT chk_rattach_size CHECK (file_size_bytes BETWEEN 1 AND 31457280)
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
