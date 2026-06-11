## Section 3 Rewrite

**File: `src/pages/Index.tsx`**

### 1. Replace Section 3 JSX
Current Section 3 contains three `<text>` elements (Happy/Birthday/Tasnem on separate lines). Replace with a single SVG text "Happy Birthday Tasnem" using Sacramento font with stroke-dash handwriting setup:

```tsx
<div className="section-three">
  {/* Falling flowers added dynamically by showSectionThree() */}
  <div className="birthday-svg-container">
    <svg viewBox="0 0 900 120" xmlns="http://www.w3.org/2000/svg" width="100%">
      <text
        x="50%"
        y="90"
        textAnchor="middle"
        data-word="0"
        style={{
          fontFamily: "'Sacramento', cursive",
          fontSize: '80px',
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '1.5',
          strokeDasharray: '3000',
          strokeDashoffset: '3000',
          transition: 'none',
        }}
      >
        Happy Birthday Tasnem
      </text>
    </svg>
  </div>
</div>
```

### 2. Replace `startHandwritingAnimation`
Current version loops over 3 words with `writeIn` animation. Replace body with single-element stroke-dashoffset animation that fills in after 3.5s:

```ts
const startHandwritingAnimation = useCallback(() => {
  const textEl = document.querySelector('[data-word="0"]') as SVGTextElement | null;
  if (textEl) {
    textEl.style.transition = 'stroke-dashoffset 4s ease, fill-opacity 1s ease 3.5s';
    textEl.style.strokeDashoffset = '0';
    setTimeout(() => {
      textEl.style.fill = '#ffffff';
      textEl.style.fillOpacity = '1';
      textEl.style.strokeOpacity = '0';
    }, 3500);
  }
}, []);
```

### 3. Leave untouched
- `showSectionThree` already exists, adds flowers, and calls `startHandwritingAnimation` after 500ms — no change needed.
- Confetti's `animate` already calls `showSectionThree()` when particles die — no change.
- Section 1, Section 2, countdown, fullscreen, orientation guard — untouched.
