/* ============================================================
   SPLASH SCREEN — The Encoders Club
   Style: Neon Synthwave with particle effects
   Shows logo + Ren'Py logo with fade-out animation
   ============================================================ */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";
const RENPY_LOGO = "https://www.renpy.org/dl/8.1.3/renpy-8.1.3-sdk/doc/_static/logo.png";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      duration: Math.random() * 1 + 1.5,
    }));
    setParticles(newParticles);

    // Complete splash after 3 seconds
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.2 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#080818] via-[#0d0d24] to-[#080818] flex items-center justify-center pointer-events-none"
    >
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#FF2D78]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -100],
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Ren'Py Logo */}
        <motion.img
          src={RENPY_LOGO}
          alt="Ren'Py"
          className="w-20 h-20 object-contain"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* The Encoders Club Logo */}
        <motion.img
          src={LOGO_URL}
          alt="The Encoders Club"
          className="w-32 h-32 object-contain rounded-full"
          style={{
            filter: "drop-shadow(0 0 40px rgba(255,45,120,0.6))",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Text */}
        <motion.h1
          className="text-3xl font-bold text-white mt-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The Encoders Club
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-white/60 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Comunidad Ren'Py en Español
        </motion.p>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D78]/20 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}
