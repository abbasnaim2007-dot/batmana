

## Fix Countdown Number Visibility

### FIX 1 — Color change (`src/index.css` line 381)
Change `color: #ffb7fa` to `color: #ffffff` in `.countdown-number`. The current pink text is invisible against the pink `#ffb7fa` background of section-two.

### FIX 2 — Already correct, no change needed
The code already uses `numberElRef.current` (a React ref attached to the span), not `getElementById`. The selector is correct.

**Single edit: `src/index.css` line 381 only.**

