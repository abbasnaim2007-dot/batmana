

## Fix JSX Sibling Order for Reveal Overlay

The reveal-overlay is already a sibling (not a child) of section-two. The issue is the **rendering order**. Currently:

1. `section-two` (z-index 200)
2. `reveal-overlay` (z-index 150)
3. `section-hook` (z-index 100)

Required order in JSX (bottom to top in DOM):

1. `section-hook` (z-index 100) — rendered first
2. `reveal-overlay` (z-index 150) — rendered second
3. `section-two` (z-index 200) — rendered last

### Change in `src/pages/Index.tsx` (lines 303-324)

Reorder the JSX inside the `<>` fragment so:
- Section 1 (`section-hook`) comes first
- Reveal overlay comes second
- Section 2 (`section-two` with countdown + confetti) comes last

No changes to animation logic, CSS, or any other code.

