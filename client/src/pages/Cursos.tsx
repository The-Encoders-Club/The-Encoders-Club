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
    <div className="min-h-screen bg-[#080818] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#FF2D78]/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10 w-full"
        >
          {/* Icon with glow */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF] rounded-full blur-2xl opacity-25 animate-pulse-glow" />
              <div className="relative bg-white/5 p-8 rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,45,120,0.15)]">
                <Hammer size={56} className="text-[#FF2D78]" />
              </div>
            </div>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            En <span className="brand-gradient-text">Construcción</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Estamos preparando el mejor contenido para que domines Ren'Py. Muy pronto podrás acceder a tutoriales exclusivos y cursos certificados.
          </p>

          {/* Sparkles con CSS puro en lugar de framer-motion infinito */}
          <div className="flex justify-center gap-4 mb-10">
            <Sparkles size={24} className="text-[#FF2D78] animate-cyber-pulse" style={{ animationDelay: '0s' }} />
            <Sparkles size={24} className="text-[#4D9FFF] animate-cyber-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles size={24} className="text-[#a855f7] animate-cyber-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Bottom badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF2D78] animate-ping" />
            Próximamente 2026
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
