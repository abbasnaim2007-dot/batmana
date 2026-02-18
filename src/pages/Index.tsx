import { useEffect, useMemo, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

// Generate 18 falling logo configs with randomized positions and timings
const fallingLogos = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + i * i * 3) % 100}%`,
  duration: `${8 + (i * 0.4) % 6}s`,
  delay: `${(i * 0.31) % 5}s`,
  scale: 0.5 + (i % 7) * 0.08,
}));

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

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

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      console.log("startCountdown()"); // Section 2 hook
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#F8F9FA",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        overflow: "hidden",
        zIndex: 50,
        opacity: isExiting ? 0 : 1,
        transition: "opacity 600ms ease-out",
      }}
    >
      {/* Falling Batman logos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        {fallingLogos.map((logo) => (
          <img
            key={logo.id}
            src={batmanLogo}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "50px",
              left: logo.left,
              top: "-10vh",
              transform: `scale(${logo.scale})`,
              animation: `batman-fall ${logo.duration} ${logo.delay} linear infinite`,
              willChange: "top, transform",
            }}
          />
        ))}
      </div>

      {/* Batman image — floats freely on background */}
      <img
        src={pookieBatman}
        alt="Batmana"
        style={{
          width: "180px",
          height: "180px",
          objectFit: "cover",
          border: "4px solid #FFC4FB",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(255, 196, 251, 0.35)",
          position: "relative",
          zIndex: 10,
          animation: "gentle-float 4s ease-in-out infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Arabic text — floats freely on background */}
      <p
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: "27px",
          fontWeight: 400,
          color: "#FF13F0",
          direction: "rtl",
          unicodeBidi: "embed",
          textAlign: "center",
          lineHeight: 1.6,
          letterSpacing: "0.3px",
          margin: 0,
          padding: "0 20px",
          maxWidth: "90vw",
          textShadow: "0 2px 6px rgba(255, 19, 240, 0.2)",
          position: "relative",
          zIndex: 10,
          animation: "text-glow 3s ease-in-out infinite",
        }}
      >
        بالله يا باتمانه اقلبي تلفونك
      </p>

      {/* Start button — landscape only */}
      <button
        onClick={handleStart}
        style={{
          padding: "14px 48px",
          background: "#FF13F0",
          border: "2px solid #FFFFFF",
          borderRadius: "12px",
          fontFamily: "'Cairo', sans-serif",
          fontSize: "22px",
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: "1px",
          cursor: "pointer",
          position: "relative",
          zIndex: 10,
          willChange: "transform",
          transform: "translateZ(0)",
          WebkitAppearance: "none",
          appearance: "none",
          animation: isPortrait
            ? "none"
            : "button-entrance 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), button-glow-pulse 2s ease-in-out 0.8s infinite",
          boxShadow: "0 0 20px rgba(255, 19, 240, 0.6), 0 4px 16px rgba(255, 19, 240, 0.4)",
          opacity: isPortrait ? 0 : 1,
          pointerEvents: isPortrait ? "none" : "auto",
          transition: "opacity 400ms ease",
        }}
      >
        ابدأ
      </button>
    </div>
  );
};

export default Index;
