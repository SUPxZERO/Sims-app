# Component Guide: Loading States & Animations

## Quick Reference

### New Components Added

#### 1. **Skeleton** (`resources/js/components/common/Skeleton.tsx`)
Reusable skeleton loader for loading states.

```tsx
import Skeleton from '../../components/common/Skeleton';

// Single skeleton
<Skeleton type="text" width="w-full" height="h-4" />

// Multiple skeletons
<Skeleton type="card" width="w-full" count={3} />

// Types: 'text' | 'card' | 'avatar' | 'button' | 'input' | 'table-row'
```

**Types:**
- `text` - Animated text line (default)
- `card` - Card placeholder (h-32)
- `avatar` - Circular avatar (10x10)
- `button` - Button placeholder (h-10)
- `input` - Input field placeholder (h-10)
- `table-row` - Table row placeholder (h-12)

---

#### 2. **SkeletonDashboardLayout** (`resources/js/components/common/SkeletonDashboardLayout.tsx`)
Complete dashboard loading state with header, KPIs, charts, and table skeletons.

```tsx
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';

if (loading) {
  return <SkeletonDashboardLayout />;
}
```

**Components Included:**
- Header with title and subtitle skeletons
- KPI grid (3 columns) with card skeletons
- Chart section (2 columns) with circular chart placeholders
- Table skeleton with 5 row placeholders

---

#### 3. **SkeletonJobCard** (`resources/js/components/common/SkeletonJobCard.tsx`)
Specialized skeleton for job listing cards.

```tsx
import SkeletonJobCard from '../../components/common/SkeletonJobCard';

// In a grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {[1, 2, 3, 4, 5, 6].map((i) => (
    <SkeletonJobCard key={i} />
  ))}
</div>
```

**Skeleton Elements:**
- Job title and company name placeholders
- Work mode and location badges
- Apply button placeholder

---

#### 4. **EmptyState** (`resources/js/components/common/EmptyState.tsx`)
Friendly UI for empty data scenarios.

```tsx
import EmptyState from '../../components/common/EmptyState';

<EmptyState 
  icon="📭"
  title="No Applications Yet"
  description="Start exploring job listings and apply to positions."
  action={{
    label: "Find Jobs",
    onClick: () => navigate('/jobs')
  }}
/>
```

**Props:**
- `icon` (string) - Emoji icon to display (default: "📭")
- `title` (string) - Main heading
- `description` (string, optional) - Subtitle text
- `action` (object, optional) - Button with label and onClick handler
- `className` (string, optional) - Additional CSS classes

---

### Enhanced Components

#### 1. **Button** 
- Enhanced loading spinner with smooth animation
- Added `motion-reduce` support for accessibility
- Maintains disabled state styling

```tsx
<Button isLoading={isLoading} onClick={handleSubmit}>
  Submit Application
</Button>
```

---

#### 2. **Card**
- Added `style` prop for animation delays
- Enhanced hover effect (`hover:shadow-2xl`)
- Smooth 300ms transitions on all properties

```tsx
<Card 
  className="flex flex-col" 
  style={{ animationDelay: '100ms' }}
>
  Card content
</Card>
```

---

#### 3. **Input**
- Better focus state with blue border
- Error messages slide in with animation
- Smooth label color transitions

```tsx
<Input
  label="Email"
  placeholder="you@example.com"
  error={error ? "Invalid email" : undefined}
/>
```

---

#### 4. **Modal**
- Entrance animations: backdrop fades in, dialog slides up
- Duration: 300ms with ease-out timing
- Smooth exit when closed

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  Modal content slides in smoothly
</Modal>
```

---

#### 5. **Table**
- Each row gets stagger animation on load
- 30ms delay between row entrances
- Hover states with smooth color transitions

```tsx
<Table 
  data={items}
  columns={[...]}
  keyExtractor={(row) => row.id}
/>
// Rows automatically animate in with stagger effect
```

---

#### 6. **PageHeader**
- Content uses `animate-slideUp` for smooth entrance
- Supports image or video backgrounds
- Consistent animation timing

```tsx
<PageHeader 
  title="Find Internships"
  subtitle="Discover opportunities"
  mediaType="video"
  mediaSrc={heroVideo}
/>
```

---

### CSS Animations

#### Available Animation Classes (`resources/css/app.css`):

```css
.animate-fadeIn      /* Fade in over 0.3s */
.animate-slideUp     /* Slide up + fade in over 0.3s */
.stagger-item        /* Automatic stagger with nth-child delays */
.transition-smooth   /* Smooth transition on all properties */
```

#### How Stagger Works:
```css
/* Automatically adds 0.1s delay per child */
.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.2s; }
/* ... up to 5 items, then 0.5s for 6+ items */
```

---

## Implementation Examples

### Example 1: Dashboard Page Loading State

```tsx
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';

