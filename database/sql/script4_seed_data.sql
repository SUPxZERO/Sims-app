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
VALUES (seq_evaluation_criteria.NEXTVAL, 'Technical Competence', 'Ability to apply technical skills and knowledge to assigned tasks', 0.20, 1, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Communication Skills', 'Effectiveness in verbal and written communication', 0.15, 2, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Teamwork & Collaboration', 'Ability to work effectively in teams and collaborate with colleagues', 0.15, 3, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Professionalism & Work Ethic', 'Demonstrates responsibility, punctuality, and professional behavior', 0.15, 4, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Initiative & Problem Solving', 'Proactively identifies and resolves problems, shows self-motivation', 0.15, 5, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Attendance & Punctuality', 'Regularity of attendance and adherence to work schedules', 0.10, 6, 1);
INSERT INTO evaluation_criteria (criteria_id, criteria_name, description, weight, sort_order, is_active)
VALUES (seq_evaluation_criteria.NEXTVAL, 'Overall Performance', 'General assessment of intern overall contribution and growth', 0.10, 7, 1);

-- ==================== MATCHING WEIGHT CONFIGURATION ====================
INSERT INTO matching_weight_configs (config_id, skill_weight, gpa_weight, preference_weight, min_score_threshold, max_recommendations)
VALUES (1, 0.60, 0.20, 0.20, 30.00, 10);

-- ==================== SYSTEM CONFIGURATIONS ====================
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REPORT_DEADLINE_DAY', 'SUNDAY', 'STRING', 'Default day of the week for weekly report submission deadline');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REPORT_DEADLINE_TIME', '23:59', 'STRING', 'Time of day for weekly report submission deadline');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_ACTIVE_APPLICATIONS', '3', 'INTEGER', 'Maximum number of active applications per student');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_REVISION_REQUESTS', '2', 'INTEGER', 'Maximum number of revision requests per weekly report');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'COMPANY_EVAL_DEADLINE_DAYS', '14', 'INTEGER', 'Days after internship end for company evaluation submission');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'REMINDER_HOURS_BEFORE', '24', 'INTEGER', 'Hours before deadline to send reminder notification');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'COMPANY_EVAL_WEIGHT', '0.40', 'DECIMAL', 'Weight of company evaluation in final score');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'LECTURER_GRADE_WEIGHT', '0.40', 'DECIMAL', 'Weight of lecturer grade in final score');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'ATTENDANCE_WEIGHT', '0.20', 'DECIMAL', 'Weight of attendance score in final score');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'ACCOUNT_LOCK_DURATION_MINUTES', '30', 'INTEGER', 'Duration for account lock on failed login attempts');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_FAILED_LOGIN_ATTEMPTS', '5', 'INTEGER', 'Failed login attempts before account lock');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'JWT_ACCESS_TOKEN_EXPIRY_MINUTES', '60', 'INTEGER', 'JWT access token expiry in minutes');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'JWT_REFRESH_TOKEN_EXPIRY_DAYS', '7', 'INTEGER', 'JWT refresh token expiry in days');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_FILE_SIZE_BYTES', '5242880', 'INTEGER', 'Maximum file upload size in bytes (5 MB)');
INSERT INTO system_configs (config_id, config_key, config_value, config_type, description)
VALUES (seq_system_configs.NEXTVAL, 'MAX_REPORT_ATTACHMENTS', '3', 'INTEGER', 'Maximum number of file attachments per weekly report');

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

-- Category 2: Web Frameworks
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Web Frameworks', 'Frontend and backend web development frameworks', 1, 2);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'React', 'Frontend JavaScript library by Meta', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Laravel', 'PHP web application framework', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Node.js', 'JavaScript runtime environment', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Web Frameworks'), 'Django', 'Python web framework', 1);

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
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Databases'), 'SQL', 'Structured Query Language', 1);

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

-- Category 5: Design & Multimedia
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Design & Multimedia', 'UI/UX design and multimedia tools', 1, 5);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'Figma', 'Collaborative UI design tool', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Design & Multimedia'), 'UI/UX Design', 'User interface and experience design', 1);

-- Category 6: Data Science & AI
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Data Science & AI', 'Machine learning and data analysis technologies', 1, 6);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Machine Learning', 'Algorithms and statistical models', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Data Science & AI'), 'Data Analysis', 'Statistical analysis and interpretation', 1);

-- Category 7: Business & Communication
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Business & Communication', 'Professional and business skills', 1, 7);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Project Management', 'Planning and executing projects', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Business & Communication'), 'Technical Writing', 'Documentation and technical communication', 1);

-- Category 8: Networking & Security
INSERT INTO skill_categories (skill_category_id, category_name, description, is_active, sort_order)
VALUES (seq_skill_categories.NEXTVAL, 'Networking & Security', 'Network administration and cybersecurity', 1, 8);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Network Administration', 'Managing computer networks', 1);
INSERT INTO skills (skill_id, skill_category_id, skill_name, description, is_active)
VALUES (seq_skills.NEXTVAL, (SELECT skill_category_id FROM skill_categories WHERE category_name = 'Networking & Security'), 'Cybersecurity', 'Information security practices', 1);

-- ==================== DEFAULT ADMIN USER ====================
-- Password: password123 (bcrypt hash - cost factor 12)
INSERT INTO users (user_id, email, password_hash, full_name, role, status, email_verified_at)
VALUES (seq_users.NEXTVAL, 'admin@suims.edu',
    '$2y$12$208bWr14EgmlCAUwj1o5nOeriSRjRjAeSLLZK0taUW9Uq2AFoWmTW',
    'System Administrator', 'ADMIN', 'ACTIVE', SYSTIMESTAMP);

COMMIT;
