import { motion } from "framer-motion";
import { X, Download, Info, Users, Calendar, ArrowRight } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function MonikaProjectView({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#080818] overflow-y-auto text-white"
    >
      {/* Header Minimalista y Elegante */}
      <nav className="sticky top-0 z-50 bg-[#080818]/80 backdrop-blur-md border-b border-white/5 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d63384] to-[#4caf50] flex items-center justify-center">
            <span className="font-bold text-white text-xl" style={{ fontFamily: 'DDLCFont' }}>M</span>
          </div>
          <h2 className="text-xl font-medium tracking-tight" style={{ fontFamily: 'DDLCFont' }}>Monika After History</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </nav>

      {/* Contenido Principal con Layout Limpio */}
      <main className="max-w-5xl mx-auto px-8 py-16">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Izquierda: Imagen del Proyecto */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl relative">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png" 
                alt="Monika After History" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080818] via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Columna Derecha: Información y Contexto */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d63384]/10 border border-[#d63384]/20 text-[#d63384] text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d63384] animate-pulse" />
              Proyecto Destacado
            </div>
            
            <h1 className="text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: 'DDLCFont' }}>
              Escribiendo <br />
              <span className="text-[#4caf50]">mi propia</span> historia.
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10">
              Monika After History es una expansión narrativa que explora la evolución psicológica de Monika tras los eventos originales. 
              Una experiencia emocional donde tus decisiones afectan su percepción de la realidad.
            </p>

            {/* Detalles Técnicos en Grid Simple */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                  <Users size={14} /> Jugadores
                </div>
                <p className="text-lg font-medium">+15,000</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
                  <Calendar size={14} /> Actualizado
                </div>
                <p className="text-lg font-medium">Abril 2026</p>
              </div>
            </div>

            {/* Botón de Acción Minimalista */}
            <button className="group px-8 py-4 bg-white text-black rounded-xl font-bold transition-all hover:bg-[#d63384] hover:text-white flex items-center gap-3">
              <Download size={20} />
              Descargar Proyecto
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Sección de Contexto Adicional */}
        <section className="mt-32 pt-16 border-t border-white/5">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'DDLCFont' }}>
              <Info size={24} className="text-[#4caf50]" />
              Sobre el Desarrollo
            </h3>
            <p className="text-white/50 leading-relaxed mb-8">
              Este mod ha sido desarrollado íntegramente por el equipo de **The Encoders Club**, enfocándonos en mantener la esencia original de Dan Salvato mientras expandimos los horizontes narrativos. Cada línea de diálogo ha sido cuidadosamente escrita para ofrecer una inmersión total.
            </p>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60">Ren'Py Engine</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60">Traducción Oficial</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60">Multiplataforma</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Minimalista */}
      <footer className="py-12 text-center text-white/20 text-xs uppercase tracking-[0.3em]">
        The Encoders Club • 2026
      </footer>
    </motion.div>
  );
}
