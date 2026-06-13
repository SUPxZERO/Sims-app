# Figma Design Specification
## Internship Management Platform - Complete Design System

---

## 📋 Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Grid](#spacing--grid)
5. [Components](#components)
6. [Page Templates](#page-templates)
7. [Implementation Guide](#implementation-guide)

---

## Design System Overview

### Platform Overview
- **Platform:** Internship Management & Matching System
- **Role-Based Dashboard:** Student, Lecturer, Company, Admin
- **Design Language:** Modern Dark Theme with Glass Morphism
- **Primary Color:** Blue (#2563EB)
- **Theme:** Dark Mode (Slate 950 background)

### Design Principles
1. **Clarity** - Information hierarchy is clear and scannable
2. **Efficiency** - Users accomplish tasks quickly
3. **Delight** - Smooth animations and transitions
4. **Accessibility** - WCAG AA compliant
5. **Consistency** - Uniform components across all pages

---

## Color Palette

### Core Colors

#### Background Colors
```
Slate 950:  #030712  - Main background
Slate 900:  #0F172A  - Secondary background / Cards
Slate 800:  #1E293B  - Tertiary background / Hover states
Slate 700:  #334155  - Borders / Disabled states
```

#### Text Colors
```
Slate 100:  #F1F5F9  - Primary text (headings)
Slate 200:  #E2E8F0  - Secondary text
Slate 300:  #CBD5E1  - Tertiary text
Slate 400:  #94A3B8  - Placeholder text
Slate 500:  #64748B  - Disabled text
```

#### Accent Colors
```
Blue 600:   #2563EB  - Primary actions / Links
Blue 500:   #3B82F6  - Hover state
Blue 400:   #60A5FA  - Lighter hover
Green 500:  #10B981  - Success states
Yellow 500: #EAB308  - Warning states
Red 500:    #EF4444  - Error states
```

#### Glass Effect
```
Background: rgba(15, 23, 42, 0.4) - Transparent slate
Backdrop:   blur(16px)             - Frosted glass
Border:     rgba(51, 65, 85, 0.6)  - Subtle border
```

### Usage Guidelines

**Dark Cards (Glass Morphism)**
- Background: Slate 900 @ 40% opacity
- Border: Slate 800 @ 60% opacity
- Backdrop Blur: 16px

**Borders**
- Default: Slate 800 @ 60%
- Hover: Slate 700 @ 80%
- Focus: Blue 500 @ 100%

**Shadows**
- Subtle: 0 4px 6px rgba(0,0,0,0.1)
- Medium: 0 10px 15px rgba(0,0,0,0.2)
- Large: 0 20px 25px rgba(0,0,0,0.3)

---

## Typography

### Font Family
**Primary Font:** System Font Stack
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
sans-serif
```

### Font Sizes & Weights

| Name | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| **Display 1** | 48px | 700 | 56px | -0.02em |
| **Display 2** | 36px | 700 | 44px | -0.015em |
| **Heading 1** | 32px | 700 | 40px | -0.01em |
| **Heading 2** | 28px | 600 | 36px | 0 |
| **Heading 3** | 24px | 600 | 32px | 0 |
| **Heading 4** | 20px | 600 | 28px | 0 |
| **Body Large** | 18px | 400 | 28px | 0 |
| **Body** | 16px | 400 | 24px | 0 |
| **Body Small** | 14px | 400 | 20px | 0 |
| **Label Large** | 14px | 500 | 20px | 0.1em |
| **Label** | 12px | 500 | 16px | 0.1em |
| **Caption** | 11px | 400 | 16px | 0 |

### Usage Examples

**Page Title (Heading 1)**
- Size: 32px
- Weight: 700
- Color: Slate 100
- Spacing below: 8px

**Section Title (Heading 3)**
- Size: 24px
- Weight: 600
- Color: Slate 100
- Spacing below: 16px

**Body Text (Body)**
- Size: 16px
- Weight: 400
- Color: Slate 300
- Line Height: 24px

**Small Label (Label)**
- Size: 12px
- Weight: 500
- Color: Slate 400
- Uppercase: Yes (optional)

---

## Spacing & Grid

### Base Unit
**8px Grid System**

All spacing, padding, margins, and sizes are multiples of 8px.

### Spacing Scale

```
xs:  4px   - Small gaps between elements
sm:  8px   - Small padding
md:  16px  - Standard padding / gaps
lg:  24px  - Large sections
xl:  32px  - Extra large gaps
2xl: 48px  - Page-level spacing
3xl: 64px  - Large page sections
```

### Padding

**Components**
- Button: 12px vertical, 16px horizontal
- Input: 10px vertical, 12px horizontal
- Card: 24px (all sides)
- Modal: 24px (content), 16px (header)
- Section: 32px top/bottom, 24px left/right

### Gap (Flex/Grid)

**Cards Grid**
- Desktop (3 columns): 24px gap
- Tablet (2 columns): 20px gap
- Mobile (1 column): 16px gap

**Stacked Elements**
- Default: 16px
- Compact: 12px
- Spacious: 24px

---

## Components

### Button

#### States & Variants

**Primary Button**
```
Default:
  Background: Blue 600
  Text: White
  Padding: 12px 16px
  Border Radius: 8px
  
Hover:
  Background: Blue 700
  Shadow: Subtle
  Transition: 200ms ease-in-out

Focus:
  Ring: 2px Blue 500 @ 50%
  Ring Offset: Slate 900 2px

Disabled:
  Opacity: 50%
  Cursor: Not allowed
  
Loading:
  Spinner: Rotate animation
  Text: Hidden or "Loading..."
```

**Secondary Button**
```
Default:
  Background: Slate 700
  Text: White
  Border: None

Hover:
  Background: Slate 600
  Shadow: Subtle

States: Same as Primary
```

**Danger Button**
```
Default:
  Background: Red 600
  Text: White

Hover:
  Background: Red 700

States: Same as Primary
```

### Input Field

**Text Input**
```
Default:
  Background: Slate 800 @ 50%
  Border: 1px Slate 700
  Height: 40px
  Padding: 10px 12px
  Border Radius: 8px
  
Focus:
  Border: 1px Blue 400
  Ring: 2px Blue 500 @ 30%
  Background: Slate 800 @ 60%

Error:
  Border: 1px Red 500
  Ring: 2px Red 500 @ 30%
  Error Text: 12px Red 500 below field

Disabled:
  Opacity: 50%
  Cursor: Not allowed
  Background: Slate 800 @ 30%

Placeholder:
  Color: Slate 400
  Font Weight: 400
```

### Badge

**Variants**

```
Primary:
  Background: Blue 500 @ 20%
  Text: Blue 400
  Border: 1px Blue 500 @ 30%
  Padding: 6px 12px
  Border Radius: 20px
  Font Size: 12px

Success:
  Background: Green 500 @ 20%
  Text: Green 400
  Border: 1px Green 500 @ 30%

Warning:
  Background: Yellow 500 @ 20%
  Text: Yellow 400
  Border: 1px Yellow 500 @ 30%

Danger:
  Background: Red 500 @ 20%
  Text: Red 400
  Border: 1px Red 500 @ 30%

Info:
  Background: Teal 500 @ 20%
  Text: Teal 400
  Border: 1px Teal 500 @ 30%
```

### Card

**Glass Card**
```
Background: Slate 900 @ 40% + Blur 16px
Border: 1px Slate 800 @ 60%
Border Radius: 16px
Padding: 24px
Shadow: 0 10px 15px rgba(0,0,0,0.2)

Hover:
  Border: 1px Slate 700 @ 80%
  Shadow: 0 20px 25px rgba(0,0,0,0.3)
  Transition: 300ms ease-out

Focus (if clickable):
  Ring: 2px Blue 500 @ 50%
  Ring Offset: 2px
```

### Modal

**Modal Container**
```
Backdrop:
  Background: Slate 900 @ 80%
  Backdrop Blur: 8px
  Transition: 300ms fadeIn

Dialog:
  Background: Slate 800
  Border: 1px Slate 700
  Border Radius: 16px
  Max Width: 500px (md), 800px (lg), 1200px (xl)
  Max Height: 90vh
  Shadow: Large
  
Header:
  Background: Slate 800 @ 50%
  Border Bottom: 1px Slate 700
  Padding: 20px 24px
  Display: flex, justify-between, align-center
  
Content:
  Padding: 24px
  Overflow Y: Auto
  Background: Slate 900 @ 20%

Animation:
  Entrance: 300ms slideUp ease-out
  Exit: 200ms fadeOut ease-in
```

### Table

**Table Structure**
```
Background: Slate 900 @ 20%
Border Collapse: Collapse

Header Row:
  Background: Slate 900 @ 50%
  Border Bottom: 1px Slate 800
  Padding: 12px 16px
  Font Weight: 500
  Font Size: 12px
  Color: Slate 400
  Text Transform: Uppercase
  Letter Spacing: 0.05em

Body Rows:
  Border Bottom: 1px Slate 800 @ 50%
  Padding: 16px
  Height: 48px (min)
  
  Hover:
    Background: Slate 800 @ 30%
    Transition: 200ms ease-in-out
    Cursor: Pointer (if selectable)

Cells:
  Padding: 12px 16px
  Text Color: Slate 300
  Font Size: 14px

Empty State:
  Message: Center aligned
  Color: Slate 500
  Padding: 40px
  Font: Body Small, Italic
```

### Spinner

**Loading Spinner**
```
Size: 48px (lg), 32px (md), 16px (sm)
Color: Blue 500 or Custom
Animation: Rotate 1s linear infinite
Stroke Width: 4px
Background Circle: Slate 700 @ 25%
```

### Checkbox & Radio

**Checkbox**
```
Size: 20px × 20px
Border: 2px Slate 600
Border Radius: 4px

Checked:
  Background: Blue 600
  Icon: White checkmark
  Transition: 150ms ease-out

Focus:
  Ring: 2px Blue 500 @ 50%
  Ring Offset: 2px

Disabled:
  Opacity: 50%
  Cursor: Not allowed
```

**Radio Button**
```
Size: 20px × 20px
Border: 2px Slate 600
Border Radius: 50%

Selected:
  Border: 2px Blue 600
  Inner Circle: 8px Blue 600
  Transition: 150ms ease-out

Focus:
  Ring: 2px Blue 500 @ 50%
  Ring Offset: 2px

Disabled:
  Opacity: 50%
  Cursor: Not allowed
```

### Select Dropdown

**Select**
```
Background: Slate 900 @ 50%
Border: 1px Slate 700
Height: 40px
Padding: 10px 12px
Border Radius: 8px
Color: Slate 200

Focus:
  Border: 1px Blue 400
  Ring: 2px Blue 500 @ 30%

Dropdown Menu:
  Background: Slate 800
  Border: 1px Slate 700
  Border Radius: 8px
  Shadow: Large
  
Option Item:
  Padding: 12px 16px
  Height: 40px
  
  Hover:
    Background: Slate 700
    
  Selected:
    Background: Blue 500 @ 20%
    Color: Blue 400
    Font Weight: 500
```

---

## Page Templates

### Layout Structure

#### Dashboard Layout

```
Header (Fixed/Sticky):
  - Logo + Brand Name
  - Search Bar
  - Notifications
  - User Avatar + Dropdown
  - Height: 64px
  
Sidebar (Fixed, Collapsible):
  - Navigation Links
  - Active State Indicator
  - Width: 280px (expanded), 80px (collapsed)
  
Main Content:
  - Padding: 32px
  - Background: Slate 950
  - Min height: 100vh
  
Page Header (Hero Section):
  - Background Image/Video (40% opacity)
  - Gradient Overlay
  - Title + Subtitle
  - Optional Action Buttons
  - Height: 250px - 350px
  
Content Sections:
  - Cards in Grid/List
  - Gap: 24px
  - Responsive columns
```

### Student Dashboard Page

**Components:**
1. **Hero Header**
   - Video background (student_dash_video.mp4)
   - Title: "Welcome back, [First Name] 👋"
   - Subtitle: "Here's your internship overview"
   - Size: 250px height

2. **KPI Grid (3 Columns)**
   - CV Status Card
     - Icon: Document
     - Value: COMPLETE/INCOMPLETE
     - Label: CV Status
     - Detail: "X snapshots saved"
   
   - Active Applications Card
     - Icon: Briefcase
     - Value: "X / 3"
     - Label: Active Applications
     - Detail: "Currently in progress"
   
   - Weeks Logged Card
     - Icon: Clock
     - Value: "X / 12"
     - Label: Weeks Logged
     - Detail: "Approved weekly reports"

3. **Analytics Charts (2 Columns)**
   - Internship Progress (Doughnut)
     - Center text: "X of Y weeks"
     - Colors: Green (complete), Gray (remaining)
   
   - Weekly Reports Status (Doughnut)
     - Multiple status types
     - Color coded

4. **Upcoming Interviews**
   - Card list showing:
     - Position + Company
     - Date & Time
     - Duration
     - Meet link
   - Status badge

5. **Bottom Section (2 Columns)**
   - Top Recommendations
     - Job cards with match score circle
     - Apply button
   
   - Active Applications Pipeline
     - Table with:
       - Company name
       - Position
       - Match score
       - Current status (badge)
       - View action link

### Find Jobs Page

**Components:**
1. **Hero Header**
   - Video background (hero_video.mp4)
   - Title: "Find Internships"
   - Subtitle: "Discover and apply to new opportunities"
   - Refresh button (top right)

2. **Filter Card**
   - Search input (full width)
   - Work Mode dropdown (3 columns wide on desktop)

3. **Job Cards Grid (3 Columns)**
   - Each card:
     - Title + Save icon (top)
     - Company name (gray)
     - Match score circle (right)
     - Badges: Work mode, Location
     - Apply button (bottom)

4. **Loading State**
   - 6 skeleton job cards during load

5. **Empty State**
   - Icon: 📭
   - Message: "No jobs match your search"
   - Reset search button

### Company Dashboard Page

**Similar to Student Dashboard**
1. Hero Header
2. KPI Cards (3 columns)
   - Total Listings
   - Pending Applications
   - Active Interns
3. Charts (2 columns)
   - Application funnel
   - Internship status
4. Listings Overview Table

### Admin Dashboard Page

**Similar structure with admin-specific data**
1. Hero Header
2. KPI Cards (4 columns)
   - Total Users
   - Active Listings
   - Pending Approvals
   - System Health
3. Charts (3 types)
   - User growth line chart
   - Application status pie
   - Listing approvals bar
4. Recent Activity Table

### Lecturer Dashboard Page

**Similar structure with lecturer-specific data**
1. Hero Header
2. KPI Cards (3 columns)
   - Students Assigned
   - Reports to Review
   - Evaluations Pending
3. Charts
   - Student progress
   - Report status
4. Student List Table

---

## Animations & Interactions

### Entrance Animations

**Page Load:**
- Skeleton → Content fade transition
- Duration: 300ms
- Easing: ease-out

**Modal Entrance:**
- Backdrop fades in: 300ms
- Dialog slides up: 300ms
- Easing: ease-out

**List Items (Stagger):**
- Cards: 50ms delay per item
- Table rows: 30ms delay per row
- Duration: 300ms each
- Easing: ease-out

### Hover/Interaction States

**Card Hover:**
- Shadow increases
- Border lightens slightly
- Duration: 200ms
- Easing: ease-in-out

**Button Hover:**
- Background darkens
- Shadow appears
- Duration: 150ms
- Easing: ease-in-out

**Table Row Hover:**
- Background color changes
- Duration: 200ms
- Easing: ease-in-out

### Focus States

**All interactive elements:**
- Ring: 2px Blue 500 @ 50%
- Ring offset: 2px
- Visible outline (accessibility)

---

## Implementation Guide

### Setting Up Figma File

**Step 1: Create Design System**
1. Create a new Figma file: "Internship Platform - Design System"
2. Create a page: "Design Tokens"
3. Create sections for:
   - Color palette (color swatches)
   - Typography (text styles)
   - Spacing guide
   - Icons library

**Step 2: Create Component Library**
1. Create a page: "Components"
2. Create component groups:
   - Buttons (Primary, Secondary, Danger, Loading states)
   - Inputs (Text, Focus, Error, Disabled)
   - Badges (All variants)
   - Cards (Glass card base)
   - Tables (Header, rows, hover)
   - Modals (All sizes)
   - Loaders (Spinners, Skeletons)

**Step 3: Create Page Templates**
1. Create pages for each role:
   - Student Pages
   - Company Pages
   - Admin Pages
   - Lecturer Pages

2. For each page:
   - Create dashboard template
   - Create list pages
   - Create detail pages
   - Create modals/overlays

**Step 4: Interactive Prototype**
1. Create prototype page
2. Link key user flows:
   - Login → Dashboard
   - Find Jobs → Job Details → Apply
   - View Applications → Details
   - User management flow

### Component Setup Best Practices

**Naming Convention:**
```
Category/Component/State/Variant

Examples:
- Button/Primary/Default
- Button/Primary/Hover
- Button/Secondary/Disabled
- Input/Text/Focus
- Badge/Success/Default
- Card/Glass/Default
```

**Using Main Components:**
- Create in components page
- Set as main (diamond icon)
- Create variants for states
- Use in page templates

**Creating Variants:**
- Use component sets for states
- Variants for: Default, Hover, Focus, Disabled, Loading
- Variants for: Size (sm, md, lg)
- Variants for: Color/Type (primary, secondary, danger)

### Exporting Assets

**Icon Exports:**
- Export icons as SVG
- Naming: `icon-[name].svg`
- Sizes: 16px, 24px, 32px

**Color Styles:**
- Export as JSON
- Include opacity values
- Document RGB and hex

**Typography Styles:**
- Export font specifications
- Include line height, letter spacing
- Document all weights

---

## Color Reference (Hex Values)

```
SLATE
#030712 - 950
#0F172A - 900
#1E293B - 800
#334155 - 700
#475569 - 600
#64748B - 500
#94A3B8 - 400
#CBD5E1 - 300
#E2E8F0 - 200
#F1F5F9 - 100

BLUE (Primary)
#1E40AF - 900
#1D4ED8 - 800
#2563EB - 600
#3B82F6 - 500
#60A5FA - 400
#93C5FD - 300

GREEN (Success)
#065F46 - 900
#047857 - 700
#10B981 - 500
#6EE7B7 - 300

RED (Error)
#7F1D1D - 900
#DC2626 - 600
#EF4444 - 500
#FCA5A5 - 300

YELLOW (Warning)
#854D0E - 900
#B45309 - 700
#EAB308 - 500
#FEF08A - 300

TEAL (Info)
#134E4A - 900
#0D9488 - 700
#14B8A6 - 500
#99F6E4 - 300
```

---

## File Structure

```
Internship Platform - Design System
├── Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── Components
│   ├── Buttons
│   ├── Inputs
│   ├── Badges
│   ├── Cards
│   ├── Tables
│   ├── Modals
│   └── Loaders
├── Student Pages
│   ├── Dashboard
│   ├── Find Jobs
│   ├── My Applications
│   ├── My Saved Listings
│   └── CV Builder
├── Company Pages
│   ├── Dashboard
│   ├── Manage Listings
│   ├── Review Applications
│   ├── My Interns
│   └── Company Profile
├── Admin Pages
│   ├── Dashboard
│   ├── User Management
│   ├── Listing Approvals
│   └── System Settings
├── Lecturer Pages
│   ├── Dashboard
│   ├── My Students
│   ├── Reports
│   └── Evaluations
└── Prototype
    ├── Login Flow
    ├── Job Search Flow
    ├── Application Flow
    └── Admin Flow
```

---

## Next Steps

1. **Create Figma File**
   - Use this specification to set up structure
   - Create design tokens

2. **Build Components**
   - Create all component variants
   - Set up component library

3. **Create Page Templates**
   - Build page mockups
   - Use components to create pages

4. **Build Interactive Prototype**
   - Link key user flows
   - Add interaction details

5. **Export & Document**
   - Export assets
   - Create handoff documentation

---

## Notes

- This specification matches the React implementation exactly
- All colors, spacing, and animations are production-ready
- Use this as single source of truth for design
- Reference the React code for animation timings
- Maintain consistency across all pages
- Test on various screen sizes for responsive design

---

**Design System Version:** 1.0  
**Last Updated:** June 2024  
**Status:** Complete & Ready for Figma Implementation
