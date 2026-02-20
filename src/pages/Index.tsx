import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isFullscreenBtnVisible, setIsFullscreenBtnVisible] = useState(true);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Orientation tracking
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

  // Fullscreen button auto-hide logic
  const showFullscreenBtn = useCallback(() => {
    if (isInFullscreen) return;
    setIsFullscreenBtnVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsFullscreenBtnVisible(false);
    }, 3000);
  }, [isInFullscreen]);

  useEffect(() => {
    // Start initial 3-second hide timer
    showFullscreenBtn();

    const onActivity = () => showFullscreenBtn();
    document.addEventListener("touchstart", onActivity, { passive: true });
    document.addEventListener("mousemove", onActivity);
    document.addEventListener("click", onActivity);
    document.addEventListener("keydown", onActivity);

    const onFullscreenChange = () => {
      const inFS = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      setIsInFullscreen(inFS);
      if (inFS) {
        setIsFullscreenBtnVisible(false);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      } else {
        // Show briefly after exiting fullscreen
        setIsFullscreenBtnVisible(true);
        hideTimerRef.current = setTimeout(() => setIsFullscreenBtnVisible(false), 3000);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("touchstart", onActivity);
      document.removeEventListener("mousemove", onActivity);
      document.removeEventListener("click", onActivity);
      document.removeEventListener("keydown", onActivity);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showFullscreenBtn]);

  const toggleFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }, []);

  // Velocity-based falling logo configs — recalculate on orientation change
  const fallingLogos = useMemo(() => {
    const vh = window.innerHeight;
    const totalDistance = vh * 1.2; // -10vh to 110vh
    const baseVelocity = 150; // px/s
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 17 + i * i * 3) % 100}%`,
      duration: `${((totalDistance / baseVelocity) * (0.87 + (i % 7) * 0.04)).toFixed(2)}s`,
      delay: `${(i * 0.31) % 5}s`,
      scale: 0.5 + (i % 7) * 0.08,
    }));
  }, [isPortrait]);

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

      {/* START button — landscape only */}
      <button
        className="start-btn"
        onClick={handleStart}
        style={{
          padding: "12px 36px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          fontFamily: "'Open Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          color: "#FF13F0",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          cursor: "pointer",
          position: "relative",
          zIndex: 10,
          willChange: "transform",
          WebkitAppearance: "none",
          appearance: "none",
          animation: isPortrait
            ? "none"
            : "button-entrance 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
          opacity: isPortrait ? 0 : 1,
          pointerEvents: isPortrait ? "none" : "auto",
          transition: "opacity 400ms ease",
        }}
      >
        START
      </button>

      {/* Pink gradient — gives backdrop-filter something visible to blur */}
      <div className="hook-gradient" />

      {/* Fullscreen toggle button — global, auto-hides after 3s */}
      {!isInFullscreen && (
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          style={{
            opacity: isFullscreenBtnVisible ? 1 : 0,
            transform: isFullscreenBtnVisible ? "translateY(0)" : "translateY(15px)",
            pointerEvents: isFullscreenBtnVisible ? "auto" : "none",
          }}
        >
          ⛶
        </button>
      )}
    </div>
  );
};

export default Index;
