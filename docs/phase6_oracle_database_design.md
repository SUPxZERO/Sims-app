# PHASE 6: ORACLE DATABASE DESIGN & INDEXING

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 5 (Conceptual & Logical ERD)  
> **Database Platform:** Oracle Database 19c+ (Enterprise Edition)  
> **Character Set:** AL32UTF8  
> **Note:** This phase defines table structures and indexing. Executable SQL scripts are in Phase 7.

---

## 6.1 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | `lowercase_snake_case`, plural nouns | `users`, `weekly_reports` |
| Columns | `lowercase_snake_case` | `user_id`, `created_at` |
| Primary Keys | `pk_{table}` | `pk_users` |
| Foreign Keys | `fk_{child}_{parent}` | `fk_student_profiles_users` |
| Unique Constraints | `uk_{table}_{column(s)}` | `uk_users_email` |
| Check Constraints | `chk_{table}_{column}` | `chk_users_role` |
| Indexes | `idx_{table}_{column(s)}` | `idx_applications_status` |
| Sequences | `seq_{table}` | `seq_users` |
| Triggers | `trg_{table}_{action}` | `trg_users_audit` |

---

## 6.2 Table Structures with Oracle Data Types

### 6.2.1 `users`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `user_id` | `NUMBER(10)` | `NOT NULL` | `seq_users.NEXTVAL` | `PK pk_users` |
| `email` | `VARCHAR2(150)` | `NOT NULL` | — | `UK uk_users_email` |
| `password_hash` | `VARCHAR2(255)` | `NOT NULL` | — | — |
| `full_name` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `role` | `VARCHAR2(20)` | `NOT NULL` | — | `CHK chk_users_role IN ('ADMIN','STUDENT','LECTURER','COMPANY')` |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'INACTIVE'` | `CHK chk_users_status IN ('ACTIVE','INACTIVE','LOCKED')` |
| `email_verified_at` | `TIMESTAMP` | `NULL` | — | — |
| `failed_login_attempts` | `NUMBER(2)` | `NOT NULL` | `0` | — |
| `locked_until` | `TIMESTAMP` | `NULL` | — | — |
| `last_login_at` | `TIMESTAMP` | `NULL` | — | — |
| `profile_photo_path` | `VARCHAR2(500)` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_users` — START WITH 1, INCREMENT BY 1

---

### 6.2.2 `student_profiles`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `student_profile_id` | `NUMBER(10)` | `NOT NULL` | `seq_student_profiles.NEXTVAL` | `PK pk_student_profiles` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_sprofiles_users → users(user_id)`, `UK uk_sprofiles_user` |
| `student_id_number` | `VARCHAR2(30)` | `NOT NULL` | — | `UK uk_sprofiles_stdid` |
| `department` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `faculty` | `VARCHAR2(100)` | `NULL` | — | — |
| `enrollment_year` | `NUMBER(4)` | `NOT NULL` | — | `CHK chk_sprofiles_year BETWEEN 2000 AND 2099` |
| `expected_graduation` | `NUMBER(4)` | `NULL` | — | — |
| `gpa` | `NUMBER(3,2)` | `NOT NULL` | — | `CHK chk_sprofiles_gpa BETWEEN 0.00 AND 4.00` |
| `phone_number` | `VARCHAR2(20)` | `NULL` | — | — |
| `address` | `VARCHAR2(500)` | `NULL` | — | — |
| `linkedin_url` | `VARCHAR2(300)` | `NULL` | — | — |
| `bio` | `CLOB` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_student_profiles`  
**FK Behavior:** `ON DELETE CASCADE` (deleting user removes student profile)

---

### 6.2.3 `lecturer_profiles`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `lecturer_profile_id` | `NUMBER(10)` | `NOT NULL` | `seq_lecturer_profiles.NEXTVAL` | `PK pk_lecturer_profiles` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_lprofiles_users → users(user_id)`, `UK uk_lprofiles_user` |
| `staff_id_number` | `VARCHAR2(30)` | `NOT NULL` | — | `UK uk_lprofiles_staffid` |
| `department` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `faculty` | `VARCHAR2(100)` | `NULL` | — | — |
| `specialization` | `VARCHAR2(500)` | `NULL` | — | — |
| `max_supervision_load` | `NUMBER(3)` | `NOT NULL` | `10` | `CHK chk_lprofiles_load BETWEEN 1 AND 30` |
| `phone_number` | `VARCHAR2(20)` | `NULL` | — | — |
| `office_location` | `VARCHAR2(100)` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_lecturer_profiles`  
**FK Behavior:** `ON DELETE CASCADE`

---

### 6.2.4 `company_profiles`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `company_profile_id` | `NUMBER(10)` | `NOT NULL` | `seq_company_profiles.NEXTVAL` | `PK pk_company_profiles` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cprofiles_users → users(user_id)`, `UK uk_cprofiles_user` |
| `company_name` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `industry_sector` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `company_size` | `VARCHAR2(20)` | `NULL` | — | `CHK chk_cprofiles_size IN ('STARTUP','SMALL','MEDIUM','LARGE','ENTERPRISE')` |
| `company_website` | `VARCHAR2(300)` | `NULL` | — | — |
| `company_address` | `VARCHAR2(500)` | `NOT NULL` | — | — |
| `company_city` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `company_description` | `CLOB` | `NULL` | — | — |
| `contact_person_name` | `VARCHAR2(200)` | `NULL` | — | — |
| `contact_phone` | `VARCHAR2(20)` | `NULL` | — | — |
| `is_verified` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_cprofiles_verified IN (0,1)` |
| `verified_at` | `TIMESTAMP` | `NULL` | — | — |
| `verified_by` | `NUMBER(10)` | `NULL` | — | `FK fk_cprofiles_verifier → users(user_id)` |
| `company_logo_path` | `VARCHAR2(500)` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_company_profiles`  
**FK Behavior:** `user_id ON DELETE CASCADE`, `verified_by ON DELETE SET NULL`

---

### 6.2.5 `password_resets`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `reset_id` | `NUMBER(10)` | `NOT NULL` | `seq_password_resets.NEXTVAL` | `PK pk_password_resets` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_presets_users → users(user_id) ON DELETE CASCADE` |
| `token` | `VARCHAR2(255)` | `NOT NULL` | — | `UK uk_presets_token` |
| `expires_at` | `TIMESTAMP` | `NOT NULL` | — | — |
| `used_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_password_resets`

---

### 6.2.6 `cvs`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_id` | `NUMBER(10)` | `NOT NULL` | `seq_cvs.NEXTVAL` | `PK pk_cvs` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvs_users → users(user_id) ON DELETE CASCADE`, `UK uk_cvs_user` |
| `personal_summary` | `CLOB` | `NULL` | — | — |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'INCOMPLETE'` | `CHK chk_cvs_status IN ('INCOMPLETE','COMPLETE')` |
| `visibility` | `VARCHAR2(20)` | `NOT NULL` | `'PRIVATE'` | `CHK chk_cvs_visibility IN ('PUBLIC','PRIVATE')` |
| `current_version` | `NUMBER(5)` | `NOT NULL` | `1` | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_cvs`

