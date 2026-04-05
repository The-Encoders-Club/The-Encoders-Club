import { motion } from "framer-motion";
import { X, Heart, Book, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function MonikaProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#fff0f5] overflow-y-auto"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Fondo decorativo estilo DDLC */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffb6c1_2px,transparent_2px)] [background-size:32px_32px]" />
      </div>

      {/* Header Tematizado */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#ffb6c1] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ffb6c1] rounded-full flex items-center justify-center">
            <Heart size={16} className="text-white fill-current" />
          </div>
          <span className="font-bold text-[#d63384] tracking-tight">Monika After History</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#ffb6c1]/20 text-[#d63384] transition-colors"
        >
          <X size={24} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative">
        {/* Hero Section Monika */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#ffb6c1]/30 text-[#d63384] text-xs font-bold mb-4 uppercase tracking-widest">
              Solo Monika
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-[#d63384] mb-6 leading-tight">
              Escribiendo <br />
              <span className="text-[#4caf50]">mi propia</span> historia.
            </h1>
            <p className="text-[#6c757d] text-lg leading-relaxed mb-8">
              ¿Alguna vez te has preguntado qué pasa cuando el guion termina? 
              En esta historia alternativa, Monika toma el control total para crear 
              un espacio donde el amor y la realidad se entrelazan de formas inesperadas.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#d63384] text-white rounded-full font-bold shadow-lg shadow-[#d63384]/20 hover:scale-105 transition-transform flex items-center gap-2">
                <Book size={18} />
                Leer Poema
              </button>
              <button className="px-8 py-3 border-2 border-[#ffb6c1] text-[#d63384] rounded-full font-bold hover:bg-[#ffb6c1]/10 transition-colors">
                Galería
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#ffb6c1] to-[#ff85a2] overflow-hidden shadow-2xl relative group">
              {/* Placeholder para Monika */}
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <Sparkles size={120} />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            {/* Elementos flotantes */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#4caf50]"
            >
              <Heart size={32} fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>

        {/* Características */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { title: "Narrativa Profunda", desc: "Diálogos existenciales y reflexiones sobre el jugador.", color: "#d63384" },
            { title: "Estilo Visual", desc: "Arte fiel al estilo original de Doki Doki Literature Club.", color: "#4caf50" },
            { title: "Música Original", desc: "Banda sonora compuesta para evocar melancolía y esperanza.", color: "#ff85a2" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-[#ffb6c1]/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-[#6c757d] text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer de la mini página */}
        <div className="text-center pt-12 border-t border-[#ffb6c1]/30">
          <p className="text-[#d63384]/60 text-sm font-medium">
            Un proyecto de The Encoders Club • 2026
          </p>
        </div>
      </main>
    </motion.div>
  );
}
