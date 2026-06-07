# PHASE 3: BUSINESS PROCESS MODELING

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 1 (System Analysis) → Phase 2 (Use Case Analysis)  
> **Notation:** BPMN-aligned flowcharts rendered in Mermaid.js  
> **Convention:** 🔔 = Notification trigger, 🛑 = Blocking condition, ✅ = Approval gate

---

## 3.1 Student Complete Journey

This flowchart maps the entire student experience from registration through final grade receipt.

```mermaid
flowchart TD
    START((🎓 Student\nJourney Start)) --> REG["Register Account\n(Name, Email, Student ID,\nDepartment, Password)"]
    REG --> VERIFY_EMAIL{"Email\nVerification"}
    VERIFY_EMAIL -->|Verified| LOGIN["Login\n(JWT Token Issued)"]
    VERIFY_EMAIL -->|Not Verified| RESEND["Resend Verification\nEmail"]
    RESEND --> VERIFY_EMAIL

    LOGIN --> PROFILE["Complete Student Profile\n(GPA, Enrollment Year,\nPhone, Address)"]
    PROFILE --> CV_CHECK{"CV\nComplete?"}
    CV_CHECK -->|No| BUILD_CV["Build / Edit CV"]
    CV_CHECK -->|Yes| DASHBOARD["Student Dashboard"]
    BUILD_CV --> ADD_EDU["Add Education\nEntries"]
    ADD_EDU --> ADD_EXP["Add Work Experience\n(Optional)"]
    ADD_EXP --> ADD_SKILLS["Select Skills from\nTaxonomy (Min 3)"]
    ADD_SKILLS --> UPLOAD_DOCS["Upload Certifications\n(PDF, Max 5MB)"]
    UPLOAD_DOCS --> SAVE_CV["Save CV"]
    SAVE_CV --> CV_VALID{"CV Minimum\nMet?\n(1 Edu + 3 Skills)"}
    CV_VALID -->|No| ADD_SKILLS
    CV_VALID -->|Yes| CV_COMPLETE["CV Status: COMPLETE\n🔔 Recommendation Engine\nTriggered"]
    CV_COMPLETE --> DASHBOARD

    DASHBOARD --> BROWSE["Browse / Search\nInternship Listings"]
    DASHBOARD --> VIEW_REC["View Recommended\nInternships\n(Ranked by Match Score)"]
    VIEW_REC --> BROWSE

    BROWSE --> SELECT_LISTING["View Listing Details\n& Match Score Breakdown"]
    SELECT_LISTING --> APPLY_CHECK{"Eligible\nto Apply?"}
    APPLY_CHECK -->|"CV Incomplete"| BUILD_CV
    APPLY_CHECK -->|"3 Active Apps"| MANAGE_APPS["Withdraw an Existing\nApplication First"]
    APPLY_CHECK -->|"Already Applied"| BROWSE
    APPLY_CHECK -->|"Deadline Passed"| BROWSE
    APPLY_CHECK -->|Eligible| APPLY["Submit Application\n(CV Snapshot + Cover Letter)"]

    MANAGE_APPS --> WITHDRAW["Withdraw Application\n🔔 Notify Company"]
    WITHDRAW --> APPLY_CHECK

    APPLY --> APP_SUBMITTED["Application Status:\nSUBMITTED\n🔔 Notify Company Rep"]

    APP_SUBMITTED --> TRACK["Track Application\non Dashboard"]
    TRACK --> STATUS_UPDATE{"Status\nUpdate\nReceived?"}
    STATUS_UPDATE -->|"UNDER_REVIEW\n🔔"| TRACK
    STATUS_UPDATE -->|"SHORTLISTED\n🔔"| TRACK
    STATUS_UPDATE -->|"REJECTED\n🔔"| REJECTED_END["Application Rejected\n(Can Apply Elsewhere)"]
    STATUS_UPDATE -->|"ACCEPTED\n🔔"| AWAIT_CONFIRM["Awaiting Admin\nConfirmation"]
    REJECTED_END --> BROWSE

    AWAIT_CONFIRM --> CONFIRMED{"Admin\nConfirms?"}
    CONFIRMED -->|"Rejected by Admin"| REJECTED_END
    CONFIRMED -->|"Confirmed ✅\n🔔 All Parties Notified"| INTERNSHIP_ACTIVE["Internship Status: ACTIVE\nOther Applications\nAuto-Withdrawn"]

    INTERNSHIP_ACTIVE --> WEEKLY_CYCLE["Weekly Reporting Cycle\nBegins"]
    WEEKLY_CYCLE --> CHECK_DEADLINE{"Report\nDeadline\nApproaching?"}
    CHECK_DEADLINE -->|"24h Before\n🔔 Reminder"| WRITE_REPORT["Write Weekly Report\n(Activities, Challenges,\nLearnings, Hours)"]
    CHECK_DEADLINE -->|"Not Yet"| WRITE_REPORT
    WRITE_REPORT --> ATTACH["Attach Files\n(Optional, Max 3)"]
    ATTACH --> SUBMIT_DRAFT{"Save as\nDraft or Submit?"}
    SUBMIT_DRAFT -->|Draft| DRAFT_SAVED["Report Saved\nas DRAFT"]
    DRAFT_SAVED --> WRITE_REPORT
    SUBMIT_DRAFT -->|Submit| VALIDATE_RPT{"Validation\nPassed?\n(50+ chars, 1-80 hrs)"}
    VALIDATE_RPT -->|No| WRITE_REPORT
    VALIDATE_RPT -->|Yes| RPT_SUBMITTED["Report Status:\nSUBMITTED\n🔔 Notify Lecturer"]

    RPT_SUBMITTED --> LATE_CHECK{"Past\nDeadline?"}
    LATE_CHECK -->|Yes| LATE_FLAG["Report Flagged\nas LATE"]
    LATE_CHECK -->|No| AWAIT_REVIEW["Awaiting Lecturer\nReview"]
    LATE_FLAG --> AWAIT_REVIEW

    AWAIT_REVIEW --> REVIEW_RESULT{"Lecturer\nDecision\n🔔"}
    REVIEW_RESULT -->|"APPROVED ✅"| RPT_APPROVED["Report Approved"]
    REVIEW_RESULT -->|"REVISION_REQUESTED"| REVISE_RPT["Review Feedback &\nRevise Report"]
    REVIEW_RESULT -->|"REJECTED"| RPT_REJECTED["Report Rejected\n(Final for This Week)"]

    REVISE_RPT --> VALIDATE_RPT
    RPT_APPROVED --> NEXT_WEEK{"More Weeks\nRemaining?"}
    RPT_REJECTED --> NEXT_WEEK
    NEXT_WEEK -->|Yes| WEEKLY_CYCLE
    NEXT_WEEK -->|No| INTERNSHIP_END["Internship Period\nEnds"]

    INTERNSHIP_END --> AWAIT_EVAL["Await Company\nEvaluation"]
    AWAIT_EVAL --> AWAIT_GRADE["Await Lecturer\nGrade"]
    AWAIT_GRADE --> FINAL_SCORE["Final Score Calculated\n🔔 Notification:\nGrade Available"]
    FINAL_SCORE --> VIEW_GRADE["View Final Score\n& Grade Breakdown"]
    VIEW_GRADE --> FINISH((🎓 Student\nJourney Complete))

    style START fill:#8957e5,stroke:#bc8cff,color:#fff
    style FINISH fill:#8957e5,stroke:#bc8cff,color:#fff
    style CV_COMPLETE fill:#238636,stroke:#3fb950,color:#fff
    style APP_SUBMITTED fill:#1f6feb,stroke:#58a6ff,color:#fff
    style INTERNSHIP_ACTIVE fill:#238636,stroke:#3fb950,color:#fff
    style RPT_SUBMITTED fill:#1f6feb,stroke:#58a6ff,color:#fff
    style RPT_APPROVED fill:#238636,stroke:#3fb950,color:#fff
    style REJECTED_END fill:#da3633,stroke:#f85149,color:#fff
    style RPT_REJECTED fill:#da3633,stroke:#f85149,color:#fff
    style LATE_FLAG fill:#d29922,stroke:#e3b341,color:#fff
    style FINAL_SCORE fill:#238636,stroke:#3fb950,color:#fff
```

