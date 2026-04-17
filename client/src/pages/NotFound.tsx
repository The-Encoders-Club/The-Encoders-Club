import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080818] text-white flex items-center justify-center px-4" style={{ paddingTop: "80px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="relative inline-block mb-8">
          <div className="text-[7rem] font-black leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]">4</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4D9FFF] to-[#a855f7]">0</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#FF2D78]">4</span>
          </div>
          <div className="absolute inset-0 text-[7rem] font-black leading-none blur-2xl opacity-20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-[#FF2D78]">404</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Página no encontrada
        </h1>
        <p className="text-white/55 text-base mb-8 leading-relaxed">
          La página que buscas no existe o fue movida. ¿Quizás querías visitar nuestros proyectos?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
          <Link
            href="/proyectos"
            className="btn-outline"
          >
            <Search size={16} />
            Ver proyectos
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
