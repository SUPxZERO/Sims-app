# Building Your First Figma Page
## Complete Visual Walkthrough: Student Dashboard

**Goal:** Build a complete, professional page in Figma step-by-step  
**Time:** 30 minutes  
**Difficulty:** Beginner  
**Result:** Reusable Student Dashboard template

---

## 🎯 Preview of Final Result

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT DASHBOARD PAGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Welcome back, [Name] 👋                                   │ │
│  │  Here's your internship overview                           │ │
│  │                        [Refresh Match Scores Button]       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ CV Status        │  │ Active Apps      │  │ Weeks Logged │  │
│  │ COMPLETE         │  │ 2/3              │  │ 8/12         │  │
│  │ 3 snapshots      │  │ In progress      │  │ Approved     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│  ┌──────────────────────────────┐  ┌─────────────────────────┐ │
│  │ Internship Progress (Chart)  │  │ Weekly Reports (Chart)  │ │
│  │                              │  │                         │ │
│  │    [Doughnut Chart]          │  │  [Doughnut Chart]       │ │
│  │                              │  │                         │ │
│  └──────────────────────────────┘  └─────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Top Internship Recommendations     [Find More Button]        │ │
│  │                                                              │ │
│  │ [Job Card] [Job Card] [Job Card]                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

This is what we'll build in 30 minutes!

---

## 📍 Step 1: Create the Frame (5 minutes)

### What You'll Do:
Create a container that represents one page of your application

### Step-by-Step:

1. **In Figma, on your "Pages - Student" page**
   - Click **"Frame Tool"** (press F)
   - Or: In toolbar, find the frame icon and click it

2. **Draw Your Frame**
   - Click and drag to create a rectangle
   - Size: **1440px width × 1200px height** (standard desktop)
   - This is your "canvas" for the page

3. **Rename and Style**
   - Double-click name → Type: **"Student Dashboard"**
   - Right panel → Fill color: **#030712** (Slate 950)
   - This is your background

**Result:** A 1440×1200px frame with dark background ✓

---

## 📍 Step 2: Build the Hero Section (5 minutes)

### What You'll Do:
Create the top banner with welcome message

### Step-by-Step:

1. **Create Hero Background**
   - Rectangle Tool (R)
   - Draw at top of frame: 1440px wide × 250px tall
   - Position: Top-left corner of frame
   - Fill: **#0F172A** (Slate 900)
   - Add gradient (optional): Slate 950 → Slate 900

2. **Add Gradient (Optional)**
   - With rectangle selected → Right panel → Fill
   - Click gradient icon
   - First color: #030712 (bottom)
   - Second color: #0F172A (top)
   - Drag to angle the gradient left to right