### 3.1.1 Student Journey — Key Decision Points

| Decision Point | Conditions | Outcome |
|---------------|------------|---------|
| CV Complete? | ≥ 1 Education + ≥ 3 Skills | Unlocks application eligibility |
| Eligible to Apply? | CV complete + < 3 active apps + no duplicate + deadline not passed | Application proceeds |
| Report Validation | Activities ≥ 50 chars + Hours 1–80 | Report accepted for submission |
| Lecturer Decision | Approve / Revise (max 2) / Reject | Report finalized or revision cycle |
| More Weeks Remaining? | Current date vs. internship end date | Continues cycle or ends internship |

---

## 3.2 Company Representative Complete Journey

```mermaid
flowchart TD
    START((🏢 Company\nJourney Start)) --> REG["Register Company\nRepresentative Account\n(Name, Email, Company Name,\nIndustry, Contact)"]
    REG --> AWAIT_VERIFY["Await Company\nProfile Verification\nby Admin"]

    AWAIT_VERIFY --> VERIFIED{"Admin Verifies\nCompany?\n🔔"}
    VERIFIED -->|"Rejected"| UPDATE_PROFILE["Update Company\nProfile & Resubmit"]
    UPDATE_PROFILE --> AWAIT_VERIFY
    VERIFIED -->|"Verified ✅"| COMP_DASH["Company Dashboard"]

    COMP_DASH --> CREATE_POST["Create Internship\nPosting"]
    CREATE_POST --> FILL_DETAILS["Fill Position Details\n(Title, Description,\nDuration, Quota, Location)"]
    FILL_DETAILS --> ADD_SKILLS["Select Required Skills\nfrom Taxonomy\n(Min 1 Tag)"]
    ADD_SKILLS --> SET_DEADLINE["Set Application\nDeadline"]
    SET_DEADLINE --> PREVIEW["Preview Posting"]

    PREVIEW --> SAVE_ACTION{"Save as Draft\nor Submit?"}
    SAVE_ACTION -->|"Draft"| DRAFT["Posting Status:\nDRAFT"]
    DRAFT --> CREATE_POST
    SAVE_ACTION -->|"Submit"| VALIDATE_POST{"Validation\nPassed?"}
    VALIDATE_POST -->|"No (Missing fields,\nbad duration)"| FILL_DETAILS
    VALIDATE_POST -->|"Yes"| PENDING["Posting Status:\nPENDING_APPROVAL\n🔔 Notify Admin"]

    PENDING --> ADMIN_DECISION{"Admin\nDecision\n🔔"}
    ADMIN_DECISION -->|"APPROVED ✅"| PUBLISHED["Posting Status:\nPUBLISHED\n🔔 Recommendation\nEngine Triggered"]
    ADMIN_DECISION -->|"CHANGES_REQUESTED"| EDIT_POST["Edit Posting per\nAdmin Feedback"]
    ADMIN_DECISION -->|"REJECTED"| REJECTED_POST["Posting Rejected\n(Review Reason)"]
    EDIT_POST --> VALIDATE_POST
    REJECTED_POST --> CREATE_POST

    PUBLISHED --> RECEIVE_APPS["Receive Applications\n🔔 Per Application"]

    RECEIVE_APPS --> REVIEW_APP["Review Application\n(CV, Cover Letter,\nMatch Score)"]
    REVIEW_APP --> APP_ACTION{"Application\nAction"}
    APP_ACTION -->|"Mark Under Review"| UNDER_REVIEW["Status: UNDER_REVIEW\n🔔 Notify Student"]
    APP_ACTION -->|"Shortlist"| SHORTLIST["Status: SHORTLISTED\n🔔 Notify Student"]
    APP_ACTION -->|"Reject"| REJECT_APP["Status: REJECTED\n(Enter Reason)\n🔔 Notify Student"]

    UNDER_REVIEW --> APP_ACTION2{"Further\nAction"}
    APP_ACTION2 -->|"Shortlist"| SHORTLIST
    APP_ACTION2 -->|"Reject"| REJECT_APP

    SHORTLIST --> ACCEPT_DECISION{"Accept\nStudent?"}
    ACCEPT_DECISION -->|"Yes"| ACCEPT_APP["Status: ACCEPTED\n🔔 Notify Student\n🔔 Notify Admin\n(Awaiting Confirmation)"]
    ACCEPT_DECISION -->|"No"| REJECT_APP

    ACCEPT_APP --> ADMIN_CONFIRM{"Admin\nConfirms\nPlacement?\n🔔"}
    ADMIN_CONFIRM -->|"Confirmed ✅"| PLACEMENT_ACTIVE["Placement Active\nQuota Decremented"]
    ADMIN_CONFIRM -->|"Rejected"| BACK_TO_SHORTLIST["Student Returns to\nShortlisted Pool"]
    BACK_TO_SHORTLIST --> ACCEPT_DECISION

    REJECT_APP --> MORE_APPS{"More\nApplications?"}
    MORE_APPS -->|"Yes"| REVIEW_APP
    MORE_APPS -->|"No"| WAIT_APPS["Wait for More\nApplications"]
    WAIT_APPS --> RECEIVE_APPS

    PLACEMENT_ACTIVE --> QUOTA_CHECK{"Quota\nFilled?"}
    QUOTA_CHECK -->|"Yes"| LISTING_CLOSED["Listing Status:\nCLOSED"]
    QUOTA_CHECK -->|"No"| RECEIVE_APPS

    LISTING_CLOSED --> INTERNSHIP_PERIOD["Internship Period\n(Monitor Interns)"]
    PLACEMENT_ACTIVE --> INTERNSHIP_PERIOD

    INTERNSHIP_PERIOD --> INTERN_ENDS["Internship End\nDate Reached"]
    INTERN_ENDS --> EVAL_PENDING["Evaluation Required\n🔔 Reminder"]
    EVAL_PENDING --> FILL_EVAL["Complete Evaluation\nRubric\n(7 Criteria, 0-100 Each)"]
    FILL_EVAL --> ADD_COMMENTS["Add Comments:\nStrengths, Improvements,\nHiring Recommendation"]
    ADD_COMMENTS --> SUBMIT_EVAL["Submit Evaluation\n(Final & Immutable)"]
    SUBMIT_EVAL --> EVAL_DONE["Evaluation Status:\nSUBMITTED\n🔔 Notify Lecturer\n🔔 Notify Admin"]
    EVAL_DONE --> FINISH((🏢 Company\nJourney Complete))

    style START fill:#da3633,stroke:#f85149,color:#fff
    style FINISH fill:#da3633,stroke:#f85149,color:#fff
    style PUBLISHED fill:#238636,stroke:#3fb950,color:#fff
    style PENDING fill:#d29922,stroke:#e3b341,color:#fff
    style ACCEPT_APP fill:#1f6feb,stroke:#58a6ff,color:#fff
    style PLACEMENT_ACTIVE fill:#238636,stroke:#3fb950,color:#fff
    style LISTING_CLOSED fill:#6e7681,stroke:#8b949e,color:#fff
    style REJECTED_POST fill:#da3633,stroke:#f85149,color:#fff
    style REJECT_APP fill:#da3633,stroke:#f85149,color:#fff
    style EVAL_DONE fill:#238636,stroke:#3fb950,color:#fff
```