---

### 6.2.7 `cv_educations`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_education_id` | `NUMBER(10)` | `NOT NULL` | `seq_cv_educations.NEXTVAL` | `PK pk_cv_educations` |
| `cv_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvedu_cvs → cvs(cv_id) ON DELETE CASCADE` |
| `institution_name` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `degree` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `field_of_study` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `start_date` | `DATE` | `NOT NULL` | — | — |
| `end_date` | `DATE` | `NULL` | — | `CHK chk_cvedu_dates (end_date IS NULL OR end_date >= start_date)` |
| `gpa` | `NUMBER(3,2)` | `NULL` | — | `CHK chk_cvedu_gpa (gpa IS NULL OR gpa BETWEEN 0.00 AND 4.00)` |
| `description` | `VARCHAR2(1000)` | `NULL` | — | — |
| `sort_order` | `NUMBER(3)` | `NOT NULL` | `0` | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_cv_educations`

---

### 6.2.8 `cv_experiences`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_experience_id` | `NUMBER(10)` | `NOT NULL` | `seq_cv_experiences.NEXTVAL` | `PK pk_cv_experiences` |
| `cv_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvexp_cvs → cvs(cv_id) ON DELETE CASCADE` |
| `company_name` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `position_title` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `start_date` | `DATE` | `NOT NULL` | — | — |
| `end_date` | `DATE` | `NULL` | — | `CHK chk_cvexp_dates (end_date IS NULL OR end_date >= start_date)` |
| `description` | `CLOB` | `NULL` | — | — |
| `sort_order` | `NUMBER(3)` | `NOT NULL` | `0` | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_cv_experiences`

---

### 6.2.9 `cv_documents`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_document_id` | `NUMBER(10)` | `NOT NULL` | `seq_cv_documents.NEXTVAL` | `PK pk_cv_documents` |
| `cv_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvdoc_cvs → cvs(cv_id) ON DELETE CASCADE` |
| `document_label` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `file_path` | `VARCHAR2(500)` | `NOT NULL` | — | — |
| `file_name` | `VARCHAR2(255)` | `NOT NULL` | — | — |
| `file_size_bytes` | `NUMBER(10)` | `NOT NULL` | — | `CHK chk_cvdoc_size (file_size_bytes BETWEEN 1 AND 5242880)` |
| `mime_type` | `VARCHAR2(50)` | `NOT NULL` | — | `CHK chk_cvdoc_mime (mime_type = 'application/pdf')` |
| `uploaded_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_cv_documents`

---

### 6.2.10 `cv_versions`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_version_id` | `NUMBER(10)` | `NOT NULL` | `seq_cv_versions.NEXTVAL` | `PK pk_cv_versions` |
| `cv_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvver_cvs → cvs(cv_id) ON DELETE CASCADE` |
| `version_number` | `NUMBER(5)` | `NOT NULL` | — | `UK uk_cvver_cv_version (cv_id, version_number)` |
| `snapshot_data` | `CLOB` | `NOT NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_cv_versions`

---

### 6.2.11 `skill_categories`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `skill_category_id` | `NUMBER(5)` | `NOT NULL` | `seq_skill_categories.NEXTVAL` | `PK pk_skill_categories` |
| `category_name` | `VARCHAR2(100)` | `NOT NULL` | — | `UK uk_skillcat_name` |
| `description` | `VARCHAR2(500)` | `NULL` | — | — |
| `is_active` | `NUMBER(1)` | `NOT NULL` | `1` | `CHK chk_skillcat_active IN (0,1)` |
| `sort_order` | `NUMBER(3)` | `NOT NULL` | `0` | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_skill_categories`

---

### 6.2.12 `skills`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `skill_id` | `NUMBER(5)` | `NOT NULL` | `seq_skills.NEXTVAL` | `PK pk_skills` |
| `skill_category_id` | `NUMBER(5)` | `NOT NULL` | — | `FK fk_skills_cat → skill_categories(skill_category_id)` |
| `skill_name` | `VARCHAR2(100)` | `NOT NULL` | — | `UK uk_skills_cat_name (skill_category_id, skill_name)` |
| `description` | `VARCHAR2(500)` | `NULL` | — | — |
| `is_active` | `NUMBER(1)` | `NOT NULL` | `1` | `CHK chk_skills_active IN (0,1)` |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_skills`  
**FK Behavior:** `ON DELETE CASCADE` (deactivating category cascades)

---

### 6.2.13 `cv_skills`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `cv_skill_id` | `NUMBER(10)` | `NOT NULL` | `seq_cv_skills.NEXTVAL` | `PK pk_cv_skills` |
| `cv_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_cvskills_cvs → cvs(cv_id) ON DELETE CASCADE` |
| `skill_id` | `NUMBER(5)` | `NOT NULL` | — | `FK fk_cvskills_skills → skills(skill_id)` |
| `proficiency_level` | `VARCHAR2(20)` | `NOT NULL` | — | `CHK chk_cvskills_level IN ('BEGINNER','INTERMEDIATE','ADVANCED')` |
| `proficiency_weight` | `NUMBER(3,2)` | `NOT NULL` | — | `CHK chk_cvskills_weight IN (0.33, 0.66, 1.00)` |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Composite Unique:** `UK uk_cvskills_cv_skill (cv_id, skill_id)`  
**Sequence:** `seq_cv_skills`

---

