import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
            y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`],
            x: [`${p.x}%`, `${p.x + 5}%`, `${p.x}%`],
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute rounded-full bg-[#FF2D78]/20 blur-[1px]"
          style={{ 
            width: p.size, 
            height: p.size,
            boxShadow: "0 0 10px rgba(255, 45, 120, 0.4)"
          }}
        />
      ))}
      
      {/* Líneas decorativas sutiles */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </div>
  );
}
