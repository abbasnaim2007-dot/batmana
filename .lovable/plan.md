

## Seamless Pink Circular Reveal — No Flash

### Architecture Change
Replace the current approach (section-two animates its own clip-path) with a dedicated `#pink-reveal` overlay that wipes over section-one, then fades out to expose section-two underneath.

### `src/index.css` — 3 edits

1. **Remove black body background** (lines 23-25): Delete `body { background: #000000; }`

2. **Replace `.section-two` rules** (lines 345-360): Remove clip-path approach, set `z-index: 100`, `opacity: 0`, `pointer-events: none`, no clip-path. `.section-two.is-active` sets `opacity: 1; pointer-events: all;`

3. **Add `#pink-reveal`** rule (new, after section-two rules):
   - `position: fixed; inset: 0; background: #ffb7fa; z-index: 999;`
   - `clip-path: circle(0% at 50% 50%); pointer-events: none; will-change: clip-path;`

### `src/pages/Index.tsx` — 2 edits

1. **Add `<div id="pink-reveal" />`** in JSX as sibling to section-hook and section-two (around line 433, before orientation guard)

2. **Replace `handleStart`** (lines 230-270) with new sequence:
   - Play sound
   - Get button position → compute xPct/yPct
   - Animate `#pink-reveal` clip-path from 0% to 150% (1.2s)
   - After 1250ms: hide section-hook, add `is-active` to section-two, fade out pink-reveal (opacity 0, 0.3s)
   - After another 350ms: disable pink pointer-events, call `runCountdown()`
   - Keep `setCurrentSection(2)` for orientation guard

### What stays unchanged
- Countdown logic, confetti, orientation guard, all other CSS