### 3.2.1 Company Journey — Key Decision Points

| Decision Point | Conditions | Outcome |
|---------------|------------|---------|
| Admin Verifies Company? | Company profile complete & legitimate | Unlocks posting capability |
| Admin Approves Posting? | Posting meets policy requirements | Listing becomes visible to students |
| Accept Student? | Student qualifications match needs | Application accepted, awaits Admin confirmation |
| Quota Filled? | Confirmed placements = Posting quota | Listing auto-closed |
| Evaluation Submission | Within 14 days of internship end | Unlocks Lecturer grading |

---

## 3.3 Lecturer / Supervisor Complete Journey

```mermaid
flowchart TD
    START((👨‍🏫 Lecturer\nJourney Start)) --> REG["Register Lecturer\nAccount\n(Name, Staff ID,\nDepartment, Specialization)"]
    REG --> LOGIN["Login\n(JWT Token Issued)"]
    LOGIN --> LECT_DASH["Lecturer Dashboard"]

    LECT_DASH --> AWAIT_ASSIGN["Await Student\nAssignment by Admin"]
    AWAIT_ASSIGN --> ASSIGNED{"Student\nAssigned?\n🔔"}
    ASSIGNED -->|"Yes"| VIEW_ASSIGNMENT["View Assignment:\nStudent Name, Company,\nPosition, Duration"]
    ASSIGNED -->|"Not Yet"| LECT_DASH

    VIEW_ASSIGNMENT --> MONITOR["Monitor Supervised\nStudents Overview"]
    MONITOR --> STUDENT_LIST["View Student List:\n• Progress Bar\n• Report Compliance %\n• Pending Reports Count\n• Evaluation Status"]

    STUDENT_LIST --> SELECT_STUDENT["Select a Student\nto View Details"]
    SELECT_STUDENT --> STUDENT_DETAIL["View Student Detail:\n• Report Timeline\n• Hours Chart\n• Attendance Data"]

    STUDENT_DETAIL --> COMPLIANCE_CHECK{"Student\nCompliance\nIssue?"}
    COMPLIANCE_CHECK -->|"Missing Reports"| SEND_REMINDER["Send Manual Reminder\n🔔 Notify Student"]
    COMPLIANCE_CHECK -->|"All Good"| MONITOR
    SEND_REMINDER --> MONITOR

    LECT_DASH --> PENDING_REVIEWS["View Pending\nReport Reviews"]
    PENDING_REVIEWS --> REVIEW_QUEUE["Report Review Queue:\nSorted by Date (Oldest First)\n• Student Name\n• Week Number\n• Late Flag"]

    REVIEW_QUEUE --> SELECT_REPORT["Select Report\nto Review"]
    SELECT_REPORT --> READ_REPORT["Read Full Report:\n• Activities\n• Challenges\n• Learnings\n• Hours Logged\n• Attachments"]

    READ_REPORT --> REVIEW_DECISION{"Review\nDecision"}
    REVIEW_DECISION -->|"Approve ✅"| APPROVE_RPT["Report Status:\nAPPROVED\n🔔 Notify Student\n(Feedback Optional)"]
    REVIEW_DECISION -->|"Request Revision"| REV_CHECK{"Revision Count\n< 2?"}
    REVIEW_DECISION -->|"Reject"| REJECT_RPT["Report Status:\nREJECTED\n🔔 Notify Student\n(Reason Required)"]

    REV_CHECK -->|"Yes"| REQUEST_REV["Report Status:\nREVISION_REQUESTED\nEnter Specific Feedback\n(Min 20 chars)\n🔔 Notify Student"]
    REV_CHECK -->|"No (Limit Reached)"| FORCE_DECISION{"Must Approve\nor Reject"}
    FORCE_DECISION -->|"Approve"| APPROVE_RPT
    FORCE_DECISION -->|"Reject"| REJECT_RPT

    REQUEST_REV --> AWAIT_REVISION["Await Student\nRevision"]
    AWAIT_REVISION --> REVISED_RECEIVED{"Revised Report\nReceived?\n🔔"}
    REVISED_RECEIVED -->|"Yes"| READ_REPORT
    REVISED_RECEIVED -->|"Not Yet"| PENDING_REVIEWS

    APPROVE_RPT --> MORE_REVIEWS{"More Reports\nin Queue?"}
    REJECT_RPT --> MORE_REVIEWS
    MORE_REVIEWS -->|"Yes"| REVIEW_QUEUE
    MORE_REVIEWS -->|"No"| LECT_DASH

    LECT_DASH --> EVAL_SECTION["Pending Evaluations\n(Post-Internship)"]
    EVAL_SECTION --> EVAL_CHECK{"Company\nEvaluation\nSubmitted?"}
    EVAL_CHECK -->|"No 🛑"| EVAL_LOCKED["Grading Locked:\nAwaiting Company\nEvaluation"]
    EVAL_LOCKED --> EVAL_SECTION
    EVAL_CHECK -->|"Yes ✅"| GRADING_FORM["Open Grading Form"]

    GRADING_FORM --> VIEW_CONTEXT["Review Context:\n• Weekly Report Summary\n• Approval/Rejection Stats\n• Company Eval Score\n• Attendance Data"]
    VIEW_CONTEXT --> SCORE_CRITERIA["Score Criteria:\n• Report Quality (0-100)\n• Final Presentation (0-100)\n• Engagement (0-100)"]
    SCORE_CRITERIA --> ADD_LECT_COMMENTS["Add Overall Comments"]
    ADD_LECT_COMMENTS --> PREVIEW_GRADE["Preview Auto-Calculated\nLecturer Score"]
    PREVIEW_GRADE --> SUBMIT_GRADE["Submit Grade\n(Final & Immutable)"]

    SUBMIT_GRADE --> GRADE_SUBMITTED["Lecturer Grade:\nSUBMITTED\n🔔 Trigger CalculateFinalScore\n🔔 Notify Student\n🔔 Notify Admin"]
    GRADE_SUBMITTED --> FINAL_CALC["System Calculates:\nCompany (40%) +\nLecturer (40%) +\nAttendance (20%)\n→ Letter Grade"]

    FINAL_CALC --> EXPORT{"Export\nReport?"}
    EXPORT -->|"Yes"| EXPORT_PDF["Export Student\nProgress Report\n(PDF/Excel)"]
    EXPORT -->|"No"| LECT_DASH
    EXPORT_PDF --> LECT_DASH

    LECT_DASH --> FINISH((👨‍🏫 Lecturer\nJourney Complete))

    style START fill:#d29922,stroke:#e3b341,color:#fff
    style FINISH fill:#d29922,stroke:#e3b341,color:#fff
    style APPROVE_RPT fill:#238636,stroke:#3fb950,color:#fff
    style REJECT_RPT fill:#da3633,stroke:#f85149,color:#fff
    style REQUEST_REV fill:#d29922,stroke:#e3b341,color:#fff
    style EVAL_LOCKED fill:#6e7681,stroke:#8b949e,color:#fff
    style GRADE_SUBMITTED fill:#238636,stroke:#3fb950,color:#fff
    style FINAL_CALC fill:#8957e5,stroke:#bc8cff,color:#fff
```

