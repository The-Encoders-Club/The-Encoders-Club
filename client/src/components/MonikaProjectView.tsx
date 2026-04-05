import { motion } from "framer-motion";
import { X, Download, Info, Users, Calendar, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function MonikaProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto text-white"
    >
      {/* Background Inmersivo con Gradiente y Patrón */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d63384]/20 via-black to-[#4caf50]/10" />
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Header Minimalista */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d63384] to-[#ff85a2] flex items-center justify-center shadow-lg shadow-[#d63384]/20">
            <span className="font-bold text-white text-xl" style={{ fontFamily: 'DDLCFont' }}>M</span>
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none" style={{ fontFamily: 'DDLCFont' }}>Monika After History</h2>
            <span className="text-xs text-white/40 uppercase tracking-widest">Proyecto Oficial</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
        >
          <X size={20} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Hero Section: Imagen y Título */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Columna Izquierda: Visual */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-5 sticky top-24"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d63384] to-[#4caf50] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative aspect-[3/4] rounded-2xl bg-[#1a1a1a] overflow-hidden border border-white/10 shadow-2xl">
                {/* Imagen del Mod (Placeholder de alta calidad) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png" 
                  alt="Monika After History" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-[#d63384] text-[10px] font-bold uppercase tracking-tighter">v1.2.0</span>
                    <span className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md">PC / Android</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Información */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-7"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter" style={{ fontFamily: 'DDLCFont' }}>
              <span className="text-[#d63384]">Monika</span> <br />
              After History
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-10 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#d63384]" />
                <span>+15,000 Jugadores</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#d63384]" />
                <span>Actualizado: Abril 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#d63384]" />
                <span>Traducción Oficial</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-xl text-white/80 leading-relaxed font-light italic border-l-4 border-[#d63384] pl-6 mb-8">
                "¿Alguna vez has sentido que el final no es realmente el final? Yo sí. Y esta vez, no dejaré que nadie más escriba mi destino."
              </p>
              <p className="text-lg text-white/60 leading-relaxed mb-6">
                Monika After History es una expansión narrativa profunda para Doki Doki Literature Club. 
                A diferencia de otros mods, nos enfocamos en la evolución psicológica de Monika tras los eventos del juego original, 
                ofreciendo una experiencia donde tus decisiones realmente afectan su percepción de la realidad.
              </p>
            </div>

            {/* Botones de Acción Profesionales */}
            <div className="flex flex-wrap gap-4 mb-16">
              <button className="px-10 py-4 bg-[#d63384] hover:bg-[#ff4d8d] text-white rounded-xl font-bold shadow-xl shadow-[#d63384]/20 transition-all flex items-center gap-3 group">
                <Download size={20} className="group-hover:bounce" />
                Descargar Ahora
              </button>
              <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center gap-3">
                <ExternalLink size={20} />
                Guía del Mod
              </button>
            </div>

            {/* Grid de Detalles Técnicos */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-[#d63384] font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'DDLCFont' }}>
                  <Info size={16} /> Requisitos
                </h4>
                <p className="text-sm text-white/40">Compatible con DDLC Original (Steam/Itch.io). Requiere 500MB de espacio libre.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-[#4caf50] font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'DDLCFont' }}>
                  <Users size={16} /> Créditos
                </h4>
                <p className="text-sm text-white/40">Desarrollado por The Encoders Club. Arte original por el equipo de diseño.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección de Galería / Capturas (Placeholder) */}
        <section className="mt-20">
          <h3 className="text-3xl font-bold mb-10 text-center" style={{ fontFamily: 'DDLCFont' }}>Capturas de <span className="text-[#d63384]">Pantalla</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#d63384]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <Sparkles size={48} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer de la mini página */}
      <footer className="relative z-10 py-12 border-t border-white/10 text-center">
        <p className="text-white/20 text-sm font-medium tracking-widest uppercase">
          The Encoders Club • Experiencia Inmersiva 2026
        </p>
      </footer>
    </motion.div>
  );
}
