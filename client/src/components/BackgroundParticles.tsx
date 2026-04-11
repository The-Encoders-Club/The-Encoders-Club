import { useEffect, useRef } from "react";

/**
 * BackgroundParticles — versión optimizada
 * - Usa Canvas 2D en lugar de 30 elementos DOM animados con framer-motion
 * - requestAnimationFrame con throttling a ~30fps (suficiente para partículas)
 * - will-change: transform en el canvas para composición GPU
 * - Pausa automáticamente cuando la pestaña no está visible (Page Visibility API)
 */
export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // 18 partículas en lugar de 30
    const PARTICLE_COUNT = 18;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.35 + 0.1),
      opacity: Math.random() * 0.2 + 0.05,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = (timestamp: number) => {
      if (document.hidden) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_INTERVAL) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacityDir * 0.003;

        if (p.opacity >= 0.25) p.opacityDir = -1;
        if (p.opacity <= 0.02) p.opacityDir = 1;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 45, 120, ${p.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