### 3.3.1 Lecturer Report Review — Approval Sub-Process Detail

```mermaid
flowchart LR
    subgraph REPORT_LIFECYCLE["Weekly Report Review Lifecycle"]
        direction LR
        S1["SUBMITTED\nby Student"] --> S2["Lecturer\nReads Report"]
        S2 --> D1{"Decision"}
        D1 -->|"✅ Approve"| S3["APPROVED\n🔔 Student"]
        D1 -->|"📝 Revise\n(Count < 2)"| S4["REVISION_REQUESTED\n🔔 Student"]
        D1 -->|"❌ Reject"| S5["REJECTED\n🔔 Student"]
        S4 -->|"Student Resubmits\n🔔 Lecturer"| S2
        S4 -->|"Max Revisions\nReached (2)"| D2{"Must Decide"}
        D2 -->|"Approve"| S3
        D2 -->|"Reject"| S5
    end

    style S1 fill:#1f6feb,stroke:#58a6ff,color:#fff
    style S3 fill:#238636,stroke:#3fb950,color:#fff
    style S4 fill:#d29922,stroke:#e3b341,color:#fff
    style S5 fill:#da3633,stroke:#f85149,color:#fff
```

### 3.3.2 Lecturer Journey — Key Decision Points

| Decision Point | Conditions | Outcome |
|---------------|------------|---------|
| Review Decision | Report quality assessment | Approve / Revise / Reject |
| Revision Count < 2? | Per BR-17 | If exceeded, must approve or reject |
| Company Eval Submitted? | Per BR-20 dependency | Grading form unlocked or locked |
| Submit Grade | All criteria scored (0–100) | Triggers final score calculation |

