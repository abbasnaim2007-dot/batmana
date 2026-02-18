
## Hook Card Precision Update — Part 1 Fix

### What's Changing

Three files need updating to match the exact specifications provided.

---

### 1. `index.html` — Add Tajawal font + fix font weight for Cairo

The Google Fonts import currently loads Cairo at weight 800. The spec requires **weight 900** and also needs **Tajawal** as a fallback. This is updated in both `index.html` (new `<link>` tag) and `src/index.css` (the existing `@import` URL).

```
From: Cairo:wght@800
To:   Cairo:wght@900&family=Tajawal:wght@800
```

---

### 2. `src/index.css` — Update CSS variables + add new keyframes

**CSS variable changes:**
- `--glass-bg`: `rgba(255, 255, 255, 0.15)` → `rgba(255, 255, 255, 0.4)` (more opaque for better glassmorphism visibility)
- `--glass-blur`: `blur(20px)` → `blur(25px)` (stronger blur per spec)
- `--strong-shadow`: update to `0 20px 50px rgba(255, 19, 240, 0.2)` (exact spec value)

**Keyframe changes:**
- `gentle-pulse` duration stays but animation name stays same — no change needed in CSS (controlled via inline style)
- Add `@keyframes text-glow` (replaces `text-pulse`) — animates `text-shadow` instead of `transform`

---

### 3. `src/pages/Index.tsx` — Full card markup update

**Asset**: Copy `user-uploads://image_8a825b.jpg.jpg` → `src/assets/pookie_batman.jpg` and update the import (replaces the old `.jfif`).

**Container (`fixed inset-0`)**: Background explicitly set to `#F8F9FA` (Ghost White) instead of relying on `bg-background` CSS variable — guarantees solid, non-transparent backdrop behind the glass card.

**Card element** — exact inline style object matching the spec:
```
width: min(340px, 90vw)
padding: 36px 28px
background: rgba(255, 255, 255, 0.4)
backdropFilter: blur(25px)
WebkitBackdropFilter: blur(25px)
border: 3px solid #FF13F0
borderRadius: 24px
boxShadow: 0 20px 50px rgba(255, 19, 240, 0.2)
display: flex, flexDirection: column, alignItems: center, gap: 24px
position: fixed, top: 50%, left: 50%, transform: translate(-50%, -50%)
zIndex: 100
```

**Image element** — exact inline style:
```
width: 220px, height: 220px
objectFit: cover
border: 4px solid #FFC4FB
borderRadius: 16px
boxShadow: 0 8px 32px rgba(255, 196, 251, 0.4)
animation: gentle-pulse 2.5s ease-in-out infinite
```

**Arabic text `<p>` element** — exact inline style:
```
fontFamily: "'Cairo', 'Tajawal', sans-serif"
fontSize: 30px
fontWeight: 900
color: #FF13F0
textShadow: 0 2px 8px rgba(255, 19, 240, 0.3)
direction: rtl
unicodeBidi: embed
textAlign: center
lineHeight: 1.6
letterSpacing: 0.5px
padding: 0 12px
animation: text-glow 2.5s ease-in-out infinite
```

The wrapping portrait visibility `div` (opacity toggle) is removed — the card itself handles its own fixed positioning and the outer orientation wrapper only controls opacity/pointer-events as before.

---

### Technical Notes

- The card uses `position: fixed` + `transform: translate(-50%, -50%)` directly (not nested inside a flex centering wrapper) — matching the spec exactly
- The outer orientation container wrapper still exists for the fade-out-on-landscape behavior, but it no longer uses `flex items-center justify-center` since the card is self-centered
- The `bg-background` class is replaced with an explicit `backgroundColor: "#F8F9FA"` inline style on the root div so dark mode or CSS variable overrides cannot affect it
- All animation properties use `transform` and `opacity` only (GPU-composited), plus `text-shadow` for the text glow — all performant on mobile Safari
