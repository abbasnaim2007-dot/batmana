

## Add Confetti Sound

1. **Copy uploaded file** to `public/sounds/Confetti_Sound.mp3`
2. **In `src/pages/Index.tsx`**, add two lines at the top of `fireConfetti`, before the canvas code:
   ```ts
   const confettiAudio = new Audio('/sounds/Confetti_Sound.mp3');
   confettiAudio.play().catch(() => {});
   ```

No other changes.

