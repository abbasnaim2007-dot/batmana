
## Section 1 Refined: Floating Layout + Landscape Start Button

### What's Changing (Summary)

The glassmorphism card is removed entirely. The Batman image and Arabic text will float freely on the Ghost White background. The falling logo animation is fixed. A Start button appears only in landscape mode. The new image asset is copied in.

---

### Files to Change

**1. `src/assets/pookie_batman.jpg`** — Replace with the newly uploaded `image_8a825b.jpg` (Batman with pink bows — the correct image).

**2. `src/index.css`** — Update keyframes and add new ones:
- Fix `batman-fall`: currently uses `translateY` which conflicts with the `scale` transform on the logo elements. Rewrite to animate `top` from `-10vh` → `110vh` so logos truly reach the bottom regardless of viewport size.
- Replace `gentle-pulse` (scale) with `gentle-float` (translateY 0 → -12px → 0) for the dreamlike floating effect.
- Keep `text-glow` keyframe as-is.
- Add `button-entrance` keyframe (scale 0.8 + translateY 20px → scale 1 + translateY 0).
- Add `button-glow-pulse` keyframe (box-shadow intensity oscillation).
- Update `@import` to load Cairo at weight **400** (currently 900) — add `400` to the import URL so both weights are available.
- Add `@media (prefers-reduced-motion)` rules for the float and button animations.

**3. `src/pages/Index.tsx`** — Full component rewrite:

**Falling logos** — keep the 18-logo array but fix the randomization so each logo gets a truly varied `left` position (use `Math.random()`-style distribution via `useMemo` instead of the current deterministic `(i * 5.5) % 100` pattern). Each logo's animation now uses `top` keyframe animation (not `translateY`) so the `scale` transform on the element doesn't interfere. The container div gets `overflow: visible` so logos aren't clipped, and the outer wrapper gets `overflow: hidden` only on the main container.

**Layout** — remove the card `div` entirely. Replace with a simple `flex column, center` container:
```
position: fixed, inset: 0
background: #F8F9FA
display: flex, flexDirection: column
alignItems: center, justifyContent: center
gap: 28px
zIndex: 50
overflow: hidden (to clip logos at edges)
```

**Image** — float directly in the flex column:
```
width: 180px, height: 180px
objectFit: cover
border: 4px solid #FFC4FB
borderRadius: 16px
boxShadow: 0 8px 24px rgba(255, 196, 251, 0.35)
animation: gentle-float 4s ease-in-out infinite
zIndex: 10, position: relative
willChange: transform
```

**Arabic text** — float directly in the flex column:
```
fontFamily: "'Cairo', sans-serif"
fontSize: 27px
fontWeight: 400  ← CHANGED from 900
color: #FF13F0
direction: rtl
unicodeBidi: embed
textAlign: center
lineHeight: 1.6
letterSpacing: 0.3px
padding: 0 20px
maxWidth: 90vw
textShadow: 0 2px 6px rgba(255, 19, 240, 0.2)
zIndex: 10, position: relative
```

**Start button** — added as a sibling in the flex column:
- Rendered in JSX but shown/hidden via `isPortrait` state (already tracked)
- **Portrait**: `opacity: 0`, `pointerEvents: none`, `display: none` effectively (use opacity + scale trick so it doesn't affect layout — actually use conditional rendering with the `isPortrait` flag to toggle a CSS class)
- **Landscape** (`!isPortrait`): rendered with `opacity: 1`, entrance animation plays, then `button-glow-pulse` runs infinitely
- Style:
  ```
  padding: 14px 48px
  background: #FF13F0
  border: 2px solid #FFFFFF
  borderRadius: 12px
  fontFamily: Cairo, sans-serif
  fontSize: 22px
  fontWeight: 600
  color: #FFFFFF
  letterSpacing: 1px
  boxShadow: 0 0 20px rgba(255,19,240,0.6), 0 4px 16px rgba(255,19,240,0.4)
  animation: button-entrance 0.8s + button-glow-pulse 2s 0.8s infinite
  cursor: pointer
  ```
- `onClick` handler: fades the entire section to `opacity: 0` over 600ms (sets a `isExiting` state that applies the fade transition), then calls `startCountdown()` placeholder (console.log for now since Section 2 doesn't exist yet)

**Orientation logic** — existing `isPortrait` state hook stays. The button simply reads `!isPortrait`.

---

### Technical Notes

- The `batman-fall` keyframe switch from `translateY` to animating `top` is necessary because the logos have an initial `top: "-10vh"` set via inline style — the animation will override `top` from `-10vh` to `110vh`. This avoids the transform conflict with `scale`.
- All animated elements get `will-change: transform` for GPU compositing.
- Cairo weight 400 must be added to the Google Fonts `@import` URL in `src/index.css` (currently only 900 is imported). The `index.html` `<link>` tag also needs updating.
- The logo container needs `overflow: visible` while the outer wrapper uses `overflow: hidden` — this is handled by keeping `overflow: hidden` on the root `fixed inset-0` div while the logo `div` wrapper is `position: absolute, inset: 0` with `pointer-events: none`. The logos animate with `top` so they naturally exit the `overflow: hidden` clipping of the parent — this is correct behavior (they fade out at 110vh before the parent clips them, so no visual cut-off).

---

### Visual Result

**Portrait:**
- Ghost White full screen
- Falling Batman logos from top to bottom (subtle, 0.12 opacity)
- Batman image centered, floating gently up/down
- Arabic text below in Cairo Regular, fuchsia
- No card, no border, no glass effect

**Landscape:**
- Same layout, image and text stay visible
- Start button appears below the text with neon glow + pulsing animation
- Button click → 600ms fade out of Section 1 (Section 2 hook ready)
