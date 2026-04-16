import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Reducir partículas en dispositivos móviles para mejor rendimiento
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 20; // Reducido más para Honor X5 Plus
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.6,
      duration: Math.random() * 15 + 15, // Más lento = menos CPU
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ willChange: 'transform' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: `${p.x}%`, 
            y: `${p.y}%`, 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 12}%`, `${p.y}%`],
            x: [`${p.x}%`, `${p.x + 2}%`, `${p.x}%`],
            opacity: [0, 0.2, 0],
            scale: [0, 0.8, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          viewport={{ once: false }}
          className="absolute rounded-full bg-[#FF2D78]/15 blur-[0.5px] will-change-transform"
          style={{ 
            width: p.size, 
            height: p.size,
            boxShadow: "0 0 4px rgba(255, 45, 120, 0.2)",
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}
      
      {/* Líneas decorativas sutiles - optimizadas */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ contain: 'layout' }}>
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </div>
  );
}
