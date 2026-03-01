import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import batmanLogo from "@/assets/batman-logo.png";
import pookieBatman from "@/assets/pookie_batman.jpg";

type CountdownPhase = 'idle' | 'running' | 'done';
type NumberAnim = 'entering' | 'holding' | 'exiting' | null;

const CONFETTI_COLORS = [
  '#FF13F0', '#FFC4FB', '#FFFFFF', '#ffb7fa', '#FFD700',
  '#FF1493', '#FF69B4', '#FFA500', '#00CED1', '#9370DB',
];

const Index = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isFullscreenBtnVisible, setIsFullscreenBtnVisible] = useState(true);
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);
  const [clipPath, setClipPath] = useState("circle(150vmax at 50% 50%)");
  const [countdownPhase, setCountdownPhase] = useState<CountdownPhase>('idle');
  const [currentNumber, setCurrentNumber] = useState<3 | 2 | 1 | null>(null);
  const [numberAnim, setNumberAnim] = useState<NumberAnim>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const countdownTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const confettiRef = useRef<HTMLDivElement | null>(null);
  const pausedStateRef = useRef<{ number: 3 | 2 | 1; anim: NumberAnim; elapsed: number } | null>(null);
  const phaseStartRef = useRef<number>(0);
  const isPausedRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

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
    hideTimerRef.current = setTimeout(() => {
      setIsFullscreenBtnVisible(false);
    }, 3000);
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

  // Clear all countdown timers
  const clearCountdownTimers = useCallback(() => {
    countdownTimersRef.current.forEach(t => clearTimeout(t));
    countdownTimersRef.current = [];
  }, []);

  // Schedule a timeout and track it
  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    countdownTimersRef.current.push(t);
    return t;
  }, []);

  // Confetti explosion
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    navigator.vibrate?.([30, 50, 30]);

    // Generate confetti pieces in the DOM
    requestAnimationFrame(() => {
      const container = confettiRef.current;
      if (!container) return;
      container.innerHTML = '';

      for (let corner = 0; corner < 2; corner++) {
        for (let i = 0; i < 50; i++) {
          const piece = document.createElement('div');
          piece.className = 'confetti-piece';
          const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          const size = 10 + Math.random() * 8;
          const isCircle = Math.random() > 0.5;
          const targetX = corner === 0
            ? `${Math.random() * 80}%`
            : `${20 + Math.random() * 80}%`;
          const rotation = `${360 + Math.random() * 360}deg`;

          piece.style.backgroundColor = color;
          piece.style.setProperty('--size', `${size}px`);
          piece.style.setProperty('--target-x', targetX);
          piece.style.setProperty('--rotation', rotation);
          piece.style.width = `${size}px`;
          piece.style.height = `${size}px`;
          piece.style.left = corner === 0 ? '10%' : '90%';
          piece.style.bottom = '0';
          if (isCircle) piece.style.borderRadius = '50%';

          container.appendChild(piece);
        }
      }
    });

    scheduleTimer(() => {
      setShowConfetti(false);
      console.log("Ready for Section 3");
    }, 2500);
  }, [scheduleTimer]);

  // Countdown sequence
  const runCountdownNumber = useCallback((num: 3 | 2 | 1) => {
    setCurrentNumber(num);
    setNumberAnim('entering');
    navigator.vibrate?.(10);
    phaseStartRef.current = Date.now();

    scheduleTimer(() => {
      if (isPausedRef.current) return;
      setNumberAnim('holding');
      phaseStartRef.current = Date.now();

      scheduleTimer(() => {
        if (isPausedRef.current) return;
        setNumberAnim('exiting');
        phaseStartRef.current = Date.now();

        scheduleTimer(() => {
          if (isPausedRef.current) return;
          if (num > 1) {
            runCountdownNumber((num - 1) as 3 | 2 | 1);
          } else {
            // Countdown done
            setCurrentNumber(null);
            setNumberAnim(null);
            setCountdownPhase('done');
            scheduleTimer(() => triggerConfetti(), 200);
          }
        }, 600);
      }, 1400);
    }, 600);
  }, [scheduleTimer, triggerConfetti]);

  const startCountdown = useCallback(() => {
    setCountdownPhase('running');
    runCountdownNumber(3);
  }, [runCountdownNumber]);

  // Handle START click — circular reveal then countdown
  const handleStart = useCallback(() => {
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }

    // Get button center for clip-path origin
    const btn = startBtnRef.current;
    const cx = btn ? btn.getBoundingClientRect().left + btn.offsetWidth / 2 : window.innerWidth / 2;
    const cy = btn ? btn.getBoundingClientRect().top + btn.offsetHeight / 2 : window.innerHeight / 2;

    // Set clip-path origin to button center, start fully visible
    setClipPath(`circle(150vmax at ${cx}px ${cy}px)`);

    // Next frame: shrink to 0 to reveal Section 2
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setClipPath(`circle(0px at ${cx}px ${cy}px)`);
      });
    });

    // After transition completes, switch to Section 2
    setTimeout(() => {
      setCurrentSection(2);
      startCountdown();
    }, 1200);
  }, [startCountdown]);

  // Orientation guard: pause/resume countdown in Section 2
  useEffect(() => {
    if (currentSection < 2) return;
    if (isPortrait && countdownPhase === 'running' && !isPaused) {
      // Pause
      setIsPaused(true);
      clearCountdownTimers();
      // Pause CSS animations
      document.querySelectorAll('.countdown-number').forEach((el) => {
        (el as HTMLElement).style.animationPlayState = 'paused';
      });
    } else if (!isPortrait && isPaused) {
      // Resume
      setIsPaused(false);
      document.querySelectorAll('.countdown-number').forEach((el) => {
        (el as HTMLElement).style.animationPlayState = 'running';
      });
      // Re-run from current number/anim
      if (currentNumber && numberAnim) {
        if (numberAnim === 'entering') {
          // Re-trigger from holding phase
          scheduleTimer(() => {
            setNumberAnim('holding');
            phaseStartRef.current = Date.now();
            scheduleTimer(() => {
              setNumberAnim('exiting');
              phaseStartRef.current = Date.now();
              scheduleTimer(() => {
                if (currentNumber > 1) {
                  runCountdownNumber((currentNumber - 1) as 3 | 2 | 1);
                } else {
                  setCurrentNumber(null);
                  setNumberAnim(null);
                  setCountdownPhase('done');
                  scheduleTimer(() => triggerConfetti(), 200);
                }
              }, 600);
            }, 1400);
          }, 300); // remaining entrance time estimate
        } else if (numberAnim === 'holding') {
          scheduleTimer(() => {
            setNumberAnim('exiting');
            phaseStartRef.current = Date.now();
            scheduleTimer(() => {
              if (currentNumber > 1) {
                runCountdownNumber((currentNumber - 1) as 3 | 2 | 1);
              } else {
                setCurrentNumber(null);
                setNumberAnim(null);
                setCountdownPhase('done');
                scheduleTimer(() => triggerConfetti(), 200);
              }
            }, 600);
          }, 700); // remaining hold time estimate
        } else if (numberAnim === 'exiting') {
          scheduleTimer(() => {
            if (currentNumber > 1) {
              runCountdownNumber((currentNumber - 1) as 3 | 2 | 1);
            } else {
              setCurrentNumber(null);
              setNumberAnim(null);
              setCountdownPhase('done');
              scheduleTimer(() => triggerConfetti(), 200);
            }
          }, 300); // remaining exit time estimate
        }
      }
    }
  }, [isPortrait, currentSection, countdownPhase, isPaused, currentNumber, numberAnim, clearCountdownTimers, scheduleTimer, runCountdownNumber, triggerConfetti]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCountdownTimers();
  }, [clearCountdownTimers]);

  return (
    <>
      {/* Section 2 — always in DOM behind Section 1 */}
      <div className="section-two" aria-live="polite">
        {countdownPhase === 'running' && currentNumber && (
          <div className="countdown-mask">
            <span
              className={`countdown-number ${numberAnim || ''}`}
              aria-label={`${currentNumber}`}
            >
              {currentNumber}
            </span>
          </div>
        )}
        {showConfetti && <div className="confetti-container" ref={confettiRef} />}
      </div>

      {/* Section 1 — on top, clip-path reveals Section 2 */}
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
            zIndex: 200,
            clipPath,
            transition: "clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "clip-path",
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

      {/* Fullscreen toggle button — persists across all sections */}
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
