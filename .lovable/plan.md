

## Replace Glass Card Image

Swap the current `pookie_batman.jfif` with the new uploaded image (`pookie_batman.jpg` — Batman with pink bows) on the glassmorphism hook card.

### Steps
1. Copy `user-uploads://pookie_batman.jpg` to `src/assets/pookie_batman.jpg`
2. Update the import in `src/pages/Index.tsx` to reference the new `.jpg` file instead of `.jfif`
3. Remove the old `src/assets/pookie_batman.jfif` (no longer needed)

No other changes — the card layout, animations, and orientation logic remain the same.

