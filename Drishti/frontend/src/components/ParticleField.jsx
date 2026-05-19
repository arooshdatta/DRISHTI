import { useRef, useEffect, useCallback } from 'react';

/**
 * ParticleField — A canvas-based ambient particle layer.
 *
 * Particles drift gently and repel from the user's cursor, creating a
 * "living" background that fits the "Ocular Sanctuary" design language.
 * Uses emerald (#10B981 / #4EDEA3) soft glow for the primary palette.
 *
 * Performance: Uses requestAnimationFrame with a single off-screen
 * composite, keeps particle count adaptive to viewport area.
 */

const PARTICLE_DENSITY = 0.00006; // particles per px² — keeps it subtle
const MAX_PARTICLES    = 120;
const MIN_PARTICLES    = 30;

// Cursor repulsion config
const REPULSION_RADIUS   = 140;  // px — how far the cursor reaches
const REPULSION_STRENGTH = 0.8;  // multiplier for the push force

// Drift speed bounds
const DRIFT_MIN = 0.08;
const DRIFT_MAX = 0.25;

// Glow palette — emerald family from the Stitch token
const GLOW_COLORS = [
  { r: 78, g: 222, b: 163 },   // #4EDEA3 — primary dark-mode
  { r: 16, g: 185, b: 129 },   // #10B981 — primary-container
  { r: 104, g: 219, b: 169 },  // #68DBA9 — tertiary
  { r: 111, g: 251, b: 190 },  // #6FFBBE — primary-fixed
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(w, h) {
  const color = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
  const radius = randomBetween(1.2, 3);
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    // Base velocity — gentle drift
    vx: randomBetween(-DRIFT_MAX, DRIFT_MAX),
    vy: randomBetween(-DRIFT_MAX, DRIFT_MAX),
    // Original velocity (for returning after repulsion)
    baseVx: 0,
    baseVy: 0,
    radius,
    glowRadius: radius * randomBetween(4, 8),
    opacity: randomBetween(0.15, 0.5),
    color,
    // Slight per-particle oscillation
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: randomBetween(0.003, 0.008),
  };
}

export default function ParticleField() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animationId = useRef(null);
  const dims = useRef({ w: 0, h: 0 });

  // ── Resize handler ──
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dims.current = { w, h };

    // Adjust particle count to viewport
    const targetCount = Math.min(
      MAX_PARTICLES,
      Math.max(MIN_PARTICLES, Math.floor(w * h * PARTICLE_DENSITY))
    );

    // Grow or shrink the pool
    while (particles.current.length < targetCount) {
      particles.current.push(createParticle(w, h));
    }
    particles.current.length = targetCount;
  }, []);

  // ── Animation loop ──
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { w, h } = dims.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    ctx.clearRect(0, 0, w, h);

    for (const p of particles.current) {
      // Phase-based shimmer
      p.phase += p.phaseSpeed;
      const shimmer = 0.85 + 0.15 * Math.sin(p.phase);

      // ── Cursor repulsion ──
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPULSION_RADIUS && dist > 0.1) {
        const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += nx * force;
        p.vy += ny * force;
      }

      // Friction / damping → particles gently return
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Re-inject a tiny base drift so they never fully stop
      p.vx += randomBetween(-0.01, 0.01);
      p.vy += randomBetween(-0.01, 0.01);

      // Clamp max speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2) {
        p.vx = (p.vx / speed) * 2;
        p.vy = (p.vy / speed) * 2;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges with padding
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // ── Draw soft glow ──
      const { r, g, b } = p.color;
      const alpha = p.opacity * shimmer;

      // Outer glow
      const grad = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.glowRadius
      );
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
      grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    }

    animationId.current = requestAnimationFrame(animate);
  }, []);

  // ── Lifecycle ──
  useEffect(() => {
    handleResize();

    const onMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    animationId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="no-color-transition"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
