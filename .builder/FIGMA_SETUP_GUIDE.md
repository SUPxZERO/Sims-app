# Figma Setup Guide
## Step-by-Step Instructions to Build Your Design System & Prototype

---

## 📍 Getting Started

### What You'll Need
- Figma account (free tier is fine)
- This design specification document
- Color palette reference
- ~2-3 hours to complete

### File Structure
We'll create a single Figma file with 8-10 pages for maximum organization and reusability.

---

## Phase 1: Design Tokens (30 minutes)

### Step 1.1: Create Figma File

1. Go to **figma.com** and log in
2. Click **"New file"**
3. Name it: **"Internship Platform - Design System v1"**
4. Create a new page named **"Design Tokens"**

### Step 1.2: Set Up Color Palette

On the "Design Tokens" page:

1. **Create Color Swatches**
   - Use rectangle tool (R)
   - Create 9 colors in a grid
   - Label: Slate 950, 900, 800, 700, 600, 500, 400, 300, 200, 100

2. **Add Color Styles**
   - Click "Assets" → "+" next to "Colors"
   - For each color:
     - Select shape
     - Right-click → "Create color style"
     - Name: `Color/Slate/950`, `Color/Slate/900`, etc.
     - Fill with hex: #030712, #0F172A, #1E293B, etc.

3. **Repeat for Accent Colors**
   - Create Blue colors: 900, 800, 700, 600, 500, 400, 300
   - Create Green, Red, Yellow, Teal colors

### Step 1.3: Set Up Typography

1. **Create Text Styles**
   - Select text tool (T)
   - Create sample text with each size:

   ```
   Display 1 (48px bold)
   Display 2 (36px bold)
   Heading 1 (32px bold)
   Heading 2 (28px semibold)
   Heading 3 (24px semibold)
   Body Large (18px regular)
   Body (16px regular)
   Body Small (14px regular)
   Label (12px medium)
   Caption (11px regular)
   ```

2. **Create Text Styles**
   - Select each text element
   - Right-click → "Create text style"
   - Name: `Text/Display/1`, `Text/Heading/3`, `Text/Body`, `Text/Label`, etc.

### Step 1.4: Create Shadow Styles

1. **Add Shadow Effects**
   - Rectangle tool → Create small square
   - In right panel → "Design" → "Effects" → "+"
   - Create shadows:

   ```
   Subtle:   X:0, Y:4, Blur:6, Spread:0, Color:#000 10%
   Medium:   X:0, Y:10, Blur:15, Spread:0, Color:#000 20%
   Large:    X:0, Y:20, Blur:25, Spread:0, Color:#000 30%
   ```

   - Right-click → Create effect style
   - Name: `Shadow/Subtle`, `Shadow/Medium`, `Shadow/Large`

### Step 1.5: Create Layout Grid

1. **Set Up Spacing Grid**
   - Board → Select → Right panel
   - Click "Layout grid" icon
   - Type: Grid
   - Count: 10
   - Gutter: 8px

This helps maintain 8px grid alignment throughout.

---

## Phase 2: Core Components (45 minutes)

### Step 2.1: Create Buttons

1. **Create a new page: "Components - Buttons"**

