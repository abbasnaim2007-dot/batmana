

## Change START Button Font to Open Sans 500

Two small edits:

1. **`src/index.css`** — Add `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500&display=swap');` at the top (before any other rules).

2. **`src/pages/Index.tsx`** — On the START button's inline `fontFamily` (currently `'BatmanaMedium', sans-serif'`), change to `'Open Sans', sans-serif` and ensure `fontWeight: 500`.

Nothing else changes.

