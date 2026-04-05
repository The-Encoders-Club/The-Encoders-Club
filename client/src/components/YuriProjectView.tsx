import { motion } from "framer-motion";
import { X, Heart, BookOpen, PenTool, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function YuriProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#f3f0ff] overflow-y-auto"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Fondo decorativo estilo Yuri */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#9b59b6_2px,transparent_2px)] [background-size:40px_40px]" />
      </div>

      {/* Header Tematizado */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#9b59b6] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#9b59b6] rounded-full flex items-center justify-center">
            <Heart size={16} className="text-white fill-current" />
          </div>
          <span className="font-bold text-[#6c3483] tracking-tight">Just Yuri</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#9b59b6]/20 text-[#6c3483] transition-colors"
        >
          <X size={24} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative">
        {/* Hero Section Yuri */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#9b59b6]/30 text-[#6c3483] text-xs font-bold mb-4 uppercase tracking-widest">
              Misterio & Literatura
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-[#6c3483] mb-6 leading-tight">
              Palabras <br />
              <span className="text-[#8e44ad]">profundas.</span>
            </h1>
            <p className="text-[#6c757d] text-lg leading-relaxed mb-8">
              Acompaña a Yuri en un viaje a través de las páginas de sus libros favoritos. 
              Descubre su mundo interior, lleno de elegancia, misterio y una pasión 
              que trasciende la realidad cotidiana.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#6c3483] text-white rounded-full font-bold shadow-lg shadow-[#6c3483]/20 hover:scale-105 transition-transform flex items-center gap-2">
                <BookOpen size={18} />
                Leer Novela
              </button>
              <button className="px-8 py-3 border-2 border-[#9b59b6] text-[#6c3483] rounded-full font-bold hover:bg-[#9b59b6]/10 transition-colors">
                Escribir Poema
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#9b59b6] to-[#6c3483] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <PenTool size={120} />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            {/* Elementos flotantes */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#8e44ad]"
            >
              <Sparkles size={32} fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>

        {/* Características */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { title: "Elegancia Literaria", desc: "Sumérgete en una prosa rica y descriptiva.", color: "#6c3483" },
            { title: "Misterio Sutil", desc: "Descubre los secretos que se ocultan entre líneas.", color: "#8e44ad" },
            { title: "Ambiente Relajado", desc: "Disfruta de una atmósfera tranquila y reflexiva.", color: "#9b59b6" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-[#9b59b6]/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-[#6c757d] text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-12 border-t border-[#9b59b6]/30">
          <p className="text-[#6c3483]/60 text-sm font-medium">
            Un proyecto de The Encoders Club • 2026
          </p>
        </div>
      </main>
    </motion.div>
  );
}