---

## 3.4 Administrator Complete Journey

```mermaid
flowchart TD
    START((👨‍💼 Admin\nJourney Start)) --> LOGIN["Admin Login\n(JWT Token Issued)"]
    LOGIN --> ADMIN_DASH["Admin Dashboard\n• Total Users by Role\n• Active Internships\n• Pending Approvals Count\n• System Activity Feed"]

    %% ========= USER MANAGEMENT BRANCH =========
    ADMIN_DASH --> USER_MGMT["User Management"]
    USER_MGMT --> VIEW_USERS["View / Search / Filter\nAll Users\n(Paginated)"]
    VIEW_USERS --> USER_ACTION{"User\nAction"}
    USER_ACTION -->|"Activate"| ACTIVATE["Activate Account\n🔔 Notify User"]
    USER_ACTION -->|"Deactivate"| DEACTIVATE["Deactivate Account\n🔔 Notify User\n📝 Audit Log"]
    USER_ACTION -->|"Change Role"| ROLE_CHANGE{"Profile Valid\nfor New Role?"}
    USER_ACTION -->|"Verify Company"| VERIFY_COMPANY["Verify Company Profile\n🔔 Notify Company Rep"]
    ROLE_CHANGE -->|"Valid"| UPDATE_ROLE["Update Role\n🔔 Notify User\n📝 Audit Log"]
    ROLE_CHANGE -->|"Invalid"| ROLE_ERROR["Error: Incomplete\nProfile for Target Role"]
    ACTIVATE --> ADMIN_DASH
    DEACTIVATE --> ADMIN_DASH
    UPDATE_ROLE --> ADMIN_DASH
    VERIFY_COMPANY --> ADMIN_DASH

    %% ========= POSTING APPROVAL BRANCH =========
    ADMIN_DASH --> POST_APPROVAL["Internship Posting\nApproval Queue"]
    POST_APPROVAL --> VIEW_POST["Review Posting Details\n(Title, Description, Skills,\nDuration, Company Status)"]
    VIEW_POST --> POST_VALIDATE{"Posting\nCompliant?"}
    POST_VALIDATE -->|"Yes"| APPROVE_POST["Approve Posting ✅\nStatus: PUBLISHED\n🔔 Notify Company\n🔔 Trigger Recommendation\nEngine Recalculation"]
    POST_VALIDATE -->|"Needs Changes"| REQUEST_CHANGES["Request Changes\n(Enter Feedback)\n🔔 Notify Company"]
    POST_VALIDATE -->|"Non-Compliant"| REJECT_POST["Reject Posting\n(Enter Reason)\n🔔 Notify Company\n📝 Audit Log"]
    APPROVE_POST --> ADMIN_DASH
    REQUEST_CHANGES --> ADMIN_DASH
    REJECT_POST --> ADMIN_DASH

    %% ========= PLACEMENT CONFIRMATION BRANCH =========
    ADMIN_DASH --> PLACEMENT_QUEUE["Placement\nConfirmation Queue\n🔔 Triggered by\nCompany Acceptance"]
    PLACEMENT_QUEUE --> REVIEW_PLACEMENT["Review Placement:\n• Student Profile\n• Company & Position\n• Application Timeline"]
    REVIEW_PLACEMENT --> ASSIGN_LECTURER["Select Supervising\nLecturer\n(Filtered by Department)"]
    ASSIGN_LECTURER --> LOAD_CHECK{"Lecturer Load\n≤ Max (10)?"}
    LOAD_CHECK -->|"Yes"| CONFIRM_PLACE["Confirm Placement ✅"]
    LOAD_CHECK -->|"Exceeded"| LOAD_WARNING["Warning: Max Load\nExceeded. Override\nor Select Another"]
    LOAD_WARNING --> OVERRIDE{"Override?"}
    OVERRIDE -->|"Yes"| CONFIRM_PLACE
    OVERRIDE -->|"No"| ASSIGN_LECTURER

    CONFIRM_PLACE --> AUTO_WITHDRAW["Auto-Withdraw\nStudent's Other\nPending Applications\n🔔 Notify per App"]
    AUTO_WITHDRAW --> DECREMENT_QUOTA["Decrement Listing\nQuota"]
    DECREMENT_QUOTA --> QUOTA_ZERO{"Quota\n= 0?"}
    QUOTA_ZERO -->|"Yes"| CLOSE_LISTING["Auto-Close Listing\nStatus: CLOSED"]
    QUOTA_ZERO -->|"No"| NOTIFY_ALL["🔔 Notify:\n• Student (Confirmed)\n• Lecturer (Assigned)\n• Company (Confirmed)\n📝 Audit Log"]
    CLOSE_LISTING --> NOTIFY_ALL
    NOTIFY_ALL --> ADMIN_DASH

    %% ========= SYSTEM CONFIGURATION BRANCH =========
    ADMIN_DASH --> SYS_CONFIG["System Configuration"]
    SYS_CONFIG --> CONFIG_OPTIONS{"Configuration\nArea"}
    CONFIG_OPTIONS -->|"Skills"| MANAGE_SKILLS["Manage Skill\nTaxonomy\n(Add/Edit/Deactivate)"]
    CONFIG_OPTIONS -->|"Grading"| CONFIGURE_GRADING["Configure Grading:\n• Weight: Company (40%)\n• Weight: Lecturer (40%)\n• Weight: Attendance (20%)\n• Grade Scale Thresholds"]
    CONFIG_OPTIONS -->|"Matching"| CONFIGURE_MATCHING["Configure Recommendation\nWeights:\n• Skill Weight (60%)\n• GPA Weight (20%)\n• Preference Weight (20%)"]
    CONFIG_OPTIONS -->|"Deadlines"| CONFIGURE_DEADLINES["Configure:\n• Weekly Report Deadline\n• Eval Submission Window\n• Reminder Timing"]
    MANAGE_SKILLS --> ADMIN_DASH
    CONFIGURE_GRADING --> ADMIN_DASH
    CONFIGURE_MATCHING --> ADMIN_DASH
    CONFIGURE_DEADLINES --> ADMIN_DASH

    %% ========= AUDIT & REPORTING BRANCH =========
    ADMIN_DASH --> AUDIT_LOGS["View Audit Logs\n(Searchable, Filterable)"]
    AUDIT_LOGS --> ADMIN_DASH
    ADMIN_DASH --> EXPORT_REPORTS["Export Reports\n(PDF / Excel)"]
    EXPORT_REPORTS --> ADMIN_DASH

    %% ========= ESCALATION HANDLING =========
    ADMIN_DASH --> ESCALATIONS["Handle Escalations"]
    ESCALATIONS --> ESCAL_TYPE{"Escalation\nType"}
    ESCAL_TYPE -->|"Late Company\nEvaluation\n(> 14 Days)"| CONTACT_COMPANY["Contact Company\n🔔 Send Escalation\nNotification"]
    ESCAL_TYPE -->|"Unlock Evaluation\nfor Re-submission"| UNLOCK_EVAL["Unlock Evaluation\n📝 Audit Log\n🔔 Notify Evaluator"]
    ESCAL_TYPE -->|"Override Application\nStatus"| ADMIN_OVERRIDE["Override Status\n(With Justification)\n📝 Audit Log"]
    CONTACT_COMPANY --> ADMIN_DASH
    UNLOCK_EVAL --> ADMIN_DASH
    ADMIN_OVERRIDE --> ADMIN_DASH

    ADMIN_DASH --> FINISH((👨‍💼 Admin\nJourney Complete))

    style START fill:#1f6feb,stroke:#58a6ff,color:#fff
    style FINISH fill:#1f6feb,stroke:#58a6ff,color:#fff
    style APPROVE_POST fill:#238636,stroke:#3fb950,color:#fff
    style REJECT_POST fill:#da3633,stroke:#f85149,color:#fff
    style REQUEST_CHANGES fill:#d29922,stroke:#e3b341,color:#fff
    style CONFIRM_PLACE fill:#238636,stroke:#3fb950,color:#fff
    style CLOSE_LISTING fill:#6e7681,stroke:#8b949e,color:#fff
    style LOAD_WARNING fill:#d29922,stroke:#e3b341,color:#fff
    style VERIFY_COMPANY fill:#238636,stroke:#3fb950,color:#fff
```

