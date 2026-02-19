
## Start Button — Glassmorphism Pill Redesign

### Scope
Two files need changes: `index.html` (add Open Sans font) and `src/pages/Index.tsx` (update button inline styles). No CSS file changes needed since all styles are inline on the React component.

---

### 1. `index.html` — Add Open Sans font

Append `&family=Open+Sans:wght@500` to the existing Google Fonts `<link>` tag:

```
FROM:
family=Cairo:wght@400;900&family=Tajawal:wght@800&family=Bebas+Neue

TO:
family=Cairo:wght@400;900&family=Tajawal:wght@800&family=Bebas+Neue&family=Open+Sans:wght@500
```

---

### 2. `src/pages/Index.tsx` — Restyle the button (lines 126–155)

The entire inline `style` object on the `<button>` is replaced. Here's a precise diff of every changed property:

| Property | Old Value | New Value |
|---|---|---|
| `padding` | `"14px 48px"` | `"12px 36px"` |
| `background` | `"#FF13F0"` | `"rgba(255, 255, 255, 0.6)"` |
| `backdropFilter` | *(not set)* | `"blur(15px)"` |
| `WebkitBackdropFilter` | *(not set)* | `"blur(15px)"` |
| `border` | `"2px solid #FFFFFF"` | `"1px solid rgba(255, 255, 255, 0.8)"` |
| `borderRadius` | `"12px"` | `"50px"` |
| `fontFamily` | `"'Bebas Neue', sans-serif"` | `"'Open Sans', sans-serif"` |
| `fontSize` | `"28px"` | `"16px"` |
| `fontWeight` | `400` | `500` |
| `color` | `"#FFFFFF"` | `"#FF13F0"` |
| `letterSpacing` | `"2px"` | `"1.5px"` |
| `boxShadow` | `"0 0 20px rgba(255,19,240,0.6), 0 4px 16px rgba(255,19,240,0.4)"` | `"0 0 15px rgba(255, 19, 240, 0.3)"` |
| `animation` (landscape) | `button-entrance 0.8s ..., button-glow-pulse 2s ...` | same keyframes but `button-glow-pulse` runs on a `3s` cycle (softer) |

**Properties that stay exactly the same:**
- `cursor`, `position`, `zIndex`, `willChange`, `WebkitAppearance`, `appearance`, `opacity` (orientation toggle), `pointerEvents` (orientation toggle), `transition`
- Button text stays `START`
- `onClick={handleStart}` stays

The `transform: "translateZ(0)"` on the button is removed — it conflicts with hover/active transform states (since it's inline and can't be overridden by CSS pseudo-classes). GPU compositing is already handled by `will-change: transform`.

---

### Technical Notes

- `backdropFilter` needs content behind it to be visible. The Ghost White (#F8F9FA) background is solid, so on its own the blur effect won't be very dramatic — but the falling Batman logos passing behind the button will make the frosted glass effect visible, especially in landscape mode.
- The `@supports not (backdrop-filter)` fallback is handled by keeping the background at `rgba(255, 255, 255, 0.6)` — browsers without backdrop-filter support will still see the semi-transparent white pill shape, which reads cleanly against the light background.
- `border-radius: 50px` on a `12px 36px` padding button produces a true pill shape.
- Hover, active, and focus pseudo-class styles cannot be added inline in React — they require a CSS class or a CSS-in-JS approach. Since the existing button already uses only inline styles (no hover states are currently active), this limitation is consistent with the current implementation. The entrance animation and glow pulse are preserved via the existing `button-entrance` and `button-glow-pulse` keyframes in `src/index.css`.

---

### Visual Result

**After:**
- Semi-transparent white pill floating above the background
- Fuchsia text "START" in Open Sans Medium
- Subtle pink glow (15px, 0.3 opacity) — elegant, not aggressive
- Frosted glass blur (15px) — visible when Batman logos pass behind in landscape
- Soft pulsing glow cycle every 3 seconds
- Compact and lightweight — does not dominate the layout

