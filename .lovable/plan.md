

## Section 1 — Final Precision Update

Three additions: custom font, updated Arabic text, and pop sound on START click. All previous enhancements preserved.

---

### Files to Create (Asset Copies)

1. **`public/fonts/The_Year_of_The_Camel_Medium.otf`** -- Copy from `user-uploads://The_Year_of_The_Camel_Medium.otf`
2. **`public/sounds/mixkit-hard-pop-click-2364.wav`** -- Copy from `user-uploads://mixkit-hard-pop-click-2364.wav`

Font goes in `public/fonts/` so CSS `@font-face` can reference it via `/fonts/...`. Audio goes in `public/sounds/` so the `Audio()` constructor can load it via `/sounds/...`.

---

### Files Modified

**2 files: `src/index.css` and `src/pages/Index.tsx`**

---

### 1. `src/index.css` -- Add `@font-face` at top

Insert before line 1 (before the Google Fonts import):

```css
@font-face {
  font-family: 'BatmanaMedium';
  src: url('/fonts/The_Year_of_The_Camel_Medium.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

No other CSS changes needed -- the font is applied via inline style in the component.

---

### 2. `src/pages/Index.tsx` -- Three edits

**A. Add audio ref and preload (top of component, after `hideTimerRef`):**

```tsx
const popSoundRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  const audio = new Audio("/sounds/mixkit-hard-pop-click-2364.wav");
  audio.preload = "auto";
  audio.load();
  popSoundRef.current = audio;
}, []);
```

Creates an `Audio` object on mount, preloads the WAV file so it plays instantly on click. No visible `<audio>` element needed.

**B. Update `handleStart` to play sound (line 96):**

```tsx
const handleStart = () => {
  // Play pop sound immediately
  if (popSoundRef.current) {
    popSoundRef.current.currentTime = 0;
    popSoundRef.current.play().catch(() => {});
  }
  setIsExiting(true);
  setTimeout(() => {
    console.log("startCountdown()");
  }, 600);
};
```

Sound plays first, then the fade-out animation begins. The `.catch(() => {})` silently handles browsers that block audio (though this is user-initiated so it should always work).

**C. Update Arabic text content and font (lines 169-190):**

Change `fontFamily` from `"'Cairo', sans-serif"` to `"'BatmanaMedium', 'Cairo', sans-serif"` and `fontWeight` from `400` to `"normal"`.

Change text from `بالله يا باتمانه اقلبي تلفونك` to `اقلبي تلفونك يا باتمانه`.

---

### Summary

| Change | Detail |
|---|---|
| Custom font file | Copied to `public/fonts/`, declared via `@font-face` as `BatmanaMedium` |
| Arabic text font | `fontFamily: "'BatmanaMedium', 'Cairo', sans-serif"` (Cairo fallback) |
| Arabic text content | Changed to `اقلبي تلفونك يا باتمانه` |
| Pop sound file | Copied to `public/sounds/`, preloaded via `new Audio()` on mount |
| Sound playback | `popSoundRef.current.play()` called at start of `handleStart` |
| All previous enhancements | Untouched -- fullscreen toggle, velocity rain, glassmorphism button all preserved |

