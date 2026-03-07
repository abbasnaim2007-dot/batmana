

## 5 Fixes: Button Font, Section 1 Flash, Reveal Speed, Countdown Animation, Confetti

### Fix 1 — START Button Font
- **`src/index.css` line 17**: Add `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap');` alongside existing Google Fonts import
- **`src/pages/Index.tsx` line 472**: Change `fontFamily` from `'BatmanaMedium', sans-serif` to `'Open Sans', sans-serif`

### Fix 2 — Section 1 Flash After Reveal
- **`src/pages/Index.tsx` ~line 300** (inside `handleStart`, right after setting `overlay.style.clipPath`): Add a state update or direct DOM hide of Section 1 container at animation start, not after `await anim.finished`. Since Section 1 is conditionally rendered via `currentSection === 1`, we move `setCurrentSection(2)` to fire immediately after the clip-path animation begins (not after it finishes). This hides Section 1 behind the expanding overlay so when the overlay retires, Section 2 is already showing.

Concretely: move `setCurrentSection(2)` from line 322 to right after the `overlay.animate()` call (line 312), before `await anim.finished`.

### Fix 3 — Reveal Duration 800ms → 1400ms
- **`src/pages/Index.tsx` line 308**: Change `duration: 800` to `duration: 1400`

### Fix 4 — Countdown Animation Rewrite
- **`src/pages/Index.tsx`**: Replace `runCountdown` (lines 216-281) with new logic using translateY(60px) enter and translateY(-80px) exit, with 0.45s/0.35s durations, 700ms overlap timing. Use Web Animations API (consistent with existing pattern) but with the new values.
- **`src/index.css`**: Update `.countdown-mask` (lines 370-386) to have `overflow: visible; background: transparent;` and remove fixed width/height. Update `.countdown-number` (lines 397-414) to use `color: #ffb7fa`, remove text-shadow, set initial `transform: translateY(60px); opacity: 0;`.
- **`src/pages/Index.tsx` JSX**: Remove the conditional `countdownPhase === 'running' && currentNumber &&` wrapper so the countdown element stays in DOM for imperative animation. Show the countdown-mask always when section 2 is active.

### Fix 5 — Stronger Confetti
- **`src/pages/Index.tsx`**: Replace `triggerConfetti` (lines 126-213) with the user's stronger version: 300 particles, wider velocity range, lower gravity (0.25), rotation, rectangular shapes. Adapt to existing React refs pattern (use `confettiCanvasRef.current` instead of `document.getElementById`).

### Files changed
- `src/index.css` — Google Fonts import, countdown-mask, countdown-number styles
- `src/pages/Index.tsx` — handleStart timing, runCountdown rewrite, triggerConfetti rewrite, button font

