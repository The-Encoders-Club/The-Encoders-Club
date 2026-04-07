/* ============================================================
   CURSOS PAGE — The Encoders Club
   Style: Neon Synthwave Gaming
   ============================================================ */
import { motion } from "framer-motion";
import { Hammer, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Cursos() {
  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF] rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-[#FF2D78]/20 to-[#4D9FFF]/20 p-6 rounded-full border border-[#FF2D78]/30">
                <Hammer size={48} className="text-[#FF2D78]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            En Construcción
          </h1>

          {/* Description */}
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            Estamos trabajando en traerte los mejores cursos de Ren'Py. Pronto tendremos contenido exclusivo y tutoriales detallados para que aprendas a crear novelas visuales profesionales.
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center gap-2 mb-8">
            <Sparkles size={20} className="text-[#FF2D78] animate-pulse" />
            <Sparkles size={20} className="text-[#4D9FFF] animate-pulse" style={{ animationDelay: "0.2s" }} />
            <Sparkles size={20} className="text-[#a855f7] animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>

          {/* Call to action */}
          <p className="text-white/40 text-sm">
            Síguenos en nuestro Discord para ser notificado cuando los cursos estén disponibles.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