3. **Add Hero Text**
   - Text Tool (T)
   - Click inside the rectangle
   - Type: **"Welcome back, [Name] 👋"**
   - Font: 32px Bold, Slate 100 (#F1F5F9)
   - Position: Top-left with 24px padding

4. **Add Subtitle**
   - Text Tool (T)
   - Type: **"Here's your internship overview"**
   - Font: 18px Regular, Blue 200 (lighter blue)
   - Position: Below title

5. **Add Button (Top Right)**
   - Rectangle: 200px × 44px
   - Position: Top-right, with 24px padding
   - Fill: Blue 500 @ 30% opacity
   - Border: 1px Blue 400
   - Add text: "↻ Refresh Match Scores" (14px, white)
   - Border radius: 8px

**Result:** Professional hero banner with title, subtitle, and button ✓

---

## 📍 Step 3: Build KPI Cards Grid (8 minutes)

### What You'll Do:
Create 3 stat cards below the hero

### Structure:
```
┌─────────────┬─────────────┬─────────────┐
│  KPI Card 1 │  KPI Card 2 │  KPI Card 3 │
│  CV Status  │  Active Apps│  Weeks Logged
└─────────────┴─────────────┴─────────────┘
Gap: 24px between cards
Top padding: 32px from hero
```

### Step-by-Step:

1. **Create First Card Background**
   - Rectangle Tool (R)
   - Size: 400px × 200px (approx)
   - Position: 32px below hero
   - Fill: **#0F172A @ 40%** (semi-transparent)
   - Stroke: 1px **#334155** (Slate 700)
   - Border radius: **16px**
   - Shadow: Medium (from your design tokens)

2. **Add Card Content - CV Status Card**
   - Icon: Text "📄" or simple document icon
   - Label: Text "CV Status" (12px, Slate 400)
   - Value: Text "COMPLETE" (24px Bold, Green 400)
   - Detail: Text "3 snapshots saved" (14px, Slate 500)
   - Arrange vertically with 8px gaps

3. **Create Second Card - Active Applications**
   - Duplicate first card (Cmd+D)
   - Position 24px to the right
   - Update content:
     - Label: "Active Applications"
     - Value: "2 / 3"
     - Detail: "Currently in progress"
     - Icon: 💼 (briefcase)

4. **Create Third Card - Weeks Logged**
   - Duplicate second card
   - Position 24px to the right
   - Update content:
     - Label: "Weeks Logged"
     - Value: "8 / 12"
     - Detail: "Approved weekly reports"
     - Icon: ⏱️ (timer)

**Result:** 3 professional KPI cards in a row ✓

---

## 📍 Step 4: Build Chart Cards (8 minutes)

### What You'll Do:
Create 2 large cards for charts (simplified)

### Structure:
```
┌──────────────────────────────┬──────────────────────────────┐
│  Internship Progress (Chart) │  Weekly Reports (Chart)      │
│                              │                              │
│       [Doughnut Chart]       │     [Doughnut Chart]         │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
Gap: 24px between
```

### Step-by-Step:

1. **Create Left Chart Card**
   - Rectangle: 650px × 350px
   - Position: 32px below KPI cards
   - Fill: #0F172A @ 40%
   - Stroke: 1px Slate 700
   - Border radius: 16px
   - Shadow: Medium

2. **Add Chart Title**
   - Text: "Internship Progress" (20px Bold, Slate 100)
   - Position: Top-left with 24px padding

3. **Add Simple Chart Placeholder**
   - Circle: 200px diameter
   - Center it in the card
   - Fill with gradient:
     - Green 500 (50% of circle)
     - Slate 700 (remaining)
   - This represents: 8 weeks completed, 4 remaining

4. **Add Chart Legend**
   - Text: "8 of 12 weeks" (16px, centered)
   - Position: Center of circle

5. **Create Right Chart Card**
   - Duplicate left card
   - Position 24px to the right
   - Update title: "Weekly Reports Status"
   - Update circle colors for different data representation

**Result:** 2 professional chart cards with data visualization ✓

---

## 📍 Step 5: Build Recommendations Section (7 minutes)

### What You'll Do:
Create a section with job recommendations

### Structure:
```
┌────────────────────────────────────────────────────┐
│ Top Internship Recommendations    [Find More Btn]  │
│                                                     │
│ ┌──────────────────┐  ┌──────────────┐  ┌─────────┐
│ │ Job 1            │  │ Job 2        │  │ Job 3   │
│ └──────────────────┘  └──────────────┘  └─────────┘
└────────────────────────────────────────────────────┘
```

### Step-by-Step:

1. **Create Container Card**
   - Rectangle: Full width - 32px padding = 1376px
   - Height: 300px
   - Position: 32px below charts
   - Fill: #0F172A @ 40%
   - Stroke: 1px Slate 700
   - Border radius: 16px

2. **Add Section Header**
   - Text: "Top Internship Recommendations" (20px Bold)
   - Position: Top-left with 24px padding

3. **Add "Find More" Button**
   - Rectangle: 140px × 40px
   - Position: Top-right
   - Fill: Slate 700
   - Border radius: 8px
   - Text: "Find More" (14px, white)

4. **Create Job Card (First Recommendation)**
   - Rectangle: 280px × 200px (inside the container)
   - Fill: Slate 800 @ 30%
   - Border: 1px Slate 700 @ 50%
   - Border radius: 12px
   - Add content:
     - Title: "Senior Frontend Engineer" (16px Bold)
     - Company: "Tech Corp" (14px, Slate 400)
     - Match Score: "85%" (in a circular badge)
     - Button: "Apply" (12px)

5. **Create Job Cards 2 & 3**
   - Duplicate Job Card 1
   - Position side-by-side with 12px gaps
   - Update company and title text

**Result:** Professional recommendations section ✓

---

## 📍 Step 6: Add Visual Polish (5 minutes)

### What You'll Do:
Make everything look polished and professional

### Step-by-Step:

1. **Add Shadows to All Cards**
   - Select each card
   - Right panel → Design → Effects → Shadow
   - Apply Medium shadow to all cards
   - This gives depth

2. **Ensure Proper Spacing**
   - 32px margins from edges
   - 24px gaps between sections
   - 24px padding inside cards

3. **Check Color Consistency**
   - All backgrounds: Slate 950 or Slate 900 @ 40%
   - All borders: Slate 700 @ 60%
   - All text: Slate 100 or 300
   - All accents: Blue 600 (buttons)

4. **Add Hover States (Optional)**
   - Duplicate the entire dashboard
   - Change card fills to Slate 800 @ 50% (lighter)
   - Change borders to Slate 700 @ 80%
   - This shows what it looks like on hover
   - Create as variant: "Hover"

5. **Group Everything**
   - Select all elements (Cmd+A)
   - Group them (Cmd+G)
   - Name it: "Student Dashboard - Content"
   - This keeps things organized

**Result:** Professional, polished page ✓

---

## 📍 Step 7: Create Loading State Version (3 minutes)

### What You'll Do:
Create a skeleton loading version of the same page

### Step-by-Step:

1. **Duplicate Your Entire Page**
   - Ctrl+A to select all
   - Cmd+D to duplicate
   - Move to the right
   - Rename: "Student Dashboard - Loading"

2. **Replace Cards with Skeletons**
   - For each card:
     - Change fill to Slate 800 @ 50%
     - Remove all text
     - Remove shadows (or keep subtle)
     - Add pulsing animation effect (visual indication of loading)

3. **Add Skeleton Elements**
   - For KPI cards: Add 2-3 skeleton bars (200px × 12px, gray)
   - For chart cards: Large circle placeholder (200px)
   - For job cards: 3 skeleton bars

4. **Mark as Loading State**
   - Add label: "LOADING STATE" (text)
   - Position at top-left corner
   - This clearly indicates it's a loading state

**Result:** Complete loading skeleton page ✓

---

## 🎨 Color Reference (Copy-Paste These)

### Backgrounds
```
Main Background:     #030712 (Slate 950)
Card Background:     #0F172A (Slate 900)
Card Fill:           #0F172A @ 40% opacity (Slate 900 semi-transparent)
Hover State:         #1E293B (Slate 800)
```

### Text
```
Primary Text:        #F1F5F9 (Slate 100)
Secondary Text:      #CBD5E1 (Slate 300)
Tertiary Text:       #94A3B8 (Slate 400)
Disabled Text:       #64748B (Slate 500)
```

### Borders
```
Default Border:      #334155 (Slate 700) @ 60%
Focus Border:        #2563EB (Blue 600) @ 100%
```

### Accents
```
Primary Button:      #2563EB (Blue 600)
Button Hover:        #1D4ED8 (Blue 700)
Success:             #10B981 (Green 500)
Warning:             #EAB308 (Yellow 500)
Error:               #EF4444 (Red 500)
```

---

## ✅ Step-by-Step Size Cheat Sheet

### Frame
- Width: **1440px**
- Height: **1200px** (adjust as needed)
- Background: **#030712**

### Hero Section
- Width: **1440px**
- Height: **250px**
- Position: **Top (0, 0)**

### KPI Cards (Each)
- Width: **~400px**
- Height: **200px**
- Gap: **24px**
- Padding from hero: **32px**
- 3 cards in a row

### Chart Cards (Each)
- Width: **~650px**
- Height: **350px**
- Gap: **24px**
- Padding from KPIs: **32px**
- 2 cards in a row

### Job Cards (Each)
- Width: **~280px**
- Height: **200px**
- Gap: **12px**
- Inside container: 3 in a row

### Button (Standard)
- Width: **140-200px**
- Height: **40-44px**
- Border radius: **8px**

### Card Corners
- Border radius: **16px** (large cards)
- Border radius: **12px** (nested cards)
- Border radius: **8px** (buttons/inputs)

---

## 🎯 Verification Checklist

When you're done, verify:

- [ ] Hero section at top with title, subtitle, button
- [ ] 3 KPI cards in a row below hero
- [ ] 2 chart cards below KPIs
- [ ] Job recommendations section at bottom
- [ ] All cards have subtle shadows
- [ ] All colors match design spec
- [ ] Spacing is consistent (32px margins, 24px gaps)
- [ ] All text is readable (good contrast)
- [ ] Loading state version created
- [ ] Everything is grouped and named

---

## 🎓 Key Principles While Building

1. **Use Your Design Tokens**
   - Reference the color styles you created
   - Don't hardcode colors
   - Click and use `Color/Slate/900`, etc.

2. **Organize as You Go**
   - Name each element
   - Group related elements
   - Use descriptive names like "Hero - Title" not "Text 1"

3. **Be Precise**
   - Use exact pixel values
   - Align to 8px grid
   - Check spacing with rulers

4. **Consistency**
   - Same colors throughout
   - Same padding/margin amounts
   - Same font sizes for same types

5. **Reuse Components**
   - Don't recreate cards
   - Duplicate and modify
   - Use components for buttons

---

## 🚀 What You'll Have After This

**Student Dashboard Page** with:
- ✓ Professional hero section
- ✓ 3 KPI stat cards
- ✓ 2 chart visualization cards
- ✓ Recommendations section
- ✓ Loading state skeleton
- ✓ Professional styling
- ✓ Proper spacing and alignment
- ✓ Reusable structure

**Time Spent:** ~30 minutes  
**Result:** Production-ready page template  
**Next:** Use same process for other pages  

---

## 💡 Pro Tips

1. **Use Shift+Click** to add to selection instead of Ctrl+A
2. **Double-click** to edit text content
3. **Cmd+Z** to undo if you make mistakes
4. **V key** to switch back to selection tool
5. **Cmd+G** to group selected elements
6. **Cmd+D** to duplicate (way faster than copy-paste)
7. **View → Show Layout Grid** to see 8px grid
8. **Right-click → "Copy as SVG"** to export elements

---

## 🎉 What's Next

Once you complete the Student Dashboard page:

1. **Create Other Pages** - Repeat for Find Jobs, Company Dashboard, etc.
2. **Add Interactive Prototype** - Link buttons to other pages
3. **Create Variants** - Add hover/loading states
4. **Share with Team** - Get feedback
5. **Iterate** - Refine based on feedback

---

## 📞 If You Get Stuck

**Issue:** Card isn't showing colors right  
**Solution:** Make sure fill is set (not just stroke), check opacity

**Issue:** Text is hard to read  
**Solution:** Make sure background is dark and text is light (#F1F5F9)

**Issue:** Elements not aligned  
**Solution:** Turn on layout grid (View → Show layout grid)

**Issue:** Spacing looks off  
**Solution:** Check that gaps are exactly 24px, padding is 32px or 24px

**Issue:** Colors don't match spec  
**Solution:** Use the exact hex values from FIGMA_DESIGN_SPECIFICATION.md

---

## 🎨 Building Multiple Pages

Once you master the Student Dashboard, the process is the same for:
- **Find Jobs** - Similar layout, different content
- **Company Dashboard** - Same structure, different KPIs
- **Admin Dashboard** - 4 KPIs instead of 3
- **Lecturer Dashboard** - Role-specific layout

Each page uses:
- Same hero section pattern
- Same card pattern
- Same spacing rules
- Same colors

---

**Time to Build:** 30 minutes  
**Skill Level:** Beginner-Intermediate  
**Result:** Professional page template  
**Complexity:** Medium  

You've got this! Let's build something amazing! 🚀🎨

---

## 📸 Visual Summary

```
FINAL STUDENT DASHBOARD PAGE

┌─────────────────────────────────────────────────────────┐
│ [HERO SECTION: Welcome Title + Button]                  │
├─────────────────────────────────────────────────────────┤
│ [KPI CARD]  [KPI CARD]  [KPI CARD]                      │
├─────────────────────────────────────────────────────────┤
│ [CHART CARD]                [CHART CARD]                 │
├─────────────────────────────────────────────────────────┤
│ [JOB CARD] [JOB CARD] [JOB CARD]                        │
├─────────────────────────────────────────────────────────┤
│ [APPLICATIONS TABLE OR ADDITIONAL CONTENT]              │
└─────────────────────────────────────────────────────────┘

All with:
✓ Professional styling
✓ Proper spacing (8px grid)
✓ Consistent colors (design tokens)
✓ Smooth shadows
✓ Accessible contrast
✓ Mobile-responsive structure

Ready to replicate for other pages!
```

---

**Ready to build?** Start with the frame, add hero, then build section by section. You'll have a complete page in 30 minutes! 🚀
