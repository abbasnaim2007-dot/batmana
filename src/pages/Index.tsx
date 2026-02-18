import { useEffect, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

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
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#F8F9FA" }}
    >
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

      {/* Hook Card — portrait orientation */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(340px, 90vw)",
          padding: "36px 28px",
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "3px solid #FF13F0",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(255, 19, 240, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          zIndex: 100,
          opacity: isPortrait ? 1 : 0,
          pointerEvents: isPortrait ? "auto" : "none",
          transition: "opacity 600ms ease",
        }}
      >
        <img
          src={pookieBatman}
          alt="Batmana"
          style={{
            width: "220px",
            height: "220px",
            objectFit: "cover",
            border: "4px solid #FFC4FB",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(255, 196, 251, 0.4)",
            animation: "gentle-pulse 2.5s ease-in-out infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Cairo', 'Tajawal', sans-serif",
            fontSize: "30px",
            fontWeight: 900,
            color: "#FF13F0",
            textShadow: "0 2px 8px rgba(255, 19, 240, 0.3)",
            direction: "rtl",
            unicodeBidi: "embed",
            textAlign: "center",
            lineHeight: 1.6,
            letterSpacing: "0.5px",
            margin: 0,
            padding: "0 12px",
            animation: "text-glow 2.5s ease-in-out infinite",
          }}
        >
          بالله يا باتمانه اقلبي تلفونك
        </p>
      </div>
    </div>
  );
};

export default Index;
