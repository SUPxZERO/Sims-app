# PHASE 13: ALGORITHM IMPLEMENTATION

## Smart University Internship Management System (SUIMS)

> **Document Version:** 1.0  
> **Date:** June 5, 2026  
> **Phase Dependency:** Phase 12 (UI/UX Design Specification)  
> **Engine Type:** Multi-Criteria Recommender System  
> **Target Framework:** Oracle PL/SQL (Database tier) & Laravel 12 (Application tier)

---

## 13.1 Mathematical Modeling & Formulas

The SUIMS Internship Recommendation Engine utilizes a **Multi-Criteria Utility Function** to evaluate the compatibility between a student's profile $S$ and an internship listing $L$. The system normalizes and aggregates three distinct compatibility vectors: **Skill Overlap**, **Academic Performance**, and **Departmental Preference**.

### 13.1.1 Skill Match Score ($S_{\text{skill}}$)

The skill match score measures the intersection of a student's capabilities and a listing's requirements. It accounts for both **breadth** (matching required tags) and **depth** (student's proficiency level).

Let:
- $\mathcal{K}_L$ be the set of skills required or preferred by listing $L$.
- $\mathcal{K}_S$ be the set of skills present in student $S$'s CV.
- $w^{\text{imp}}_k$ be the importance weight of skill $k \in \mathcal{K}_L$ where:
  $$w^{\text{imp}}_k = \begin{cases} 1.00 & \text{if skill } k \text{ is REQUIRED} \\ 0.50 & \text{if skill } k \text{ is PREFERRED} \end{cases}$$
- $w^{\text{prof}}_{s,k}$ be the proficiency weight of student $S$ in skill $k \in \mathcal{K}_S$ where:
  $$w^{\text{prof}}_{s,k} = \begin{cases} 1.00 & \text{if proficiency is ADVANCED} \\ 0.66 & \text{if proficiency is INTERMEDIATE} \\ 0.33 & \text{if proficiency is BEGINNER} \end{cases}$$

The normalized Skill Match Score $S_{\text{skill}}$ is defined as:

$$S_{\text{skill}}(S, L) = \left( \frac{\sum_{k \in \mathcal{K}_L \cap \mathcal{K}_S} (w^{\text{prof}}_{s,k} \times w^{\text{imp}}_k)}{\sum_{j \in \mathcal{K}_L} w^{\text{imp}}_j} \right) \times 100$$

*Note: If $\sum_{j \in \mathcal{K}_L} w^{\text{imp}}_j = 0$ (listing has no skill requirements), $S_{\text{skill}}(S, L) = 100.00$.*

---

### 13.1.2 GPA Match Score ($S_{\text{gpa}}$)

The GPA match score measures academic qualification alignment and applies a penalty scale if the student does not meet the minimum GPA criteria.

Let:
- $\text{GPA}_S$ be the cumulative GPA of student $S$ ($\text{GPA}_S \in [0.00, 4.00]$).
- $\text{GPA}^{\text{min}}_L$ be the minimum GPA requirement of listing $L$.

The GPA Match Score $S_{\text{gpa}}$ is defined as:

$$S_{\text{gpa}}(S, L) = \begin{cases} 
100.00 & \text{if } \text{GPA}^{\text{min}}_L \text{ is NULL or } \text{GPA}^{\text{min}}_L = 0 \\
100.00 & \text{if } \text{GPA}_S \ge \text{GPA}^{\text{min}}_L \\
\max\left(0.00, \left(\frac{\text{GPA}_S}{\text{GPA}^{\text{min}}_L}\right) \times 100\right) & \text{if } \text{GPA}_S < \text{GPA}^{\text{min}}_L
\end{cases}$$

---

### 13.1.3 Preference Match Score ($S_{\text{pref}}$)

Measures departmental alignment. Students from preferred academic departments receive full scores, while students from other departments receive a minor baseline utility score to allow cross-disciplinary applications.

Let:
- $\mathcal{D}_L$ be the set of preferred departments listed by listing $L$.
- $d_S$ be the academic department of student $S$.

The Preference Match Score $S_{\text{pref}}$ is defined as:

$$S_{\text{pref}}(S, L) = \begin{cases} 
100.00 & \text{if } \mathcal{D}_L \text{ is empty or NULL} \\
100.00 & \text{if } d_S \in \mathcal{D}_L \\
25.00 & \text{if } d_S \notin \mathcal{D}_L
\end{cases}$$

---

### 13.1.4 Composite Score ($S_{\text{composite}}$)

Aggregates all components using weights defined in the system configurations.

Let:
- $w_{\text{skill}}, w_{\text{gpa}}, w_{\text{pref}}$ be the configured algorithm weights where:
  $$w_{\text{skill}} + w_{\text{gpa}} + w_{\text{pref}} = 1.00$$

The final Composite Match Score $S_{\text{composite}}$ is:

$$S_{\text{composite}}(S, L) = (S_{\text{skill}} \times w_{\text{skill}}) + (S_{\text{gpa}} \times w_{\text{gpa}}) + (S_{\text{pref}} \times w_{\text{pref}})$$

---

## 13.2 Algorithmic Workflow

The following flowchart maps the trigger-driven pipeline that coordinates recommendation recalculation.

```mermaid
flowchart TD
    subgraph TRIGGERS["⚡ Trigger Events"]
        E1["Student Updates CV\n(skills changed)"]
        E2["New Listing Approved\n(approved_by Admin)"]
        E3["Admin Updates Config\n(matching weights modified)"]
    end

    subgraph ENGINE["⚙️ Recommendation Engine Pipeline"]
        direction TB
        T1["Fetch Config Weights\n(matching_weight_configs)"]
        T2["Identify Target Scope\n(Single Student / Single Listing / Global)"]
        T3["Loop Through Student-Listing Pairs"]
        
        T4["Compute Skill Match\n(intersection, prof depth)"]
        T5["Compute GPA Match\n(qualification penalty)"]
        T6["Compute Preference Match\n(department check)"]
        
        T7["Calculate Composite Score"]
        T8["Filter Threshold\n(score >= min_score_threshold)"]
    end

    subgraph STORAGE["📤 Data Persistence"]
        DB_WRITE["MERGE INTO\nrecommendation_scores"]
        DASHBOARD["Reload Dashboard\n(real-time display)"]
    end

    E1 --> T2
    E2 --> T2
    E3 --> T2
    T2 --> T1
    T1 --> T3
    T3 --> T4
    T3 --> T5
    T3 --> T6
    T4 & T5 & T6 --> T7
    T7 --> T8
    T8 -->|Pass| DB_WRITE
    DB_WRITE --> DASHBOARD
```

---

## 13.3 Structured Algorithm Pseudocode

The following pseudocode outlines the implementation of the matching engine.

### 13.3.1 Core Calculation Subroutines
```typescript
// Subroutine to calculate skill match score
function getSkillMatchScore(cvId: number, listingId: number): number {
    let studentSkills = query("SELECT skill_id, proficiency_weight FROM cv_skills WHERE cv_id = ?", [cvId]);
    let listingSkills = query("SELECT skill_id, importance_weight FROM listing_required_skills WHERE listing_id = ?", [listingId]);
    
    if (listingSkills.length === 0) {
        return 100.00;
    }
    
    let numerator = 0.00;
    let denominator = 0.00;
    
    for (let reqSkill of listingSkills) {
        denominator += reqSkill.importance_weight;
        let matched = studentSkills.find(s => s.skill_id === reqSkill.skill_id);
        if (matched) {
            numerator += (matched.proficiency_weight * reqSkill.importance_weight);
        }
    }
    
    return round((numerator / denominator) * 100, 2);
}

// Subroutine to calculate GPA match score
function getGpaMatchScore(gpa: number, minGpa: number | null): number {
    if (minGpa === null || minGpa === 0) {
        return 100.00;
    }
    if (gpa >= minGpa) {
        return 100.00;
    }
    return round(max(0, (gpa / minGpa) * 100), 2);
}

// Subroutine to calculate preference match score
function getPrefMatchScore(department: string, preferredDeptsStr: string | null): number {
    if (preferredDeptsStr === null || preferredDeptsStr.trim() === "") {
        return 100.00;
    }
    // Clean string and convert to array
    let depts = preferredDeptsStr.replace(/\s+/g, "").split(",");
    let cleanDept = department.trim().replace(/\s+/g, "");
    
    if (depts.includes(cleanDept)) {
        return 100.00;
    }
    return 25.00; // Baseline penalty
}
```

### 13.3.2 Main Execution Pipeline (Single Student)
```typescript
function calculateStudentRecommendations(userId: number): void {
    // 1. Fetch student attributes and CV ID
    let student = queryRow("SELECT sp.gpa, sp.department, cv.cv_id FROM student_profiles sp JOIN cvs cv ON cv.user_id = sp.user_id WHERE sp.user_id = ?", [userId]);
    if (!student) return; // Incomplete profile -> Skip
    
    // 2. Fetch algorithm parameters
    let config = queryRow("SELECT skill_weight, gpa_weight, preference_weight, min_score_threshold FROM matching_weight_configs WHERE config_id = 1");
    if (!config) return;
    
    // 3. Clear existing scores for this student
    execute("DELETE FROM recommendation_scores WHERE user_id = ?", [userId]);
    
    // 4. Fetch all active, approved, and open listings
    let activeListings = query("SELECT listing_id, min_gpa, preferred_departments FROM internship_listings WHERE status = 'PUBLISHED' AND application_deadline >= CURRENT_DATE");
    
    for (let listing of activeListings) {
        let skillScore = getSkillMatchScore(student.cv_id, listing.listing_id);
        let gpaScore = getGpaMatchScore(student.gpa, listing.min_gpa);
        let prefScore = getPrefMatchScore(student.department, listing.preferred_departments);
        
        let compositeScore = round(
            (skillScore * config.skill_weight) + 
            (gpaScore * config.gpa_weight) + 
            (prefScore * config.preference_weight), 
            2
        );
        
        // Save if score meets threshold
        if (compositeScore >= config.min_score_threshold) {
            // Fetch skill counts for metadata displays
            let skillsTotal = queryValue("SELECT COUNT(*) FROM listing_required_skills WHERE listing_id = ?", [listing.listing_id]);
            let skillsMatched = queryValue("SELECT COUNT(*) FROM listing_required_skills lrs JOIN cv_skills cs ON cs.skill_id = lrs.skill_id WHERE lrs.listing_id = ? AND cs.cv_id = ?", [listing.listing_id, student.cv_id]);
            
            execute("INSERT INTO recommendation_scores (user_id, listing_id, skill_match_score, gpa_match_score, preference_match_score, composite_score, skill_weight_used, gpa_weight_used, preference_weight_used, matched_skills_count, total_required_skills, calculated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
            [
                userId, listing.listing_id, skillScore, gpaScore, prefScore, compositeScore,
                config.skill_weight, config.gpa_weight, config.preference_weight,
                skillsMatched, skillsTotal
            ]);
        }
    }
}
```

---

## 13.4 Complexity Analysis

### 13.4.1 Time Complexity

Let:
- $U$ be the number of active student profiles.
- $L$ be the number of open internship listings.
- $K_L$ be the average number of required skills per listing.
- $K_S$ be the average number of skills on a student's CV.

For a global recalculation (updating all records):
1. **Looping**: The engine runs nested loops over all students and all listings: $U \times L$ iterations.
2. **Skill Matching**: In each iteration, evaluating skill matches involves checking student skills against listing requirements. Utilizing B-tree indexes or Hash Maps, checking skill overlap takes: $O(K_L + K_S)$ time.
3. **GPA & Preference matching**: Standard attribute compares take $O(1)$ time.

Thus, the total Time Complexity for global matching is:

$$T(U, L) = O(U \times L \times (K_L + K_S))$$

In a typical university context (e.g. $U = 1000$ active students, $L = 200$ active listings, $K_L = 5$, $K_S = 8$):
- Number of matching iterations: $1000 \times 200 = 200,000$ operations.
- This is highly performant and executes in less than 5 seconds when compiled to native database code.

### 13.4.2 Space Complexity

The system records recommendations in the `recommendation_scores` table.
- Space required scales with the number of matches that exceed the configured score threshold.
- In the worst-case scenario (all student-listing pairs exceed the threshold):

$$S(U, L) = O(U \times L)$$

For $U = 1000, L = 200$, maximum table rows is $200,000$. Standard relational tables handle this load easily (under 50 MB storage).

---

## 13.5 Optimization Strategies

To handle larger scaling requirements (e.g. $U \ge 10,000$ students), SUIMS implements the following query optimizations:

1. **Covering Indexes for Skill Joins**:
   - The index `idx_cvskills_cv_prof` on `cv_skills (cv_id, skill_id, proficiency_weight)` covers all columns needed for the skill join, eliminating the need to read data blocks from the `cv_skills` table directly.
2. **Dynamic Threshold Pruning**:
   - The engine checks minimum GPA requirements early. If a student's GPA is far below the listing's requirement (such that the GPA penalty drops the composite score below the threshold even with perfect skill scores), the loop skips the expensive skill join calculation:
     $$\text{If } (100 \times w_{\text{skill}}) + (S_{\text{gpa}} \times w_{\text{gpa}}) + (100 \times w_{\text{pref}}) < \text{Threshold} \implies \text{Skip Join}$$
3. **Event-Driven Incremental Calculations**:
   - Avoids global rebuilds. Recalculation is triggered dynamically on individual record events:
     - Student updates skills $\implies$ Recalculate for *that student only* ($O(L \times (K_L + K_S))$).
     - Company publishes listing $\implies$ Recalculate for *that listing only* ($O(U \times (K_L + K_S))$).
     - Confirmed placement finalized $\implies$ Remove scores for that student ($O(1)$).

---

## 13.6 Phase 13 — State Summary

> [!IMPORTANT]
> **Critical Decisions Carried Forward:**
> - **Mathematical Normalization**: Match scoring uses explicit formulas to normalize Skill Match, GPA Match, and Preference Match onto a consistent 0–100 scale.
> - **Efficiency Optimization**: Avoids expensive global recalculations by running incremental calculations triggered by individual record events.
> - **Pruning Rules**: Skips expensive skill table joins for candidates whose GPA is far below requirements, optimizing calculation speeds.
> - **Weight Integrity**: Sliders and database constraints enforce a strict sum of weights: $w_{\text{skill}} + w_{\text{gpa}} + w_{\text{pref}} = 1.00$.

---

✅ **Phase 13 completed.** Reply **CONTINUE** to proceed to Phase 14 (Testing Strategy), or provide feedback to revise this phase.
