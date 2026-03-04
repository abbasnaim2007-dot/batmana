

## Fix: Section 2 Post-Reveal Visibility + Animation Duration

Two issues to fix, both in `src/pages/Index.tsx`:

### Issue 1: Overlay blocks Section 2 content after reveal

After `await anim.finished` (line 304), the overlay remains at z-index 9999, hiding everything. Need to add overlay teardown **before** `setCurrentSection(2)`.

**Change in `handleStart` (lines 304-309):**

```ts
      await anim.finished;

      // Retire overlay instantly
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '-1';
      overlay.style.opacity = '0';
    }

    setCurrentSection(2);
    countdownAbortRef.current = false;
    runCountdown();
```

### Issue 2: Animation duration change

Line 298: change `duration: 600` → `duration: 800`. Easing is already correct.

### No CSS changes needed

The z-index layering in CSS is fine — the overlay just needs JS teardown after animation. The `.section-two` at z-index 100 will be visible once the overlay drops to -1.

