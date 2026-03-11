

## Preload Audio for Zero-Latency Playback

Four changes in `src/pages/Index.tsx`:

1. **Add module-level constants** (after line 3, before `type CountdownPhase`): Two `new Audio()` instances with `.preload = 'auto'` for both sound files.

2. **Replace the existing audio preload useEffect** (lines 33-39): Replace with a simpler `useEffect` that calls `.load()` on both module-level constants. Remove `popSoundRef` if no longer used elsewhere.

3. **In `handleStart`** (lines 243-244): Replace `new Audio(...)` + `.play()` with `popAudio.currentTime = 0; popAudio.play().catch(() => {});`.

4. **In `fireConfetti`** (lines 114-115): Replace `new Audio(...)` + `.play()` with `confettiAudio.currentTime = 0; confettiAudio.play().catch(() => {});`.

Also need to check if `popSoundRef` is used elsewhere — if not, remove its declaration too.

