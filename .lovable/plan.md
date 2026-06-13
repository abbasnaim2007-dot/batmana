## Section 3 — Switch to CSS-driven handwriting animation

### 1. `src/pages/Index.tsx` — replace inside `<div className="section-three">`

Replace lines 513–542 (the flowers comment + birthday-svg-container) with:

```tsx
{/* Falling flowers will be added dynamically by showSectionThree() */}

<div className="birthday-svg-container">
  <svg
    viewBox="0 0 900 200"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    style={{ overflow: 'visible' }}
  >
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="birthday-text"
      data-word="0"
    >
      Happy Birthday Tasnem
    </text>
  </svg>
</div>
```

### 2. `src/pages/Index.tsx` — simplify `startHandwritingAnimation` (lines 197–216)

Replace body with a class toggle that triggers the new CSS keyframes:

```ts
const startHandwritingAnimation = useCallback(() => {
  const textEl = document.querySelector('[data-word="0"]') as SVGTextElement | null;
  if (!textEl) return;
  textEl.classList.remove('animate');
  // force reflow so re-adding the class restarts the animation
  void textEl.getBoundingClientRect();
  textEl.classList.add('animate');
}, []);
```

### 3. `src/index.css` — append the new rules

Append at the end of the file (do not remove the existing `.birthday-svg-container` / mobile rule):

```css
@keyframes drawText {
  from { stroke-dashoffset: 4000; fill-opacity: 0; }
  70%  { stroke-dashoffset: 0;    fill-opacity: 0; }
  100% { stroke-dashoffset: 0;    fill-opacity: 1; }
}

.birthday-text {
  font-family: 'Sacramento', cursive;
  font-size: 72px;
  fill: transparent;
  stroke: #ffffff;
  stroke-width: 1px;
  stroke-dasharray: 4000;
  stroke-dashoffset: 4000;
  fill-opacity: 0;
}

.birthday-text.animate {
  animation: drawText 4s ease-in-out forwards;
}

@media (max-width: 768px) {
  .birthday-text { font-size: 38px; }
}
```

### Untouched
Section 1, Section 2, countdown, confetti, fullscreen, orientation guard, `showSectionThree`, flowers logic, all existing CSS rules above the appended block.
