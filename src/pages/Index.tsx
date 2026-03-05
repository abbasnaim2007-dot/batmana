import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

type CountdownPhase = 'idle' | 'running' | 'done';

const CONFETTI_COLORS = [
  '#ffb7fa', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ffffff', '#ff922b',
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  gravity: number;
  rotation: number; rotationSpeed: number;
  color: string;
  shape: 'rect' | 'circle';
  width: number; height: number;
  radius: number;
  alpha: number; fadeRate: number;
}

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isFullscreenBtnVisible, setIsFullscreenBtnVisible] = useState(true);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);
  const [countdownPhase, setCountdownPhase] = useState<CountdownPhase>('idle');
  const [currentNumber, setCurrentNumber] = useState<3 | 2 | 1 | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const isPausedRef = useRef(false);
  const revealOverlayRef = useRef<HTMLDivElement | null>(null);
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

  // === Canvas Confetti ===
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

      const particles: Particle[] = [];
      const rand = (min: number, max: number) => min + Math.random() * (max - min);

      // Spawn two bursts
      const origins = [
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height },
      ];

      for (const origin of origins) {
        const count = Math.floor(rand(55, 75));
        const isLeft = origin.x === 0;
        for (let i = 0; i < count; i++) {
          const isRect = Math.random() < 0.6;
          particles.push({
            x: origin.x, y: origin.y,
            vx: isLeft ? rand(2, 9) : rand(-9, -2),
            vy: rand(-18, -8),
            gravity: 0.45,
            rotation: rand(0, 360),
            rotationSpeed: rand(-8, 8),
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            shape: isRect ? 'rect' : 'circle',
            width: rand(7, 14), height: rand(4, 10),
            radius: rand(4, 8),
            alpha: 1.0,
            fadeRate: rand(0.008, 0.018),
          });
        }
      }

      const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.99;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.fadeRate;

          if (p.alpha <= 0) { particles.splice(i, 1); continue; }

          ctx.save();
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.fillStyle = p.color;
          if (p.shape === 'rect') {
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        if (particles.length > 0) {
          confettiRafRef.current = requestAnimationFrame(loop);
        } else {
          setShowConfetti(false);
          console.log("Ready for Section 3");
        }
      };
      confettiRafRef.current = requestAnimationFrame(loop);
    });
  }, []);

  // === Async Countdown with Web Animations API ===
  const runCountdown = useCallback(async () => {
    // Font loading gate
    try { await document.fonts.load('600 200px "ArticulatCF"'); } catch {}

    setCountdownPhase('running');

    const waitWhilePaused = async () => {
      while (isPausedRef.current) {
        await new Promise(r => setTimeout(r, 100));
      }
    };

    const delay = (ms: number) => new Promise<void>(resolve => {
      const start = Date.now();
      const check = () => {
        if (countdownAbortRef.current) return;
        if (isPausedRef.current) { requestAnimationFrame(check); return; }
        if (Date.now() - start >= ms) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });

    for (const num of [3, 2, 1] as const) {
      if (countdownAbortRef.current) return;
      await waitWhilePaused();

      setCurrentNumber(num);
      navigator.vibrate?.(10);

      // Wait for ref to be available
      await new Promise(r => requestAnimationFrame(r));
      const el = numberElRef.current;
      if (!el) continue;

      // Entrance: slide up from below
      const enterAnim = el.animate(
        [
          { transform: 'translateY(100%)', opacity: '1' },
          { transform: 'translateY(0%)', opacity: '1' },
        ],
        { duration: 280, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );
      await enterAnim.finished;

      // Hold
      await delay(1400);
      await waitWhilePaused();

      // Exit: slide up out
      const exitAnim = el.animate(
        [
          { transform: 'translateY(0%)', opacity: '1' },
          { transform: 'translateY(-100%)', opacity: '1' },
        ],
        { duration: 280, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );
      await exitAnim.finished;
    }

    if (countdownAbortRef.current) return;
    setCurrentNumber(null);
    setCountdownPhase('done');
    await new Promise(r => setTimeout(r, 200));
    triggerConfetti();
  }, [triggerConfetti]);

  // === Handle START click — circular reveal then countdown ===
  const handleStart = useCallback(async () => {
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }

    const btn = startBtnRef.current;
    const rect = btn?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const overlay = revealOverlayRef.current;
    if (overlay) {
      overlay.style.zIndex = '300';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      overlay.style.clipPath = `circle(0% at ${cx}px ${cy}px)`;

      const anim = overlay.animate(
        [
          { clipPath: `circle(0% at ${cx}px ${cy}px)` },
          { clipPath: `circle(150vmax at ${cx}px ${cy}px)` },
        ],
        {
          duration: 800,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      );

      await anim.finished;

      // Retire overlay instantly
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '-1';
      overlay.style.opacity = '0';
    }

    setCurrentSection(2);
    countdownAbortRef.current = false;

    // Wait for React to paint Section 2 DOM before starting countdown
    await new Promise(r => requestAnimationFrame(r));
    runCountdown();
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
      {/* Section 2 — always in DOM behind Section 1 */}
      <div className={`section-two${currentSection === 2 ? ' is-active' : ''}`} aria-live="polite">
        {countdownPhase === 'running' && currentNumber && (
          <div className="countdown-mask">
            <span
              ref={numberElRef}
              className="countdown-number"
              aria-label={`${currentNumber}`}
              style={{ transform: 'translateY(100%)' }}
            >
              {currentNumber}
            </span>
          </div>
        )}
        {showConfetti && (
          <canvas
            ref={confettiCanvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Reveal overlay for circular wipe */}
      <div ref={revealOverlayRef} className="reveal-overlay" />

      {/* Section 1 — on top */}
      {currentSection === 1 && (
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
              fontFamily: "'BatmanaMedium', sans-serif",
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
