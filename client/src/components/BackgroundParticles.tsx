import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduceMotion ? 0 : isMobile ? 6 : 25;

    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      duration: Math.random() * 12 + 12,
      delay: Math.random() * 8,
      driftX: (Math.random() - 0.5) * 6,
      driftY: -(Math.random() * 15 + 8),
    }));

    setParticles(generated);
  }, []);

  return (
    <>
      <style>{`
        @keyframes particle-float {
          0%   { opacity: 0; transform: translate(0, 0) scale(0); }
          20%  { opacity: 0.25; }
          80%  { opacity: 0.2; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ contain: "strict" }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={
              {
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255, 45, 120, 0.35)",
                boxShadow: "0 0 6px rgba(255, 45, 120, 0.25)",
                animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                "--dx": `${p.driftX}%`,
                "--dy": `${p.driftY}%`,
                willChange: "transform, opacity",
              } as React.CSSProperties
            }
          />
        ))}

        {/* Líneas decorativas sutiles */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ contain: "layout" }}
        >
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
          <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </div>
    </>
  );
}