### 6.2.14 `internship_listings`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `listing_id` | `NUMBER(10)` | `NOT NULL` | `seq_internship_listings.NEXTVAL` | `PK pk_internship_listings` |
| `company_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_listings_company → users(user_id)` |
| `title` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `description` | `CLOB` | `NOT NULL` | — | — |
| `requirements` | `CLOB` | `NULL` | — | — |
| `location` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `work_mode` | `VARCHAR2(20)` | `NOT NULL` | — | `CHK chk_listings_workmode IN ('ONSITE','REMOTE','HYBRID')` |
| `duration_weeks` | `NUMBER(2)` | `NOT NULL` | — | `CHK chk_listings_duration BETWEEN 4 AND 24` |
| `quota` | `NUMBER(3)` | `NOT NULL` | — | `CHK chk_listings_quota BETWEEN 1 AND 50` |
| `filled_count` | `NUMBER(3)` | `NOT NULL` | `0` | `CHK chk_listings_filled (filled_count >= 0)` |
| `stipend_info` | `VARCHAR2(500)` | `NULL` | — | — |
| `application_deadline` | `DATE` | `NOT NULL` | — | — |
| `status` | `VARCHAR2(25)` | `NOT NULL` | `'DRAFT'` | `CHK chk_listings_status IN ('DRAFT','PENDING_APPROVAL','PUBLISHED','CHANGES_REQUESTED','REJECTED','CLOSED','WITHDRAWN')` |
| `admin_feedback` | `CLOB` | `NULL` | — | — |
| `approved_by` | `NUMBER(10)` | `NULL` | — | `FK fk_listings_approver → users(user_id) ON DELETE SET NULL` |
| `published_at` | `TIMESTAMP` | `NULL` | — | — |
| `min_gpa` | `NUMBER(3,2)` | `NULL` | — | `CHK chk_listings_mingpa (min_gpa IS NULL OR min_gpa BETWEEN 0.00 AND 4.00)` |
| `preferred_departments` | `VARCHAR2(500)` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_internship_listings`

---

### 6.2.15 `listing_required_skills`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `listing_skill_id` | `NUMBER(10)` | `NOT NULL` | `seq_listing_req_skills.NEXTVAL` | `PK pk_listing_req_skills` |
| `listing_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_lskills_listings → internship_listings(listing_id) ON DELETE CASCADE` |
| `skill_id` | `NUMBER(5)` | `NOT NULL` | — | `FK fk_lskills_skills → skills(skill_id)` |
| `importance` | `VARCHAR2(20)` | `NOT NULL` | — | `CHK chk_lskills_imp IN ('REQUIRED','PREFERRED')` |
| `importance_weight` | `NUMBER(3,2)` | `NOT NULL` | — | `CHK chk_lskills_weight IN (1.00, 0.50)` |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Composite Unique:** `UK uk_lskills_listing_skill (listing_id, skill_id)`  
**Sequence:** `seq_listing_req_skills`

---

### 6.2.16 `recommendation_scores`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `recommendation_id` | `NUMBER(10)` | `NOT NULL` | `seq_recommendation_scores.NEXTVAL` | `PK pk_recommendation_scores` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_recscore_users → users(user_id) ON DELETE CASCADE` |
| `listing_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_recscore_listings → internship_listings(listing_id) ON DELETE CASCADE` |
| `skill_match_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_recscore_skill BETWEEN 0.00 AND 100.00` |
| `gpa_match_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_recscore_gpa BETWEEN 0.00 AND 100.00` |
| `preference_match_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_recscore_pref BETWEEN 0.00 AND 100.00` |
| `composite_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_recscore_comp BETWEEN 0.00 AND 100.00` |
| `skill_weight_used` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `gpa_weight_used` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `preference_weight_used` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `matched_skills_count` | `NUMBER(3)` | `NOT NULL` | — | — |
| `total_required_skills` | `NUMBER(3)` | `NOT NULL` | — | — |
| `calculated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Composite Unique:** `UK uk_recscore_user_listing (user_id, listing_id)`  
**Sequence:** `seq_recommendation_scores`

---

### 6.2.17 `matching_weight_configs`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `config_id` | `NUMBER(1)` | `NOT NULL` | — | `PK pk_matching_weight_configs`, `CHK chk_mwc_singleton (config_id = 1)` |
| `skill_weight` | `NUMBER(3,2)` | `NOT NULL` | `0.60` | `CHK chk_mwc_sw BETWEEN 0.00 AND 1.00` |
| `gpa_weight` | `NUMBER(3,2)` | `NOT NULL` | `0.20` | `CHK chk_mwc_gw BETWEEN 0.00 AND 1.00` |
| `preference_weight` | `NUMBER(3,2)` | `NOT NULL` | `0.20` | `CHK chk_mwc_pw BETWEEN 0.00 AND 1.00` |
| `min_score_threshold` | `NUMBER(5,2)` | `NOT NULL` | `30.00` | `CHK chk_mwc_thresh BETWEEN 0.00 AND 100.00` |
| `max_recommendations` | `NUMBER(3)` | `NOT NULL` | `10` | `CHK chk_mwc_maxrec BETWEEN 1 AND 50` |
| `updated_by` | `NUMBER(10)` | `NULL` | — | `FK fk_mwc_users → users(user_id) ON DELETE SET NULL` |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Special Constraint:** `CHK chk_mwc_sum (skill_weight + gpa_weight + preference_weight = 1.00)`  
**No Sequence needed** — singleton row always has `config_id = 1`

---

### 6.2.18 `applications`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `application_id` | `NUMBER(10)` | `NOT NULL` | `seq_applications.NEXTVAL` | `PK pk_applications` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_apps_users → users(user_id)` |
| `listing_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_apps_listings → internship_listings(listing_id)` |
| `cv_version_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_apps_cvversions → cv_versions(cv_version_id)` |
| `cover_letter` | `CLOB` | `NULL` | — | — |
| `match_score_at_apply` | `NUMBER(5,2)` | `NULL` | — | — |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'SUBMITTED'` | `CHK chk_apps_status IN ('SUBMITTED','UNDER_REVIEW','SHORTLISTED','ACCEPTED','REJECTED','CONFIRMED','WITHDRAWN','AUTO_WITHDRAWN')` |
| `rejection_reason` | `CLOB` | `NULL` | — | — |
| `submitted_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `reviewed_at` | `TIMESTAMP` | `NULL` | — | — |
| `decided_at` | `TIMESTAMP` | `NULL` | — | — |
| `confirmed_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Composite Unique:** `UK uk_apps_user_listing (user_id, listing_id)`  
**Sequence:** `seq_applications`

---

### 6.2.19 `application_status_history`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `history_id` | `NUMBER(10)` | `NOT NULL` | `seq_app_status_history.NEXTVAL` | `PK pk_app_status_history` |
| `application_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_apphist_apps → applications(application_id) ON DELETE CASCADE` |
| `from_status` | `VARCHAR2(20)` | `NULL` | — | — |
| `to_status` | `VARCHAR2(20)` | `NOT NULL` | — | — |
| `changed_by` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_apphist_users → users(user_id)` |
| `change_reason` | `CLOB` | `NULL` | — | — |
| `changed_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_app_status_history`

---

### 6.2.20 `internships`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `internship_id` | `NUMBER(10)` | `NOT NULL` | `seq_internships.NEXTVAL` | `PK pk_internships` |
| `application_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_apps → applications(application_id)`, `UK uk_intern_app` |
| `student_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_student → users(user_id)` |
| `company_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_company → users(user_id)` |
| `lecturer_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_lecturer → users(user_id)` |
| `listing_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_listings → internship_listings(listing_id)` |
| `start_date` | `DATE` | `NOT NULL` | — | — |
| `end_date` | `DATE` | `NOT NULL` | — | `CHK chk_intern_dates (end_date > start_date)` |
| `total_weeks` | `NUMBER(2)` | `NOT NULL` | — | `CHK chk_intern_weeks BETWEEN 4 AND 24` |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'ACTIVE'` | `CHK chk_intern_status IN ('ACTIVE','COMPLETED','TERMINATED')` |
| `confirmed_by` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_intern_confirmer → users(user_id)` |
| `report_deadline_day` | `VARCHAR2(10)` | `NOT NULL` | `'SUNDAY'` | `CHK chk_intern_day IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY')` |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_internships`

---

### 6.2.21 `weekly_reports`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `report_id` | `NUMBER(10)` | `NOT NULL` | `seq_weekly_reports.NEXTVAL` | `PK pk_weekly_reports` |
| `internship_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_wreports_intern → internships(internship_id) ON DELETE CASCADE` |
| `week_number` | `NUMBER(2)` | `NOT NULL` | — | `CHK chk_wreports_week BETWEEN 1 AND 24` |
| `week_start_date` | `DATE` | `NOT NULL` | — | — |
| `week_end_date` | `DATE` | `NOT NULL` | — | — |
| `activities` | `CLOB` | `NULL` | — | — |
| `challenges` | `CLOB` | `NULL` | — | — |
| `learnings` | `CLOB` | `NULL` | — | — |
| `hours_logged` | `NUMBER(4,1)` | `NULL` | — | `CHK chk_wreports_hours (hours_logged IS NULL OR hours_logged BETWEEN 1.0 AND 80.0)` |
| `status` | `VARCHAR2(25)` | `NOT NULL` | `'NOT_STARTED'` | `CHK chk_wreports_status IN ('NOT_STARTED','DRAFT','SUBMITTED','APPROVED','REVISION_REQUESTED','REJECTED')` |
| `is_late` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_wreports_late IN (0,1)` |
| `revision_count` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_wreports_revcount BETWEEN 0 AND 2` |
| `submitted_at` | `TIMESTAMP` | `NULL` | — | — |
| `approved_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Composite Unique:** `UK uk_wreports_intern_week (internship_id, week_number)`  
**Sequence:** `seq_weekly_reports`

