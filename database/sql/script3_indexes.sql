-- ============================================================
-- SUIMS — Script 3: INDEXES
-- Smart University Internship Management System
-- Oracle Database 19c+
-- ============================================================

-- ==================== AUTHENTICATION & USER LOOKUP ====================
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_role_status ON users (role, status);
CREATE INDEX idx_users_status ON users (status);

-- ==================== PROFILE LOOKUPS ====================
CREATE INDEX idx_sprofiles_dept ON student_profiles (department);
CREATE INDEX idx_sprofiles_gpa ON student_profiles (gpa);
CREATE INDEX idx_lprofiles_dept ON lecturer_profiles (department);
CREATE INDEX idx_cprofiles_verified ON company_profiles (is_verified);

-- ==================== CV & SKILL MATCHING ====================
CREATE INDEX idx_cvs_status ON cvs (status);
CREATE INDEX idx_cvs_visibility ON cvs (visibility, status);
CREATE INDEX idx_cvskills_skill ON cv_skills (skill_id);
CREATE INDEX idx_cvskills_cv ON cv_skills (cv_id);
CREATE INDEX idx_cvskills_cv_prof ON cv_skills (cv_id, skill_id, proficiency_weight);

-- ==================== LISTING & RECOMMENDATION ====================
CREATE INDEX idx_listings_status ON internship_listings (status);
CREATE INDEX idx_listings_company ON internship_listings (company_user_id);
CREATE INDEX idx_listings_status_deadline ON internship_listings (status, application_deadline);
CREATE INDEX idx_listings_approved ON internship_listings (approved_by);
CREATE INDEX idx_lskills_skill ON listing_required_skills (skill_id);
CREATE INDEX idx_lskills_listing ON listing_required_skills (listing_id);
CREATE INDEX idx_recscore_user_comp ON recommendation_scores (user_id, composite_score DESC);
CREATE INDEX idx_recscore_listing_comp ON recommendation_scores (listing_id, composite_score DESC);

-- ==================== APPLICATION WORKFLOW ====================
CREATE INDEX idx_apps_user_status ON applications (user_id, status);
CREATE INDEX idx_apps_listing_status ON applications (listing_id, status);
CREATE INDEX idx_apps_status ON applications (status);
CREATE INDEX idx_apps_cvversion ON applications (cv_version_id);
CREATE INDEX idx_apphist_app ON application_status_history (application_id);
CREATE INDEX idx_apphist_changed ON application_status_history (changed_at);

-- ==================== INTERNSHIP & REPORTING ====================
CREATE INDEX idx_intern_student ON internships (student_user_id);
CREATE INDEX idx_intern_lecturer ON internships (lecturer_user_id);
CREATE INDEX idx_intern_company ON internships (company_user_id);
CREATE INDEX idx_intern_status ON internships (status);
CREATE INDEX idx_intern_lecturer_status ON internships (lecturer_user_id, status);
CREATE INDEX idx_wreports_intern_status ON weekly_reports (internship_id, status);
CREATE INDEX idx_wreports_status ON weekly_reports (status);
CREATE INDEX idx_rattach_report ON report_attachments (report_id);
CREATE INDEX idx_rreviews_report ON report_reviews (report_id);
CREATE INDEX idx_rreviews_reviewer ON report_reviews (reviewer_user_id);

-- ==================== EVALUATION & GRADING ====================
CREATE INDEX idx_compeval_status ON company_evaluations (status);
CREATE INDEX idx_compeval_evaluator ON company_evaluations (evaluator_user_id);
CREATE INDEX idx_ecscore_eval ON evaluation_criteria_scores (evaluation_id);
CREATE INDEX idx_lgrades_grader ON lecturer_grades (grader_user_id);

-- ==================== NOTIFICATIONS ====================
CREATE INDEX idx_notif_user_read ON notifications (user_id, is_read);
CREATE INDEX idx_notif_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notif_ref ON notifications (reference_type, reference_id);

-- ==================== AUDIT LOGS ====================
CREATE INDEX idx_audit_table_record ON audit_logs (table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_logs (changed_at);
CREATE INDEX idx_audit_changed_by ON audit_logs (changed_by);
