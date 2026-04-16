/* ============================================================
   BACKGROUND PARTICLES — OPTIMIZED FOR LOW-END DEVICES
   Uses pure CSS animations instead of framer-motion
   ============================================================ */
import { useEffect, useState } from "react";

export default function BackgroundParticles() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect low-end devices
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice, { passive: true });
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Less particles on mobile
  const particleCount = isMobile ? 8 : 15;
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* CSS-only particles - much lighter than framer-motion */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      
      {/* Static decorative lines - no animation */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      </div>
      
      {/* Subtle gradient overlays for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080818] to-transparent pointer-events-none" />
    </div>
  );
}
