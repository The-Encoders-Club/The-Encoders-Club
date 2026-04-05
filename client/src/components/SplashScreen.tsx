import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Duración total del splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080818] overflow-hidden"
        >
          {/* Partículas de fondo */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, Math.random() * -100],
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
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
              duration: 1, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100 
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 relative">
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(255,45,120,0.3)", "0 0 50px rgba(255,45,120,0.6)", "0 0 20px rgba(255,45,120,0.3)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-[#FF2D78]/30"
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
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 text-2xl md:text-3xl font-bold text-white tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The Encoders <span className="text-[#FF2D78]">Club</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#FF2D78] to-transparent mt-2"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