---

### 6.2.22 `report_attachments`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `attachment_id` | `NUMBER(10)` | `NOT NULL` | `seq_report_attachments.NEXTVAL` | `PK pk_report_attachments` |
| `report_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_rattach_reports → weekly_reports(report_id) ON DELETE CASCADE` |
| `file_path` | `VARCHAR2(500)` | `NOT NULL` | — | — |
| `file_name` | `VARCHAR2(255)` | `NOT NULL` | — | — |
| `file_size_bytes` | `NUMBER(10)` | `NOT NULL` | — | `CHK chk_rattach_size (file_size_bytes BETWEEN 1 AND 5242880)` |
| `mime_type` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `uploaded_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_report_attachments`

---

### 6.2.23 `report_reviews`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `review_id` | `NUMBER(10)` | `NOT NULL` | `seq_report_reviews.NEXTVAL` | `PK pk_report_reviews` |
| `report_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_rreviews_reports → weekly_reports(report_id) ON DELETE CASCADE` |
| `reviewer_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_rreviews_users → users(user_id)` |
| `decision` | `VARCHAR2(25)` | `NOT NULL` | — | `CHK chk_rreviews_decision IN ('APPROVED','REVISION_REQUESTED','REJECTED')` |
| `comments` | `CLOB` | `NOT NULL` | — | — |
| `reviewed_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_report_reviews`

---

### 6.2.24 `company_evaluations`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `evaluation_id` | `NUMBER(10)` | `NOT NULL` | `seq_company_evaluations.NEXTVAL` | `PK pk_company_evaluations` |
| `internship_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_compeval_intern → internships(internship_id)`, `UK uk_compeval_intern` |
| `evaluator_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_compeval_users → users(user_id)` |
| `composite_score` | `NUMBER(5,2)` | `NULL` | — | `CHK chk_compeval_score (composite_score IS NULL OR composite_score BETWEEN 0.00 AND 100.00)` |
| `strengths` | `CLOB` | `NULL` | — | — |
| `improvements` | `CLOB` | `NULL` | — | — |
| `overall_comments` | `CLOB` | `NULL` | — | — |
| `hiring_recommendation` | `VARCHAR2(20)` | `NULL` | — | `CHK chk_compeval_hire IN ('WOULD_HIRE','WOULD_CONSIDER','WOULD_NOT_HIRE')` |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'DRAFT'` | `CHK chk_compeval_status IN ('DRAFT','SUBMITTED','LOCKED')` |
| `is_late` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_compeval_late IN (0,1)` |
| `submitted_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_company_evaluations`

---

### 6.2.25 `evaluation_criteria_scores`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `criteria_score_id` | `NUMBER(10)` | `NOT NULL` | `seq_eval_criteria_scores.NEXTVAL` | `PK pk_eval_criteria_scores` |
| `evaluation_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_ecscore_eval → company_evaluations(evaluation_id) ON DELETE CASCADE` |
| `criteria_id` | `NUMBER(5)` | `NOT NULL` | — | `FK fk_ecscore_criteria → evaluation_criteria(criteria_id)` |
| `score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_ecscore_score BETWEEN 0.00 AND 100.00` |

**Composite Unique:** `UK uk_ecscore_eval_criteria (evaluation_id, criteria_id)`  
**Sequence:** `seq_eval_criteria_scores`

---

### 6.2.26 `lecturer_grades`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `grade_id` | `NUMBER(10)` | `NOT NULL` | `seq_lecturer_grades.NEXTVAL` | `PK pk_lecturer_grades` |
| `internship_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_lgrades_intern → internships(internship_id)`, `UK uk_lgrades_intern` |
| `grader_user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_lgrades_users → users(user_id)` |
| `report_quality_score` | `NUMBER(5,2)` | `NULL` | — | `CHK chk_lgrades_rqs (report_quality_score IS NULL OR report_quality_score BETWEEN 0.00 AND 100.00)` |
| `presentation_score` | `NUMBER(5,2)` | `NULL` | — | `CHK chk_lgrades_ps (presentation_score IS NULL OR presentation_score BETWEEN 0.00 AND 100.00)` |
| `engagement_score` | `NUMBER(5,2)` | `NULL` | — | `CHK chk_lgrades_es (engagement_score IS NULL OR engagement_score BETWEEN 0.00 AND 100.00)` |
| `composite_score` | `NUMBER(5,2)` | `NULL` | — | `CHK chk_lgrades_comp (composite_score IS NULL OR composite_score BETWEEN 0.00 AND 100.00)` |
| `overall_comments` | `CLOB` | `NULL` | — | — |
| `status` | `VARCHAR2(20)` | `NOT NULL` | `'DRAFT'` | `CHK chk_lgrades_status IN ('DRAFT','SUBMITTED','LOCKED')` |
| `submitted_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_lecturer_grades`

---

