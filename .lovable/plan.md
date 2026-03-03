

## Section 2 — Four Targeted Fixes

All changes confined to `src/pages/Index.tsx`, `src/index.css`, and `index.html`. Section 1 logic untouched.

---

### Fix 1: Circular Reveal via Overlay + Web Animations API

**Current problem**: Section 1's `clip-path` shrinks to reveal Section 2, but the CSS transition approach has timing issues.

**New approach**: Add a dedicated overlay `<div>` with `id="reveal-overlay"` rendered in the JSX. On START click:
1. Compute `cx`/`cy` from `getBoundingClientRect()` of the button
2. Use `overlay.animate()` (Web Animations API) to expand `clip-path: circle(0% at cx cy)` → `circle(150vmax at cx cy)` over 600ms
3. On `animation.finished`, set `currentSection = 2` and start countdown
4. Remove the old `clipPath` state and CSS `transition` from Section 1's wrapper entirely

**JSX**: Add a ref `revealOverlayRef` for the overlay div, rendered at z-index 9999 with `pointer-events: none`, `background: #ffb7fa`, initial `clip-path: circle(0% at 50% 50%)`.

**Index.tsx changes**:
- Remove `clipPath` state variable
- Remove `clip-path` and `transition` from Section 1 wrapper style
- `handleStart`: use `revealOverlayRef.current.animate(...)` with `.finished.then(...)` to transition and start countdown
- Section 1 stays in DOM until animation finishes, then `setCurrentSection(2)` removes it

---

### Fix 2: Kinetic Typography — Font Preload + Web Animations API + Clean Mask

**A. Font preload**: Add `<link rel="preload" href="/fonts/Articulat_CF_Demi_Bold.ttf" as="font" type="font/ttf" crossorigin="anonymous">` to `index.html`. Change `font-display: swap` → `font-display: block` in the `@font-face` for ArticulatCF.

**B. Font loading gate**: Before starting the countdown sequence, `await document.fonts.load('600 200px "ArticulatCF"')` to ensure no fallback flash on "3".

**C. Countdown rewrite using Web Animations API**:
- Replace the CSS class-based animation (`entering`/`holding`/`exiting` classes) with imperative `el.animate()` calls chained via `await animation.finished`
- Use a single ref (`numberElRef`) for the countdown `<span>`
- Each number cycle: set text content → entrance animate (280ms, translateY 100%→0%) → hold 1400ms via `setTimeout` wrapped in a Promise → exit animate (280ms, translateY 0%→-100%) → next number
- Remove `numberAnim` state entirely; the countdown is driven by an async function
- Keep `currentNumber` state for rendering, keep `countdownPhase` for guard logic
- Haptic `navigator.vibrate?.(10)` at each entrance

**D. Clean mask CSS**: Strip pseudo-elements, add explicit `background: transparent; border: none; outline: none; box-shadow: none; isolation: isolate;` to `.countdown-mask`.

**E. Font size**: Change to `clamp(120px, 18vw, 200px)`, remove the media query overrides.

---

### Fix 3: Canvas-Based Confetti

Replace DOM-based confetti with a `<canvas>` particle system.

**JSX**: Add a `<canvas>` ref (`confettiCanvasRef`) rendered when `showConfetti` is true, styled `position: fixed; inset: 0; z-index: 10000; pointer-events: none`.

**`triggerConfetti` rewrite**:
1. Set canvas size to `window.innerWidth × window.innerHeight`
2. Spawn 2 bursts (bottom-left, bottom-right), ~65 particles each with randomized `vx`, `vy`, `gravity`, `rotation`, `rotationSpeed`, `color`, `shape`, `alpha`, `fadeRate` per the spec
3. Run a `requestAnimationFrame` loop: update physics, draw rects/circles, remove dead particles, cancel when empty
4. Colors: `['#ffb7fa','#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ffffff','#ff922b']`
5. Remove all DOM confetti CSS (`.confetti-container`, `.confetti-piece`, `@keyframes confetti-burst`)

---

### Fix 4: Orientation Guard — Safari-Safe Glassmorphism

**CSS changes to `.orientation-guard`**:
- Background: `rgba(255, 255, 255, 0.12)` (lighter, more frosted)
- Add `-webkit-transform: translateZ(0); transform: translateZ(0); will-change: backdrop-filter;` to force GPU compositing
- Add `saturate(180%)` to both `backdrop-filter` declarations
- Box-shadow with depth: `0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.30)`
- z-index stays 99999

**Remove `backdrop-filter` from `.guard-card`**: WebKit invalidates nested backdrop-filter. The card keeps its white-tinted bg and border but drops its own blur.

---

### File-Level Summary

| File | Changes |
|---|---|
| `index.html` | Add `<link rel="preload">` for ArticulatCF font |
| `src/index.css` | ArticulatCF `font-display: block`; countdown font-size to `clamp()`; remove media query overrides; clean `.countdown-mask`; remove `.countdown-number.entering/.exiting` animation rules; remove `.confetti-container/.confetti-piece/@keyframes confetti-burst`; update `.orientation-guard` for Safari; remove `backdrop-filter` from `.guard-card` |
| `src/pages/Index.tsx` | Remove `clipPath`/`numberAnim` state; add `revealOverlayRef`/`numberElRef`/`confettiCanvasRef` refs; rewrite `handleStart` with overlay + Web Animations API; rewrite countdown as async function with `el.animate().finished`; rewrite `triggerConfetti` as canvas rAF particle system; add reveal overlay + canvas to JSX; update orientation guard pause/resume to work with new async approach |

### Pause/Resume Strategy (Orientation Guard)

The async countdown loop checks `isPausedRef.current` at each phase boundary. When paused, it enters a polling loop (`await new Promise(r => setTimeout(r, 100))`) until unpaused. This avoids complex timer cleanup — the async function simply waits. CSS `animationPlayState` manipulation is removed since we use Web Animations API (which can be paused via `animation.pause()`/`.play()` if mid-animation).

