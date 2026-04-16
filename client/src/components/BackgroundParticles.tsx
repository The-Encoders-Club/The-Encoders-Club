import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Reducir partículas en dispositivos móviles para mejor rendimiento
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 4 : 12; // Aún más reducido para máximo rendimiento
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.4,
      duration: Math.random() * 20 + 20, // Mucho más lento para menos CPU
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ willChange: 'transform', contain: 'strict' }}>
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
            y: [`${p.y}%`, `${p.y - 8}%`, `${p.y}%`],
            x: [`${p.x}%`, `${p.x + 1}%`, `${p.x}%`],
            opacity: [0, 0.15, 0],
            scale: [0, 0.6, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          viewport={{ once: false }}
          className="absolute rounded-full bg-[#FF2D78]/10 blur-[0.3px] will-change-transform"
          style={{ 
            width: p.size, 
            height: p.size,
            boxShadow: "0 0 2px rgba(255, 45, 120, 0.1)",
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}
      
      {/* Líneas decorativas - DESHABILITADAS para rendimiento móvil */}
    </div>
  );
}
