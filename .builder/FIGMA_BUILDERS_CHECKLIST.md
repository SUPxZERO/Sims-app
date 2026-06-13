# Figma Builder's Checklist
## Complete Step-by-Step Execution Guide

**Goal:** Build a complete Figma design system in 2.5-3 hours  
**Difficulty:** Beginner-Intermediate  
**Status:** Ready to Execute

---

## 🎯 Pre-Flight Checklist

Before you start, verify you have:

- [ ] Figma account (free tier is fine) - Go to figma.com
- [ ] This checklist open in another tab
- [ ] FIGMA_DESIGN_SPECIFICATION.md ready for reference
- [ ] FIGMA_SETUP_GUIDE.md open for detailed instructions
- [ ] ~3 hours available without interruptions
- [ ] Coffee/tea ☕
- [ ] Comfortable workspace

---

## ⏱️ Phase 1: Design Tokens (30 minutes)

### Step 1.1: Create Figma File ✓

**What to do:**
1. Go to https://www.figma.com
2. Click **"New file"** button (top-right)
3. Name it: **"Internship Platform - Design System v1"**
4. Wait for it to load

**Time:** 2 minutes

### Step 1.2: Create First Page ✓

**What to do:**
1. You should be on the "Page 1" by default
2. Rename it: Right-click on "Page 1" → Click "Rename" → Type "Design Tokens"
3. Or just double-click the name to edit

**Result:** A page named "Design Tokens" created

**Time:** 1 minute

### Step 1.3: Add Color Swatches ✓

**What to do:**

1. **Create Slate Colors Grid**
   - Select Rectangle Tool (press R)
   - Draw a rectangle (100px × 100px)
   - Fill color: #030712 (Slate 950)
   - Add text below: "Slate 950"
   - Duplicate it 9 times (Cmd+D or Ctrl+D)
   - Change each to:
     - #0F172A (Slate 900)
     - #1E293B (Slate 800)
     - #334155 (Slate 700)
     - #475569 (Slate 600)
     - #64748B (Slate 500)
     - #94A3B8 (Slate 400)
     - #CBD5E1 (Slate 300)
     - #E2E8F0 (Slate 200)
     - #F1F5F9 (Slate 100)

2. **Create Blue Colors Grid**
   - Repeat above for Blue colors:
     - #1E40AF (Blue 900)
     - #1D4ED8 (Blue 800)
     - #2563EB (Blue 600) ← Primary
     - #3B82F6 (Blue 500)
     - #60A5FA (Blue 400)
     - #93C5FD (Blue 300)

3. **Create Accent Colors**
   - Green: #10B981 (success)
   - Red: #EF4444 (error)
   - Yellow: #EAB308 (warning)
   - Teal: #14B8A6 (info)

**Result:** Visual color palette ready

**Time:** 10 minutes

### Step 1.4: Create Color Styles ✓

**What to do:**

For each color swatch:
1. Click on the rectangle
2. Go to right panel → Find "Assets" (or press Shift+A)
3. Click the **"+"** next to "Colors"
4. Right-click on the color in the fill section → **"Create color style"**
5. Name it: `Color/Slate/950`, `Color/Slate/900`, etc.

**Repeat for all colors:**
```
Color/Slate/950    → #030712
Color/Slate/900    → #0F172A
Color/Slate/800    → #1E293B
Color/Slate/700    → #334155
Color/Slate/600    → #475569
Color/Slate/500    → #64748B
Color/Slate/400    → #94A3B8
Color/Slate/300    → #CBD5E1
Color/Slate/200    → #E2E8F0
Color/Slate/100    → #F1F5F9

Color/Blue/900     → #1E40AF
Color/Blue/800     → #1D4ED8
Color/Blue/600     → #2563EB (primary action)
Color/Blue/500     → #3B82F6
Color/Blue/400     → #60A5FA
Color/Blue/300     → #93C5FD

Color/Green/500    → #10B981 (success)
Color/Red/500      → #EF4444 (error)
Color/Yellow/500   → #EAB308 (warning)
Color/Teal/500     → #14B8A6 (info)
```

**Result:** All colors as reusable styles in Assets panel

**Time:** 12 minutes

### Step 1.5: Create Typography Styles ✓

**What to do:**

