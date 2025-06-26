# BusyWomen UI Update Tasks

## Task 1: Improve Hero Section Mobile Responsiveness
**Current Issue:** Hero image not properly stretching in mobile view.

**Implementation Details:**
- Update background image styling in `Hero.jsx`
- Implement responsive image loading with `srcset` and `sizes` attributes
- Use modern CSS container queries for better responsive control
- Ensure proper aspect ratio maintenance across devices
- Implement progressive image loading for better performance

**Files to Modify:**
- `/src/components/home/Hero.jsx`

**Success Criteria:**
- Hero image fully visible on mobile devices without cropping
- Smooth loading transition on all device sizes
- Maintains visual appeal across breakpoints

## Task 2: Reorganize Hero Section Layout
**Current Issue:** Testimonials are placed above key points in the hero section.

**Implementation Details:**
- Move `TestimonialCarousel` component to a dedicated section after Features
- Adjust grid layout in Hero component for better content flow
- Implement a more logical visual hierarchy
- Add smooth scroll navigation between sections

**Files to Modify:**
- `/src/components/home/Hero.jsx`
- `/src/pages/Home.jsx` (to adjust component order)

**Success Criteria:**
- Clear visual hierarchy in the hero section
- Testimonials displayed in a more appropriate location
- Improved user flow through the page content

## Task 3: Redesign Key Point Cards (HeroStats)
**Current Issue:** Key point cards need a cleaner, floating design.

**Implementation Details:**
- Replace card-based design with floating numbers and text
- Implement subtle animations for hover states
- Use gradient text for numbers to add visual interest
- Add parallax scrolling effect for depth
- Ensure accessibility with proper contrast ratios

**Files to Modify:**
- `/src/components/home/HeroStats.jsx`

**Success Criteria:**
- Clean, modern floating stats design
- Visually appealing animations that don't distract
- Maintains readability and accessibility

## Task 4: Improve Color Delineation Throughout the App
**Current Issue:** Limited color palette (primarily white and blue) lacks visual hierarchy.

**Implementation Details:**
- Create an expanded color palette with primary, secondary, and accent colors
- Implement CSS custom properties for consistent theming
- Add subtle gradients between sections for visual separation
- Ensure WCAG 2.1 AA compliance for all color combinations
- Implement dark mode support with system preference detection

**Files to Modify:**
- Create new `/src/styles/colors.css` for centralized color management
- Update global styles in main CSS file
- Modify component-specific styling as needed

**Success Criteria:**
- Clear visual distinction between different sections
- Improved visual hierarchy through strategic color use
- Consistent brand identity with expanded palette

## Task 5: Enhance Mobile-First Styling
**Current Issue:** Application needs better mobile-first approach.

**Implementation Details:**
- Review and adjust all responsive breakpoints
- Optimize touch targets (minimum 44x44px)
- Implement proper spacing for mobile viewports
- Add gesture support for common interactions
- Ensure proper viewport settings and text sizing

**Files to Modify:**
- Global CSS files
- Component-specific styling
- Layout components

**Success Criteria:**
- Seamless experience across all device sizes
- No horizontal scrolling on mobile devices
- Touch-friendly interface elements
- Fast loading and rendering on mobile devices
