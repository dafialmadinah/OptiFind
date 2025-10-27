# Professional Landing Page Animation System

## 🎯 Overview
This document describes the comprehensive, seamless scroll story animation system implemented for OptiFind's landing page. The system features professional section-to-section transitions, refined typography, magnetic button interactions, and a dramatic curtain effect for the testimonials section.

---

## 🎨 Design Philosophy

### Seamless Flow
- **No "Patah" (Breaking)**: Every section transition is smooth and connected
- **Story-driven**: Animations guide users through a narrative journey
- **Performance-first**: Optimized for 60fps with hardware acceleration
- **Accessibility**: Full support for `prefers-reduced-motion`

### Professional Polish
- Consistent easing curves (power2.out, power1.inOut)
- Unified scrub timing (1.2-2.0) for smooth parallax
- Magnetic button interactions with elastic bounce
- Typography system with responsive scaling

---

## 📐 Typography System

### Scale & Hierarchy
```css
Display/H1: text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-extrabold
H2:         text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.01em] font-bold
H3:         text-[22px] md:text-[24px] leading-[1.2] font-semibold
Body:       text-[16px] md:text-[17px] leading-[1.7] text-slate-600
Label:      uppercase tracking-[0.22em] text-xs text-slate-500
```

### Usage
- **Hero Headline**: Display scale with negative tracking for impact
- **Section Headers**: H2 scale for clear hierarchy
- **Card Titles**: H3 scale for readability
- **Body Text**: Comfortable 1.7 line-height for reading
- **Labels**: Uppercase with wide tracking for premium feel

---

## 🎬 Section Animations

### 1. Hero Section

#### On-Load Sequence (Once)
```typescript
Timeline stagger:
1. subtitle (0ms)
2. headline (+150ms)
3. copy (+150ms)
4. primaryCTA (+200ms)
5. secondaryCTA (+100ms)
6. visual (+200ms)

Duration: 0.8-1.2s
Ease: power2.out
Transform: y: 32→0, opacity: 0→1, scale: 0.95→1 (visual only)
```

#### Scroll-Out (Parallax Exit)
```typescript
Visual:
- Transform: scale 1→0.94, y 0→-24px, opacity 1→0.6
- Scrub: 1.2
- Range: top top → bottom top

Headline/Copy:
- Transform: y 0→-24px, opacity 1→0
- Scrub: 1.2
- Range: top 10% → bottom top

Background Gradient:
- backgroundPosition: 50% 50% → 50% 60%
- Scrub: 1.5
```

**Effect**: Hero elements gracefully fade and shrink as user scrolls down, creating smooth transition to next section.

---

### 2. HowItWorks Section (Morphing Cards)

#### Animation Flow
Cards slide in **from far right** with morphing widths:

```typescript
Stage 1: Card 0 slides in
- x: 800 → 0 (from right)
- flex: 0% → 90%
- bg: white → #f48b2f
- color: dark → white
- Duration: 1s

Stage 2: Card 0 shrinks, Card 1 slides in
- Card 0: flex 90% → 38%, bg orange → white
- Card 1: x 800 → 0, flex 0% → 58%, bg white → orange
- Duration: 1s

Stage 3: Cards 0-1 shrink, Card 2 slides in
- Card 0: flex 38% → 31%
- Card 1: flex 58% → 31%, bg orange → white
- Card 2: x 800 → 0, flex 0% → 34%, bg white → orange
- Duration: 1s

Stage 4: All cards equal
- All: flex → 33.333%, bg → white
- Duration: 1s

Total: 4 stages × 1s = 400vh scroll distance
Scrub: 2 (slower, smoother)
Ease: power1.inOut (consistent)
```

#### Header Animation
```typescript
data-stage-header:
- Fade in on section enter
- TranslateY(-8px) as cards start morphing
- Creates "connected" feeling
```

**Effect**: Cards appear from right in sequence, morphing like a carousel, ending in balanced 3-column layout.

---

### 3. CommunityImpact Section

#### Background Entry
```typescript
Initial: yPercent -140 (above viewport - "in the sky")
Entry: yPercent -140 → 0
Duration: 1.4s
Ease: power2.out
Trigger: top 85%

Parallax during scroll:
- backgroundPosition: 50% 50% → 50% 40%
- Scrub: 1.5
```

#### Content Reveal (Staggered)
```typescript
data-step elements:
- Transform: y 24 → 0, opacity 0 → 1
- Stagger: 0.12s per element
- Duration: 1.2s
- Delay: 0.2s
- Ease: power2.out

Icon circles:
- Transform: x 100 → 0, opacity 0 → 1
- Stagger: 0.08s per icon
- Duration: 1s
- Delay: 0.5s
```

