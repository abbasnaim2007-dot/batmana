
## Section 1 — Three Precision Enhancements

### Overview

Three isolated changes to `src/pages/Index.tsx` and `src/index.css`. No new files. No Section 2 work. Every existing behavior is preserved.

---

### Enhancement 1: Global Fullscreen Button

**What it does:** A small `⛶` icon fixed to the bottom-right corner. It auto-hides after 3 seconds of inactivity and reappears on any touch/mouse/keyboard event. Hides completely while the browser is in fullscreen mode.

**Implementation approach:** Since this is a React component (not a plain HTML page), all logic goes into `Index.tsx` using React hooks — no raw DOM querySelector. The fullscreen button is a new `<button>` JSX element placed inside the root `<div>`, rendered independently of the Section 1 layout.

**`src/pages/Index.tsx` changes:**

- Add `useRef`, `useCallback` to imports
- Add two new state values: `isFullscreenBtnVisible` (boolean, starts `true`) and a ref `hideTimerRef` for the auto-hide timeout
- Add `useEffect` that:
  - Runs on mount, starts 3-second hide timer
  - Attaches `touchstart`, `mousemove`, `click`, `keydown` listeners that reset the timer
  - Attaches `fullscreenchange` / `webkitfullscreenchange` listeners to track real fullscreen state
  - Cleans up all listeners on unmount
- Add `toggleFullscreen()` handler that calls `document.documentElement.requestFullscreen()` / `exitFullscreen()` with webkit fallbacks
- Add JSX at the bottom of the root div:

```tsx
<button
  className="fullscreen-btn"
  onClick={toggleFullscreen}
  aria-label="Toggle fullscreen"
  style={{
    opacity: isFullscreenBtnVisible ? 1 : 0,
    transform: isFullscreenBtnVisible ? "translateY(0)" : "translateY(15px)",
    pointerEvents: isFullscreenBtnVisible ? "auto" : "none",
  }}
>
  ⛶
</button>
```

**`src/index.css` changes — add `.fullscreen-btn` class:**

```css
.fullscreen-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  font-size: 22px;
  color: rgba(100, 100, 100, 0.6);
  line-height: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.3s ease,
              background 0.2s ease, box-shadow 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(100, 100, 100, 0.9);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.fullscreen-btn:active {
  transform: scale(0.96) !important;
}
```

The `opacity` and `transform` are set via inline style on the element so the React state drives them, while the CSS class handles the hover/active pseudo-states.

---

### Enhancement 2: Batman Rain Velocity Fix

**The problem:** The current system hardcodes durations like `8s`, `10s`, etc. In landscape mode the viewport is shorter, so logos take the same 8–10 seconds to cross less vertical distance — making them appear faster visually. The fix: calculate duration from a constant velocity (150 px/s) and the actual viewport height.

**Implementation approach:** Since logos are generated as a static `const` array outside the component, switch to a `useMemo` inside the component so the logo configs recalculate when `isPortrait` changes (which already tracks orientation). Each logo's `duration` is derived from:

```
totalDistance = vh * 1.2   (from -10vh to 110vh)
duration = totalDistance / 150 px/s  ±15% variation
```

**`src/pages/Index.tsx` changes:**

- Remove the static `fallingLogos` const at the top of the file
- Add a `useMemo` inside the component that computes logo configs using `window.innerHeight` and the velocity formula — and re-runs when `isPortrait` changes

```tsx
const fallingLogos = useMemo(() => {
  const vh = window.innerHeight;
  const totalDistance = vh * 1.2; // -10vh to 110vh
  const baseVelocity = 150; // px/s
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + i * i * 3) % 100}%`,
    duration: `${((totalDistance / baseVelocity) * (0.87 + (i % 7) * 0.04)).toFixed(2)}s`,
    delay: `${(i * 0.31) % 5}s`,
    scale: 0.5 + (i % 7) * 0.08,
  }));
}, [isPortrait]);
```

Note: The `useMemo` import is already in the file — no new import needed.

---

### Enhancement 3: START Button — Realistic Glassmorphism (Reference Image)

**What the reference image shows:** A pill-shaped button with:
- Very light, nearly white frosted glass body (not pink-glowing)
- Grey/dark text (in our case, fuchsia text on the same glass body)
- A visible top-edge white bevel highlight (inner shadow)
- A soft grey drop shadow beneath for 3D depth
- No neon colored glow at all

**Changes needed:**

**`src/index.css` — rewrite `.start-btn`:**

- Replace `box-shadow: 0 0 15px rgba(255,19,240,0.3)` with the bevel+depth shadow system:
  ```
  box-shadow:
    0 8px 24px rgba(0,0,0,0.12),
    0 4px 12px rgba(0,0,0,0.08),
    inset 0 2px 4px rgba(255,255,255,0.6),
    inset 0 -1px 2px rgba(0,0,0,0.05);
  ```
- Change `backdrop-filter: blur(20px)` → `blur(12px)` (lighter blur so Batman logos are visible behind it)
- Remove the pink neon from `:hover` and `:active` pseudo-states — replace with grey shadow enhancement and white bevel changes
- Remove `button-glow-pulse` from the button animation (no more pulsing pink glow)

**`src/pages/Index.tsx` — update button inline styles:**

- Change `boxShadow` inline value to match the new bevel system (so it's correct on first render before CSS class kicks in)
- Remove `button-glow-pulse` from the animation string — keep `button-entrance` only
- Reduce `backdropFilter` / `WebkitBackdropFilter` from `blur(15px)` → `blur(12px)`

Also update `button-glow-pulse` keyframe in `src/index.css` to use the grey bevel shadow (so it doesn't fight the new button style if it's still referenced anywhere):

```css
@keyframes button-glow-pulse {
  0%, 100% {
    box-shadow:
      0 8px 24px rgba(0,0,0,0.12),
      0 4px 12px rgba(0,0,0,0.08),
      inset 0 2px 4px rgba(255,255,255,0.6),
      inset 0 -1px 2px rgba(0,0,0,0.05);
  }
  50% {
    box-shadow:
      0 10px 28px rgba(0,0,0,0.15),
      0 5px 14px rgba(0,0,0,0.1),
      inset 0 2px 5px rgba(255,255,255,0.7),
      inset 0 -1px 2px rgba(0,0,0,0.06);
  }
}
```

---

### Files Changed

| File | Changes |
|---|---|
| `src/index.css` | Add `.fullscreen-btn` class; rewrite `.start-btn` box-shadow + blur; update `button-glow-pulse` keyframe; update `.start-btn` hover/active pseudo-states |
| `src/pages/Index.tsx` | Add fullscreen state + logic + JSX; move `fallingLogos` into `useMemo`; update button inline `boxShadow`, `backdropFilter`, and `animation` |

No changes to: `index.html`, `App.tsx`, `tailwind.config.ts`, or any other file.

---

### Technical Notes

- The fullscreen button's `opacity` + `transform` are driven by React state (inline style) so the 3-second timer works cleanly with React's re-render cycle — no `querySelector` needed
- `useMemo` with `[isPortrait]` dependency correctly recalculates logo durations on each orientation change, which already triggers a state update via the existing `resize` / `orientationchange` listeners
- Reducing blur from 20px → 12px lets the falling Batman logos be partially visible behind the glass, which actually makes the frosted effect more perceptible (the reference image shows a relatively light blur)
- The inset shadow technique (`inset 0 2px 4px rgba(255,255,255,0.6)`) creates the top bevel highlight seen in the reference image — it simulates light hitting the top edge of the glass pill
