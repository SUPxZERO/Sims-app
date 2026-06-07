# PHASE 11: REACT TYPESCRIPT ARCHITECTURE

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 10 (Laravel 12 Architecture)  
> **Frontend Platform:** React 18+ (Single Page Application)  
> **Language Stack:** TypeScript (Strict Mode) · Tailwind CSS

---

## 11.1 Directory Structure Blueprint

SUIMS enforces a clean, modular structure for scalability, separating layouts, pages, components, hooks, services, and types.

```
sims-app-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Card.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── DashboardLayout.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── CVBuilder.tsx
│   │   │   └── WeeklyReports.tsx
│   │   ├── lecturer/
│   │   │   ├── LecturerDashboard.tsx
│   │   │   └── ReportReview.tsx
│   │   ├── company/
│   │   │   ├── CompanyDashboard.tsx
│   │   │   ├── CreateListing.tsx
│   │   │   └── InternEvaluation.tsx
│   │   └── error/
│   │       ├── NotFound.tsx
│   │       └── Unauthorized.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 11.2 Core TypeScript Definitions

SUIMS enforces compile-time type safety across all components and API boundaries.

### 11.2.1 `src/types/index.ts`
```typescript
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
```

---

## 11.3 Context State Management (Auth)

Authentication state is propagated via a React context provider, keeping track of the user profile, JWT, and session restoration.

### 11.3.1 `src/context/AuthContext.tsx`
```tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('suims_token');
      const storedUser = localStorage.getItem('suims_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('suims_token', accessToken);
    localStorage.setItem('suims_refresh_token', refreshToken);
    localStorage.setItem('suims_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('suims_token');
    localStorage.removeItem('suims_refresh_token');
    localStorage.removeItem('suims_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData: User) => {
    localStorage.setItem('suims_user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 11.4 Axios HTTP client & Interceptors

SUIMS uses a custom Axios client to automatically append authentication headers and execute silent JWT token refreshes if access tokens expire.

### 11.4.1 `src/services/api.ts`
```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Flag to track token refreshing state
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Inject JWT token from localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('suims_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 and attempt silent refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Attempt refresh if 401 occurs and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('suims_refresh_token');

      if (!refreshToken) {
        isRefreshing = false;
        // Force logout if no refresh token exists
        localStorage.removeItem('suims_token');
        localStorage.removeItem('suims_refresh_token');
        localStorage.removeItem('suims_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const { access_token, refresh_token } = response.data.data;
        
        localStorage.setItem('suims_token', access_token);
        localStorage.setItem('suims_refresh_token', refresh_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clean local session on refresh failure
        localStorage.removeItem('suims_token');
        localStorage.removeItem('suims_refresh_token');
        localStorage.removeItem('suims_user');
        window.location.href = '/login?session_expired=true';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 11.5 Route Maps & Guarding

Routes are split into public, protected, and role-governed pathways.

### 11.5.1 `src/routes/ProtectedRoute.tsx`
```tsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserRole } from '../types';
import Spinner from '../components/common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    throw new Error('ProtectedRoute must be used within an AuthProvider');
  }

  const { isAuthenticated, user, isLoading } = auth;

  // Render spinner during storage-check phase
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if unauthenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guard against incorrect user roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### 11.5.2 Route Matrix Layout
```typescript
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard Views
import StudentDashboard from '../pages/student/StudentDashboard';
import CVBuilder from '../pages/student/CVBuilder';
import WeeklyReports from '../pages/student/WeeklyReports';

import LecturerDashboard from '../pages/lecturer/LecturerDashboard';
import ReportReview from '../pages/lecturer/ReportReview';

import CompanyDashboard from '../pages/company/CompanyDashboard';
import CreateListing from '../pages/company/CreateListing';

import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';

import Unauthorized from '../pages/error/Unauthorized';
import NotFound from '../pages/error/NotFound';

export const routeConfig: RouteObject[] = [
  // Public Paths
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/unauthorized', element: <Unauthorized /> },

  // Guarded Layout Routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // STUDENT Pathways
      {
        path: 'student/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'student/cv',
        element: (
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <CVBuilder />
          </ProtectedRoute>
        ),
      },
      {
        path: 'student/weekly-reports',
        element: (
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <WeeklyReports />
          </ProtectedRoute>
        ),
      },

      // LECTURER Pathways
      {
        path: 'lecturer/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <LecturerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lecturer/reports/:id',
        element: (
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <ReportReview />
          </ProtectedRoute>
        ),
      },

      // COMPANY Pathways
      {
        path: 'company/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'company/listings/new',
        element: (
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CreateListing />
          </ProtectedRoute>
        ),
      },

      // ADMIN Pathways
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];
```

---

## 11.6 Reusable Custom Hooks

Hooks encapsulate data retrieval, state management, and request validation processes.

### 11.6.1 `src/hooks/useFetch.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, autoFetch: boolean = true) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: autoFetch,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.get<{ success: boolean; message: string; data: T }>(url);
      setState({
        data: response.data.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setState({
        data: null,
        loading: false,
        error: axiosError.response?.data?.message || axiosError.message || 'An error occurred.',
      });
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { ...state, refetch: fetchData };
}
```

---

## 11.7 Phase 11 — State Summary

> [!IMPORTANT]
> **Critical Decisions Carried Forward to Subsequent Phases:**
> - **Type-Safety Enforcement**: All entity interfaces (`User`, `StudentProfile`, `InternshipListing`, etc.) are defined centrally under `src/types/index.ts` to coordinate type safety across visual components and API requests.
> - **Axios JWT Retry Interceptors**: Seamless token verification occurs via interceptor setups, checking for expired access tokens, running behind-the-scenes refreshes, and silently retrying calls to avoid UI disruptions.
> - **Role Guarding Wrapper (`ProtectedRoute`)**: Centralized RBAC redirects users to `/login` or `/unauthorized` depending on authentication state and specific role assignments.
> - **Modular Hook Implementations**: Component data access is delegated to custom hooks (`useFetch`, `useAuth`), ensuring declarative page structures.

---

✅ **Phase 11 completed.** Reply **CONTINUE** to proceed to Phase 12 (UI/UX Design Specification), or provide feedback to revise this phase.
