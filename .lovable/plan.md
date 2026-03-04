

## Section 2 Rewrite — Updated Z-Index Hierarchy + Asset Refresh

### Summary

Adopt the user's new simplified z-index scheme, copy uploaded asset files, update the reveal overlay to start fully inactive on load, and apply the START button font change.

### File copies (uploaded assets → project)

| Source | Destination |
|---|---|
| `user-uploads://Articulat_CF_Demi_Bold-2.ttf` | `public/fonts/Articulat_CF_Demi_Bold.ttf` |
| `user-uploads://The_Year_of_The_Camel_Medium-2.otf` | `public/fonts/The_Year_of_The_Camel_Medium.otf` |
| `user-uploads://mixkit-long-pop-2358-3.wav` | `public/sounds/mixkit-long-pop-2358.wav` |

### Z-Index hierarchy change (`src/index.css`)

Old → New:

| Element | Old | New |
|---|---|---|
| Section 1 (inline) | 200 | 100 |
| Section 2 `.section-two` | 10000 | 200 |
| Reveal overlay `.reveal-overlay` (active) | 9999 | 300 |
| Reveal overlay (retired via JS) | -1 | -1 (unchanged) |
| `.countdown-mask` | 10001 | remove explicit z-index (stacks naturally within section-two) |
| Confetti canvas (inline) | 10002 | 999 (below orientation guard) |
| `.orientation-guard` | 99999 | 999 |

Wait — the spec puts orientation guard at 999 and confetti canvas would conflict. Let me re-read the spec: orientation alert is 999, confetti is not in the spec hierarchy. I'll keep confetti at 500 (between section-two at 200 and orientation at 999).

Revised:

| Element | Z-Index |
|---|---|
| Reveal overlay (inactive) | -1 |
| Section 1 | 100 |
| Section 2 `.section-two` | 200 |
| Confetti canvas | 500 |
| Reveal overlay (active during animation) | 300 |
| `.orientation-guard` | 999 |

### CSS changes (`src/index.css`)

1. `.section-two` z-index: `10000` → `200`
2. `.reveal-overlay` z-index: `9999` → `300`; add default inactive state: `opacity: 0; pointer-events: none;`
3. `.countdown-mask` z-index: `10001` → remove (natural stacking within parent)
4. `.orientation-guard` z-index: `99999` → `999`

### JS changes (`src/pages/Index.tsx`)

1. **Reveal overlay activation on click**: Before `animate()`, set overlay to active state:
   ```ts
   overlay.style.zIndex = '300';
   overlay.style.opacity = '1';
   overlay.style.pointerEvents = 'all';
   ```

2. **Section 1 inline z-index**: `200` → `100`

3. **Confetti canvas inline z-index**: `10002` → `500`

4. **START button font**: Change `fontFamily` from `'Open Sans', sans-serif` → `'BatmanaMedium', sans-serif` (The Year of The Camel is already loaded as BatmanaMedium in CSS)

5. **Post-animation teardown** (already correct, no change needed):
   ```ts
   overlay.style.pointerEvents = 'none';
   overlay.style.zIndex = '-1';
   overlay.style.opacity = '0';
   ```

### What is NOT changed
- Clip-path animation keyframes, origin calculation, duration (800ms), easing, fill
- Confetti particle physics
- Countdown animation logic (slide up/down, 280ms, Web Animations API)
- Orientation guard glassmorphism styling
- Section 1 content (image, text, falling logos)
- Font pre-warm useEffect
- rAF paint wait before runCountdown()

