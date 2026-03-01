

## Section 1 Audio Swap + Section 2 Cinematic Countdown

### Part A: Audio File Swap (Simple)

1. Copy `user-uploads://mixkit-long-pop-2358-2.wav` to `public/sounds/mixkit-long-pop-2358.wav`
2. Copy `user-uploads://Articulat_CF_Demi_Bold.ttf` to `public/fonts/Articulat_CF_Demi_Bold.ttf`
3. In `src/pages/Index.tsx` line 14, change the audio path from `"/sounds/mixkit-hard-pop-click-2364.wav"` to `"/sounds/mixkit-long-pop-2358.wav"`

---

### Part B: Section 2 — The Cinematic Countdown

The entire experience lives in `src/pages/Index.tsx` (single component) with supporting CSS in `src/index.css`. Section 2 is always in the DOM underneath Section 1, revealed by a circular wipe transition.

---

#### Architecture

```text
Index component state:
  currentSection: 1 | 2
  isExiting: boolean (Section 1 fade/wipe)
  clipPath: string (for circular reveal)
  countdownPhase: 'idle' | 'running' | 'done'
  currentNumber: 3 | 2 | 1 | null
  numberAnim: 'entering' | 'holding' | 'exiting' | null
  isPaused: boolean (orientation guard pause)
  showConfetti: boolean

Layer stack (z-index):
  Section 2 background: z-index 100 (always in DOM)
  Section 1 overlay:    z-index 200 (clip-path reveals Section 2)
  Fullscreen button:    z-index 99999 (persists across sections)
  Orientation guard:    z-index 999998
```

---

#### CSS Additions to `src/index.css`

1. **New `@font-face`** for ArticulatCF (Articulat CF Demi Bold) alongside existing BatmanaMedium declaration

2. **Section 2 base styles:**
   - `.section-two` -- solid `#ffb7fa` background, fixed, full viewport, z-index 100
   - `.countdown-mask` -- overflow hidden container, centered, 320x300px
   - `.countdown-number` -- ArticulatCF font, 240px size, white, fuchsia neon glow text-shadow, positioned for vertical slide

3. **Countdown keyframes:**
   - `@keyframes masked-slide-enter` -- translateY(100%) + blur(10px) to translateY(0%) + blur(0), 0.6s
   - `@keyframes masked-slide-exit` -- translateY(0%) + blur(0) to translateY(-100%) + blur(10px), 0.6s

4. **Orientation guard styles:**
   - `.orientation-guard` -- fixed overlay, `rgba(255, 183, 250, 0.4)` background, `backdrop-filter: blur(20px)`, z-index 999998
   - `.guard-card` -- glassmorphism card with white bg, 25px blur, fuchsia border glow
   - `.guard-message` -- BatmanaMedium font, 24px, fuchsia, RTL

5. **Confetti styles:**
   - `.confetti-piece` -- absolute positioned, animated with CSS custom properties for target position and rotation
   - `@keyframes confetti-burst` -- bottom 0 to bottom 100%, with rotation and opacity fade

6. **Responsive countdown font sizes:**
   - `@media (max-width: 400px)` -- 180px
   - `@media (min-height: 500px) and (orientation: landscape)` -- 260px

---

#### Component Logic Changes in `src/pages/Index.tsx`

**New state variables:**
- `currentSection` (1 or 2)
- `clipPath` (string for the circular reveal CSS)
- `countdownPhase` ('idle', 'running', 'done')
- `currentNumber` (3, 2, 1, or null)
- `numberAnim` ('entering', 'holding', 'exiting', or null)
- `isPaused` (boolean for orientation guard)
- `showConfetti` (boolean)

**Updated `handleStart` function:**
1. Play pop sound immediately (unchanged)
2. Get the START button's bounding rect, compute center as viewport percentages
3. Set initial `clipPath` to `circle(0% at X% Y%)`
4. Use `requestAnimationFrame` to animate `clipPath` to `circle(150% at X% Y%)` over 1.2s using a CSS transition on the Section 1 wrapper
5. After 1.2s, set `currentSection = 2`, remove Section 1 from DOM, activate orientation guard, and begin countdown

