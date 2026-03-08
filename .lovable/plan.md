

## Fix Two Issues — Countdown Glow & Delay

### FIX 1 — Pink glow (`src/index.css` lines 395-396)
Replace the existing `text-shadow` values:
```
text-shadow: 0 0 15px rgba(255, 20, 147, 0.8),
             0 0 30px rgba(255, 105, 180, 0.6);
```

### FIX 2 — Remove delay (`src/pages/Index.tsx` line 277)
Change `50` to `0` in the setTimeout that calls `runCountdown()`.

Two lines changed total. Nothing else touched.

