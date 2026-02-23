

## Audio File Swap

A single-purpose change: replace the START button sound with the new longer pop sound.

---

### 1. Copy new audio file

Copy `user-uploads://mixkit-long-pop-2358.wav` to `public/sounds/mixkit-long-pop-2358.wav` (same folder as the current sound file).

### 2. Update `src/pages/Index.tsx`

Change one line in the audio preload `useEffect` (around line 14):

```
OLD:  const audio = new Audio("/sounds/mixkit-hard-pop-click-2364.wav");
NEW:  const audio = new Audio("/sounds/mixkit-long-pop-2358.wav");
```

No other changes. All fonts, text, styles, fullscreen logic, and animations remain untouched.

