

## Fix Two Issues — Neon Glow & Zero Delay

### FIX 1 — Neon pink glow (`src/index.css` lines 395-396)
Replace the 2-layer `text-shadow` with the 7-layer neon glow as specified.

### FIX 2 — Zero delay (`src/pages/Index.tsx` lines 274-277)
Flatten the nested `setTimeout`: move `runCountdown()` and the pink pointer-events cleanup directly into the parent callback (inline, no wrapping setTimeout).

Two edits total. Nothing else touched.