1. **Create Display 1 Text**
   - Select Text Tool (press T)
   - Click to create text
   - Type: "Display 1 - 48px Bold"
   - In right panel → change Font size to 48
   - Font weight: Bold (700)
   - Line height: 56px
   - Right-click → "Create text style"
   - Name: `Text/Display/1`

2. **Repeat for all typography:**

```
Text/Display/1      → 48px Bold, line-height: 56px
Text/Display/2      → 36px Bold, line-height: 44px
Text/Heading/1      → 32px Bold, line-height: 40px
Text/Heading/2      → 28px Semibold, line-height: 36px
Text/Heading/3      → 24px Semibold, line-height: 32px
Text/Heading/4      → 20px Semibold, line-height: 28px
Text/Body/Large     → 18px Regular, line-height: 28px
Text/Body           → 16px Regular, line-height: 24px
Text/Body/Small     → 14px Regular, line-height: 20px
Text/Label/Large    → 14px Medium, line-height: 20px
Text/Label          → 12px Medium, line-height: 16px
Text/Caption        → 11px Regular, line-height: 16px
```

**Result:** All typography as reusable styles

**Time:** 8 minutes

### Step 1.6: Create Shadow Styles ✓

**What to do:**

1. Create a rectangle (50px × 50px)
2. In right panel → Find "Design" section
3. Click "+" next to "Effects"
4. Select "Shadow"
5. Set values:

```
Subtle:  X:0, Y:4, Blur:6, Spread:0, Color:#000000, Opacity:10%
Medium:  X:0, Y:10, Blur:15, Spread:0, Color:#000000, Opacity:20%
Large:   X:0, Y:20, Blur:25, Spread:0, Color:#000000, Opacity:30%
```

6. Right-click shadow → "Create effect style"
7. Name: `Shadow/Subtle`, `Shadow/Medium`, `Shadow/Large`

**Result:** All shadows as reusable styles

**Time:** 5 minutes

---

## 🎨 Phase 2: Core Components (45 minutes)

### Step 2.1: Create Components Page ✓

**What to do:**

1. Create new page: Right-click on "Design Tokens" → "New page"
2. Name it: **"Components"**

**Time:** 1 minute

### Step 2.2: Build Button Component ✓

**Primary Button - Default State:**

1. **Create Rectangle**
   - Size: 120px × 44px
   - Fill: Use `Color/Blue/600` style
   - Border radius: 8px
   - No stroke

2. **Add Button Text**
   - Text tool (T)
   - Type: "Button"
   - Font: 16px Medium
   - Color: White
   - Center align

3. **Create Component**
   - Select both text and rectangle (Cmd+A or Ctrl+A)
   - Group them (Cmd+G or Ctrl+G)
   - Right-click → **"Create component"**
   - Name: `Button/Primary`

4. **Add Variants**
   - Right-click component → "Edit main component"
   - In top panel, click the component name
   - Click "+" icon to add variant properties
   - Add property: "State"
   - Add values: Default, Hover, Focus, Disabled, Loading