2. **Primary Button (Default State)**
   - Rectangle tool (R)
   - Size: 120px × 44px
   - Fill: Blue 600 (#2563EB)
   - Corner radius: 8px
   - Add text: "Button" (16px, medium, white)
   - Group: Cmd+G
   - Right-click → Create component
   - Name: `Button/Primary`

3. **Add Variants**
   - Right-click component → "Edit main component"
   - Click "+" next to component name in assets
   - Add properties:
     - State: Default, Hover, Focus, Disabled
     - Size: sm, md, lg
     - Variant: Primary, Secondary, Danger

4. **Create Variants**
   - For each combination:
     - Duplicate component
     - Change colors and sizing
     - Set variant properties
   
   **Button sizes:**
   ```
   sm:  96px × 36px, 12px text
   md:  120px × 44px, 14px text
   lg:  144px × 52px, 16px text
   ```

5. **Secondary Button**
   - Copy primary button
   - Change fill to Slate 700
   - Create as new component: `Button/Secondary`
   - Add variants

6. **Danger Button**
   - Copy primary button
   - Change fill to Red 600
   - Create as new component: `Button/Danger`
   - Add variants

### Step 2.2: Create Input Fields

1. **Create a new section on this page**

2. **Text Input (Default)**
   - Rectangle: 280px × 40px
   - Fill: Slate 800 @ 50%
   - Stroke: 1px Slate 700
   - Corner radius: 8px
   - Add text inside: "Placeholder text" (14px, Slate 400)
   - Group and create component: `Input/Text`

3. **Input Variants**
   - Default (above)
   - Focus: Border Blue 400, add 2px blue ring @ 30%
   - Error: Border Red 500, add error text below
   - Disabled: Opacity 50%

### Step 2.3: Create Badges

1. **Success Badge**
   - Pill-shaped background: Green 500 @ 20%
   - Border: 1px Green 500 @ 30%
   - Text: Green 400
   - Size: 24px height, auto width
   - Create component: `Badge/Success`

2. **Other Badge Types**
   - Primary (Blue)
   - Warning (Yellow)
   - Danger (Red)
   - Info (Teal)

### Step 2.4: Create Card Component

1. **Glass Card**
   - Rectangle: 400px × 300px
   - Fill: Slate 900 @ 40%
   - Stroke: 1px Slate 800 @ 60%
   - Corner radius: 16px
   - Effects: Blur 16px (use a background layer)
   - Padding: 24px
   - Add shadow: Medium
   - Create component: `Card/Glass`

2. **Variants**
   - Default
   - Hover (lighter border, larger shadow)

### Step 2.5: Create Modal

1. **Modal Background/Overlay**
   - Full frame background: Slate 900 @ 80% with blur

2. **Modal Dialog**
   - Rectangle: 500px × 600px
   - Fill: Slate 800
   - Border: 1px Slate 700
   - Corner radius: 16px
   - Add shadow: Large

3. **Modal Header**
   - Rectangle: 500px × 56px (part of modal)
   - Fill: Slate 800 @ 50%
   - Border bottom: 1px Slate 700
   - Add title text + close button

4. **Modal Content**
   - Remaining space below header
   - Fill: Slate 900 @ 20%
   - Padding: 24px

5. **Create Component: `Modal/Base`**
   - Add size variants: sm (400px), md (500px), lg (800px)

### Step 2.6: Create Table

1. **Table Header Row**
   - Rectangle: 800px × 48px
   - Fill: Slate 900 @ 50%
   - Border bottom: 1px Slate 800
   - Add 4 text columns: "Column 1", "Column 2", "Column 3", "Actions"
   - Font: 12px, medium, Slate 400

2. **Table Body Row**
   - Rectangle: 800px × 48px
   - Fill: Slate 900 @ 20%
   - Border bottom: 1px Slate 800 @ 50%
   - Add sample data in columns
   - Font: 14px, regular, Slate 300

3. **Create Components**
   - `Table/Header`
   - `Table/Row` (with default and hover variants)

4. **Assemble Table**
   - Header + 5 rows = complete table component
   - Group as: `Table/Standard`

### Step 2.7: Create Skeleton Loaders

1. **Skeleton Bar**
   - Rectangle: 200px × 16px
   - Fill: Slate 800 @ 50%
   - Corner radius: 8px
   - Add animation: Pulse effect (opacity 0.5 to 1.0)
   - Create component: `Skeleton/Bar`

2. **Skeleton Card**
   - Rectangle: 400px × 300px (matching Card size)
   - Fill: Slate 800 @ 50%
   - Corner radius: 16px
   - Add multiple skeleton bars inside (title, text lines)
   - Create component: `Skeleton/Card`

3. **Skeleton Row**
   - Rectangle: 800px × 48px
   - Fill: Slate 800 @ 50%
   - Corner radius: 8px
   - Create component: `Skeleton/Row`

---

## Phase 3: Page Templates (45 minutes)

### Step 3.1: Create Student Dashboard

1. **New page: "Pages - Student"**

2. **Set up frame**
   - Frame: 1440px × 1200px (desktop)
   - Fill: Slate 950
   - Name: "Student Dashboard"

3. **Add Hero Section**
   - Rectangle: Full width × 250px
   - Add gradient: Slate 950 to Slate 900
   - Add image or solid color (use video bg color)
   - Add title: "Welcome back, [Name] 👋" (32px bold)
   - Add subtitle: "Here's your internship overview" (18px)
   - Add action button (top right): "Refresh Match Scores"

4. **Add KPI Cards Grid**
   - 3 columns layout
   - Use `Card/Glass` component (3 instances)
   - Content for each:
     - Card 1: CV Status icon + "COMPLETE" + detail
     - Card 2: Applications icon + "2/3" + detail
     - Card 3: Clock icon + "8/12" + detail

5. **Add Analytics Charts**
   - 2 columns
   - First card: Doughnut chart (mock)
   - Second card: Doughnut chart (mock)

6. **Add Interview Cards**
   - Container with 3 interview cards
   - Company + position + date + button

7. **Add Bottom Section (2 columns)**
   - Left: Recommendations cards
   - Right: Applications table

### Step 3.2: Create Find Jobs Page

1. **New frame: "Find Jobs"**

2. **Hero Section**
   - Title: "Find Internships"
   - Subtitle: "Discover and apply to new opportunities"
   - Button: "Refresh Match Scores"

3. **Filter Section**
   - Use `Card/Glass`
   - Add search input
   - Add dropdown for work mode

4. **Job Cards Grid**
   - 3 columns
   - Use `Card/Glass` for each job
   - Add job details:
     - Title + Save icon
     - Company name
     - Match score (circular)
     - Work mode + Location badges
     - Apply button

5. **Show 6 job cards**

### Step 3.3: Create Company Dashboard

1. **New page: "Pages - Company"**

2. **Similar structure to Student Dashboard**
   - Hero section
   - 3 KPI cards (different data)
   - 2 chart cards
   - Listings table

### Step 3.4: Create Admin Dashboard

1. **New page: "Pages - Admin"**

2. **4 KPI cards** (instead of 3)
3. **3 chart cards**
4. **User management table**

### Step 3.5: Create Lecturer Dashboard

1. **New page: "Pages - Lecturer"**

2. **Standard dashboard structure**
   - Hero
   - 3 KPI cards
   - 2 charts
   - Student list table

---

## Phase 4: Interactive Prototype (30 minutes)

### Step 4.1: Create Prototype Page

1. **New page: "Prototype - User Flows"**

2. **Set up key screens**
   - Login screen
   - Student dashboard
   - Find jobs page
   - Job details modal
   - Applications list

3. **Connect with Prototype Links**
   - Right-click on button → "Prototype"
   - Connect to next screen
   - Set interaction: Click
   - Set animation: Smart animate (300ms)

### Step 4.2: Create User Flows

**Flow 1: Login to Dashboard**
1. Create login screen
2. Button → Student Dashboard screen
3. Add animation: Smart animate

**Flow 2: Find Job & Apply**
1. Dashboard → Find Jobs button
2. Find Jobs page
3. Click job card → Job details modal
4. Apply button → Success message

**Flow 3: View Applications**
1. Dashboard → My Applications
2. Applications list
3. Click row → Application details

### Step 4.3: Add Interactions

For each interactive element:
1. Right-click → "Prototype"
2. Link to target screen
3. Set trigger: Click
4. Set animation: Smart animate (300ms ease-in-out)
5. Set exit animation: Smart animate (200ms)

---

## Phase 5: Documentation & Export (15 minutes)

### Step 5.1: Add Documentation

1. **Create page: "Documentation"**

2. **Add sections**
   - Color palette guide
   - Typography scale
   - Spacing system
   - Component guidelines
   - Animation specs

### Step 5.2: Export Assets

1. **Export Icons** (if any)
   - Select icon
   - Right-click → "Export"
   - Format: SVG
   - Scale: 1x

2. **Export Color Styles**
   - Assets → Colors
   - Document all hex and RGB values

3. **Export Typography**
   - Document all text style specifications
   - Include line height, letter spacing

### Step 5.3: Share & Handoff

1. **Share Figma Link**
   - Top right → "Share"
   - Get link
   - Set view-only or edit permissions

2. **Create Handoff Document**
   - Export design specs
   - Share color palette
   - Share component specs

---

## Naming Conventions to Follow

### Components
```
Category/Type/Variant/State

Examples:
Button/Primary/Medium/Default
Button/Primary/Medium/Hover
Input/Text/Default
Input/Text/Focus
Input/Text/Error
Badge/Success/Default
Card/Glass/Default
Card/Glass/Hover
Modal/Medium/Default
Table/Row/Default
Table/Row/Hover
Skeleton/Bar
Skeleton/Card
Skeleton/Row
```

### Frames/Pages
```
[Page Category] - [Page Name]

Examples:
Pages - Student Dashboard
Pages - Find Jobs
Pages - Company Dashboard
Components - Buttons
Components - Inputs
Prototype - User Flows
```

### Groups/Layers
```
[Function]/[Description]

Examples:
Header/Title
Header/Subtitle
Content/KPI Cards
Content/Chart Section
Footer/Actions
```

---

## Best Practices

### Organization
✅ Use pages to organize different sections
✅ Use groups to organize related elements
✅ Use components for reusable elements
✅ Name everything clearly and consistently

### Components
✅ Create main components in dedicated pages
✅ Use variants for different states
✅ Create component sets for easy management
✅ Document component usage

### Prototyping
✅ Use smart animate for transitions
✅ Set consistent animation duration (300ms)
✅ Test prototype flows before sharing
✅ Document interaction specs

### Files
✅ Keep design system and pages in one file
✅ Use version numbers (v1, v2, etc.)
✅ Regularly back up or export

---

## Common Mistakes to Avoid

❌ Don't create duplicates - use components instead
❌ Don't forget to name layers - it's critical for handoff
❌ Don't mix styling - stick to design tokens
❌ Don't over-complicate prototypes
❌ Don't forget to test interactions

---

## Troubleshooting

**Q: Component not appearing correctly?**
A: Check that fill color is set (not just stroke)

**Q: Animation not working?**
A: Make sure prototype is set to "Smart animate"

**Q: Text looks blurry?**
A: Turn off anti-aliasing or check font rendering

**Q: Component variants confusing?**
A: Use descriptive names and organize by property

---

## Time Estimates

| Phase | Task | Time |
|-------|------|------|
| 1 | Design Tokens | 30 min |
| 2 | Core Components | 45 min |
| 3 | Page Templates | 45 min |
| 4 | Interactive Prototype | 30 min |
| 5 | Documentation & Export | 15 min |
| **Total** | **Complete Design System** | **~2.5 hours** |

---

## What's Next After Figma Setup

1. **Review & Iterate**
   - Get feedback from team
   - Refine components
   - Update colors/spacing if needed

2. **Handoff to Developers**
   - Export specs
   - Share Figma link
   - Provide component documentation

3. **Keep in Sync**
   - React code matches Figma
   - Update both together
   - Version control design changes

4. **Maintain Library**
   - Add new components as needed
   - Update existing components
   - Keep documentation current

---

## Resources

- **Figma Help:** https://help.figma.com
- **Design System Tips:** https://www.designsystems.com
- **Component Documentation:** https://www.figma.com/best-practices

---

## Final Checklist

✅ Figma file created
✅ Color styles added
✅ Text styles created
✅ Components built
✅ Page templates created
✅ Prototype links added
✅ Documentation complete
✅ File organized properly
✅ Shared with team
✅ Ready for handoff

---

**Setup Guide Version:** 1.0  
**Difficulty:** Beginner-Intermediate  
**Status:** Ready to Build  

You're all set! Follow these steps and you'll have a complete design system and interactive prototype in Figma. Good luck! 🎨
