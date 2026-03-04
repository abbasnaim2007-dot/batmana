

## Section 2 — Complete Sequencing Rewrite

### Changes in `src/pages/Index.tsx`

**1. Font pre-warm on mount** (new useEffect):
Add a useEffect that runs `document.fonts.load('600 200px "ArticulatCF"')` on mount and adds `font-ready` class to `document.documentElement` when resolved. Fire-and-forget, does not block anything.

**2. Rewrite `handleStart`** — strict post-animation sequencing:
The clip-path animation call (origin, keyframes, duration 800, easing, fill) stays identical. After `await anim.finished`:
- Step 1: Retire overlay synchronously (`pointerEvents: 'none'`, `zIndex: '-1'`, `opacity: '0'`)
- Step 2: Activate Section 2 — `setCurrentSection(2)` (React renders section-two visible)
- Step 3: Reset abort flag, call `runCountdown()` — single call site, no other invocations exist

Current code already does Steps 1-3 in the right order. The only structural issue is that `setCurrentSection(2)` triggers a React re-render, and `runCountdown()` fires before the DOM updates. Fix: add `await new Promise(r => requestAnimationFrame(r))` between `setCurrentSection(2)` and `runCountdown()` to ensure Section 2 DOM is painted before countdown starts.

**3. Section 2 z-index update** — in CSS:
- `.section-two` z-index: `100` → `10000`
- `.countdown-mask` gets `z-index: 10001` (relative stacking)
- Confetti canvas inline style already has `z-index: 10002` ✓ (but update from 10000 → 10002)
- `.orientation-guard` stays `99999` ✓
- `.reveal-overlay` stays `9999` ✓

**4. Confetti canvas z-index** — in JSX inline style, change from `10000` to `10002`.

### Changes in `src/index.css`

- `.section-two` → `z-index: 10000`
- Add `.countdown-mask` → `z-index: 10001`
- Add font-ready gating:
  ```css
  .countdown-mask { visibility: hidden; }
  .font-ready .countdown-mask { visibility: visible; }
  ```
  (Merge with existing `.countdown-mask` rule)

### No changes to
- Clip-path animation values, origin, duration (800), easing, color
- Confetti particle physics
- Orientation guard glassmorphism
- Section 1 content/styles

### File summary

| File | What changes |
|---|---|
| `src/pages/Index.tsx` | Add font pre-warm useEffect; add rAF await between setCurrentSection and runCountdown; update confetti canvas z-index to 10002 |
| `src/index.css` | `.section-two` z-index → 10000; `.countdown-mask` add z-index 10001 + font-ready visibility gating |

