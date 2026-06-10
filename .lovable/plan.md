## Use local Sacramento font

1. Copy `user-uploads://Sacramento-Regular.ttf` → `public/fonts/Sacramento-Regular.ttf`.
2. In `src/index.css`, add `@font-face` for Sacramento at the very top (alongside the existing local font-face blocks).
3. Remove `&family=Sacramento` from the Google Fonts `@import` line.

No other changes.