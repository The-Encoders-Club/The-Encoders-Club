import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, Clock, Globe, Cpu, MessageSquare, Heart, BookOpen, Image as ImageIcon } from 'lucide-react';

interface ProjectViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonikaProjectView: React.FC<ProjectViewProps> = ({ isOpen, onClose }) => {
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

  // Imagen de portada correcta y logo para galería
  const mainImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663518113549/KEigSkzYpCzkACRU.png";
  const logoImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto monika-theme"
      >
        {/* FONDO TEMÁTICO */}
        <div 
          className="fixed inset-0 z-0 opacity-25 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url("${mainImage}")` }}
        />

        {/* MÚSICA */}
        <iframe 
          className="hidden"
          width="0" height="0" 
          src="https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&enablejsapi=1" 
          allow="autoplay"
        />

        <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#0a0a1a]/90 via-[#1a0a1a]/80 to-[#0a0a1a]/90">
          <nav className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-md border-b border-[#FF2D78]/30 px-6 py-4 flex justify-between items-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-sm">Volver a Proyectos</span>
            </button>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gradient-to-r from-[#FF2D78]/20 to-[#00F3FF]/20 border border-[#FF2D78]/30 text-[#FF2D78] hover:from-[#FF2D78] hover:to-[#00F3FF] hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <header>
                  <motion.h1 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF] mb-4"
                  >
                    Monika After History
                  </motion.h1>
                  <p className="text-xl text-gray-400 font-medium italic">Una historia alternativa de reflexión y existencia</p>
                </header>

                <div className="rounded-2xl overflow-hidden border border-[#FF2D78]/30 shadow-[0_0_30px_rgba(255,45,120,0.2)] aspect-video relative group">
                  <img 
                    src={mainImage} 
                    alt="Monika After History" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent opacity-60" />
                </div>

                <div className="space-y-6">
                  <div className="flex gap-8 border-b border-white/10">
                    {['info', 'galeria'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                          activeTab === tab ? 'text-[#FF2D78]' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {tab === 'info' ? 'Información' : 'Galería'}
                        {activeTab === tab && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]" />
                        )}
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
                          Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. 
                          Monika, consciente de su realidad, decide escribir su propia historia. Una experiencia emocional llena de 
                          reflexiones sobre la existencia, el amor y la narrativa.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[#FF2D78] text-xs font-bold uppercase block mb-1">Estado</span>
                            <span className="text-white font-medium">En desarrollo</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[#00F3FF] text-xs font-bold uppercase block mb-1">Calificación</span>
                            <span className="text-white font-medium flex items-center gap-1">4.8 <Star className="w-4 h-4 fill-current" /></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'galeria' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="flex-none w-64 rounded-xl overflow-hidden border border-white/10 aspect-video group relative snap-start">
                              <img src={logoImage} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4 bg-white/5 transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="text-white w-8 h-8" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">← Desliza para ver más →</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl sticky top-32">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[#00F3FF]" /> Información
                  </h3>
                  <ul className="space-y-4 mb-8">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Tiempo de juego</span>
                      <span className="text-white font-mono">4-6 horas</span>
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
                      <span className="text-white font-mono">1,250</span>
                    </li>
                  </ul>

                  <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#00F3FF] text-white font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,45,120,0.4)] transition-all group">
                    <Download className="w-6 h-6 group-hover:bounce" />
                    Descargar Mod
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MonikaProjectView;