### 3.4.1 Administrator Journey — Key Decision Points

| Decision Point | Conditions | Outcome |
|---------------|------------|---------|
| Posting Compliant? | Valid skills, description, duration, verified company | Approve / Request Changes / Reject |
| Lecturer Load ≤ Max? | Current supervision count vs. configurable max (default: 10) | Assign or warn/override |
| Quota = 0? | All positions filled | Auto-close listing |
| Escalation Type | Late evaluation, unlock request, status override | Appropriate admin intervention |

---

## 3.5 Cross-Functional Master Process Flow

This diagram shows how the four roles interact across the complete internship lifecycle.

```mermaid
flowchart TB
    subgraph PHASE1["Phase 1: Setup & Listing"]
        direction LR
        C1["Company Creates\nPosting"] --> A1["Admin Reviews\n& Approves"]
        A1 --> SYS1["System Publishes\n& Triggers\nRecommendations"]
    end

    subgraph PHASE2["Phase 2: Application & Placement"]
        direction LR
        S1["Student Views\nRecommendations\n& Applies"] --> C2["Company Reviews\nApplications"]
        C2 --> C3["Company Accepts\nStudent"]
        C3 --> A2["Admin Confirms\nPlacement &\nAssigns Lecturer"]
    end

    subgraph PHASE3["Phase 3: Internship Execution"]
        direction LR
        S2["Student Submits\nWeekly Report"] --> L1["Lecturer Reviews\n& Approves/Revises"]
        L1 --> S3["Student Revises\n(if needed)"]
        S3 --> L1
    end

    subgraph PHASE4["Phase 4: Evaluation & Grading"]
        direction LR
        C4["Company Submits\nEvaluation"] --> L2["Lecturer Submits\nGrade"]
        L2 --> SYS2["System Calculates\nFinal Score"]
        SYS2 --> S4["Student Views\nFinal Grade"]
    end

    PHASE1 --> PHASE2
    PHASE2 --> PHASE3
    PHASE3 --> PHASE4

    style PHASE1 fill:#0d1117,stroke:#1f6feb,color:#c9d1d9
    style PHASE2 fill:#0d1117,stroke:#8957e5,color:#c9d1d9
    style PHASE3 fill:#0d1117,stroke:#d29922,color:#c9d1d9
    style PHASE4 fill:#0d1117,stroke:#238636,color:#c9d1d9
```