### 6.2.27 `final_scores`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `final_score_id` | `NUMBER(10)` | `NOT NULL` | `seq_final_scores.NEXTVAL` | `PK pk_final_scores` |
| `internship_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_fscores_intern → internships(internship_id)`, `UK uk_fscores_intern` |
| `company_eval_score` | `NUMBER(5,2)` | `NOT NULL` | — | — |
| `lecturer_grade_score` | `NUMBER(5,2)` | `NOT NULL` | — | — |
| `attendance_score` | `NUMBER(5,2)` | `NOT NULL` | — | — |
| `company_weight` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `lecturer_weight` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `attendance_weight` | `NUMBER(3,2)` | `NOT NULL` | — | — |
| `composite_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_fscores_comp BETWEEN 0.00 AND 100.00` |
| `letter_grade` | `VARCHAR2(5)` | `NOT NULL` | — | — |
| `calculated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `calculated_by` | `VARCHAR2(50)` | `NOT NULL` | `'SYSTEM'` | — |

**Sequence:** `seq_final_scores`

---

### 6.2.28 `notifications`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `notification_id` | `NUMBER(10)` | `NOT NULL` | `seq_notifications.NEXTVAL` | `PK pk_notifications` |
| `user_id` | `NUMBER(10)` | `NOT NULL` | — | `FK fk_notif_users → users(user_id) ON DELETE CASCADE` |
| `type` | `VARCHAR2(50)` | `NOT NULL` | — | — |
| `title` | `VARCHAR2(200)` | `NOT NULL` | — | — |
| `message` | `CLOB` | `NOT NULL` | — | — |
| `priority` | `VARCHAR2(10)` | `NOT NULL` | `'MEDIUM'` | `CHK chk_notif_priority IN ('HIGH','MEDIUM','LOW')` |
| `channel` | `VARCHAR2(30)` | `NOT NULL` | `'IN_APP'` | `CHK chk_notif_channel IN ('IN_APP','EMAIL','IN_APP_EMAIL')` |
| `reference_type` | `VARCHAR2(50)` | `NULL` | — | — |
| `reference_id` | `NUMBER(10)` | `NULL` | — | — |
| `is_read` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_notif_read IN (0,1)` |
| `read_at` | `TIMESTAMP` | `NULL` | — | — |
| `email_sent` | `NUMBER(1)` | `NOT NULL` | `0` | `CHK chk_notif_emailsent IN (0,1)` |
| `email_sent_at` | `TIMESTAMP` | `NULL` | — | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_notifications`

---

### 6.2.29 `system_configs`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `config_id` | `NUMBER(5)` | `NOT NULL` | `seq_system_configs.NEXTVAL` | `PK pk_system_configs` |
| `config_key` | `VARCHAR2(100)` | `NOT NULL` | — | `UK uk_sysconf_key` |
| `config_value` | `VARCHAR2(500)` | `NOT NULL` | — | — |
| `config_type` | `VARCHAR2(20)` | `NOT NULL` | — | `CHK chk_sysconf_type IN ('STRING','INTEGER','DECIMAL','BOOLEAN')` |
| `description` | `VARCHAR2(500)` | `NULL` | — | — |
| `updated_by` | `NUMBER(10)` | `NULL` | — | `FK fk_sysconf_users → users(user_id) ON DELETE SET NULL` |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_system_configs`

---

### 6.2.30 `grading_scales`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `grade_scale_id` | `NUMBER(3)` | `NOT NULL` | `seq_grading_scales.NEXTVAL` | `PK pk_grading_scales` |
| `letter_grade` | `VARCHAR2(5)` | `NOT NULL` | — | `UK uk_gscale_grade` |
| `min_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_gscale_min BETWEEN 0.00 AND 100.00` |
| `max_score` | `NUMBER(5,2)` | `NOT NULL` | — | `CHK chk_gscale_max BETWEEN 0.00 AND 100.00` |
| `grade_point` | `NUMBER(3,2)` | `NULL` | — | — |
| `sort_order` | `NUMBER(2)` | `NOT NULL` | — | — |

**Sequence:** `seq_grading_scales`

---

### 6.2.31 `evaluation_criteria`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `criteria_id` | `NUMBER(5)` | `NOT NULL` | `seq_evaluation_criteria.NEXTVAL` | `PK pk_evaluation_criteria` |
| `criteria_name` | `VARCHAR2(100)` | `NOT NULL` | — | `UK uk_evalcrit_name` |
| `description` | `VARCHAR2(500)` | `NULL` | — | — |
| `weight` | `NUMBER(3,2)` | `NOT NULL` | — | `CHK chk_evalcrit_weight BETWEEN 0.00 AND 1.00` |
| `sort_order` | `NUMBER(2)` | `NOT NULL` | — | — |
| `is_active` | `NUMBER(1)` | `NOT NULL` | `1` | `CHK chk_evalcrit_active IN (0,1)` |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |

**Sequence:** `seq_evaluation_criteria`

---

### 6.2.32 `audit_logs`

| Column | Oracle Data Type | Nullable | Default | Constraints |
|--------|-----------------|----------|---------|-------------|
| `audit_id` | `NUMBER(15)` | `NOT NULL` | `seq_audit_logs.NEXTVAL` | `PK pk_audit_logs` |
| `table_name` | `VARCHAR2(100)` | `NOT NULL` | — | — |
| `record_id` | `NUMBER(10)` | `NOT NULL` | — | — |
| `action` | `VARCHAR2(10)` | `NOT NULL` | — | `CHK chk_auditlog_action IN ('INSERT','UPDATE','DELETE')` |
| `old_values` | `CLOB` | `NULL` | — | — |
| `new_values` | `CLOB` | `NULL` | — | — |
| `changed_by` | `NUMBER(10)` | `NULL` | — | `FK fk_auditlog_users → users(user_id) ON DELETE SET NULL` |
| `changed_at` | `TIMESTAMP` | `NOT NULL` | `SYSTIMESTAMP` | — |
| `ip_address` | `VARCHAR2(45)` | `NULL` | — | — |
| `user_agent` | `VARCHAR2(500)` | `NULL` | — | — |

**Sequence:** `seq_audit_logs` — START WITH 1, INCREMENT BY 1, CACHE 100 (high-volume)

---

## 6.3 Sequence Summary

| # | Sequence Name | Table | Start | Increment | Cache |
|---|--------------|-------|-------|-----------|-------|
| 1 | `seq_users` | `users` | 1 | 1 | 20 |
| 2 | `seq_student_profiles` | `student_profiles` | 1 | 1 | 20 |
| 3 | `seq_lecturer_profiles` | `lecturer_profiles` | 1 | 1 | 20 |
| 4 | `seq_company_profiles` | `company_profiles` | 1 | 1 | 20 |
| 5 | `seq_password_resets` | `password_resets` | 1 | 1 | 20 |
| 6 | `seq_cvs` | `cvs` | 1 | 1 | 20 |
| 7 | `seq_cv_educations` | `cv_educations` | 1 | 1 | 20 |
| 8 | `seq_cv_experiences` | `cv_experiences` | 1 | 1 | 20 |
| 9 | `seq_cv_documents` | `cv_documents` | 1 | 1 | 20 |
| 10 | `seq_cv_versions` | `cv_versions` | 1 | 1 | 20 |
| 11 | `seq_skill_categories` | `skill_categories` | 1 | 1 | 10 |
| 12 | `seq_skills` | `skills` | 1 | 1 | 10 |
| 13 | `seq_cv_skills` | `cv_skills` | 1 | 1 | 50 |
| 14 | `seq_internship_listings` | `internship_listings` | 1 | 1 | 20 |
| 15 | `seq_listing_req_skills` | `listing_required_skills` | 1 | 1 | 20 |
| 16 | `seq_recommendation_scores` | `recommendation_scores` | 1 | 1 | 100 |
| 17 | `seq_applications` | `applications` | 1 | 1 | 20 |
| 18 | `seq_app_status_history` | `application_status_history` | 1 | 1 | 50 |
| 19 | `seq_internships` | `internships` | 1 | 1 | 20 |
| 20 | `seq_weekly_reports` | `weekly_reports` | 1 | 1 | 50 |
| 21 | `seq_report_attachments` | `report_attachments` | 1 | 1 | 20 |
| 22 | `seq_report_reviews` | `report_reviews` | 1 | 1 | 50 |
| 23 | `seq_company_evaluations` | `company_evaluations` | 1 | 1 | 20 |
| 24 | `seq_eval_criteria_scores` | `evaluation_criteria_scores` | 1 | 1 | 50 |
| 25 | `seq_lecturer_grades` | `lecturer_grades` | 1 | 1 | 20 |
| 26 | `seq_final_scores` | `final_scores` | 1 | 1 | 20 |
| 27 | `seq_notifications` | `notifications` | 1 | 1 | 100 |
| 28 | `seq_system_configs` | `system_configs` | 1 | 1 | 5 |
| 29 | `seq_grading_scales` | `grading_scales` | 1 | 1 | 5 |
| 30 | `seq_evaluation_criteria` | `evaluation_criteria` | 1 | 1 | 5 |
| 31 | `seq_audit_logs` | `audit_logs` | 1 | 1 | 100 |

