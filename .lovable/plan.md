

## Fix Pink Reveal Timing

In `src/pages/Index.tsx`, change the `setTimeout` delay from `1250` to `1200` ms so `runCountdown()` fires exactly when the pink reveal's 1.2s CSS transition completes.

Single line change — no other modifications.

