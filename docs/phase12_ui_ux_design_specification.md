# PHASE 12: UI/UX DESIGN SPECIFICATION

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 11 (React TypeScript Architecture)  
> **Design Style:** Modern Glassmorphism & Sleek Dark Mode  
> **Target Screen Breakpoints:** Mobile (320px–480px) · Tablet (481px–1023px) · Desktop (1024px+)

---

## 12.1 Design Tokens & UI Conventions

SUIMS implements a visual design system that balances corporate enterprise functionality with modern academic aesthetics. The interface utilizes high-contrast typography, structural glassmorphic backdrops, and subtle micro-animations for user interaction.

### 12.1.1 Color Palette (Tailwind System)

| Token Name | Hex Code | Visual Application |
|------------|----------|-------------------|
| `Primary-Dark` | `#030712` (Slate-950) | Main background |
| `Secondary-Dark` | `#0f172a` (Slate-900) | Sidebar and Card background |
| `Accent-Blue` | `#3b82f6` (Blue-500) | Primary actions, navigation selection |
| `Accent-Indigo` | `#6366f1` (Indigo-500) | Secondary highlight, calculations, engine outputs |
| `Accent-Teal` | `#14b8a6` (Teal-500) | Analytics charts, success states, verified badges |
| `Success` | `#22c55e` (Green-500) | Statuses: `APPROVED`, `CONFIRMED`, `WOULD_HIRE` |
| `Warning` | `#eab308` (Yellow-500) | Statuses: `UNDER_REVIEW`, `REVISION_REQUESTED` |
| `Danger` | `#ef4444` (Red-500) | Statuses: `REJECTED`, `CLOSED`, `LOCKED` |
| `Text-Muted` | `#94a3b8` (Slate-400) | Sub-captions, secondary descriptions, metadata |

### 12.1.2 Typography & Grids
- **Header Font**: `Outfit` (Google Font) — tracking tight, font weight 600–700. Used for section headings, dashboard KPI scores, and page titles.
- **Body & Data Font**: `Inter` (Google Font) — tracking normal, font weight 400–500. Enforced across high-density tables, forms, and audit views.
- **Base Grid**: 12-column responsive layout (`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6`).

### 12.1.3 Base Component Class (Glassmorphism Specification)
All cards and overlays inherit the standard glassmorphic profile:
- **Tailwind class**: `bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl shadow-xl transition-all duration-300 hover:border-slate-700/80`

---

## 12.2 Dashboard 1: Student Portal

Designed to guide students dynamically from CV compilation to internship discovery, placement confirmation, and weekly log reporting.

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] SUIMS   [Search Listings...]                        (🔔 3)  [Student Avatar] John Doe   |
+---------------------------------------------------------------------------------------------------+
|  (Home) Dashboard     |  [ KPI 1: CV Status ]      [ KPI 2: Active Apps ]     [ KPI 3: Weeks Logged]  |
|  (CV)   CV Builder    |  [ Complete (100%) ]      [ 2 / 3 Active       ]     [ Week 6 / 12        ]  |
|  (Jobs) Find Jobs     +---------------------------------------------------------------------------+
|  (Logs) Reports       |                                                                           |
|                       |  [ SECTION A: TOP INTERNSHIP RECOMMENDATIONS ]                            |
|                       |  1. TechCorp - React Developer Internship   [ Match Score: 85% ]   [Apply]|
|                       |  2. SoftSol - Python Engineer Intern        [ Match Score: 78% ]   [Apply]|
|                       |                                                                           |
|                       |  [ SECTION B: ACTIVE APPLICATIONS PIPELINE ]                              |
|                       |  +---------------------------------------------------------------------+  |
|                       |  | Company  | Position           | Score  | Status        | Action     |  |
|                       |  +----------+--------------------+--------+---------------+------------+  |
|                       |  | TechCorp | React Developer    | 85.00% | Shortlisted   | View       |  |
|                       |  | DevShop  | Backend Developer  | 72.50% | Under Review  | View       |  |
|                       |  +---------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

### 12.2.1 Metric & KPI Panels
- **CV Completeness Gauge**: A circular progress indicator (`conic-gradient`) representing CV section completeness. If incomplete, displays a warning banner redirecting to the builder.
- **Active Applications Count**: Displays `X / 3` (referencing BR-11). The widget changes color dynamically: emerald (0–1 applications), yellow (2 applications), orange (3 applications - maxed).