export const MyDashboard: React.FC = () => {
  const { data, loading, error } = useFetch('/dashboard', true);

  // Show skeleton while loading
  if (loading) {
    return <SkeletonDashboardLayout />;
  }

  // Show error if fetch failed
  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg">
        Error loading dashboard: {error}
      </div>
    );
  }

  // Show actual content
  return (
    <div className="space-y-6">
      {/* Dashboard content */}
    </div>
  );
};
```

---

### Example 2: Job Listing with Stagger Animation

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredJobs.map((job, index) => (
    <Card
      key={job.id}
      className="stagger-item flex flex-col hover:border-blue-500/50"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => selectJob(job)}
    >
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-slate-400">{job.company}</p>
    </Card>
  ))}
</div>

// Cards animate in with waterfall effect
// Card 1: 0ms, Card 2: 50ms, Card 3: 100ms, etc.
```

---

### Example 3: Form with Input Animations

```tsx
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({ email: '', password: '' });

return (
  <form className="space-y-4">
    <Input
      label="Email Address"
      type="email"
      placeholder="you@example.com"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      error={errors.email}
      // Error message automatically slides in with animation
    />

    <Input
      label="Password"
      type="password"
      placeholder="••••••••"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      error={errors.password}
    />

    <Button isLoading={isSubmitting} onClick={handleSubmit}>
      {isSubmitting ? 'Signing in...' : 'Sign In'}
    </Button>
  </form>
);
```

---

### Example 4: Empty State

```tsx
import EmptyState from '../../components/common/EmptyState';

const MyApplications: React.FC = () => {
  const { data } = useFetch('/applications');
  const applications = data?.applications || [];

  if (applications.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No Applications Yet"
        description="You haven't applied to any positions. Start by exploring available internships."
        action={{
          label: "Browse Internships",
          onClick: () => navigate('/find-jobs')
        }}
      />
    );
  }

  return <ApplicationsList applications={applications} />;
};
```

---

## Pages Updated with Skeleton Loading

| Page | Path | Loading Component |
|------|------|-------------------|
| Student Dashboard | `/student/dashboard` | SkeletonDashboardLayout |
| Find Jobs | `/student/find-jobs` | Custom + SkeletonJobCard ×6 |
| My Applications | `/student/my-applications` | SkeletonDashboardLayout |
| Company Dashboard | `/company/dashboard` | SkeletonDashboardLayout |
| Manage Listings | `/company/listings` | SkeletonDashboardLayout |
| My Interns | `/company/my-interns` | SkeletonDashboardLayout |
| Review Applications | `/company/applications/:id` | SkeletonDashboardLayout |
| Admin Dashboard | `/admin/dashboard` | SkeletonDashboardLayout |
| User Management | `/admin/users` | SkeletonDashboardLayout |
| Lecturer Dashboard | `/lecturer/dashboard` | SkeletonDashboardLayout |
| My Students | `/lecturer/my-students` | SkeletonDashboardLayout |

---

## Animation Timing Guidelines

**Standard Durations:**
- Page/Modal entrance: 300ms
- Component transitions: 200-300ms
- Hover states: 150-200ms
- Stagger delay: 50-100ms between items
- List animations: 30ms delay for table rows

**Easing Functions:**
- Entrance animations: `ease-out`
- Hover/interactions: `ease-in-out`
- Exit animations: `ease-in`

---

## Performance Notes

✅ **Optimized:**
- All animations use CSS `transform` and `opacity` (GPU-accelerated)
- No JavaScript-driven animations (except Tailwind animations)
- 60fps target with smooth easing
- Minimal repaints and reflows

⚠️ **Considerations:**
- Large lists (100+ items) may benefit from virtual scrolling
- Modal animations are performant due to hardware acceleration
- Skeleton loaders reduce perceived load time significantly

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Android)

---

## Accessibility

- ✅ `prefers-reduced-motion` support for animations
- ✅ Color contrast maintained throughout (WCAG AA)
- ✅ Keyboard navigation on all interactive elements
- ✅ Semantic HTML structure
- ✅ ARIA labels on buttons and modals

---

## Common Patterns

### Loading State Pattern
```tsx
if (loading) return <SkeletonDashboardLayout />;
if (error) return <ErrorMessage message={error} />;
return <ContentComponent data={data} />;
```

### Stagger Animation Pattern
```tsx
{items.map((item, index) => (
  <Card key={item.id} className="stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
    {item.content}
  </Card>
))}
```

### Form with Validation Pattern
```tsx
<Input
  label="Email"
  error={errors.email}
  onChange={() => setErrors({ ...errors, email: '' })}
/>
// Error message slides in when error exists
```

---

## Troubleshooting

**Q: Animations not appearing?**
- Check if user has `prefers-reduced-motion` enabled
- Verify Tailwind CSS is properly configured
- Check browser DevTools for animation keyframes

**Q: Stagger effect not working?**
- Ensure elements have `stagger-item` class
- Verify inline `style={{ animationDelay }}` is set
- Check that parent has proper layout (flex/grid)

**Q: Skeleton still showing after load?**
- Verify `loading` state is false after data fetch
- Check if refetch is called properly
- Look for race conditions in async code

---

## Future Enhancements

- [ ] Add page transition animations with React Router
- [ ] Implement Framer Motion for complex sequences
- [ ] Add more specialized skeleton types (chart-specific, etc.)
- [ ] Create skeleton variants for different content types
- [ ] Add animation preference settings in user preferences
