import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  onComplete?: () => void;
}

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png";

export default function SplashScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tiempo total de visualización: 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Esperamos a que termine la animación de salida (1.5s) antes de llamar a onComplete
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080818] overflow-hidden"
        >
          {/* Fondo de Partículas Brillantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: "110%",
                  opacity: 0 
                }}
                animate={{ 
                  y: "-10%",
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 3, 
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
                className="absolute w-1 h-1 bg-[#FF2D78] rounded-full shadow-[0_0_10px_#FF2D78]"
              />
            ))}
          </div>

          {/* Contenedor del Logo con Efectos */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Anillo de Energía Pulsante */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: 360
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#FF2D78] shadow-[0_0_30px_rgba(255,45,120,0.4)]"
              />
              
              {/* Logo con Sombra de Neón */}
              <motion.img 
                src={LOGO_URL} 
                alt="The Encoders Club" 
                className="w-40 h-40 md:w-56 md:h-56 object-contain relative z-20"
                animate={{ 
                  filter: [
                    "drop-shadow(0 0 10px rgba(255,45,120,0.4))",
                    "drop-shadow(0 0 30px rgba(255,45,120,0.8))",
                    "drop-shadow(0 0 10px rgba(255,45,120,0.4))"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Línea de Escaneo Láser */}
              <motion.div 
                className="absolute left-0 right-0 h-[2px] bg-[#FF2D78] shadow-[0_0_15px_#FF2D78] z-30"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Texto: THE ENCODERS CLUB */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-10 text-center"
            >
              <h1 
                className="text-3xl md:text-5xl font-bold text-white tracking-[0.4em] uppercase"
                style={{ 
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: "0 0 20px rgba(255,255,255,0.3)"
                }}
              >
                The Encoders <span className="text-[#FF2D78]">Club</span>
              </h1>
              
              {/* Barra de Carga Animada */}
              <div className="mt-6 w-48 md:w-64 h-[2px] bg-white/10 mx-auto relative overflow-hidden rounded-full">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF2D78] to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
                className="mt-4 text-[10px] md:text-xs text-white/60 tracking-[0.5em] uppercase font-medium"
              >
                Iniciando Sistema...
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