### 12.2.2 Interactive Components & Tables
- **Job Finder Search Panel**: Displays searchable filters by Skill category, Work mode (ONSITE / REMOTE / HYBRID), and Location. Shows search results with circular recommendation match percentage badges.
- **Weekly Report Form**: Simple textarea input requiring `activities` (min 50 characters, enforced via client-side counter), `challenges`, `learnings`, and `hours_logged` (number field restricted between 1.0 and 80.0 hours). Displays a drag-and-drop zone for PDF attachments (max 5MB).

### 12.2.3 Data Visualizations
- **Competency Comparison Radar Chart**: Overlays student skills against listing requirements for the selected position, helping students visualize their skill gaps.

---

## 12.3 Dashboard 2: Company Representative Portal

Focuses on applicant tracking, candidate filtering, placement confirmation, and final student evaluation.

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] SUIMS   [Search Candidates...]                      (🔔 1)  [Company Avatar] HR Manager   |
+---------------------------------------------------------------------------------------------------+
|  (Home) Overview      |  [ KPI 1: Active Listings ] [ KPI 2: Total Applicants ] [ KPI 3: Active Interns]  |
|  (List) Manage Posts  |  [ 3 Active Listings      ] [ 18 Pending Review       ] [ 4 Hired Interns      ]  |
|  (Pool) Talent Pool   +---------------------------------------------------------------------------+
|  (Eval) Evaluations   |                                                                           |
|                       |  [ SECTION A: APPLICANT PIPELINE BY LISTING ]                             |
|                       |  Select Listing: [ React Developer Intern ] v                             |
|                       |  +---------------------------------------------------------------------+  |
|                       |  | Candidate | Match Score | GPA  | Status        | Actions            |  |
|                       |  +-----------+-------------+------+---------------+--------------------+  |
|                       |  | Alice Lim | 85.00%      | 3.82 | Shortlisted   | [Review] [Reject]  |  |
|                       |  | Bob Tan   | 68.20%      | 3.10 | Submitted     | [Review] [Reject]  |  |
|                       |  +---------------------------------------------------------------------+  |
|                       |                                                                           |
|                       |  [ SECTION B: INTERN EVALUATION STATUS ]                                  |
|                       |  1. Alice Lim - Internship Ending June 15 [ Evaluate Now ]                |
+---------------------------------------------------------------------------------------------------+
```

### 12.3.1 Metric & KPI Panels
- **Listing Metrics Grid**: Active listings, total applications, and hired quotas. Hired quota is represented as a fraction (e.g. `2/5 Hired` to represent filled counts and quotas).

### 12.3.2 Interactive Components & Forms
- **Post Listing Form**: Sectioned inputs for Title, Description, Quota (1-50), Duration (4-24 weeks), GPA requirement, and work arrangement. Includes an interactive skill-tag selector that queries the system's skill taxonomy in real-time.
- **Evaluation Rubric Form**: Composed of sliders (0–100 range) representing the 7 active evaluation criteria (e.g. Technical Competence, Communication, punctuality). Displays real-time calculations of the `composite_score` weight distribution as the user adjusts the sliders.

### 12.3.3 Data Visualizations
- **Applicant Funnel Chart**: Displays recruitment pipeline conversion metrics: `Submitted (100%) -> Under Review (75%) -> Shortlisted (40%) -> Accepted (15%) -> Confirmed (10%)`.
- **Match Score Scatter-Plot**: Maps candidates along Match Score (x-axis) vs GPA (y-axis), highlighting top talent profiles at a glance.

---

## 12.4 Dashboard 3: Lecturer/Supervisor Panel

Enables academic mentors to supervise weekly reporting logs and grade their assigned student interns efficiently.

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] SUIMS   [Search Students...]                        (🔔 5)  [Lecturer Avatar] Prof. Lee   |
+---------------------------------------------------------------------------------------------------+
|  (Home) Dashboard     |  [ KPI 1: Active Supervised ]  [ KPI 2: Pending Reviews ] [ KPI 3: Capacity ]     |
|  (Stud) My Students   |  [ 8 Students               ]  [ 3 Weekly Reports       ] [ 8 / 10 limit   ]     |
|  (Grad) Grading Board +---------------------------------------------------------------------------+
|                       |                                                                           |
|                       |  [ SECTION A: PENDING WEEKLY REPORT REVIEWS ]                             |
|                       |  1. Student: Alice Lim - Week 6 Report    [ Submitted: June 4, 11:30 ]    |
|                       |     [View Report Log]  -> Comments: [____________________]                |
|                       |     Actions: [ Approve ]  [ Request Revision ]  [ Reject ]                |
|                       |                                                                           |
|                       |  [ SECTION B: MY ASSIGNED STUDENTS LIST ]                                 |
|                       |  +---------------------------------------------------------------------+  |
|                       |  | Student   | Company  | Duration    | Reports Approved | Final Grade |  |
|                       |  +-----------+----------+-------------+------------------+-------------+  |
|                       |  | Alice Lim | TechCorp | Wk 1-12     | 6 / 12 Approved  | Pending     |  |
|                       |  | Bob Tan   | SoftSol  | Wk 1-12     | 12 / 12 Approved | [ Grade ]   |  |
|                       |  +---------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

### 12.4.1 Metric & KPI Panels
- **Supervision Workload Gauge**: Displays capacity consumption (e.g. `8 / 10 limit` indicating current workload against the maximum workload config).
- **Backlog Alert Badge**: Displays a high-contrast red warning badge showing the number of pending weekly reviews.

### 12.4.2 Interactive Components & Forms
- **Weekly Report Review Component**: Splits the screen. Left side displays student's submitted activities, challenges, and attachments. Right side provides a validation panel: decision toggle (Approve / Request Revision / Reject) and feedback text box (must be at least 20 characters for rejection/revision requests).
- **Lecturer Grading Panel**: Triggers when all weekly reports are finalized. Lecturer inputs three grades (0-100 range): Report Quality (40%), Presentation (30%), and Engagement (30%). Displays the calculated lecturer composite score dynamically.

### 12.4.3 Data Visualizations
- **Report Submission Compliance Trend**: A multi-series line chart tracking on-time submissions, late submissions, and missing logs over elapsed program weeks.

---

## 12.5 Dashboard 4: Administrator Panel

Provides system control, user profiles administration, listing audits, and matching engine parameter configurations.

```
+---------------------------------------------------------------------------------------------------+
|  [Logo] SUIMS   [Search System logs...]                     (🔔 0)  [Admin Avatar] Administrator  |
+---------------------------------------------------------------------------------------------------+
|  (Home) System Home   |  [ KPI 1: Active Internships ] [ KPI 2: Pending Listings ] [ KPI 3: Audit Logs ]  |
|  (User) Manage Users  |  [ 124 Placements            ] [ 5 Pending Listings      ] [ 14,203 Total      ]  |
|  (List) Audit Posts   +---------------------------------------------------------------------------+
|  (Engn) Match Config  |                                                                           |
|  (Logs) View Audits   |  [ SECTION A: RECOMMENDATION ENGINE WEIGHTS SETTING ]                     |
|                       |  Skill Weight:  [=======|=======] 60%  (Min Threshold: [30]% )            |
|                       |  GPA Weight:    [===|===========] 20%  (Max Recs:      [10]  )            |
|                       |  Pref Weight:   [===|===========] 20%  [ Save Weights Config ]            |
|                       |                                                                           |
|                       |  [ SECTION B: PENDING INTERNSHIP POSTING REVIEW BOARD ]                   |
|                       |  1. SoftCorp - Web Security Specialist (3 slots)  [Review Details]        |
|                       |     Feedback Comments: [____________________]  [ Approve ] [ Reject ]     |
+---------------------------------------------------------------------------------------------------+
```

### 12.5.1 Metric & KPI Panels
- **System Activity Grid**: Displays active placements, total user registrations split by role, and database audit log volumes.

### 12.5.2 Interactive Components & Forms
- **Recommendation Engine Sliders**: A set of three tied range sliders (0–100%) for Skill, GPA, and Preference weights. As one slider is moved, the others automatically adjust to enforce the `sum = 100%` database rule (BR-21/BR-22).
- **Listing Review Panel**: Detailed view of company postings with action controls: Approve (triggers publish event) or Reject/Request Changes (opens dialog requiring reasons, which sends mail to company).

### 12.5.3 Data Visualizations
- **User Distribution Pie Chart**: Breakdown of user profiles by role (`Students`, `Lecturers`, `Companies`, `Admins`).
- **Placement Growth Line Chart**: Plots cumulative confirmed placements month-over-month.

---

## 12.6 Phase 12 — State Summary

> [!IMPORTANT]
> **Critical Design Rules Carried Forward:**
> - **Visual Uniformity**: Layout designs must stick to styling tokens (Slate dark backgrounds, Outward/Inter font pairings, and Glassmorphic blur styles).
> - **Interactive Component Rules**: Form fields must match database/API models. Sliders are mapped to 0-100 values; Admin weight settings are constrained to sum to 100%.
> - **Validation UI**: Revisions or rejections require comments with character limit warnings before enabling form actions.
> - **Standardized Responsive Cards**: Layout components use Tailwind grid breakpoints (`grid-cols-1 md:grid-cols-12`) to support mobile and desktop views.

---

✅ **Phase 12 completed.** Reply **CONTINUE** to proceed to Phase 13 (Algorithm Implementation), or provide feedback to revise this phase.
