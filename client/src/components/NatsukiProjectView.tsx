import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, Clock, Globe, Cpu, MessageSquare, Heart, BookOpen, Image as ImageIcon, Monitor } from 'lucide-react';

interface ProjectViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const NatsukiProjectView: React.FC<ProjectViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // URLs de Cloudfront generadas
  const mainImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/ImCZGjlQqWHkygmQ.png";
  
  // Imágenes de Vista Previa
  const previewImages = [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/fRwehLiQXmdlyzkT.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/hfJDYHHcaghUPWDY.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/LoFizNNVGrQAVrjI.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/pGPSAZuWYokOhDFV.png"
  ];

  // Enlace de descarga
  const downloadLink = "https://github.com/The-Encoders-Club/Just-Natsuki-ES/releases/download/Actualizaci%C3%B3n/Jn-ES-1.3.5.zip";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#1a0a1a] text-white overflow-y-auto natsuki-theme"
      >
        {/* FONDO TEMÁTICO - DEGRADADO NATSUKI */}
        <div 
          className="fixed inset-0 z-0 opacity-100 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(26, 10, 26, 0.95) 0%, rgba(255, 45, 120, 0.12) 50%, rgba(26, 10, 26, 0.95) 100%)`, backgroundColor: '#1a0a1a' }}
        />

        {/* ÁUDIO OPTIMIZADO - YOUTUBE EMBED */}
        <iframe
          className="hidden"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/BDsCNVj72ig?autoplay=1&loop=1&playlist=BDsCNVj72ig&controls=0&modestbranding=1&rel=0&iv_load_policy=3&mute=0&fs=0"
          allow="autoplay; encrypted-media"
          style={{ display: 'none', pointerEvents: 'none' }}
          title="Natsuki Theme"
        />

        <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#1a0a1a]/95 via-[#2a0a1a]/90 to-[#1a0a1a]/95 w-full overflow-x-hidden">
          <nav className="sticky top-0 z-50 bg-[#1a0a1a]/90 backdrop-blur-md border-b border-[#FF2D78]/30 px-4 sm:px-6 py-4 flex justify-between items-center w-full">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-sm">Volver a Proyectos</span>
            </button>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gradient-to-r from-[#FF2D78]/20 to-[#FF9EBC]/20 border border-[#FF2D78]/30 text-[#FF2D78] hover:from-[#FF2D78] hover:to-[#FF9EBC] hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </nav>

          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full">
              <div className="lg:col-span-2 space-y-8">
                <header>
                  <motion.h1 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] mb-4"
                  >
                    Just Natsuki
                  </motion.h1>
                  <p className="text-xl text-gray-300 font-medium italic">Sumérgete en la historia de Natsuki, explorando su mundo más allá del club</p>
                </header>

                {/* PORTADA - AJUSTE TOTAL */}
                <div className="rounded-2xl overflow-hidden border border-[#FF2D78]/50 shadow-[0_0_30px_rgba(255,45,120,0.3)] aspect-video relative group">
                  <img 
                    src={mainImage} 
                    alt="Just Natsuki" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a1a]/30 to-transparent pointer-events-none" />
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 border-b border-white/10 pb-4">
                    {['info', 'kiwi'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-all text-sm ${
                          activeTab === tab 
                            ? 'bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)]' 
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {tab === 'info' ? 'Información' : 'Kiwi'}
                      </button>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {activeTab === 'info' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-[#FF2D78]" /> Sobre este proyecto
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          Una narrativa íntima que profundiza en su personalidad, sus sueños y los desafíos que enfrenta día a día. 
                          Descubre el lado más humano de Natsuki en esta experiencia fan-made.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[#FF2D78] text-xs font-bold uppercase block mb-1">Estado</span>
                            <span className="text-white font-medium">Disponible</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[#FF9EBC] text-xs font-bold uppercase block mb-1">Calificación</span>
                            <span className="text-white font-medium flex items-center gap-1">4.5 <Star className="w-4 h-4 fill-current" /></span>
                          </div>
                        </div>

                        {/* SECCIÓN DE IMÁGENES ACTUALIZADA */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#FF2D78]" /> Vista Previa
                          </h4>
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {previewImages.map((src, idx) => (
                              <div key={idx} className="flex-none w-64 rounded-xl overflow-hidden border border-white/10 aspect-video group relative snap-start">
                                <img src={src} alt={`Vista Previa ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ImageIcon className="text-white w-8 h-8" />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">← Desliza para ver más →</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'kiwi' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-gray-500 italic">Próximamente...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeTab === 'info' && (
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl sticky top-32">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#FF9EBC]" /> Detalles
                  </h3>
                  <ul className="space-y-4 mb-8">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Tiempo de juego</span>
                      <span className="text-white font-mono">3-5 horas</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Idioma</span>
                      <span className="text-white">Español</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Motor</span>
                      <span className="text-white">Ren'Py</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Descargas</span>
                      <span className="text-white font-mono">980</span>
                    </li>
                  </ul>

                  <a 
                    href={downloadLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] text-white font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,45,120,0.4)] transition-all group"
                  >
                    <Download className="w-6 h-6 group-hover:bounce" />
                    Descargar Mod PC
                  </a>
                </div>
              </div>
              )}
            </div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NatsukiProjectView;
