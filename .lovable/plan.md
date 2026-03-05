

## Section 2 — Z-Index Hierarchy Rewrite + Overlay Init Fix

### What's wrong now

The current z-index values (10000, 9999, 10001, 10002, 99999) are inflated. The reveal overlay has no explicit inactive default state in CSS and no activation step before `animate()`. The START button uses Open Sans instead of the Camel font.

### Changes

**`src/index.css`** — 4 edits:

1. `.section-two` z-index: `10000` → `200`
2. `.reveal-overlay` z-index: `9999` → `-1`; add `opacity: 0; pointer-events: none;` as default inactive state
3. `.countdown-mask` z-index: `10001` → remove (keep visibility gating, remove z-index line)
4. `.orientation-guard` z-index: `99999` → `999`

**`src/pages/Index.tsx`** — 4 edits:

1. **Section 1 inline z-index** (line 385): `200` → `100`
2. **Confetti canvas inline z-index** (line 364): `10002` → `500`
3. **Overlay activation before animate()** — insert before `overlay.style.clipPath` (line 297):
   ```ts
   overlay.style.zIndex = '300';
   overlay.style.opacity = '1';
   overlay.style.pointerEvents = 'all';
   ```
4. **START button font** (line 469): `'Open Sans', sans-serif` → `'BatmanaMedium', sans-serif`

### Asset copies

Copy uploaded files to replace existing assets:
- `user-uploads://Articulat_CF_Demi_Bold-3.ttf` → `public/fonts/Articulat_CF_Demi_Bold.ttf`
- `user-uploads://The_Year_of_The_Camel_Medium-3.otf` → `public/fonts/The_Year_of_The_Camel_Medium.otf`
- `user-uploads://mixkit-long-pop-2358-4.wav` → `public/sounds/mixkit-long-pop-2358.wav`

### What stays unchanged
- Clip-path animation (800ms, easing, keyframes, origin calc)
- Post-animation overlay teardown (already sets zIndex=-1, opacity=0, pointerEvents=none)
- Countdown logic, confetti physics, orientation guard styling
- Font pre-warm useEffect, rAF paint wait

