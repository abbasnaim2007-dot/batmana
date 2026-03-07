

## Fix Two CSS Bugs in Section 2

### Bug 1 — Reveal overlay z-index
**`src/index.css` line 362**: Change `z-index: -1` to `z-index: 150`

### Bug 2 — Countdown permanently hidden
**`src/index.css`**:
- Line 383: Remove `visibility: hidden;`
- Lines 386-388: Delete the `.font-ready .countdown-mask` rule entirely

No changes to Index.tsx or any other file.