> [!TIP]
> High-volume tables (`recommendation_scores`, `notifications`, `audit_logs`) use `CACHE 100` to reduce sequence contention under concurrent access. Low-volume configuration tables use `CACHE 5`.

---

## 6.4 Constraint Summary

### 6.4.1 Primary Key Constraints (32)

All 32 tables have a single-column surrogate primary key using Oracle sequences.

### 6.4.2 Foreign Key Constraints (40)

| # | Constraint Name | Child Table | Child Column | Parent Table | Parent Column | ON DELETE |
|---|----------------|-------------|-------------|-------------|--------------|-----------|
| 1 | `fk_sprofiles_users` | `student_profiles` | `user_id` | `users` | `user_id` | `CASCADE` |
| 2 | `fk_lprofiles_users` | `lecturer_profiles` | `user_id` | `users` | `user_id` | `CASCADE` |
| 3 | `fk_cprofiles_users` | `company_profiles` | `user_id` | `users` | `user_id` | `CASCADE` |
| 4 | `fk_cprofiles_verifier` | `company_profiles` | `verified_by` | `users` | `user_id` | `SET NULL` |
| 5 | `fk_presets_users` | `password_resets` | `user_id` | `users` | `user_id` | `CASCADE` |
| 6 | `fk_cvs_users` | `cvs` | `user_id` | `users` | `user_id` | `CASCADE` |
| 7 | `fk_cvedu_cvs` | `cv_educations` | `cv_id` | `cvs` | `cv_id` | `CASCADE` |
| 8 | `fk_cvexp_cvs` | `cv_experiences` | `cv_id` | `cvs` | `cv_id` | `CASCADE` |
| 9 | `fk_cvdoc_cvs` | `cv_documents` | `cv_id` | `cvs` | `cv_id` | `CASCADE` |
| 10 | `fk_cvver_cvs` | `cv_versions` | `cv_id` | `cvs` | `cv_id` | `CASCADE` |
| 11 | `fk_skills_cat` | `skills` | `skill_category_id` | `skill_categories` | `skill_category_id` | `CASCADE` |
| 12 | `fk_cvskills_cvs` | `cv_skills` | `cv_id` | `cvs` | `cv_id` | `CASCADE` |
| 13 | `fk_cvskills_skills` | `cv_skills` | `skill_id` | `skills` | `skill_id` | `CASCADE` |
| 14 | `fk_listings_company` | `internship_listings` | `company_user_id` | `users` | `user_id` | `CASCADE` |
| 15 | `fk_listings_approver` | `internship_listings` | `approved_by` | `users` | `user_id` | `SET NULL` |
| 16 | `fk_lskills_listings` | `listing_required_skills` | `listing_id` | `internship_listings` | `listing_id` | `CASCADE` |
| 17 | `fk_lskills_skills` | `listing_required_skills` | `skill_id` | `skills` | `skill_id` | `CASCADE` |
| 18 | `fk_recscore_users` | `recommendation_scores` | `user_id` | `users` | `user_id` | `CASCADE` |
| 19 | `fk_recscore_listings` | `recommendation_scores` | `listing_id` | `internship_listings` | `listing_id` | `CASCADE` |
| 20 | `fk_mwc_users` | `matching_weight_configs` | `updated_by` | `users` | `user_id` | `SET NULL` |
| 21 | `fk_apps_users` | `applications` | `user_id` | `users` | `user_id` | `CASCADE` |
| 22 | `fk_apps_listings` | `applications` | `listing_id` | `internship_listings` | `listing_id` | `CASCADE` |
| 23 | `fk_apps_cvversions` | `applications` | `cv_version_id` | `cv_versions` | `cv_version_id` | — |
| 24 | `fk_apphist_apps` | `application_status_history` | `application_id` | `applications` | `application_id` | `CASCADE` |
| 25 | `fk_apphist_users` | `application_status_history` | `changed_by` | `users` | `user_id` | — |
| 26 | `fk_intern_apps` | `internships` | `application_id` | `applications` | `application_id` | — |
| 27 | `fk_intern_student` | `internships` | `student_user_id` | `users` | `user_id` | — |
| 28 | `fk_intern_company` | `internships` | `company_user_id` | `users` | `user_id` | — |
| 29 | `fk_intern_lecturer` | `internships` | `lecturer_user_id` | `users` | `user_id` | — |
| 30 | `fk_intern_listings` | `internships` | `listing_id` | `internship_listings` | `listing_id` | — |
| 31 | `fk_intern_confirmer` | `internships` | `confirmed_by` | `users` | `user_id` | — |
| 32 | `fk_wreports_intern` | `weekly_reports` | `internship_id` | `internships` | `internship_id` | `CASCADE` |
| 33 | `fk_rattach_reports` | `report_attachments` | `report_id` | `weekly_reports` | `report_id` | `CASCADE` |
| 34 | `fk_rreviews_reports` | `report_reviews` | `report_id` | `weekly_reports` | `report_id` | `CASCADE` |
| 35 | `fk_rreviews_users` | `report_reviews` | `reviewer_user_id` | `users` | `user_id` | — |
| 36 | `fk_compeval_intern` | `company_evaluations` | `internship_id` | `internships` | `internship_id` | — |
| 37 | `fk_compeval_users` | `company_evaluations` | `evaluator_user_id` | `users` | `user_id` | — |
| 38 | `fk_ecscore_eval` | `evaluation_criteria_scores` | `evaluation_id` | `company_evaluations` | `evaluation_id` | `CASCADE` |
| 39 | `fk_ecscore_criteria` | `evaluation_criteria_scores` | `criteria_id` | `evaluation_criteria` | `criteria_id` | — |
| 40 | `fk_lgrades_intern` | `lecturer_grades` | `internship_id` | `internships` | `internship_id` | — |
| 41 | `fk_lgrades_users` | `lecturer_grades` | `grader_user_id` | `users` | `user_id` | — |
| 42 | `fk_fscores_intern` | `final_scores` | `internship_id` | `internships` | `internship_id` | — |
| 43 | `fk_notif_users` | `notifications` | `user_id` | `users` | `user_id` | `CASCADE` |
| 44 | `fk_sysconf_users` | `system_configs` | `updated_by` | `users` | `user_id` | `SET NULL` |
| 45 | `fk_auditlog_users` | `audit_logs` | `changed_by` | `users` | `user_id` | `SET NULL` |