---

## 3.6 Notification Trigger Registry

This table documents every notification trigger point identified across all business processes.

| ID | Trigger Event | Sender | Recipient(s) | Channel | Priority |
|----|--------------|--------|-------------- |---------|----------|
| **N-01** | Account activated/deactivated by Admin | System | Affected User | In-App + Email | High |
| **N-02** | Company profile verified by Admin | System | Company Rep | In-App + Email | High |
| **N-03** | Internship posting submitted for approval | System | Admin | In-App | Medium |
| **N-04** | Internship posting approved | System | Company Rep | In-App + Email | High |
| **N-05** | Internship posting rejected / changes requested | System | Company Rep | In-App + Email | High |
| **N-06** | Posting published — new recommendations available | System | Matching Students | In-App | Low |
| **N-07** | New application received | System | Company Rep | In-App + Email | Medium |
| **N-08** | Application status changed (Under Review) | System | Student | In-App | Medium |
| **N-09** | Application shortlisted | System | Student | In-App + Email | High |
| **N-10** | Application accepted by Company | System | Student + Admin | In-App + Email | High |
| **N-11** | Application rejected | System | Student | In-App + Email | High |
| **N-12** | Placement confirmed by Admin | System | Student + Lecturer + Company | In-App + Email | High |
| **N-13** | Other pending applications auto-withdrawn | System | Student + Affected Companies | In-App | Medium |
| **N-14** | Lecturer assigned to student | System | Lecturer | In-App + Email | High |
| **N-15** | Weekly report deadline reminder (24h before) | Scheduler | Student | In-App + Email | Medium |
| **N-16** | Weekly report submitted | System | Lecturer | In-App | Medium |
| **N-17** | Weekly report approved | System | Student | In-App | Medium |
| **N-18** | Weekly report revision requested | System | Student | In-App + Email | High |
| **N-19** | Weekly report rejected | System | Student | In-App + Email | High |
| **N-20** | Manual reminder from Lecturer | Lecturer | Student | In-App | Medium |
| **N-21** | Company evaluation submitted | System | Lecturer + Admin | In-App + Email | High |
| **N-22** | Company evaluation overdue (> 14 days) | Scheduler | Admin (Escalation) | In-App + Email | High |
| **N-23** | Lecturer grade submitted | System | Student + Admin | In-App + Email | High |
| **N-24** | Final score calculated / grade available | System | Student | In-App + Email | High |
| **N-25** | Evaluation unlocked by Admin | System | Evaluator (Company/Lecturer) | In-App + Email | High |
| **N-26** | Application withdrawn by Student | System | Company Rep | In-App | Medium |
| **N-27** | Listing auto-closed (quota filled) | System | Company Rep | In-App | Medium |
| **N-28** | Application deadline approaching (48h) | Scheduler | Students with draft apps | In-App | Low |

### 3.6.1 Notification Channel Decision Logic

```mermaid
flowchart TD
    EVENT["System Event\nOccurs"] --> CLASSIFY{"Event\nPriority?"}
    CLASSIFY -->|"HIGH"| BOTH["Deliver via:\n✅ In-App Notification\n✅ Email Notification"]
    CLASSIFY -->|"MEDIUM"| INAPP_ONLY["Deliver via:\n✅ In-App Notification\n❌ Email (unless user opted-in)"]
    CLASSIFY -->|"LOW"| INAPP_QUIET["Deliver via:\n✅ In-App Notification\n(Silent — no badge flash)"]

    BOTH --> STORE["Store in\nnotifications table"]
    INAPP_ONLY --> STORE
    INAPP_QUIET --> STORE

    STORE --> UNREAD["Increment User's\nUnread Count Badge"]

    style EVENT fill:#1f6feb,stroke:#58a6ff,color:#fff
    style BOTH fill:#da3633,stroke:#f85149,color:#fff
    style INAPP_ONLY fill:#d29922,stroke:#e3b341,color:#fff
    style INAPP_QUIET fill:#238636,stroke:#3fb950,color:#fff
```

---

## 3.7 Approval Workflow State Machines

### 3.7.1 Internship Posting Approval States

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Company saves draft
    DRAFT --> PENDING_APPROVAL : Company submits
    PENDING_APPROVAL --> PUBLISHED : Admin approves
    PENDING_APPROVAL --> CHANGES_REQUESTED : Admin requests changes
    PENDING_APPROVAL --> REJECTED : Admin rejects
    CHANGES_REQUESTED --> PENDING_APPROVAL : Company resubmits
    REJECTED --> DRAFT : Company creates new version
    PUBLISHED --> CLOSED : Quota filled OR deadline passed
    PUBLISHED --> WITHDRAWN : Company withdraws