#### Counter Animation
```typescript
Trigger: top 60%
Duration: 2.5s per counter
Stagger: 0.2s delay between counters
Ease: power2.out
Format: Intl.NumberFormat with suffix (+, %)
```

**Effect**: Background "falls from sky", content reveals left-to-right, icons slide in, counters animate smoothly.

---

### 4. Testimonials Section (Curtain Effect)

#### Blue Curtain Animation
```typescript
Element: [data-curtain]
Position: absolute inset-0 z-50
Background: gradient from-[#203063] via-[#28407a] to-[#142253]

Phase 1 - Descent (curtain drops):
- Initial: yPercent -100 (hidden above)
- Target: yPercent 0
- Range: top 85% → top 55%
- Scrub: 1.5
- Ease: power3.inOut

Phase 2 - Retract (curtain rises):
- Initial: yPercent 0
- Target: yPercent -100
- Range: top 55% → top 20%
- Scrub: 1.5
- Ease: power3.inOut
```

**Effect**: Blue gradient "curtain" descends like stage curtain, then retracts upward, revealing testimonials underneath. Creates dramatic transition from dark Impact section to white Testimonials.

#### Footer Reveal
Handled by existing `useFooterReveal` hook:
- Cover div slides up to reveal FooterUnderlay
- FooterUnderlay is `fixed bottom-0` behind all sections
- Smooth opacity 0→1 and blur 6→0 as footer appears

---

## 🧲 Magnetic Buttons

All elements with `[data-magnetic]` attribute get interactive hover effect:

```typescript
On mousemove:
- Calculate distance from center
- Apply transform: translateX/Y (±15% of distance)
- Duration: 0.3s
- Ease: power2.out

On mouseleave:
- Reset to x:0, y:0
- Duration: 0.4s
- Ease: elastic.out(1, 0.5) - bouncy return

On active (click):
- Scale: 0.98
- Duration: instant
```

### Elements with Magnetic Effect
- Primary CTA (Laporkan Sekarang)
- Secondary CTA (Lihat Barang Ditemukan)
- Feedback button
- Navigation arrows (testimonials)

**Effect**: Buttons "magnetically" follow cursor with elastic bounce back.

---

## 🎨 Visual Polish

### Card Hover States
```css
Initial: shadow-sm
Hover: shadow-2xl, translateY(-4px)
Duration: 0.2s
Ease: cubic-bezier(0.4, 0, 0.2, 1)
```

### Button Hover States
```css
Primary CTA:
- Hover: scale(1.02), shadow-xl
- Active: scale(0.98)

Secondary CTA:
- Hover: bg-white, text-[#1d2d5a], scale(1.02)
- Active: scale(0.98)
```

### Border Radius Consistency
- Buttons: `rounded-[20px]`
- Cards: `rounded-[20px]`
- Large cards: `rounded-[32px]`

### Spacing System (8px base grid)
- space-8: 0.5rem (8px)
- space-16: 1rem (16px)
- space-24: 1.5rem (24px)
- space-32: 2rem (32px)
- space-48: 3rem (48px)
- space-64: 4rem (64px)

---

## ⚡ Performance Optimizations

### Hardware Acceleration
```css
.section, [data-hero], [data-track], [data-card], [data-impact-bg], .cover {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### Will-Change Strategy
```css
/* Only during active animations */
[data-hero-visual], [data-stage-header], [data-curtain] {
  will-change: transform, opacity;
}