5. **Create Variant: Hover**
   - Duplicate the button (Cmd+D)
   - Change fill to Blue 700 (#1D4ED8)
   - Add drop shadow: Medium
   - Set variant property to "Hover"

6. **Create Variant: Disabled**
   - Duplicate the button
   - Change opacity to 50%
   - Set variant property to "Disabled"

7. **Create Variant: Loading**
   - Duplicate the button
   - Text changes to "Loading..."
   - Add spinner icon (you can use a simple SVG or emoji ⟳)

**Secondary Button:**
- Repeat steps above but use `Color/Slate/700` for fill
- Name: `Button/Secondary`

**Danger Button:**
- Repeat steps above but use `Color/Red/600` for fill
- Name: `Button/Danger`

**Result:** 3 button components with multiple variants

**Time:** 15 minutes

### Step 2.3: Build Input Component ✓

**Text Input - Default:**

1. **Create Rectangle (Input background)**
   - Size: 280px × 40px
   - Fill: Slate 800 @ 50% (use #1E293B)
   - Stroke: 1px Slate 700 (#334155)
   - Border radius: 8px

2. **Add Placeholder Text**
   - Text: "Placeholder text"
   - Font: 14px Regular
   - Color: Slate 400 (#94A3B8)
   - Padding: 10px left

3. **Group and Create Component**
   - Group all elements
   - Right-click → "Create component"
   - Name: `Input/Text`

4. **Create Variants:**
   - Focus: Border color Blue 400, add blue ring
   - Error: Border Red 500, add error text below
   - Disabled: Opacity 50%

**Result:** Input component with variants

**Time:** 10 minutes

### Step 2.4: Build Badge Component ✓

**Success Badge:**

1. **Create Background Rectangle**
   - Rounded pill: 24px height
   - Fill: Green 500 @ 20% (rgba(16, 185, 129, 0.2))
   - Stroke: 1px Green 500 @ 30%
   - Padding: 6px horizontal, 6px vertical

2. **Add Badge Text**
   - Text: "Success"
   - Font: 12px Medium
   - Color: Green 400 (#4ade80)
   - Center aligned

3. **Create Component**
   - Group all
   - Right-click → "Create component"
   - Name: `Badge/Success`

4. **Create Other Variants:**
   - Badge/Primary (Blue)
   - Badge/Warning (Yellow)
   - Badge/Danger (Red)
   - Badge/Info (Teal)

**Result:** Badge components for all states

**Time:** 8 minutes

### Step 2.5: Build Card Component ✓

**Glass Card:**

1. **Create Background Rectangle**
   - Size: 400px × 300px
   - Fill: Slate 900 @ 40% (#0F172A)
   - Stroke: 1px Slate 800 @ 60% (#1E293B)
   - Border radius: 16px
   - Apply shadow: Medium

2. **Add Content Area**
   - Inner rectangle with padding
   - Add sample heading + text

3. **Create Component**
   - Group all
   - Right-click → "Create component"
   - Name: `Card/Glass`

4. **Create Hover Variant**
   - Duplicate
   - Border: Lighter
   - Shadow: Larger
   - Set variant to "Hover"

**Result:** Card component with hover state

**Time:** 7 minutes

### Step 2.6: Build Modal Component ✓

**Modal Dialog:**

1. **Create Overlay Background**
   - Frame: 1440px × 900px
   - Fill: Slate 900 @ 80%
   - Add blur effect

2. **Create Modal Container**
   - Rectangle: 500px × 600px
   - Fill: Slate 800 (#1E293B)
   - Stroke: 1px Slate 700
   - Border radius: 16px
   - Shadow: Large
   - Centered on overlay

3. **Add Modal Header**
   - Rectangle: 500px × 56px
   - Fill: Slate 800 @ 50%
   - Border bottom: 1px Slate 700
   - Add title text + close button (X)

4. **Add Modal Content**
   - Rectangle below header
   - Fill: Slate 900 @ 20%
   - Padding: 24px
   - Height: Remaining space

5. **Create Component**
   - Group all
   - Right-click → "Create component"
   - Name: `Modal/Medium`

6. **Create Size Variants**
   - Modal/Small (400px wide)
   - Modal/Large (800px wide)

**Result:** Modal components for different sizes

**Time:** 8 minutes

### Step 2.7: Build Table Component ✓

**Table Header:**

1. **Create Header Row**
   - Rectangle: 800px × 48px
   - Fill: Slate 900 @ 50%
   - Border bottom: 1px Slate 800
   - Add 4 column headers: "Column", "Status", "Date", "Action"
   - Font: 12px Medium, Slate 400

2. **Create Table Row**
   - Rectangle: 800px × 48px
   - Fill: Slate 900 @ 20%
   - Border bottom: 1px Slate 800 @ 50%
   - Add sample data

3. **Create Components**
   - Group header → `Table/Header`
   - Group row → `Table/Row`

4. **Create Row Variant: Hover**
   - Duplicate row
   - Fill: Slate 800 @ 30%
   - Set variant to "Hover"

**Result:** Table components

**Time:** 7 minutes

### Step 2.8: Build Skeleton Components ✓

**Skeleton Bar:**

1. Create rectangle: 200px × 16px
2. Fill: Slate 800 @ 50%
3. Border radius: 8px
4. Right-click → "Create component"
5. Name: `Skeleton/Bar`

**Skeleton Card:**

1. Rectangle: 400px × 300px
2. Fill: Slate 800 @ 50%
3. Add multiple skeleton bars inside
4. Create component: `Skeleton/Card`

**Skeleton Row:**

1. Rectangle: 800px × 48px
2. Fill: Slate 800 @ 50%
3. Create component: `Skeleton/Row`

**Result:** Skeleton components

**Time:** 5 minutes

---

## 📄 Phase 3: Page Templates (45 minutes)

### Step 3.1: Create Student Dashboard ✓

**Setup:**

1. Create new page: "Pages - Student"
2. Create frame: 1440px × 1200px
3. Fill: Slate 950
4. Name: "Student Dashboard"

**Build Structure:**

1. **Hero Section (Top)**
   - Use Card component or create rectangle
   - Size: Full width × 250px
   - Background gradient: Slate 950 → Slate 900
   - Add title: "Welcome back, [Name] 👋"
   - Add subtitle: "Here's your internship overview"
   - Optional: Add refresh button

2. **KPI Cards (3 columns)**
   - Copy `Card/Glass` component 3 times
   - Arrange in grid (24px gap)
   - Add content to each:
     - Card 1: CV Status (icon + value + detail)
     - Card 2: Active Applications (2/3)
     - Card 3: Weeks Logged (8/12)

3. **Analytics Charts (2 columns)**
   - Copy `Card/Glass` 2 times
   - Left: Doughnut chart placeholder
   - Right: Doughnut chart placeholder

4. **Upcoming Interviews Section**
   - Container with 3 interview cards
   - Each: Company + Position + Date + Button

5. **Bottom Section (2 columns)**
   - Left: "Top Recommendations" with job cards
   - Right: "Active Applications Pipeline" with table

**Result:** Complete Student Dashboard template

**Time:** 15 minutes

### Step 3.2: Create Find Jobs Page ✓

**Build:**

1. New frame: 1440px × 1200px, name "Find Jobs"

2. **Hero Section**
   - Title: "Find Internships"
   - Subtitle: "Discover and apply..."
   - Button: "Refresh Match Scores"

3. **Filter Section**
   - Use Card component
   - Add Input (search)
   - Add Dropdown (work mode)

4. **Job Cards Grid (3 columns)**
   - Use `Card/Glass` component 6 times
   - Content for each:
     - Title + Save icon
     - Company name
     - Match score circle (60%)
     - Badges: Work mode, Location
     - Apply button

5. **Loading State** (separate frame)
   - Same layout but with skeleton cards
   - 6 `Skeleton/Card` components

**Result:** Find Jobs page template + loading state

**Time:** 12 minutes

### Step 3.3: Create Company Dashboard ✓

Similar structure to Student Dashboard:
1. Hero section
2. 3 KPI cards (different data)
3. 2 chart cards
4. Listings overview table

**Result:** Company Dashboard template

**Time:** 12 minutes

### Step 3.4: Create Admin Dashboard ✓

Similar structure but with:
1. 4 KPI cards (instead of 3)
2. 3 chart sections
3. Recent activity table

**Result:** Admin Dashboard template

**Time:** 6 minutes

---

## 🔗 Phase 4: Interactive Prototype (30 minutes)

### Step 4.1: Set Up Prototype Page ✓

1. Create new page: "Prototype - User Flows"
2. Copy key screens from page templates:
   - Login screen (create simple version)
   - Student Dashboard
   - Find Jobs page
   - Job Details modal
   - Applications page

**Time:** 5 minutes

### Step 4.2: Create User Flow Links ✓

**Flow 1: Dashboard to Find Jobs**

1. On Student Dashboard frame, select "Find More" button
2. Right side panel → "Prototype" tab
3. Click and drag to "Find Jobs" frame
4. Set:
   - Interaction: Click
   - Animation: Smart animate
   - Duration: 300ms
   - Easing: ease-out

**Flow 2: Find Jobs to Job Details**

1. Select a job card on Find Jobs
2. Right panel → Prototype
3. Drag to Job Details modal
4. Set: Smart animate, 300ms

**Flow 3: Apply Button**

1. Select Apply button on Job Details
2. Link to a success message frame
3. Set: Smart animate, 300ms

**Repeat for other key interactions:**
- View Applications
- Application Details
- User Management flows

**Result:** Interactive prototype ready to demo

**Time:** 25 minutes

---

## 📚 Phase 5: Documentation (15 minutes)

### Step 5.1: Create Documentation Page ✓

1. New page: "Documentation"

2. **Add Sections:**
   - Color palette (reference)
   - Typography scale
   - Spacing system (8px grid)
   - Component guidelines
   - Animation specs
   - File structure

3. **Format:**
   - Use text and shapes to document
   - Add examples
   - Include hex values

**Result:** Self-documenting design system

**Time:** 15 minutes

---

## ✅ Final Checklist

### Verification Steps

Go through each section and verify:

**Design Tokens ✓**
- [ ] Colors created and styled (19 colors)
- [ ] Typography created and styled (12 text styles)
- [ ] Shadows created and styled (3 shadow styles)
- [ ] All in Assets panel

**Components ✓**
- [ ] Button component with variants (Primary, Secondary, Danger)
- [ ] Input component with variants (Default, Focus, Error, Disabled)
- [ ] Badge component with variants (All 5 types)
- [ ] Card component with Hover variant
- [ ] Modal components (3 sizes)
- [ ] Table components (Header, Row with Hover)
- [ ] Skeleton components (Bar, Card, Row)

**Pages ✓**
- [ ] Student Dashboard (Hero + KPIs + Charts + Interviews + Bottom section)
- [ ] Find Jobs (Hero + Filter + Job cards × 6 + Loading state)
- [ ] Company Dashboard
- [ ] Admin Dashboard
- [ ] Lecturer Dashboard

**Prototype ✓**
- [ ] Key screens set up
- [ ] Links created between screens
- [ ] Smart animate applied
- [ ] All interactions tested

**Documentation ✓**
- [ ] Design specs documented
- [ ] Colors listed
- [ ] Typography documented
- [ ] Exported or shareable

---

## 🎓 Time Tracking

Track your progress:

```
Phase 1: Design Tokens        [████████] 30 min
Phase 2: Core Components      [████████] 45 min
Phase 3: Page Templates       [████████] 45 min
Phase 4: Interactive Prototype [████████] 30 min
Phase 5: Documentation        [████████] 15 min
                                    Total: 2.5 hours
```

---

## 🚀 Pro Tips While Building

1. **Save Often** - Cmd+S (Mac) or Ctrl+S (Windows)
2. **Use Shortcuts:**
   - R = Rectangle tool
   - T = Text tool
   - A = Selection tool
   - Cmd+G / Ctrl+G = Group
   - Cmd+D / Ctrl+D = Duplicate
3. **Organize as you go** - Group related elements
4. **Name everything** - Makes handoff easier
5. **Use Auto-layout** - Makes responsive design easier

---

## ❌ Common Issues & Solutions

**Issue:** Component not showing correctly  
**Solution:** Make sure fill color is set (not just stroke)

**Issue:** Text is hard to read  
**Solution:** Check color contrast; use Slate 100 for primary text

**Issue:** Layout looks misaligned  
**Solution:** Turn on layout grid (View → Show layout grid)

**Issue:** Prototype links not working  
**Solution:** Make sure both frames are on same page, use Prototype tab

**Issue:** Colors look wrong  
**Solution:** Use hex codes directly (#2563EB) not approximations

---

## 📊 Success Criteria

You'll know you're done when:

✅ All 19 colors are in Assets as styles  
✅ All 12 text styles are in Assets  
✅ All components are built with variants  
✅ All 5 pages are templated  
✅ Prototype links work and animate smoothly  
✅ File is organized and named properly  
✅ Documentation is complete  
✅ You can share the link with your team  

---

## 🎉 Completion!

Once you finish:

1. **Share the Figma Link**
   - Top right → Share
   - Get link
   - Copy and share with team

2. **Get Feedback**
   - Gather team input
   - Note changes needed
   - Iterate quickly

3. **Use for Development**
   - Developers reference Figma
   - Keep React code in sync
   - Update both together

4. **Maintain Going Forward**
   - Add new components as needed
   - Update existing components
   - Keep documentation current

---

## 📞 Need Help?

If you get stuck:

1. Check FIGMA_SETUP_GUIDE.md for detailed instructions
2. Reference FIGMA_DESIGN_SPECIFICATION.md for specs
3. Look at Figma help: https://help.figma.com
4. Search YouTube for specific tutorials

---

## 🎨 Ready to Build?

**You have everything you need:**
- ✅ All specifications documented
- ✅ Step-by-step instructions
- ✅ Color values ready to copy
- ✅ Component structure defined
- ✅ Page layouts designed
- ✅ Prototype flows mapped

**Let's go create something amazing!** 🚀

---

**Checklist Version:** 1.0  
**Last Updated:** June 2024  
**Estimated Time:** 2.5 hours  
**Difficulty:** Beginner-Intermediate  
**Status:** Ready to Execute ✨