```

### 3.7.2 Application Workflow States

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Student applies
    SUBMITTED --> UNDER_REVIEW : Company starts review
    UNDER_REVIEW --> SHORTLISTED : Company shortlists
    UNDER_REVIEW --> REJECTED : Company rejects
    SHORTLISTED --> ACCEPTED : Company accepts
    SHORTLISTED --> REJECTED : Company rejects
    ACCEPTED --> CONFIRMED : Admin confirms + assigns lecturer
    ACCEPTED --> UNDER_REVIEW : Admin rejects confirmation
    CONFIRMED --> [*] : Placement active

    SUBMITTED --> WITHDRAWN : Student withdraws
    UNDER_REVIEW --> WITHDRAWN : Student withdraws
    SHORTLISTED --> WITHDRAWN : Student withdraws

    SUBMITTED --> AUTO_WITHDRAWN : Another placement confirmed
    UNDER_REVIEW --> AUTO_WITHDRAWN : Another placement confirmed
    SHORTLISTED --> AUTO_WITHDRAWN : Another placement confirmed
```

### 3.7.3 Weekly Report States

```mermaid
stateDiagram-v2
    [*] --> NOT_STARTED : Week begins
    NOT_STARTED --> DRAFT : Student starts writing
    DRAFT --> SUBMITTED : Student submits
    SUBMITTED --> APPROVED : Lecturer approves
    SUBMITTED --> REVISION_REQUESTED : Lecturer requests revision (max 2x)
    SUBMITTED --> REJECTED : Lecturer rejects
    REVISION_REQUESTED --> SUBMITTED : Student resubmits revision
    APPROVED --> [*]
    REJECTED --> [*]

    note right of SUBMITTED : Late flag applied\nif past deadline
    note right of REVISION_REQUESTED : Counter incremented\nMax 2 per report
```

### 3.7.4 Evaluation & Grading States

```mermaid
stateDiagram-v2
    [*] --> INTERNSHIP_COMPLETED : End date reached

    state Company_Evaluation {
        CE_PENDING --> CE_DRAFT : Company starts
        CE_DRAFT --> CE_SUBMITTED : Company submits
    }

    state Lecturer_Grading {
        LG_LOCKED --> LG_UNLOCKED : Company eval submitted
        LG_UNLOCKED --> LG_SUBMITTED : Lecturer submits grade
    }

    state Final_Score {
        FS_PENDING --> FS_CALCULATED : Both evaluations in
    }

    INTERNSHIP_COMPLETED --> CE_PENDING
    CE_SUBMITTED --> LG_LOCKED
    CE_SUBMITTED --> LG_UNLOCKED
    LG_SUBMITTED --> FS_PENDING
    FS_CALCULATED --> [*] : Grade published to student

    note right of LG_LOCKED : Blocked until\ncompany eval done\n(BR-20)
    note right of FS_CALCULATED : Formula:\nCompany(40%) +\nLecturer(40%) +\nAttendance(20%)
```

---

## 3.8 Scheduled Process Flows (Cron / Scheduler)

| Schedule | Process | Trigger | Actions |
|----------|---------|---------|---------|
| **Daily @ 00:00** | Deadline Enforcement | Cron | Check for overdue weekly reports → flag as `LATE` if not submitted by deadline |
| **Daily @ 08:00** | Deadline Reminders | Cron | Check for reports due within 24 hours → send N-15 reminder to students |
| **Daily @ 09:00** | Evaluation Overdue Check | Cron | Check for company evaluations not submitted > 14 days post-internship → send N-22 escalation to Admin |
| **On CV Update** | Recommendation Recalculation | Event | Recalculate match scores for the updated student against all active listings |
| **On Posting Published** | Recommendation Recalculation | Event | Calculate match scores for all eligible students against the new listing |
| **Daily @ 23:59** | Listing Deadline Check | Cron | Close listings whose application deadline has passed → set status to `CLOSED` |
| **Weekly @ Monday 01:00** | Initialize Week Reports | Cron | Create `NOT_STARTED` report slots for the new week for all active internships |

---

## 3.9 Phase 3 — State Summary

> [!IMPORTANT]
> **Critical Decisions Carried Forward to Subsequent Phases:**

- **Four complete journey flowcharts** have been modeled covering every user interaction from registration to completion. These journeys directly inform the **frontend route map** (Phase 11) and **API endpoint design** (Phase 9) — each process step corresponds to at least one API call and one UI view.
- **Four state machines** have been formally defined (Posting: 7 states, Application: 8 states, Report: 6 states, Evaluation: multi-track). These states must be implemented as **ENUM/CHECK constraints** in the Oracle schema (Phase 6) and as **status transition validation** in the Laravel Service layer (Phase 10).
- **28 notification triggers** (N-01 through N-28) are catalogued with channel routing logic (In-App + Email for High priority, In-App only for Medium/Low). This registry governs the **Laravel Events/Listeners architecture** (Phase 10) and the **notifications database table** design (Phase 5–6).
- **7 scheduled processes** are identified requiring the **Laravel Task Scheduler** (Phase 10). These include deadline enforcement, reminder dispatch, overdue escalation, and recommendation recalculation — each requiring a dedicated Artisan command or queued job.

---

✅ **Phase 3 completed.** Reply **CONTINUE** to proceed to Phase 4 (Database Requirements & Recommendation Engine Prep), or provide feedback to revise this phase.
