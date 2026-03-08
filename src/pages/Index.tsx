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
  

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const isPausedRef = useRef(false);
  
  const numberElRef = useRef<HTMLSpanElement | null>(null);
  const countdownAbortRef = useRef(false);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Font pre-warm — fire-and-forget on mount
  useEffect(() => {
    document.fonts.load('600 200px "ArticulatCF"').then(() => {
      document.documentElement.classList.add('font-ready');
    }).catch(() => {});
  }, []);

  // Audio preload
  useEffect(() => {
    const audio = new Audio("/sounds/mixkit-long-pop-2358.mp3");
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

  // === Canvas Confetti ===
  const fireConfetti = useCallback(() => {
    navigator.vibrate?.([30, 50, 30]);

    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#FFD700', '#FFC200', '#FFE566',
      '#FFFFFF', '#F0F0FF',
      '#00FFFF', '#00E5FF', '#18FFFF',
      '#E040FB', '#CE93D8', '#AA00FF',
    ];

    const particles = Array.from({ length: 400 }, (_, i) => {
      const fromLeft = i < 200;
      const angle = fromLeft
        ? (Math.random() * 70 + 20) * (Math.PI / 180)
        : (Math.PI - (Math.random() * 70 + 20) * (Math.PI / 180));
      const speed = Math.random() * 20 + 12;
      return {
        x: fromLeft ? 0 : canvas.width,
        y: canvas.height,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed),
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 14 + 6,
        height: Math.random() * 7 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.28,
        drag: 0.994,
        opacity: 1,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height * 0.85) {
          p.opacity -= 0.02;
        }

        if (p.y < canvas.height + 40 && p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.restore();
        }
      }

      if (alive) requestAnimationFrame(animate);
      else canvas.style.display = 'none';
    };

    requestAnimationFrame(animate);
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
        setTimeout(() => fireConfetti(), 200);
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
        }, 1200);
      }

      index++;
      // Next number starts exactly when exit begins (at 1200ms mark)
      setTimeout(showNext, 1200);
    };

    showNext();
  }, [fireConfetti]);

  // === Handle START click — circular reveal then countdown ===
  const handleStart = useCallback(() => {
    // 1. Play sound
    const audio = new Audio('/sounds/mixkit-long-pop-2358.mp3');
    audio.play().catch(() => {});

    // 2. Get button position
    const btn = document.querySelector('.start-btn') as HTMLElement;
    const rect = btn?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const xPct = (cx / window.innerWidth) * 100;
    const yPct = (cy / window.innerHeight) * 100;

    // 3. Start pink reveal OVER section-one
    const pink = document.getElementById('pink-reveal');
    if (pink) {
      pink.style.clipPath = `circle(0% at ${xPct}% ${yPct}%)`;
      pink.style.pointerEvents = 'all';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pink.style.transition = 'clip-path 1.2s ease-in-out';
          pink.style.clipPath = `circle(150% at ${xPct}% ${yPct}%)`;
        });
      });
    }

    // 4. When pink fully covers screen → hide section-one, show section-two
    setCurrentSection(2);
    setTimeout(() => {
      const hook = document.getElementById('section-hook') as HTMLElement;
      if (hook) {
        hook.style.opacity = '0';
        hook.style.pointerEvents = 'none';
      }

      const sectionTwo = document.querySelector('.section-two') as HTMLElement;
      if (sectionTwo) sectionTwo.classList.add('is-active');

      if (pink) {
        pink.style.transition = 'opacity 0.3s ease-out';
        pink.style.opacity = '0';
      }

      if (pink) pink.style.pointerEvents = 'none';
      runCountdown();
    }, 1250);
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

      {/* Pink circular reveal overlay */}
      <div id="pink-reveal" />

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
