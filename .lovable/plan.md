

## Fullscreen Button — Toggle Functionality Update

### Overview

Update the existing fullscreen button so it remains visible (and usable) while in fullscreen mode, toggles between expand/exit icons, and uses the same realistic glassmorphism styling as the START button.

---

### Changes

**2 files modified, no new files.**

---

### 1. `src/pages/Index.tsx`

**A. Fix `showFullscreenBtn` (line 26)** — Remove the early return `if (isInFullscreen) return;` so the auto-hide timer works in both normal and fullscreen modes.

**B. Update `onFullscreenChange` handler (lines 50-52)** — Instead of hiding the button when entering fullscreen, show it briefly (with the 3-second auto-hide timer), same as when exiting.

**C. Remove conditional rendering (line 235)** — Change `{!isInFullscreen && (` to always render the button. The button should be visible in fullscreen so users can exit.

**D. Add icon toggle** — Show `⛶` when not in fullscreen, `✕` when in fullscreen. Change `aria-label` accordingly.

**E. Add `in-fullscreen` class** — When `isInFullscreen` is true, append `"fullscreen-btn in-fullscreen"` as className so CSS can style the fuchsia icon tint.

Final JSX:

```tsx
<button
  className={`fullscreen-btn${isInFullscreen ? " in-fullscreen" : ""}`}
  onClick={toggleFullscreen}
  aria-label={isInFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
  style={{
    opacity: isFullscreenBtnVisible ? 1 : 0,
    transform: isFullscreenBtnVisible ? "translateY(0)" : "translateY(15px)",
    pointerEvents: isFullscreenBtnVisible ? "auto" : "none",
  }}
>
  {isInFullscreen ? "✕" : "⛶"}
</button>
```

---

### 2. `src/index.css`

**A. Update `.fullscreen-btn` base styles (lines 240-263)** — Replace with realistic glassmorphism matching the START button:
- `background: rgba(255, 255, 255, 0.2)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(255, 255, 255, 0.5)`
- Bevel shadow system (grey drop shadow + white inset highlight)
- Add `display: flex; justify-content: center; align-items: center;`

**B. Update `.fullscreen-btn:hover` (lines 265-269)** — Enhanced bevel shadow on hover, with `transform: scale(1.08)`.

**C. Update `.fullscreen-btn:active` (lines 271-274)** — Pressed-in shadow (inverted inset), `transform: scale(0.96) translateY(1px)`.

**D. Add new rules:**
- `.fullscreen-btn.in-fullscreen` — fuchsia icon color (`rgba(255, 19, 240, 0.8)`)
- `.fullscreen-btn.in-fullscreen:hover` — stronger fuchsia on hover (`#FF13F0`)
- `.fullscreen-btn:focus-visible` — focus ring with fuchsia border accent

---

### What Changes Functionally

| Before | After |
|---|---|
| Button hidden entirely in fullscreen | Button stays visible (auto-hides after 3s, reappears on interaction) |
| No way to exit fullscreen via button | Click button again to exit fullscreen |
| Single icon `⛶` always | `⛶` in normal mode, `✕` in fullscreen mode |
| Grey icon always | Grey normally, fuchsia tint in fullscreen |
| Simple flat shadow | Realistic bevel glassmorphism matching START button |

### What Stays the Same

- 3-second auto-hide timer
- Reappear on touch/mouse/keyboard activity
- Bottom-right fixed position
- `toggleFullscreen()` logic (already supports both enter and exit)
- Responsive sizing at 360px breakpoint
