import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  onComplete?: () => void;
}

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png";

export default function SplashScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Aumentamos el tiempo a 4 segundos para que el logo se aprecie perfectamente
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Esperamos a que termine la animación de salida (1.2s) antes de llamar a onComplete
      if (onComplete) {
        setTimeout(onComplete, 1200);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }} // Salida mucho más suave y lenta
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080818] overflow-hidden"
        >
          {/* Partículas de fondo */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%",
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, "-20%"],
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-[#FF2D78] rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Logo Central */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              type: "spring",
              stiffness: 80 
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 relative">
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(255,45,120,0.2)", "0 0 60px rgba(255,45,120,0.5)", "0 0 20px rgba(255,45,120,0.2)"] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-[#FF2D78]/20"
              />
              <img 
                src={LOGO_URL} 
                alt="The Encoders Club" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-8 text-2xl md:text-4xl font-bold text-white tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The Encoders <span className="text-[#FF2D78]">Club</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#FF2D78] to-transparent mt-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="mt-4 text-xs text-white tracking-widest uppercase"
            >
              Cargando Experiencia...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
