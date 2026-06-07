# PHASE 14: TESTING STRATEGY

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 13 (Algorithm Implementation)  
> **Testing Frameworks:** PHPUnit 10+ (Backend) · Jest & React Testing Library (Frontend) · Postman CLI (API)

---

## 14.1 Unit Testing Blueprint

Unit tests focus on isolating individual business services and hooks to verify logic boundaries. Mocking is enforced for all database and network layers.

### 14.1.1 Backend Unit Test: `ApplicationServiceTest.php`
Validates that `ApplicationService` enforces the maximum active application rule (BR-11) and complete CV profile checks (BR-05).

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ApplicationService;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Contracts\ListingRepositoryInterface;
use App\Repositories\Contracts\CVRepositoryInterface;
use App\Models\Application;
use App\Models\CV;
use App\Models\InternshipListing;
use Illuminate\Validation\ValidationException;
use Mockery;

class ApplicationServiceTest extends TestCase
{
    protected $appRepo;
    protected $listingRepo;
    protected $cvRepo;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->appRepo = Mockery::mock(ApplicationRepositoryInterface::class);
        $this->listingRepo = Mockery::mock(ListingRepositoryInterface::class);
        $this->cvRepo = Mockery::mock(CVRepositoryInterface::class);

        $this->service = new ApplicationService(
            $this->appRepo,
            $this->listingRepo,
            $this->cvRepo
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * @test
     */
    public function it_throws_exception_if_student_exceeds_max_active_applications()
    {
        $userId = 10;
        $listingId = 5;

        // Mock: Student already has 3 active applications (referencing BR-11)
        $this->appRepo->shouldReceive('getActiveApplicationsCount')
            ->once()
            ->with($userId)
            ->andReturn(3);

        $this->expectException(ValidationException::class);
        
        // This should throw a ValidationException due to limit constraint
        $this->service->submitApplication($userId, $listingId, 'My cover letter');
    }

    /**
     * @test
     */
    public function it_throws_exception_if_student_has_incomplete_cv()
    {
        $userId = 10;
        $listingId = 5;

        $this->appRepo->shouldReceive('getActiveApplicationsCount')
            ->once()
            ->with($userId)
            ->andReturn(1); // 1 active is fine

        // Mock: Student has an INCOMPLETE CV profile (referencing BR-05)
        $cv = Mockery::mock(CV::class);
        $cv->status = 'INCOMPLETE';

        $this->cvRepo->shouldReceive('findByUserId')
            ->once()
            ->with($userId)
            ->andReturn($cv);

        $this->expectException(ValidationException::class);

        $this->service->submitApplication($userId, $listingId, 'My cover letter');
    }
}
```

### 14.1.2 Frontend Unit Test: `ProtectedRoute.test.tsx`
Verifies that the protected routing wrapper redirects unauthenticated traffic and validates role permissions.

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { User } from '../types';

const mockUser: User = {
  user_id: 1,
  email: 'student@suims.edu',
  full_name: 'Jane Doe',
  role: 'STUDENT',
  status: 'ACTIVE',
  created_at: '',
  updated_at: ''
};

const renderWithAuth = (
  ui: React.ReactElement,
  authValues: { user: User | null; isAuthenticated: boolean; isLoading: boolean }
) => {
  return render(
    <AuthContext.Provider value={{
      ...authValues,
      token: authValues.isAuthenticated ? 'mock-jwt' : null,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn()
    }}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute Component', () => {
  it('shows spinner loading screen if authentication status is loading', () => {
    renderWithAuth(
      <ProtectedRoute><div data-testid="child">Secret Content</div></ProtectedRoute>,
      { user: null, isAuthenticated: false, isLoading: true }
    );
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });

  it('redirects to login page if user is not authenticated', () => {
    renderWithAuth(
      <ProtectedRoute><div data-testid="child">Secret Content</div></ProtectedRoute>,
      { user: null, isAuthenticated: false, isLoading: false }
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to unauthorized page if role doesn\'t match allowed list', () => {
    renderWithAuth(
      <ProtectedRoute allowedRoles={['ADMIN']}><div data-testid="child">Secret Content</div></ProtectedRoute>,
      { user: mockUser, isAuthenticated: true, isLoading: false } // User is STUDENT
    );
    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('renders child element if user is authenticated and role is allowed', () => {
    renderWithAuth(
      <ProtectedRoute allowedRoles={['STUDENT']}><div data-testid="child">Secret Content</div></ProtectedRoute>,
      { user: mockUser, isAuthenticated: true, isLoading: false }
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Secret Content');
  });
});
```

---

## 14.2 Integration Testing Strategy

Integration tests evaluate components acting together, focusing on **Laravel Eloquent Model interactions with Oracle Database Triggers and PL/SQL Packages**.

| Test Target | Component Interactions | Expected Database Outcome | Verification Query |
|-------------|------------------------|---------------------------|-------------------|
| **Internship Activation** | `Internship` Model Insert $\rightarrow$ Database trigger `trg_internships_init_reports` | Automatically generates weekly report logs matching `total_weeks` count | `SELECT COUNT(*) FROM weekly_reports WHERE internship_id = ?;` (Expected = total_weeks) |
| **Placement Confirmation** | `Application` Update Status `'CONFIRMED'` $\rightarrow$ Compound trigger `trg_applications_autowithdraw` | Automatically changes other pending applications for the same student to `'AUTO_WITHDRAWN'` | `SELECT COUNT(*) FROM applications WHERE user_id = ? AND status = 'AUTO_WITHDRAWN';` |
| **Weekly Report Submission** | `WeeklyReport` Model Update Status `'SUBMITTED'` after end date $\rightarrow$ Trigger `trg_weekly_reports_late_check` | Automatically marks `is_late = 1` and updates `submitted_at` | `SELECT is_late FROM weekly_reports WHERE report_id = ?;` (Expected = 1) |
| **Recommendation Engine** | `pkg_recommendation_engine.calculate_student_recommendations()` procedure execution | Refreshes score cards matching the threshold in `recommendation_scores` table | `SELECT COUNT(*) FROM recommendation_scores WHERE user_id = ?;` |
| **Grading Automation** | `pkg_grading_engine.calculate_final_score()` procedure execution | Combines report attendance, company rubric ratings, and grading configs into final grades | `SELECT letter_grade FROM final_scores WHERE internship_id = ?;` |

---

## 14.3 API Testing with Postman Strategy

API testing ensures HTTP parameters are validated and authentication barriers (JWT) are enforced.

```
Postman Collection Structure:
SUIMS API Testing
├── 1. Authentication
│   ├── POST /api/auth/register (Create account)
│   ├── POST /api/auth/login (Acquire JWT)
│   └── POST /api/auth/refresh (Renew access token using refresh token)
├── 2. Student Modules
│   ├── GET /api/student/recommendations (Guarded - role STUDENT)
│   └── POST /api/student/applications (Submit application)
├── 3. Company Modules
│   ├── POST /api/company/listings (Create posting)
│   └── PUT /api/company/applications/{id}/status (Accept/reject candidate)
└── 4. Weekly Reports
    ├── POST /api/reports/{id}/submit (Submit logs)
    └── POST /api/reports/{id}/review (Approve/request revisions)
```

### 14.3.1 Postman Authorization Script (Tests Tab)
Extracts and stores JWT tokens globally upon successful login.

```javascript
// Postman Login Test Script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token returned successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data.access_token).to.not.be.undefined;
    
    // Save JWT token in environment variables
    pm.environment.set("suims_jwt_token", jsonData.data.access_token);
    pm.environment.set("suims_refresh_token", jsonData.data.refresh_token);
});
```

### 14.3.2 Guard Level Access Script (Pre-request Script)
Appends the JWT token to the Authorization header.

```javascript
var token = pm.environment.get("suims_jwt_token");
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + token
    });
}
```

---

## 14.4 User Acceptance Testing (UAT) Criteria

UAT tests focus on verifying business flows against system goals.

### 14.4.1 UAT Verification Matrix

| Test ID | Target Feature | Actor | Execution Steps | Expected Pass Criteria | Checked Rule |
|---------|----------------|-------|-----------------|------------------------|--------------|
| **UAT-01** | Student Onboarding | Student | Register user $\rightarrow$ Attempt CV creation without adding skills | Profile cannot be saved until at least 3 skills are added | **BR-02 & BR-05** |
| **UAT-02** | Job Listing Audit | Company $\rightarrow$ Admin | Company rep creates listing $\rightarrow$ Student searches listings | Listing must be hidden from students until Admin reviews and approves it | **BR-08** |
| **UAT-03** | Applications Cap | Student | Apply to 3 listings $\rightarrow$ Attempt to apply to a 4th listing | UI blocks submission; API returns `422 Unprocessable` | **BR-11** |
| **UAT-04** | Auto-Withdrawal | Admin | Confirms application for student $S$ | Status of other applications for student $S$ updates to `AUTO_WITHDRAWN` | **BR-13** |
| **UAT-05** | Late Submission | Student | Submit report for Week 2 on Tuesday (deadline was Sunday) | Report status changes to `SUBMITTED` with `is_late` flag set to `1` | **BR-15** |
| **UAT-06** | Review Ceiling | Lecturer | Request revision for report $R$ 3 times | UI disables "Request Revision" action; API rejects additional revision requests | **BR-17** |
| **UAT-07** | Grading Rubric | Company $\rightarrow$ Lecturer | Submit company evaluation $\rightarrow$ Grade lecturer rubric | Final composite score is calculated using dynamic weights, matching a letter grade | **BR-20 & BR-21** |

---

## 14.5 Phase 14 — State Summary

> [!IMPORTANT]
> **Critical Testing Decisions Carried Forward:**
> - **Service Isolation**: PHPUnit tests mock model layers and databases using Mockery, isolating testing parameters to service boundaries.
> - **Silent Token Validation**: Jest tests check that `ProtectedRoute` handles redirection based on context loading states and roles.
> - **Trigger-Driven Database Audits**: Integration testing plans verify PL/SQL side effects (report generation, auto-withdrawal) at the database layer.
> - **Postman Environment Scripts**: Automated API collection testing uses environment variables to pass tokens dynamically, simulating real-world stateless JWT guards.

---

✅ **Phase 14 completed.** Reply **CONTINUE** to proceed to Phase 15 (Thesis Documentation Outline), or provide feedback to revise this phase.
