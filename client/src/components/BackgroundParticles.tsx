import { useMemo } from "react";

// OPTIMIZACIÓN: Reemplaza la versión original basada en framer-motion.
// Esta versión usa solo animaciones CSS (cero JavaScript por frame),
// lo que elimina el layout thrash y los repaints en móviles de gama baja.

const PARTICLE_COUNT = 16;

export default function BackgroundParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${(i * 6.3) % 100}%`,
      top: `${(i * 7.7) % 100}%`,
      size: `${2 + (i % 4)}px`,
      duration: `${7 + (i % 8)}s`,
      delay: `${-(i * 0.65)}s`,
      color:
        i % 3 === 0
          ? "rgba(255, 45, 120, 0.2)"
          : i % 3 === 1
          ? "rgba(77, 159, 255, 0.18)"
          : "rgba(168, 85, 247, 0.15)",
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Nebulosidades — compositing GPU, sin repaint */}
      <div
        className="animate-nebula"
        style={{
          position: "absolute",
          top: "5%", left: "15%",
          width: "45vw", height: "45vw",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,45,120,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
          willChange: "opacity",
        }}
      />
      <div
        className="animate-nebula"
        style={{
          position: "absolute",
          bottom: "10%", right: "8%",
          width: "38vw", height: "38vw",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(77,159,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
          animationDelay: "-4s",
          willChange: "opacity",
        }}
      />
      <div
        className="animate-nebula"
        style={{
          position: "absolute",
          top: "55%", left: "55%",
          width: "28vw", height: "28vw",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(168,85,247,0.05) 0%, transparent 70%)",
          filter: "blur(35px)",
          animationDelay: "-2s",
          willChange: "opacity",
        }}
      />

      {/* Partículas CSS-only — sin JS por frame */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
