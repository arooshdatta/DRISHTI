import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

/* ─────────────────────────────────────────────
 *  Shared Particle Background
 *  Extracted so it can be rendered independently
 *  at the App level as a fixed z-0 layer.
 * ───────────────────────────────────────────── */

const PARTICLE_COUNT = 48;
const EMERALD_PALETTE = [
  'rgba(78,222,163,',   // #4EDEA3
  'rgba(16,185,129,',   // #10B981
  'rgba(104,219,169,',  // #68DBA9
  'rgba(111,251,190,',  // #6FFBBE
];

function seedParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const color = EMERALD_PALETTE[i % EMERALD_PALETTE.length];
    const size = 2 + Math.random() * 4;
    const opacity = 0.15 + Math.random() * 0.45;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 12 + Math.random() * 20;
    const dx  = -30 + Math.random() * 60;
    const dy  = -30 + Math.random() * 60;
    const delay = Math.random() * -dur;
    const blur = 0.5 + Math.random() * 2;
    return { color, size, opacity, x, y, dur, dx, dy, delay, blur };
  });
}

function InteractiveParticle({ p, mouse }) {
  const wrapperRef = useRef(null);

  useAnimationFrame(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    
    const rect = el.getBoundingClientRect();
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const dx = px - mouse.current.x;
    const dy = py - mouse.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const maxDist = 200;
    if (dist < maxDist) {
      const force = Math.pow((maxDist - dist) / maxDist, 2);
      const shiftX = (dx / dist) * force * 50; 
      const shiftY = (dy / dist) * force * 50;
      el.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(${1 + force * 0.5})`;
    } else {
      el.style.transform = `translate(0px, 0px) scale(1)`;
    }
  });

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        willChange: 'transform'
      }}
    >
      <motion.div
        aria-hidden="true"
        className="no-color-transition"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `${p.color}${p.opacity})`,
          boxShadow: `0 0 ${p.size * 3}px ${p.blur}px ${p.color}0.4)`,
        }}
        animate={{
          x: [0, p.dx, -p.dx * 0.6, p.dx * 0.3, 0],
          y: [0, p.dy * 0.7, -p.dy, p.dy * 0.5, 0],
          scale: [1, 1.3, 0.8, 1.15, 1],
          opacity: [p.opacity, p.opacity * 1.4, p.opacity * 0.6, p.opacity * 1.2, p.opacity],
        }}
        transition={{
          duration: p.dur,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: p.delay,
        }}
      />
    </div>
  );
}

export function EmeraldParticleBackground() {
  const particles = React.useMemo(() => seedParticles(PARTICLE_COUNT), []);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="no-color-transition"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'rgb(var(--bg))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(78,222,163,0.08) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.1) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      {particles.map((p, i) => (
        <InteractiveParticle key={i} p={p} mouse={mouse} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  IntroReveal — One-shot scroll animation
 * ───────────────────────────────────────────── */
export default function IntroReveal({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  // Manage body overflow to prevent the whole page from scrolling
  useEffect(() => {
    if (isRevealed) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRevealed]);

  const handleWheel = (e) => {
    // Reveal on scroll down, close on scroll up
    if (e.deltaY > 0 && !isRevealed) {
      setIsRevealed(true);
    } else if (e.deltaY < 0 && isRevealed) {
      setIsRevealed(false);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStart - currentY;
    
    // Swipe up (scroll down)
    if (diff > 20 && !isRevealed) {
      setIsRevealed(true);
      setTouchStart(currentY); // reset to prevent multiple fires
    } 
    // Swipe down (scroll up)
    else if (diff < -20 && isRevealed) {
      setIsRevealed(false);
      setTouchStart(currentY);
    }
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden z-50"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      // Allow clicks to pass through to the form when revealed
      style={{ pointerEvents: isRevealed ? 'none' : 'auto' }}
    >
      {/* ── AUTH FORM ── */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: isRevealed ? 1 : 0.9, 
          opacity: isRevealed ? 1 : 0 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* ── TOP LID ── */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-black flex items-end justify-center"
        initial={{ y: "0%" }}
        animate={{ y: isRevealed ? "-120%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ zIndex: 30, pointerEvents: isRevealed ? 'none' : 'auto' }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -24,
            left: '-5%',
            width: '110%',
            height: 48,
            borderRadius: '0 0 50% 50%',
            background: '#000',
          }}
        />
      </motion.div>

      {/* ── BOTTOM LID ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black flex items-start justify-center"
        initial={{ y: "0%" }}
        animate={{ y: isRevealed ? "120%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ zIndex: 30, pointerEvents: isRevealed ? 'none' : 'auto' }}
      >
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: '-5%',
            width: '110%',
            height: 48,
            borderRadius: '50% 50% 0 0',
            background: '#000',
          }}
        />
      </motion.div>

      {/* ── SPLASH CONTENT (title + scroll hint) ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 35 }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: isRevealed ? 0 : 1,
          scale: isRevealed ? 0.85 : 1
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(16,185,129,0.12)',
              boxShadow: '0 0 40px 8px rgba(78,222,163,0.18)',
              marginBottom: 4,
            }}
          >
            <img
              src="/drishti_logo.svg"
              alt=""
              style={{ width: 40, height: 40, filter: 'drop-shadow(0 0 8px rgba(78,222,163,0.6))' }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff',
              textShadow:
                '0 0 30px rgba(78,222,163,0.55), 0 0 80px rgba(16,185,129,0.3), 0 0 120px rgba(78,222,163,0.15)',
              margin: 0,
              userSelect: 'none',
            }}
          >
            Drishti AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              marginTop: '-4px',
              userSelect: 'none',
              textAlign: 'center'
            }}
          >
            Your sanctuary for digital eye wellness.
          </motion.p>

          {/* Scroll hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 1 }}
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
              fontWeight: 400,
              color: '#fff',
              margin: 0,
              letterSpacing: '0.04em',
              userSelect: 'none',
            }}
          >
            scroll to begin
          </motion.p>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4, y: [0, 8, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 1.4 },
              y: { duration: 1.8, ease: 'easeInOut', repeat: Infinity, delay: 1.6 },
            }}
            style={{
              marginTop: 8,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 12l6 6 6-6" stroke="#4EDEA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
