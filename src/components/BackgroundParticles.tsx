'use client';

import { useEffect, useState } from "react";

export default function BackgroundParticles() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (!mounted) return null;

  // CSS-only particles — zero JS animation overhead
  const count = isMobile ? 6 : 10;
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 37 + 13) % 97) + 1,   // deterministic spread, no Math.random
    y: ((i * 53 + 7) % 93) + 3,
    size: ((i * 7 + 3) % 15) * 0.15 + 1,
    duration: 18 + (i % 5) * 4,
    delay: (i % 6) * 1.2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        .bg-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 45, 120, 0.15);
          will-change: transform, opacity;
          animation: bgParticleFloat var(--dur) ease-in-out var(--del) infinite;
        }
        @keyframes bgParticleFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.25;
            transform: translate3d(0, -20px, 0) scale(1);
          }
          85% {
            opacity: 0.15;
            transform: translate3d(10px, -40px, 0) scale(0.8);
          }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 6px rgba(255, 45, 120, 0.2)',
            '--dur': `${p.duration}s`,
            '--del': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ contain: 'layout' }}>
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </div>
  );
}