### 6.4.3 Unique Constraints (16)

| # | Constraint | Table | Column(s) |
|---|-----------|-------|-----------|
| 1 | `uk_users_email` | `users` | `email` |
| 2 | `uk_sprofiles_user` | `student_profiles` | `user_id` |
| 3 | `uk_sprofiles_stdid` | `student_profiles` | `student_id_number` |
| 4 | `uk_lprofiles_user` | `lecturer_profiles` | `user_id` |
| 5 | `uk_lprofiles_staffid` | `lecturer_profiles` | `staff_id_number` |
| 6 | `uk_cprofiles_user` | `company_profiles` | `user_id` |
| 7 | `uk_cvs_user` | `cvs` | `user_id` |
| 8 | `uk_cvver_cv_version` | `cv_versions` | `(cv_id, version_number)` |
| 9 | `uk_skillcat_name` | `skill_categories` | `category_name` |
| 10 | `uk_skills_cat_name` | `skills` | `(skill_category_id, skill_name)` |
| 11 | `uk_cvskills_cv_skill` | `cv_skills` | `(cv_id, skill_id)` |
| 12 | `uk_lskills_listing_skill` | `listing_required_skills` | `(listing_id, skill_id)` |
| 13 | `uk_recscore_user_listing` | `recommendation_scores` | `(user_id, listing_id)` |
| 14 | `uk_apps_user_listing` | `applications` | `(user_id, listing_id)` |
| 15 | `uk_intern_app` | `internships` | `application_id` |
| 16 | `uk_wreports_intern_week` | `weekly_reports` | `(internship_id, week_number)` |

---

## 6.5 Indexing Strategy

### 6.5.1 Design Principles

| Principle | Application |
|-----------|------------|
| **Index FK columns** | All foreign key columns receive a B-tree index for JOIN performance and to prevent table locks during parent row deletion |
| **Index status/filter columns** | Status columns used in WHERE clauses get B-tree indexes |
| **Composite indexes for common queries** | Multi-column indexes follow the "leftmost prefix" rule for query optimization |
| **Function-based indexes** | Case-insensitive email search uses `LOWER()` index |
| **Covering indexes** | Key dashboard queries use composite indexes that cover all needed columns |
| **No over-indexing** | Boolean-like columns (0/1) with low cardinality use composite indexes rather than standalone |

### 6.5.2 Index Catalog

#### Authentication & User Lookup Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 1 | `idx_users_email_lower` | `users` | `LOWER(email)` | Function-Based | Case-insensitive login lookup |
| 2 | `idx_users_role_status` | `users` | `(role, status)` | Composite B-tree | Admin dashboard: filter users by role + status |
| 3 | `idx_users_status` | `users` | `status` | B-tree | Lock checking, active user queries |
| 4 | `idx_sprofiles_dept` | `student_profiles` | `department` | B-tree | Lecturer assignment filtering by department |
| 5 | `idx_sprofiles_gpa` | `student_profiles` | `gpa` | B-tree | Recommendation engine GPA filtering |
| 6 | `idx_lprofiles_dept` | `lecturer_profiles` | `department` | B-tree | Lecturer assignment filtering |
| 7 | `idx_cprofiles_verified` | `company_profiles` | `is_verified` | B-tree | Admin verification queue |

#### CV & Skill Matching Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 8 | `idx_cvs_status` | `cvs` | `status` | B-tree | Application eligibility check |
| 9 | `idx_cvs_visibility` | `cvs` | `(visibility, status)` | Composite B-tree | Company talent pool browsing (PUBLIC + COMPLETE) |
| 10 | `idx_cvskills_skill` | `cv_skills` | `skill_id` | B-tree | Recommendation engine: find students by skill |
| 11 | `idx_cvskills_cv` | `cv_skills` | `cv_id` | B-tree | Load all skills for a CV |
| 12 | `idx_cvskills_cv_prof` | `cv_skills` | `(cv_id, skill_id, proficiency_weight)` | Composite Covering | Recommendation engine: full skill match in single index scan |

#### Listing & Recommendation Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 13 | `idx_listings_status` | `internship_listings` | `status` | B-tree | Filter published/pending listings |
| 14 | `idx_listings_company` | `internship_listings` | `company_user_id` | B-tree | Company dashboard: "my postings" |
| 15 | `idx_listings_status_deadline` | `internship_listings` | `(status, application_deadline)` | Composite B-tree | Student browsing: published + deadline not passed |
| 16 | `idx_listings_approved` | `internship_listings` | `approved_by` | B-tree | FK index |
| 17 | `idx_lskills_skill` | `listing_required_skills` | `skill_id` | B-tree | Recommendation engine: find listings by skill |
| 18 | `idx_lskills_listing` | `listing_required_skills` | `listing_id` | B-tree | Load all skills for a listing |
| 19 | `idx_recscore_user_comp` | `recommendation_scores` | `(user_id, composite_score DESC)` | Composite B-tree | Student dashboard: top-N recommendations sorted by score |
| 20 | `idx_recscore_listing_comp` | `recommendation_scores` | `(listing_id, composite_score DESC)` | Composite B-tree | Company view: top students for a listing |

#### Application Workflow Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 21 | `idx_apps_user_status` | `applications` | `(user_id, status)` | Composite B-tree | Student dashboard: my applications by status, active count check |
| 22 | `idx_apps_listing_status` | `applications` | `(listing_id, status)` | Composite B-tree | Company view: applications per listing by status |
| 23 | `idx_apps_status` | `applications` | `status` | B-tree | Admin: pending confirmation queue |
| 24 | `idx_apps_cvversion` | `applications` | `cv_version_id` | B-tree | FK index |
| 25 | `idx_apphist_app` | `application_status_history` | `application_id` | B-tree | Application timeline load |
| 26 | `idx_apphist_changed` | `application_status_history` | `changed_at` | B-tree | Chronological history |

#### Internship & Reporting Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 27 | `idx_intern_student` | `internships` | `student_user_id` | B-tree | Student dashboard: my internship |
| 28 | `idx_intern_lecturer` | `internships` | `lecturer_user_id` | B-tree | Lecturer dashboard: my supervised students |
| 29 | `idx_intern_company` | `internships` | `company_user_id` | B-tree | Company dashboard: my interns |
| 30 | `idx_intern_status` | `internships` | `status` | B-tree | Active internship queries |
| 31 | `idx_intern_lecturer_status` | `internships` | `(lecturer_user_id, status)` | Composite B-tree | Lecturer: active supervised students |
| 32 | `idx_wreports_intern_status` | `weekly_reports` | `(internship_id, status)` | Composite B-tree | Report timeline with status filter |
| 33 | `idx_wreports_status` | `weekly_reports` | `status` | B-tree | Lecturer: pending review queue |
| 34 | `idx_wreports_intern_week` | `weekly_reports` | `(internship_id, week_number)` | Composite B-tree | Specific week lookup (also enforced by UK) |
| 35 | `idx_rattach_report` | `report_attachments` | `report_id` | B-tree | FK index |
| 36 | `idx_rreviews_report` | `report_reviews` | `report_id` | B-tree | Load reviews for a report |
| 37 | `idx_rreviews_reviewer` | `report_reviews` | `reviewer_user_id` | B-tree | FK index + lecturer review history |

