
## Start Button Update — Text & Font

### Scope
Three targeted changes only. Everything else (visibility logic, colors, animations, glow, spacing) stays exactly as-is.

---

### 1. `index.html` — Add Bebas Neue font

Add `&family=Bebas+Neue` to the existing Google Fonts `<link>` tag. The current tag already loads Cairo and Tajawal, so Bebas Neue is appended to the same URL to keep it as a single request:

```
FROM:
family=Cairo:wght@400;900&family=Tajawal:wght@800

TO:
family=Cairo:wght@400;900&family=Tajawal:wght@800&family=Bebas+Neue
```

---

### 2. `src/pages/Index.tsx` — Update button styles and text

Inside the `<button>` element (lines 126–155), change exactly 4 inline style values and the text content:

| Property | Current | New |
|---|---|---|
| `fontFamily` | `'Cairo', sans-serif` | `'Bebas Neue', sans-serif` |
| `fontSize` | `22px` | `28px` |
| `fontWeight` | `600` | `400` |
| `letterSpacing` | `1px` | `2px` |
| **Button text** | `ابدأ` | `START` |

All other button styles — `background`, `border`, `borderRadius`, `color`, `cursor`, `zIndex`, `willChange`, `WebkitAppearance`, `animation`, `boxShadow`, `opacity`, `pointerEvents`, `transition` — remain unchanged.

---

### Technical Notes

- Bebas Neue is a display typeface that only ships in weight 400 — the `fontWeight: 400` aligns with this correctly
- `text-transform: uppercase` is not needed since the text is already written as `START` in all caps, but can be added optionally for safety
- The wider `letterSpacing: "2px"` gives the cinematic/dramatic spacing Bebas Neue is known for
- No CSS keyframe changes required — `button-entrance` and `button-glow-pulse` already exist in `src/index.css` and will continue to work
