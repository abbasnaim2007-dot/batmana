import { useEffect, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jfif";

// Generate 18 falling logo configs with randomized properties
const fallingLogos = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.5) % 100}%`,
  duration: `${8 + (i % 5)}s`,
  delay: `${(i * 0.7) % 6}s`,
  scale: 0.5 + ((i * 0.04) % 0.7),
}));

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Falling Batman logos */}
      {fallingLogos.map((logo) => (
        <img
          key={logo.id}
          src={batmanLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute w-[60px] opacity-20"
          style={{
            left: logo.left,
            top: "-100px",
            transform: `scale(${logo.scale})`,
            animation: `batman-fall ${logo.duration} ${logo.delay} linear infinite`,
          }}
        />
      ))}

      {/* Hook Card — visible in portrait */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center transition-opacity duration-[600ms]"
        style={{ opacity: isPortrait ? 1 : 0, pointerEvents: isPortrait ? "auto" : "none" }}
      >
        <div
          className="mx-4 w-[320px] rounded-[24px] border-[3px] border-primary p-8 text-center"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
            WebkitBackdropFilter: "var(--glass-blur)",
            boxShadow: "var(--strong-shadow)",
          }}
        >
          <img
            src={pookieBatman}
            alt="Batmana"
            className="mx-auto mb-6 h-[200px] w-[200px] rounded-2xl border-4 border-accent object-cover"
            style={{
              boxShadow: "0 8px 32px hsla(300, 100%, 87%, 0.4)",
              animation: "gentle-pulse 2s ease-in-out infinite",
            }}
          />
          <p
            dir="rtl"
            className="text-primary"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              lineHeight: 1.6,
              letterSpacing: "0.5px",
              animation: "text-pulse 2s ease-in-out infinite",
            }}
          >
            بالله يا باتمانه اقلبي تلفونك
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
