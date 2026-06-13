## Section 3 Text Animation & Positioning Fix

### 1. `src/index.css` — add `.birthday-svg-container` styles + mobile override

Append:

```css
.birthday-svg-container {
  position: relative;
  z-index: 320;
  width: 90%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .birthday-svg-container svg text {
    font-size: 48px;
  }
}
```

### 2. `src/pages/Index.tsx` — replace Section 3 SVG

Replace existing SVG block inside `.section-three` / `.birthday-svg-container` with:

```tsx
<svg viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg" width="100%" style={{ overflow: 'visible' }}>
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="middle"
    data-word="0"
    style={{
      fontFamily: "'Sacramento', cursive",
      fontSize: '110px',
      fill: 'transparent',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeDasharray: 3000,
      strokeDashoffset: 3000,
    }}
  >
    Happy Birthday Tasnem
  </text>
</svg>
```

### 3. `src/pages/Index.tsx` — replace `startHandwritingAnimation`

```ts
const startHandwritingAnimation = () => {
  const textEl = document.querySelector('[data-word="0"]') as SVGTextElement;
  if (!textEl) return;

  textEl.style.strokeDashoffset = '3000';
  textEl.style.fill = 'transparent';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      textEl.style.transition = 'stroke-dashoffset 3.5s ease-in-out';
      textEl.style.strokeDashoffset = '0';

      setTimeout(() => {
        textEl.style.transition = 'fill 0.5s ease';
        textEl.style.fill = '#ffffff';
        textEl.style.stroke = 'transparent';
      }, 3600);
    });
  });
};
```

### Untouched
Section 1, Section 2, countdown, confetti, fullscreen, orientation guard, `showSectionThree` trigger.
