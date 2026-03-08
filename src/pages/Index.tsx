import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

type CountdownPhase = 'idle' | 'running' | 'done';

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isFullscreenBtnVisible, setIsFullscreenBtnVisible] = useState(true);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);
  const [countdownPhase, setCountdownPhase] = useState<CountdownPhase>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const isPausedRef = useRef(false);
  
  const numberElRef = useRef<HTMLSpanElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownAbortRef = useRef(false);
  const confettiRafRef = useRef<number | null>(null);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Font pre-warm — fire-and-forget on mount
  useEffect(() => {
    document.fonts.load('600 200px "ArticulatCF"').then(() => {
      document.documentElement.classList.add('font-ready');
    }).catch(() => {});
  }, []);

  // Audio preload
  useEffect(() => {
    const audio = new Audio("/sounds/mixkit-long-pop-2358.wav");
    audio.preload = "auto";
    audio.load();
    popSoundRef.current = audio;
  }, []);

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
    setIsFullscreenBtnVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setIsFullscreenBtnVisible(false), 3000);
  }, []);

  useEffect(() => {
    showFullscreenBtn();
    const onActivity = () => showFullscreenBtn();
    document.addEventListener("touchstart", onActivity, { passive: true });
    document.addEventListener("mousemove", onActivity);
    document.addEventListener("click", onActivity);
    document.addEventListener("keydown", onActivity);

    const onFullscreenChange = () => {
      const inFS = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsInFullscreen(inFS);
      showFullscreenBtn();
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
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    }
  }, []);

  // Velocity-based falling logo configs
  const fallingLogos = useMemo(() => {
    const vh = window.innerHeight;
    const totalDistance = vh * 1.2;
    const baseVelocity = 150;
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 17 + i * i * 3) % 100}%`,
      duration: `${((totalDistance / baseVelocity) * (0.87 + (i % 7) * 0.04)).toFixed(2)}s`,
      delay: `${(i * 0.31) % 5}s`,
      scale: 0.5 + (i % 7) * 0.08,
    }));
  }, [isPortrait]);

  // === Canvas Confetti (Fix 5 — stronger & slower) ===
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    navigator.vibrate?.([30, 50, 30]);

    requestAnimationFrame(() => {
      const canvas = confettiCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#ffb7fa', '#ffffff', '#f7c6ff', '#e040fb', '#ff80ff', '#fce4ff', '#ffccff'];

      const particles = Array.from({ length: 300 }, (_, i) => ({
        x: i < 150 ? 0 : canvas.width,
        y: canvas.height,
        vx: i < 150
          ? Math.random() * 14 + 5
          : -(Math.random() * 14 + 5),
        vy: -(Math.random() * 22 + 10),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        gravity: 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
      }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.995;
          p.rotation += p.rotationSpeed;

          if (p.y < canvas.height + 30) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
            ctx.restore();
          }
        }

        if (alive) {
          confettiRafRef.current = requestAnimationFrame(animate);
        } else {
          setShowConfetti(false);
          console.log("Ready for Section 3");
        }
      };

      confettiRafRef.current = requestAnimationFrame(animate);
    });
  }, []);

  // === Countdown Animation (Fix 4 — smooth translateY enter/exit) ===
  const runCountdown = useCallback(async () => {
    try { await document.fonts.load('600 200px "ArticulatCF"'); } catch {}

    setCountdownPhase('running');

    const numbers = [3, 2, 1];
    let index = 0;

    const showNext = () => {
      if (index >= numbers.length) {
        setCountdownPhase('done');
        setTimeout(() => triggerConfetti(), 200);
        return;
      }

      if (navigator.vibrate) navigator.vibrate(10);

      const el = numberElRef.current;
      if (el) {
        // Reset to start position (below)
        el.style.transition = 'none';
        el.style.transform = 'translateY(60px)';
        el.style.opacity = '0';
        el.textContent = String(numbers[index]);

        // Enter animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = 'transform 0.45s ease-out, opacity 0.45s ease-out';
            el.style.transform = 'translateY(0px)';
            el.style.opacity = '1';
          });
        });

        // Start exit animation after 700ms
        setTimeout(() => {
          el.style.transition = 'transform 0.35s ease-in, opacity 0.35s ease-in';
          el.style.transform = 'translateY(-80px)';
          el.style.opacity = '0';
        }, 700);
      }

      index++;
      // Next number starts exactly when exit begins (at 700ms mark)
      setTimeout(showNext, 700);
    };

    showNext();
  }, [triggerConfetti]);

  // === Handle START click — circular reveal then countdown ===
  const handleStart = useCallback(() => {
    // Play sound
    const audio = new Audio('/sounds/mixkit-long-pop-2358.wav');
    audio.play().catch(() => {});

    // Hide section 1 immediately
    const hook = document.querySelector('#section-hook') as HTMLElement;
    if (hook) {
      hook.style.opacity = '0';
      hook.style.pointerEvents = 'none';
    }

    // Get button position for reveal origin
    const btn = document.querySelector('.start-btn') as HTMLElement;
    const rect = btn?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const xPercent = (cx / window.innerWidth) * 100;
    const yPercent = (cy / window.innerHeight) * 100;

    // Activate section-two and animate clip-path
    const sectionTwo = document.querySelector('.section-two') as HTMLElement;
    if (sectionTwo) {
      sectionTwo.classList.add('is-active');
      sectionTwo.style.clipPath = `circle(0% at ${xPercent}% ${yPercent}%)`;
      sectionTwo.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          sectionTwo.style.transition = 'clip-path 1.4s ease-in-out';
          sectionTwo.style.clipPath = `circle(150% at ${xPercent}% ${yPercent}%)`;
        });
      });
    }

    // After reveal completes, start countdown
    setCurrentSection(2);
    setTimeout(() => {
      runCountdown();
    }, 1500);
  }, [runCountdown]);

  // Orientation guard: pause/resume countdown in Section 2
  useEffect(() => {
    if (currentSection < 2) return;
    if (isPortrait && countdownPhase === 'running' && !isPaused) {
      setIsPaused(true);
    } else if (!isPortrait && isPaused) {
      setIsPaused(false);
    }
  }, [isPortrait, currentSection, countdownPhase, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      countdownAbortRef.current = true;
      if (confettiRafRef.current) cancelAnimationFrame(confettiRafRef.current);
    };
  }, []);

  return (
    <>
      {/* Section 1 — on top */}
      {(
        <div
          id="section-hook"
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
            zIndex: 100,
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

          {/* Batman image */}
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

          {/* Arabic text */}
          <p
            style={{
              fontFamily: "'BatmanaMedium', 'Cairo', sans-serif",
              fontSize: "27px",
              fontWeight: "normal",
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
            اقلبي تلفونك يا باتمانه
          </p>

          {/* START button */}
          <button
            ref={startBtnRef}
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

          <div className="hook-gradient" />
        </div>
      )}

      {/* Section 2 — always in DOM */}
      <div className="section-two" aria-live="polite">
        {/* Countdown mask always in DOM for imperative animation */}
        <div className="countdown-mask">
          <span
            ref={numberElRef}
            className="countdown-number"
            aria-label="countdown"
          />
        </div>
        {showConfetti && (
          <canvas
            ref={confettiCanvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Orientation guard — Section 2+ only */}
      {currentSection >= 2 && isPortrait && (
        <div className="orientation-guard">
          <div className="guard-card">
            <p className="guard-message">
              باتمانة.. ارجعي اقلبي التلفون
              <br />
              عشان تكمل المفاجأة!
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen toggle button */}
      <button
        className={`fullscreen-btn${isInFullscreen ? " in-fullscreen" : ""}`}
        onClick={toggleFullscreen}
        aria-label={isInFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        style={{
          opacity: isFullscreenBtnVisible ? 1 : 0,
          transform: isFullscreenBtnVisible ? "translateY(0)" : "translateY(15px)",
          pointerEvents: isFullscreenBtnVisible ? "auto" : "none",
        }}
      >
        {isInFullscreen ? "✕" : "⛶"}
      </button>
    </>
  );
};

export default Index;