#### Evaluation & Grading Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 38 | `idx_compeval_status` | `company_evaluations` | `status` | B-tree | Pending evaluation queries |
| 39 | `idx_compeval_evaluator` | `company_evaluations` | `evaluator_user_id` | B-tree | FK index |
| 40 | `idx_ecscore_eval` | `evaluation_criteria_scores` | `evaluation_id` | B-tree | Load scores for an evaluation |
| 41 | `idx_lgrades_grader` | `lecturer_grades` | `grader_user_id` | B-tree | FK index |

#### Notification Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 42 | `idx_notif_user_read` | `notifications` | `(user_id, is_read)` | Composite B-tree | **Critical** — Unread count badge, notification feed |
| 43 | `idx_notif_user_created` | `notifications` | `(user_id, created_at DESC)` | Composite B-tree | Notification feed with newest-first ordering |
| 44 | `idx_notif_ref` | `notifications` | `(reference_type, reference_id)` | Composite B-tree | Polymorphic reference lookup |

#### Audit Log Indexes

| # | Index Name | Table | Column(s) | Type | Justification |
|---|-----------|-------|-----------|------|---------------|
| 45 | `idx_audit_table_record` | `audit_logs` | `(table_name, record_id)` | Composite B-tree | "Show me all changes to record X in table Y" |
| 46 | `idx_audit_changed_at` | `audit_logs` | `changed_at` | B-tree | Chronological audit browsing |
| 47 | `idx_audit_changed_by` | `audit_logs` | `changed_by` | B-tree | "Show me all changes made by user Z" |

---

### 6.5.3 Dashboard Query → Index Mapping

This table maps the most critical dashboard queries to the indexes that optimize them.

| Dashboard | Query Description | Tables Hit | Indexes Used |
|-----------|------------------|------------|-------------|
| **Admin** | Count users by role and status | `users` | `idx_users_role_status` |
| **Admin** | Pending posting approvals | `internship_listings` | `idx_listings_status` |
| **Admin** | Pending placement confirmations | `applications` | `idx_apps_status` |
| **Student** | My applications with status | `applications` | `idx_apps_user_status` |
| **Student** | Top-N recommendations | `recommendation_scores` | `idx_recscore_user_comp` |
| **Student** | Unread notification count | `notifications` | `idx_notif_user_read` |
| **Student** | Browse published internships | `internship_listings` | `idx_listings_status_deadline` |
| **Lecturer** | My supervised students (active) | `internships` | `idx_intern_lecturer_status` |
| **Lecturer** | Pending report reviews | `weekly_reports` JOIN `internships` | `idx_wreports_status` + `idx_intern_lecturer` |
| **Lecturer** | Student report timeline | `weekly_reports` | `idx_wreports_intern_status` |
| **Company** | My postings | `internship_listings` | `idx_listings_company` |
| **Company** | Applications per posting | `applications` | `idx_apps_listing_status` |
| **Company** | Recommended students for posting | `recommendation_scores` | `idx_recscore_listing_comp` |
| **Rec Engine** | Find students with skill X | `cv_skills` | `idx_cvskills_skill` |
| **Rec Engine** | All skills for a student CV | `cv_skills` | `idx_cvskills_cv_prof` (covering) |
| **Rec Engine** | All requirements for a listing | `listing_required_skills` | `idx_lskills_listing` |

---

### 6.5.4 Estimated Performance Impact

| Query Pattern | Without Index | With Index | Improvement |
|--------------|:------------:|:----------:|:-----------:|
| Login by email (10K users) | Full table scan (~10K rows) | Index lookup (1 row) | **~10,000×** |
| Student top-10 recommendations (500K scores) | Sort 500K rows | Index-ordered scan (10 rows) | **~50,000×** |
| Unread notification count (500K notifications) | Count scan (~500K) | Index range scan (user subset) | **~100×** |
| Lecturer pending reports (50K reports) | Full scan + JOIN | Composite index (status subset) | **~500×** |
| Audit trail for record (1M logs) | Full scan | Composite index (table+record) | **~100,000×** |

---

## 6.6 Table Creation Order (FK Dependency)

Tables must be created in this order to avoid FK reference errors:

```
Level 0 (No FK dependencies):
  1. users
  2. skill_categories
  3. evaluation_criteria
  4. grading_scales

Level 1 (Depends on Level 0):
  5. student_profiles      → users
  6. lecturer_profiles      → users
  7. company_profiles       → users
  8. password_resets         → users
  9. cvs                    → users
  10. skills                → skill_categories
  11. internship_listings   → users
  12. matching_weight_configs → users
  13. system_configs        → users
  14. notifications         → users
  15. audit_logs            → users

Level 2 (Depends on Level 1):
  16. cv_educations         → cvs
  17. cv_experiences        → cvs
  18. cv_documents          → cvs
  19. cv_versions           → cvs
  20. cv_skills             → cvs, skills
  21. listing_required_skills → internship_listings, skills
  22. recommendation_scores → users, internship_listings

Level 3 (Depends on Level 2):
  23. applications          → users, internship_listings, cv_versions
  
Level 4 (Depends on Level 3):
  24. application_status_history → applications, users
  25. internships            → applications, users, internship_listings

Level 5 (Depends on Level 4):
  26. weekly_reports         → internships
  27. company_evaluations    → internships, users
  28. lecturer_grades        → internships, users
  29. final_scores           → internships

Level 6 (Depends on Level 5):
  30. report_attachments     → weekly_reports
  31. report_reviews         → weekly_reports, users
  32. evaluation_criteria_scores → company_evaluations, evaluation_criteria
```

---

## 6.7 Phase 6 — State Summary

> [!IMPORTANT]
> **Critical Decisions Carried Forward to Subsequent Phases:**

- **32 table structures** are fully specified with exact Oracle data types (`VARCHAR2`, `NUMBER`, `CLOB`, `TIMESTAMP`, `DATE`), all constraints named using consistent conventions, and 31 sequences defined with appropriate cache sizes. This is the direct input for **Phase 7 (SQL scripts)**.
- **45 foreign key constraints** are defined with explicit `ON DELETE` behaviors: `CASCADE` for composition relationships (e.g., CV sub-entities), `SET NULL` for optional references (e.g., `approved_by`), and no action (restrict) for critical business references (e.g., `internships` → `users`).
- **47 indexes** are designed across 6 categories: authentication, CV/skills, listings/recommendations, applications, reporting, and notifications. The **covering index** `idx_cvskills_cv_prof` is the most important for recommendation engine performance, enabling full skill match computation from a single index scan.
- **Table creation order** is defined across 7 dependency levels to ensure FK constraints can be satisfied during Phase 7 script execution. Level 0 tables (no dependencies) are created first, with each subsequent level depending only on previously created tables.

---

✅ **Phase 6 completed.** Reply **CONTINUE** to proceed to Phase 7 (Oracle SQL Implementation), or provide feedback to revise this phase.
