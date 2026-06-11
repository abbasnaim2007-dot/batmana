Append the missing `.section-three` styles to the end of `src/index.css`:

```css
.section-three {
  position: fixed;
  inset: 0;
  background: #ffb7fa;
  z-index: 300;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 0.5s ease;
}

.section-three.is-active {
  opacity: 1;
  pointer-events: all;
}
```

No other files or rules will be touched.