/* Remove after animation completes */
.fade-up.animated {
  will-change: auto;
}
```

### GSAP Best Practices
- **Scrub timing**: 1.2-2.0 for smooth parallax
- **Consistent easing**: power2.out for entries, power2.in for exits, power1.inOut for morphs
- **Pin anticipation**: `anticipatePin: 1` prevents jump on pin start
- **Batch transforms**: Group related animations in single timeline

---

## ♿ Accessibility

### Reduced Motion Support
```typescript
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  // Skip parallax, scrub, and complex animations
  // Show static layout with simple fades (0.3s)
  // Set will-change: auto
  // Display content immediately
}
```

### Keyboard Navigation
- All interactive elements have proper focus states
- Tab order follows visual hierarchy
- `aria-label` on icon-only buttons

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic sectioning (`<section>`, `<article>`)
- Descriptive alt text on images

---

## 🎯 Key Animation Timings

| Section | Scrub | Pin | Duration | Ease |
|---------|-------|-----|----------|------|
| Hero Out | 1.2 | No | — | none |
| HowItWorks | 2.0 | Yes | 400vh | power1.inOut |
| CommunityImpact | 2.0 | Yes | 100vh | power2.out |
| Curtain | 1.5 | No | — | power3.inOut |
| Footer Reveal | — | Yes | Dynamic | power2.out |

---

## 📦 Files Modified

### Core Files
1. **src/app/page.tsx**
   - Added `useMagneticButtons()` hook
   - Added `useCurtainTestimonials()` hook
   - Updated typography classes across all sections
   - Added `[data-curtain]` element
   - Enhanced Hero parallax setup
   - Improved card hover states

2. **src/app/globals.css**
   - Professional spacing utilities
   - Typography scale utilities
   - Smooth transition utilities
   - Magnetic button styles
   - Performance optimizations

3. **src/hooks/useImpactCountUp.ts**
   - Added background parallax effect
   - Faster stagger timings (0.12s → 0.08s)
   - Improved scroll trigger ranges

### Existing Hooks (Preserved)
- `useMorphingHowItWorks` - Already optimized
- `useFooterReveal` - Works with new curtain
- `useImpactCountUp` - Enhanced with parallax

---

## 🧪 Testing Checklist

### Desktop (1920x1080)
- ✅ Hero loads smoothly with stagger
- ✅ Hero exits with parallax on scroll
- ✅ HowItWorks cards morph from right
- ✅ CommunityImpact background falls from sky
- ✅ Curtain descends and retracts smoothly
- ✅ Footer reveals behind testimonials
- ✅ Magnetic buttons follow cursor
- ✅ All hover states work

### Mobile (375x667)
- ✅ Typography scales responsively
- ✅ Touch interactions work (no magnetic on mobile)
- ✅ Scrolling is smooth without jank
- ✅ Animations don't cause layout shift

### Accessibility
- ✅ Reduced motion preference honored
- ✅ Keyboard navigation works
- ✅ Screen reader friendly
- ✅ Focus indicators visible

### Performance
- ✅ Maintains 60fps during scroll
- ✅ No memory leaks (cleanup on unmount)
- ✅ Smooth on mid-range devices
- ✅ No CLS (Cumulative Layout Shift)

---

## 🎓 Usage Guidelines

### When to Use Magnetic Buttons
```tsx
<button data-magnetic>Click Me</button>
```
- Primary/Secondary CTAs
- Important navigation elements
- Large, prominent buttons
- **Not for**: Small icons, inline links, mobile (auto-disabled)

### When to Use Card Hover
```tsx
<article className="card-hover rounded-[20px] p-8 shadow-sm">
  {/* content */}
</article>
```
- Clickable cards
- Interactive panels
- Testimonial cards
- **Not for**: Static content, disabled states

### When to Add Parallax
- Large hero sections
- Background gradients
- Visual elements that shouldn't distract
- **Not for**: Text content, CTAs, functional elements

---

## 🔧 Customization

### Adjust Scrub Speed
```typescript
// Faster (more responsive)
scrollTrigger: { scrub: 1 }

// Slower (more cinematic)
scrollTrigger: { scrub: 3 }
```

### Change Magnetic Strength
```typescript
// Weaker pull
x: x * 0.08, y: y * 0.08

// Stronger pull
x: x * 0.25, y: y * 0.25
```

### Modify Curtain Timing
```typescript
// Slower curtain
start: "top 90%", end: "top 60%"

// Faster curtain
start: "top 80%", end: "top 50%"
```

---

## 🐛 Troubleshooting

### Issue: Animations stuttering
**Solution**: Check `will-change` usage. Remove from non-animating elements.

### Issue: Curtain not appearing
**Solution**: Ensure `[data-curtain]` has `z-50` and `overflow-hidden` on parent.

### Issue: Magnetic buttons not working
**Solution**: Verify GSAP context cleanup. Check console for errors.

### Issue: Cards not morphing smoothly
**Solution**: Ensure `scrub: 2` and `ease: "power1.inOut"` in timeline.

### Issue: Footer not revealing
**Solution**: Check `useFooterReveal` hook calculates footer height correctly.

---

## 📚 Resources

### GSAP Documentation
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Timeline](https://greensock.com/docs/v3/GSAP/Timeline)
- [Easing](https://greensock.com/docs/v3/Eases)

### Design References
- Typography: [Refactoring UI](https://refactoringui.com/)
- Animations: [Laws of UX](https://lawsofux.com/)
- Accessibility: [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎉 Summary

The OptiFind landing page now features:

✅ **Seamless scroll story** - No breaking between sections  
✅ **Hero parallax exit** - Elegant fade and shrink on scroll  
✅ **Morphing cards** - Cinematic carousel effect from right  
✅ **Sky-falling impact** - Background descends dramatically  
✅ **Blue curtain reveal** - Theatrical transition to testimonials  
✅ **Magnetic interactions** - Premium button feel  
✅ **Professional typography** - Consistent, responsive scale  
✅ **Performance optimized** - 60fps, hardware accelerated  
✅ **Fully accessible** - Reduced motion support  

All animations work together to create a **cohesive, professional, and delightful** user experience.