**Countdown sequence (`startCountdown`):**
- For each number (3, 2, 1):
  1. Set `currentNumber`, `numberAnim = 'entering'`
  2. Trigger haptic: `navigator.vibrate?.(10)`
  3. After 0.6s, set `numberAnim = 'holding'`
  4. After 1.4s more, set `numberAnim = 'exiting'`
  5. After 0.6s more, move to next number
- After number 1 finishes:
  1. Wait 200ms
  2. Set `showConfetti = true`, trigger pattern vibration `navigator.vibrate?.([30, 50, 30])`
  3. After 2.5s, clear confetti
  4. Log "Ready for Section 3"

**Orientation guard logic:**
- Disabled when `currentSection === 1`
- When `currentSection >= 2` and device is portrait: show guard overlay, pause countdown (clear timeouts, set `animationPlayState: 'paused'` on active number)
- When landscape resumes: hide guard, resume countdown from where it paused

**Confetti generation (JS, not CSS-only):**
- On trigger, dynamically create 100 div elements (50 per corner) with random colors from the specified palette, random shapes (circle vs square via border-radius), random target positions and rotations via CSS custom properties
- Each piece uses the `confetti-burst` keyframe animation with 2.5s duration
- Clean up DOM after animation completes

---

#### JSX Structure

```text
<>
  {/* Section 2 -- always in DOM, behind Section 1 */}
  {currentSection >= 1 && (
    <div className="section-two">
      {/* Countdown mask */}
      {countdownPhase === 'running' && currentNumber && (
        <div className="countdown-mask">
          <span className={`countdown-number ${numberAnim}`}>
            {currentNumber}
          </span>
        </div>
      )}

      {/* Confetti containers */}
      {showConfetti && <div className="confetti-container" ref={confettiRef} />}
    </div>
  )}

  {/* Section 1 -- on top, uses clip-path for circular reveal */}
  {currentSection === 1 && (
    <div style={{ clipPath, transition: 'clip-path 1.2s cubic-bezier(0.4,0,0.2,1)', zIndex: 200, ... }}>
      {/* All existing Section 1 content unchanged */}
    </div>
  )}

  {/* Orientation guard -- Section 2+ only */}
  {currentSection >= 2 && isPortrait && (
    <div className="orientation-guard">
      <div className="guard-card">
        <p className="guard-message">
          باتمانة.. ارجعي اقلبي التلفون<br />عشان تكمل المفاجأة!
        </p>
      </div>
    </div>
  )}

  {/* Fullscreen button -- persists across all sections */}
  <button className={`fullscreen-btn ...`} ...>
    {isInFullscreen ? "✕" : "⛶"}
  </button>
</>
```

**Important structural note:** The clip-path circular reveal works by applying an *inverted* clip-path to Section 1. Section 1 starts fully visible (`circle(150% at X% Y%)`). On START click, the clip-path shrinks to `circle(0% at X% Y%)`, making Section 1 disappear and revealing Section 2 underneath. This avoids the need for a separate pink overlay element.

Actually, re-reading the spec: the circle of pink expands FROM the button center. So the approach is:
- Section 2 (pink bg) sits behind Section 1 at z-index 100
- Section 1 gets `clip-path: circle(150vmax at 50% 50%)` initially (fully visible)
- On click, transition clip-path to `circle(0% at Xpx Ypx)` over 1.2s -- Section 1 shrinks away revealing pink Section 2
- After transition, remove Section 1 from DOM

---

#### Files Changed Summary

| File | Changes |
|---|---|
| `public/sounds/mixkit-long-pop-2358.wav` | New file (copied from upload) |
| `public/fonts/Articulat_CF_Demi_Bold.ttf` | New file (copied from upload) |
| `src/index.css` | Add ArticulatCF font-face; add Section 2, countdown, orientation guard, and confetti CSS with keyframes |
| `src/pages/Index.tsx` | Swap audio path; add Section 2 state management, circular reveal transition, countdown sequence with haptic feedback, orientation guard, confetti explosion |

No other files change. The fullscreen button remains global and works across both sections.

