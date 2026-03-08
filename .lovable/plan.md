

## Use section-two as the circular reveal element

### CSS Changes (`src/index.css`)

**Replace `.section-two` rule (lines 341-351)** with clip-path based version:
- Remove `opacity: 0` — use `clip-path: circle(0% at 50% 50%)` to hide instead
- Add `will-change: clip-path`
- Keep `pointer-events: none` as default

**Update `.section-two.is-active` (lines 353-356)**: Only set `pointer-events: all` (remove `opacity: 1`)

**Delete `.reveal-overlay` rule entirely** (lines 358-368)

### JSX Changes (`src/pages/Index.tsx`)

1. **Remove reveal-overlay div** (line 431) and `revealOverlayRef` ref (line 20)
2. **Replace `handleStart`** (lines 230-283) with new version that:
   - Plays sound, hides section-hook
   - Gets button position for reveal origin
   - Adds `is-active` class to section-two
   - Animates `clip-path` via inline style + CSS transition (1.4s ease-in-out)
   - Calls `startCountdown()` after 1500ms timeout
   - No longer uses `revealOverlayRef`, Web Animations API, or `setCurrentSection`
3. **Remove `currentSection` conditional** around section-hook (line 306) — keep it always rendered since handleStart hides it via inline style
4. **Remove `currentSection === 2` conditional** from section-two class — the new handleStart manages `is-active` class imperatively
5. **Keep** `currentSection` state for orientation guard logic

### What stays unchanged
- `runCountdown`, `triggerConfetti`, confetti canvas, orientation guard
- countdown-mask and countdown-number CSS
- All other CSS rules

