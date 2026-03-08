

## Replace Confetti Function

The user's new `fireConfetti` function uses `document.getElementById('confetti-canvas')` instead of the current React ref approach. This requires two changes, both in `src/pages/Index.tsx`:

### Change 1: Replace `triggerConfetti` (lines 114-176)
Replace with the user's `fireConfetti` function, keeping it as a `useCallback`. Keep the vibrate call and `setShowConfetti` state management integrated.

### Change 2: Update the canvas element (lines 434-438)
Change from conditional rendering with ref (`{showConfetti && <canvas ref={confettiCanvasRef} .../>}`) to an always-present canvas with `id="confetti-canvas"` and `display: none` by default (the function toggles display itself).

### Change 3: Update call site (line 190)
Change `triggerConfetti()` → `fireConfetti()`.

### Cleanup
- Remove `confettiCanvasRef` ref declaration (line 25)
- Remove `confettiRafRef` usage if no longer needed
- Remove `showConfetti` state if canvas display is self-managed
- Keep the `cancelAnimationFrame` cleanup in the unmount effect

Nothing else changes.

