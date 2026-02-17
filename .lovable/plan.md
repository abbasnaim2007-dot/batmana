

## Batmana Birthday Experience — Part 1: The Hook

### Overview
A mobile-only portrait lock screen that greets Batmana with falling Batman logos, a glassmorphism card with her photo, and Arabic text prompting her to rotate her phone. When she switches to landscape, the card fades out smoothly (preparing for Part 2's start button).

---

### Design System Setup
- Ghost White background (`#F8F9FA`), Fuchsia primary (`#FF13F0`), Light Pink accent (`#FFC4FB`)
- Import Google Fonts: **Cairo** (800), **Playfair Display** (700), **Poppins** (200), **Bebas Neue**
- CSS custom properties for shadows, glows, and glass effects
- Reduced-motion media query for accessibility

### Assets
- Copy `batman-logo.png` → falling animation logos (15-20 instances)
- Copy `pookie_batman.jfif` → glassmorphism card image

### Falling Batman Logos (CSS-Only)
- 15-20 absolutely-positioned Batman logo images
- Each with randomized: horizontal position, fall duration (8-12s), animation delay, scale (0.5-1.2), and rotation
- Pure CSS `@keyframes` for falling + rotating — no JavaScript, targeting 60fps
- Low opacity (~0.2) so they stay subtle in the background

### Glassmorphism Hook Card (Portrait Mode)
- Fixed-center card with `backdrop-filter: blur(20px)`, white glass background, fuchsia border (3px), rounded corners (24px)
- Square-cropped image of Batmana with pink border and soft glow shadow
- Gentle pulse animation on the image
- Arabic text **"بالله يا باتمانه اقلبي تلفونك"** in Cairo font (28px, weight 800, fuchsia color) with RTL support
- Subtle text pulse animation

### Orientation Detection
- JavaScript listener on `orientationchange` and `resize`
- **Portrait**: Show the hook card with full opacity
- **Landscape**: Fade out the card (600ms transition), preparing the view for the Part 2 start button (which will be added later)

### Mobile-Only Viewport
- Optimized for 320px-480px width range
- Landscape test viewport: 667×375px (iPhone SE)
- No desktop layout needed

