# 🎯 Quick Animation Reference

## Add Animations to Your Components

### 1. Parallax Hero
```tsx
<section data-hero>
  <div data-hero-gradient className="absolute inset-0 bg-gradient-..." />
  <div data-hero-content>Content here</div>
  <div data-hero-visual><img /></div>
  <div data-float>Decorative blob</div>
</section>
```

### 2. Text Reveal
```tsx
<h2 data-text-reveal>Your Headline Text</h2>
```

### 3. Magnetic Buttons
```tsx
<button data-magnetic className="...">
  Click Me
</button>
```

### 4. Floating Elements
```tsx
<div data-float className="absolute ...">
  Decorative element
</div>
```

### 5. Section Transitions
```tsx
<section className="section h-screen">
  Your content
</section>
```

## Available Hooks

```tsx
import { useParallaxHero } from "@/hooks/useParallaxHero";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useStoryNavbar } from "@/hooks/useStoryNavbar";
import { useTextReveal } from "@/hooks/useTextReveal";
import { useMagneticButtons } from "@/hooks/useMagneticButtons";
import { useFloatingElements } from "@/hooks/useFloatingElements";
import { useSectionTransitions } from "@/hooks/useSectionTransitions";
import { useCursorFollower } from "@/hooks/useCursorFollower";

function MyPage() {
  useParallaxHero();
  useScrollProgress();
  useStoryNavbar();
  useTextReveal();
  useMagneticButtons();
  useFloatingElements();
  useSectionTransitions();
  useCursorFollower();
  
  return <div>...</div>;
}
```

## Customization

### Disable Custom Cursor
Remove `useCursorFollower()` hook and remove `cursor: none;` from `globals.css`

### Adjust Parallax Speed
Edit `useParallaxHero.ts`:
```tsx
// Slower
yPercent: 20, // was 30

// Faster  
yPercent: 50, // was 30
```

### Change Magnetic Strength
Edit `useMagneticButtons.ts`:
```tsx
x: x * 0.5, // was 0.3 (stronger pull)
x: x * 0.1, // was 0.3 (weaker pull)
```

### Modify Text Reveal Speed
Edit `useTextReveal.ts`:
```tsx
duration: 1.2, // was 0.8 (slower)
stagger: 0.1,  // was 0.05 (more delay between words)
```

## Troubleshooting

### Animations not working?
1. Check GSAP is installed: `npm install gsap`
2. Verify data attributes are present
3. Open DevTools → Check console for errors

### Performance issues?
1. Reduce number of floating elements
2. Disable custom cursor on slower devices
3. Increase scrub values (2 → 3 for slower)

### Mobile not working?
- Magnetic buttons automatically disabled (no mouse)
- Custom cursor hidden on ≤768px
- All other animations should work

## Best Practices

✅ **DO**
- Use `data-` attributes for triggers
- Keep floating elements under 5 per section
- Test on actual devices
- Respect `prefers-reduced-motion`

❌ **DON'T**
- Nest `data-magnetic` elements
- Add too many `data-float` elements
- Forget to clean up in useEffect
- Override `will-change` without reason
