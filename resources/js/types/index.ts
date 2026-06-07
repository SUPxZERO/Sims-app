export type UserRole = 'ADMIN' | 'STUDENT' | 'LECTURER' | 'COMPANY';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';
export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'CONFIRMED' | 'WITHDRAWN' | 'AUTO_WITHDRAWN';
export type WeeklyReportStatus = 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED';

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  profile_photo_path?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  student_profile_id: number;
  user_id: number;
  student_id_number: string;
  department: string;
  faculty?: string;
  enrollment_year: number;
  expected_graduation?: number;
  gpa: number;
  phone_number?: string;
  address?: string;
  linkedin_url?: string;
  bio?: string;
}

export interface InternshipListing {
  listing_id: number;
  company_user_id: number;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  work_mode: 'ONSITE' | 'REMOTE' | 'HYBRID';
  duration_weeks: number;
  quota: number;
  filled_count: number;
  stipend_info?: string;
  application_deadline: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'CLOSED';
  min_gpa?: number;
  preferred_departments?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  application_id: number;
  user_id: number;
  listing_id: number;
  cv_version_id: number;
  cover_letter?: string;
  match_score_at_apply?: number;
  status: ApplicationStatus;
  rejection_reason?: string;
  submitted_at: string;
  confirmed_at?: string;
  listing?: InternshipListing;
  student?: User;
}

export interface WeeklyReport {
  report_id: number;
  internship_id: number;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  activities?: string;
  challenges?: string;
  learnings?: string;
  hours_logged?: number;
  status: WeeklyReportStatus;
  is_late: number;
  revision_count: number;
  submitted_at?: string;
  approved_at?: string;
}
