import { motion } from "framer-motion";
import { X, Heart, Coffee, Star, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function NatsukiProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#fff5f8] overflow-y-auto"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Fondo decorativo estilo Natsuki */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ff85a2_2px,transparent_2px)] [background-size:24px_24px]" />
      </div>

      {/* Header Tematizado */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#ff85a2] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff85a2] rounded-full flex items-center justify-center">
            <Heart size={16} className="text-white fill-current" />
          </div>
          <span className="font-bold text-[#ff4d8d] tracking-tight">Just Natsuki</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#ff85a2]/20 text-[#ff4d8d] transition-colors"
        >
          <X size={24} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative">
        {/* Hero Section Natsuki */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#ff85a2]/30 text-[#ff4d8d] text-xs font-bold mb-4 uppercase tracking-widest">
              Slice of Life
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-[#ff4d8d] mb-6 leading-tight">
              Pequeña pero <br />
              <span className="text-[#ffb347]">valiente.</span>
            </h1>
            <p className="text-[#6c757d] text-lg leading-relaxed mb-8">
              Sumérgete en el mundo de Natsuki, donde los cupcakes son dulces y las palabras a veces son amargas. 
              Descubre su pasión por el manga y la repostería en una historia íntima sobre la amistad y la superación.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#ff4d8d] text-white rounded-full font-bold shadow-lg shadow-[#ff4d8d]/20 hover:scale-105 transition-transform flex items-center gap-2">
                <Coffee size={18} />
                Hornear Cupcakes
              </button>
              <button className="px-8 py-3 border-2 border-[#ff85a2] text-[#ff4d8d] rounded-full font-bold hover:bg-[#ff85a2]/10 transition-colors">
                Leer Manga
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#ff85a2] to-[#ffb347] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <Star size={120} />
              </div>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
            {/* Elementos flotantes */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#ffb347]"
            >
              <Sparkles size={32} fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>

        {/* Características */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { title: "Repostería Creativa", desc: "Aprende a preparar los famosos cupcakes de Natsuki.", color: "#ff4d8d" },
            { title: "Club de Manga", desc: "Explora su colección secreta y descubre nuevas historias.", color: "#ffb347" },
            { title: "Diálogos Directos", desc: "Una narrativa honesta y sin rodeos, fiel a su estilo.", color: "#ff85a2" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-[#ff85a2]/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-[#6c757d] text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-12 border-t border-[#ff85a2]/30">
          <p className="text-[#ff4d8d]/60 text-sm font-medium">
            Un proyecto de The Encoders Club • 2026
          </p>
        </div>
      </main>
    </motion.div>
  );
}
