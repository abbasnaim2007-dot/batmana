## Add Section 3: The Grand Finale

After the confetti finishes in Section 2, reveal a new pink Section 3 with falling flowers and a handwritten "Happy Birthday Tasnem" SVG animation.

### Files

**1. `public/flowers/flower.png`** — copy uploaded `image_ab8341.png` here.

**2. `src/index.css`** — append:
- `@import` for Google Font `Sacramento` (add near other font imports at top).
- `.section-three` / `.section-three.is-active` (fixed overlay, z-index 300, pink `#ffb7fa`, opacity toggle).
- `.flower` and `.flower-back` (two layers of falling flower divs using `/flowers/flower.png`).
- `@keyframes flowerFall` (translateY -80px → 110vh with rotate 720deg).
- `.birthday-svg-container` and SVG text styling (Sacramento, white stroke, stroke-dasharray 2000).
- `@keyframes writeIn` (handwriting reveal then fill).
- Mobile media query for smaller flowers and 42px text.

**3. `src/pages/Index.tsx`**:
- In `fireConfetti`'s animate loop, when `alive` becomes false and the canvas is hidden, also call `showSectionThree()`.
- Add component-scoped `showSectionThree()` that adds `is-active` to `.section-three`, spawns 12 front + 10 back flower divs with randomized left/duration/delay/size, then after 500ms calls `startHandwritingAnimation()`.
- Add `startHandwritingAnimation()` that iterates `['Happy','Birthday','Tasnem']`, applying `animation: writeIn 1.5s ease forwards` to each `[data-word="i"]` SVG text element with 1600ms stagger.
- Add Section 3 JSX right after the `.section-two` block: a `<div className="section-three">` containing `<div className="birthday-svg-container"><svg viewBox="0 0 600 300">` with three `<text data-word="0|1|2">` elements stacked vertically for "Happy", "Birthday", "Tasnem".

### Out of scope
No changes to Section 1, Section 2 timing, countdown, confetti colors, reveal animation, or audio logic.
