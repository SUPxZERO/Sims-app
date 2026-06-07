import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Register from '../pages/auth/Register';
import NotFound from '../pages/auth/NotFound';
import Unauthorized from '../pages/auth/Unauthorized';
import Login from '../pages/auth/Login';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import CVBuilder from '../pages/student/CVBuilder';
import WeeklyReports from '../pages/student/WeeklyReports';
import FindJobs from '../pages/student/FindJobs';
import MyApplications from '../pages/student/MyApplications';
import StudentProfile from '../pages/student/StudentProfile';

// Lecturer Pages
import LecturerDashboard from '../pages/lecturer/LecturerDashboard';
import ReportReview from '../pages/lecturer/ReportReview';
import MyStudents from '../pages/lecturer/MyStudents';
import StudentEvaluation from '../pages/lecturer/StudentEvaluation';
import LecturerProfile from '../pages/lecturer/LecturerProfile';

// Company Pages
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CreateListing from '../pages/company/CreateListing';
import InternEvaluation from '../pages/company/InternEvaluation';
import ManageListings from '../pages/company/ManageListings';
import ReviewApplications from '../pages/company/ReviewApplications';
import CompanyProfile from '../pages/company/CompanyProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import ListingApprovals from '../pages/admin/ListingApprovals';

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'LECTURER':
      return <Navigate to="/lecturer/dashboard" replace />;
    case 'COMPANY':
      return <Navigate to="/company/dashboard" replace />;
    case 'STUDENT':
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Guarded Dashboard Routes */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        
        {/* Redirect dynamically based on user role */}
        <Route index element={<HomeRedirect />} />

        {/* STUDENT Pathways */}
        <Route path="student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="student/cv" element={<ProtectedRoute allowedRoles={['STUDENT']}><CVBuilder /></ProtectedRoute>} />
        <Route path="student/weekly-reports" element={<ProtectedRoute allowedRoles={['STUDENT']}><WeeklyReports /></ProtectedRoute>} />
        <Route path="student/find-jobs" element={<ProtectedRoute allowedRoles={['STUDENT']}><FindJobs /></ProtectedRoute>} />
        <Route path="student/applications" element={<ProtectedRoute allowedRoles={['STUDENT']}><MyApplications /></ProtectedRoute>} />
        <Route path="student/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />

        {/* LECTURER Pathways */}
        <Route path="lecturer/dashboard" element={<ProtectedRoute allowedRoles={['LECTURER']}><LecturerDashboard /></ProtectedRoute>} />
        <Route path="lecturer/students" element={<ProtectedRoute allowedRoles={['LECTURER']}><MyStudents /></ProtectedRoute>} />
        <Route path="lecturer/interns/:id/evaluate" element={<ProtectedRoute allowedRoles={['LECTURER']}><StudentEvaluation /></ProtectedRoute>} />
        <Route path="lecturer/reports/:id" element={<ProtectedRoute allowedRoles={['LECTURER']}><ReportReview /></ProtectedRoute>} />
        <Route path="lecturer/profile" element={<ProtectedRoute allowedRoles={['LECTURER']}><LecturerProfile /></ProtectedRoute>} />

        {/* COMPANY Pathways */}
        <Route path="company/dashboard" element={<ProtectedRoute allowedRoles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="company/listings" element={<ProtectedRoute allowedRoles={['COMPANY']}><ManageListings /></ProtectedRoute>} />
        <Route path="company/listings/new" element={<ProtectedRoute allowedRoles={['COMPANY']}><CreateListing /></ProtectedRoute>} />
        <Route path="company/listings/:id/applications" element={<ProtectedRoute allowedRoles={['COMPANY']}><ReviewApplications /></ProtectedRoute>} />
        <Route path="company/interns/:id/evaluate" element={<ProtectedRoute allowedRoles={['COMPANY']}><InternEvaluation /></ProtectedRoute>} />
        <Route path="company/profile" element={<ProtectedRoute allowedRoles={['COMPANY']}><CompanyProfile /></ProtectedRoute>} />

        {/* ADMIN Pathways */}
        <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
        <Route path="admin/approvals" element={<ProtectedRoute allowedRoles={['ADMIN']}><ListingApprovals /></ProtectedRoute>} />

      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
