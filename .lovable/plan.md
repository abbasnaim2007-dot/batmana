

## Fix Two Small Issues in Section 2

### FIX 1 — Pink glow: Already present ✓
The `text-shadow` with the exact values requested is already in `.countdown-number` (lines 395-396). No change needed.

### FIX 2 — Reduce delay before countdown (`src/pages/Index.tsx` line 277)
Change `350` to `50` in the setTimeout that calls `runCountdown()` (line 274-277).

**Single edit: line 277 of `src/pages/Index.tsx` only.**

