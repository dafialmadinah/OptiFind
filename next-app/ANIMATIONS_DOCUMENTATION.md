# 🎬 OptiFind Landing Page - Professional Story Scroll Animations

## Overview
Landing page dengan animasi professional yang story-driven menggunakan GSAP 3.x + ScrollTrigger. Semua animasi smooth, responsive, dan accessible.

---

## 🎨 Animation Features

### 1. **Scroll Progress Indicator**
- Fixed gradient bar di top
- Scales dari 0 → 1 based on scroll
- Visual progress through story journey
- **Hook**: `useScrollProgress()`

### 2. **Hero Parallax (Multi-Layer)**
- **Visual Layer**: Moves 30% down + rotates 8°
- **Content Layer**: Moves 15% up  
- **Gradient Layer**: Shifts 50% down
- **Fade Effect**: Opacity 1 → 0.3 on scroll
- **Floating Decorative Blobs**: 3 layers with different parallax depths
- **Hook**: `useParallaxHero()`

### 3. **Story-Driven Navbar**
- Auto-hide on scroll down
- Show on scroll up
- Background blur + shadow on scroll past hero
- Smooth y-transform transitions
- **Hook**: `useStoryNavbar()`

### 4. **Text Reveal Animation**
- Splits text into words
- Each word slides up + fades in
- Stagger delay 0.05s
- Trigger: `data-text-reveal` attribute
- **Hook**: `useTextReveal()`

### 5. **Magnetic Buttons**
- Buttons follow cursor on hover
- Move 30% towards cursor position
- Elastic bounce back on leave
- Trigger: `data-magnetic` attribute
- **Hook**: `useMagneticButtons()`

### 6. **Floating Elements with Parallax**
- **Continuous Float**: y ±20px, x ±15px, rotation ±5°
- **Mouse Parallax**: Elements move based on cursor position
- Different depths per element (10px × index)
- Trigger: `data-float` attribute
- **Hook**: `useFloatingElements()`

### 7. **Section Transitions**
- Scale 0.9 → 1 + fade 0.7 → 1 on enter
- Scale 1 → 0.95 + fade 1 → 0.5 on exit
- Cinematic section-to-section flow
- **Hook**: `useSectionTransitions()`

### 8. **Custom Cursor**
- Main cursor: 20px orange circle with mix-blend-mode
- Trail: 8px delayed follower
- Expands to 40px on interactive elements
- Hidden on mobile (≤768px)
- **Hook**: `useCursorFollower()`

---

## 📦 Section Breakdown

### **Hero Section**
- ✅ Multi-layer parallax (3 layers)
- ✅ Floating decorative blobs (3x)
- ✅ Text reveal on headline
- ✅ Magnetic CTAs (2 buttons)
- ✅ Fade out on scroll

### **HowItWorks Section** 
- ✅ Cards morphing (existing)
- ✅ Text reveal on title
- ✅ Hover effects: shadow-xl, -translate-y-1
- ✅ Icon scale + rotate on hover

### **CommunityImpact Section**
- ✅ Floating decorative elements (2x)
- ✅ Text reveal on title
- ✅ Stats icons with hover scale + rotate
- ✅ Background animation (existing)

### **Testimonials Section**
- ✅ Text reveal on "Apa kata mereka?"
- ✅ Magnetic feedback button
- ✅ Card hover lift effects
- ✅ Avatar + nav button hover animations
- ✅ Footer reveal (existing)

---

## 🎯 Technical Details

### **Performance**
```css
/* Hardware Acceleration */
transform: translateZ(0);
will-change: transform;
backface-visibility: hidden;
-webkit-backface-visibility: hidden;
```

### **Scrub Timing** (Consistent)
- All ScrollTrigger: `scrub: 2`
- Smooth, no "patah" transitions

### **Easing** (Standardized)
- Main: `power2.out`, `power2.in`
- Smooth: `power1.inOut`
- Elastic: `elastic.out(1, 0.3)` (magnetic buttons)

### **Accessibility**
```javascript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if (prefersReducedMotion) return; // Skip animations
```

### **Mobile Optimization**
- Custom cursor hidden on ≤768px
- All animations work on touch devices
- Magnetic buttons disabled on mobile (no mouse)

---

## 🎮 Data Attributes

| Attribute | Purpose | Hook |
|-----------|---------|------|
| `data-scroll-progress` | Scroll progress bar | `useScrollProgress` |
| `data-hero` | Hero section trigger | `useParallaxHero` |
| `data-hero-visual` | Hero visual layer | `useParallaxHero` |
| `data-hero-content` | Hero content layer | `useParallaxHero` |
| `data-hero-gradient` | Hero gradient layer | `useParallaxHero` |
| `data-story-navbar` | Navbar element | `useStoryNavbar` |
| `data-text-reveal` | Text to split/reveal | `useTextReveal` |
| `data-magnetic` | Magnetic button | `useMagneticButtons` |
| `data-float` | Floating element | `useFloatingElements` |
| `.section` | Section transition | `useSectionTransitions` |

---

## 🚀 Usage Example

```tsx
// In component
import { useParallaxHero } from "@/hooks/useParallaxHero";

export default function LandingPage() {
  useParallaxHero(); // Enable parallax
  
  return (
    <section data-hero>
      <div data-hero-gradient>...</div>
      <div data-hero-content>
        <h1 data-text-reveal>Your Title</h1>
        <button data-magnetic>CTA</button>
      </div>
      <div data-hero-visual>
        <img src="..." />
      </div>
      <div data-float>Decorative</div>
    </section>
  );
}
```

---

## 🎬 Story Flow

1. **Hero** → Parallax layers create depth, fade out on scroll
2. **Scroll Progress** → Visual indicator of journey
3. **Navbar** → Auto-hides to minimize distraction
4. **HowItWorks** → Cards morph, smooth transitions
5. **CommunityImpact** → Background enters, counters animate
6. **Testimonials** → Cards reveal, footer slides up
7. **Throughout** → Magnetic buttons, floating elements, custom cursor

---

## 📊 Animation Timing

| Animation | Duration | Ease | Scrub |
|-----------|----------|------|-------|
| Hero parallax | - | none | 2 |
| Text reveal | 0.8s | power2.out | - |
| Magnetic buttons | 0.5s | power2.out | - |
| Section transitions | - | power2.out/in | 2 |
| Floating elements | 2-4s | sine.inOut | - |
| Cursor follow | 0.2-0.5s | power2.out | - |

---

## ✨ Premium Details

- **Mix-blend-mode**: Custom cursor has `difference` blend
- **Stagger**: Text words, icon animations
- **Elastic Bounce**: Magnetic buttons return with spring
- **Multi-depth Parallax**: 3 layers in hero, floating elements
- **Gradient Animation**: Progress bar uses gradient
- **Shadow Progression**: Elements gain shadow on hover
- **Rotation**: Visual elements rotate on scroll/hover

---

## 🛠️ Built With

- **GSAP 3.x** - Animation engine
- **ScrollTrigger** - Scroll-based animations
- **Next.js 14** - App Router + TypeScript
- **Tailwind CSS** - Styling + utilities
- **Custom Hooks** - Modular animation system

---

## 📝 Notes

- All hooks clean up on unmount
- ResizeObserver for dynamic measurements
- Respects user motion preferences
- GPU-accelerated for 60fps
- Mobile-first responsive design

---

**Status**: ✅ Production Ready
**Version**: 2.0 - Professional Story Scroll
**Last Updated**: October 27, 2025
