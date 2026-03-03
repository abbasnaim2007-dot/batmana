

## Fix: Section 2 Content Blocked by Reveal Overlay

### Root Cause

After the circular reveal animation completes, `revealOverlayRef` stays at `z-index: 9999` with `fill: 'forwards'` keeping it fully expanded. Section 2 sits at `z-index: 100` — completely underneath the opaque pink overlay. The countdown runs but is invisible.

### Changes

**`src/pages/Index.tsx`** — In `handleStart`, after `await anim.finished`, add overlay teardown before calling `setCurrentSection(2)` and `runCountdown()`:

```ts
await anim.finished;

// Retire overlay instantly — no transitions
overlay.style.pointerEvents = 'none';
overlay.style.zIndex = '-1';
overlay.style.opacity = '0';
```

**`src/index.css`** — Update z-index values for proper layering:

- `.section-two` → `z-index: 100` (unchanged, overlay is retired so this is fine)
- `.reveal-overlay` → stays `z-index: 9999` (only during animation, then set to -1 via JS)
- Confetti canvas inline style already has `z-index: 10000` (no change)
- `.orientation-guard` → `z-index: 99999` (unchanged)

No CSS changes needed — the fix is purely in the JS teardown sequence in `handleStart`.

### What is NOT touched

- Clip-path animation values, origin calculation, duration, easing, overlay color
- Countdown logic (`runCountdown`)
- Confetti system
- Section 1 content/styles
- Orientation guard logic

