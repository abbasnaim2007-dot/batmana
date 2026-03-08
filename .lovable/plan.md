

## Critical Bug Fix: Pink Screen on Load + Asset Refresh

### Root Cause

`.section-two` has `z-index: 200` and `background: #ffb7fa`, sitting **above** Section 1 at `z-index: 100`. It renders immediately, covering everything with a pink screen.

### Fix

**`src/index.css`** — 2 edits:

1. `.section-two`: Add `opacity: 0; pointer-events: none;` as default hidden state, keep `z-index: 200`
2. Add `.section-two.is-active` rule: `opacity: 1; pointer-events: all;`

**`src/pages/Index.tsx`** — 2 edits:

1. On the `.section-two` div, conditionally add `is-active` class when `currentSection === 2`:
   ```tsx
   <div className={`section-two${currentSection === 2 ? ' is-active' : ''}`}>
   ```
2. Remove the `setCurrentSection(2)` guard on Section 1 rendering — Section 1 stays in DOM but is naturally behind the overlay/section-two stack. (Or keep as-is since Section 1 unmounts when `currentSection !== 1`, which is fine.)

### Asset Copies

- `user-uploads://Articulat_CF_Demi_Bold-4.ttf` → `public/fonts/Articulat_CF_Demi_Bold.ttf`
- `user-uploads://The_Year_of_The_Camel_Medium-4.otf` → `public/fonts/The_Year_of_The_Camel_Medium.otf`
- `user-uploads://mixkit-long-pop-2358-5.wav` → `public/sounds/mixkit-long-pop-2358.wav`

### What stays unchanged
- All transition logic in `handleStart` (overlay activation, clip-path animation, teardown, rAF wait, `runCountdown()`)
- Countdown, confetti, orientation guard logic
- Z-index values for overlay, confetti canvas, orientation guard

