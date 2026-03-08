

## Fix Four Section 2 Issues

### FIX 1 — Black body background (`src/index.css`)
Add `body { background: #000000; }` after the `@tailwind` directives (around line 22) to prevent white flash behind circular reveal.

### FIX 2 — Slower countdown (`src/pages/Index.tsx`)
Lines 213-223: Change both `700` values to `1200`:
- Exit animation timeout (line 218): `700` → `1200`
- Next number timeout (line 223): `700` → `1200`

### FIX 3 — Countdown glow (`src/index.css`)
Add `text-shadow` to `.countdown-number` (after line 381):
```
text-shadow: 0 0 40px rgba(255, 183, 250, 0.9),
             0 0 80px rgba(255, 183, 250, 0.5);
```

### FIX 4 — Responsive font size (`src/index.css`)
- Line 379: already `200px` ✓
- Line 395: change `120px` to `30vw`

