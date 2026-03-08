

## Remove Hardcoded Inline z-index from Reveal Overlay

The reveal overlay div at line 324 has no inline style in JSX — it's clean. However, the `handleStart` function sets `zIndex` imperatively in two places:

1. **Line 250**: `overlay.style.zIndex = '300'` — sets z-index when animation starts
2. **Line 274**: `overlay.style.zIndex = '-1'` — resets z-index after animation ends

**Changes in `src/pages/Index.tsx`:**
- **Line 250**: Remove `overlay.style.zIndex = '300';`
- **Line 274**: Remove `overlay.style.zIndex = '-1';`

The CSS class `.reveal-overlay` already has `z-index: 150` which is correct. No other changes needed.

