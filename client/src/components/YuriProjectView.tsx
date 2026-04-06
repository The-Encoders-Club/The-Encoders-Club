import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, Clock, Globe, Cpu, MessageSquare, Heart, BookOpen, Image as ImageIcon, Monitor } from 'lucide-react';

interface ProjectViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const YuriProjectView: React.FC<ProjectViewProps> = ({ isOpen, onClose }) => {
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

  const backgroundImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/YqWBfcjbRaEthSYh.png";
  const logoImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

  const downloadLink = "https://github.com/The-Encoders-Club/Just-Yuri-ES/releases/download/V1.10.4/JustYuri-Beta-ES-1.10.4-win.zip";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto yuri-theme"
        style={{ margin: 0, padding: 0 }}
      >
        {/* FONDO ABSTRACTO */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0
          }}
        />

        {/* DECORACIÓN DDLC - Volutas literarias */}
        <div className="fixed top-16 right-20 z-20 opacity-20 pointer-events-none text-[#9C27B0] text-sm font-serif">
          <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            ✦ ✧ ✦
          </motion.div>
        </div>
        <div className="fixed bottom-20 left-16 z-20 opacity-20 pointer-events-none text-[#E1BEE7] text-sm font-serif">
          <motion.div animate={{ rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            ✧ ✦ ✧
          </motion.div>
        </div>

        {/* MÚSICA INVISIBLE */}
        <div style={{ display: 'none' }}>
          <iframe 
            width="0" 
            height="0" 
            src="https://www.youtube.com/embed/VGwfIloNM8w?autoplay=1&loop=1&playlist=VGwfIloNM8w&enablejsapi=1&modestbranding=1&controls=0&fs=0&rel=0&showinfo=0" 
            allow="autoplay"
            style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
          />
        </div>

        <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#0a0a1a]/95 via-[#1a0a2a]/90 to-[#0a0a1a]/95">
          <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-[#9C27B0]/30 px-6 py-4 flex justify-between items-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#9C27B0] hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-sm">Volver</span>
            </button>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gradient-to-r from-[#9C27B0]/20 to-[#E1BEE7]/20 border border-[#9C27B0]/30 text-[#9C27B0] hover:from-[#9C27B0] hover:to-[#E1BEE7] hover:text-white transition-all">
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
                    className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#9C27B0] to-[#E1BEE7] mb-4"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Just Yuri
                  </motion.h1>
                  <p className="text-xl text-gray-300 font-medium italic font-serif">Una aventura literaria con Yuri como protagonista</p>
                </header>

                {/* MARCO DDLC ELEGANTE */}
                <div className="rounded-lg overflow-hidden border border-[#9C27B0]/50 shadow-[0_0_30px_rgba(156,39,176,0.2),inset_0_0_20px_rgba(156,39,176,0.05)] aspect-video relative group bg-black/40">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/50 to-transparent opacity-60" />
                  {/* Decoración de marco elegante */}
                  <div className="absolute top-2 left-2 text-[#9C27B0] text-xs opacity-50 font-serif">✦</div>
                  <div className="absolute bottom-2 right-2 text-[#E1BEE7] text-xs opacity-50 font-serif">✧</div>
                </div>

                <div className="space-y-6">
                  {/* PESTAÑAS CON ESTILO DDLC ELEGANTE */}
                  <div className="flex gap-4 border-b border-[#9C27B0]/30 pb-4">
                    {['info', 'galeria'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-all text-sm relative ${
                          activeTab === tab 
                            ? 'bg-gradient-to-r from-[#9C27B0] to-[#E1BEE7] text-white shadow-[0_0_20px_rgba(156,39,176,0.4)] border border-[#9C27B0]' 
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#9C27B0]/50'
                        }`}
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {tab === 'info' ? '📚 Información' : '📖 Galería'}
                      </button>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {activeTab === 'info' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border border-[#9C27B0]/30 rounded-lg">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
                          <BookOpen className="w-6 h-6 text-[#9C27B0]" /> Sobre este proyecto
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg font-serif">
                          Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano 
                          con lo sobrenatural en una narrativa única. Una experiencia profunda y reflexiva.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <div className="p-4 rounded-lg bg-white/5 border border-[#9C27B0]/30">
                            <span className="text-[#9C27B0] text-xs font-bold uppercase block mb-1">Estado</span>
                            <span className="text-white font-medium">Disponible</span>
                          </div>
                          <div className="p-4 rounded-lg bg-white/5 border border-[#9C27B0]/30">
                            <span className="text-[#E1BEE7] text-xs font-bold uppercase block mb-1">Calificación</span>
                            <span className="text-white font-medium flex items-center gap-1">4.6 <Star className="w-4 h-4 fill-current" /></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'galeria' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border border-[#9C27B0]/30 rounded-lg">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="flex-none w-64 rounded-lg overflow-hidden border border-[#9C27B0]/50 aspect-video group relative snap-start bg-black/40">
                              <img src={logoImage} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4 bg-white/5 transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <BookOpen className="text-[#9C27B0] w-8 h-8" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-[#9C27B0] mt-2 italic font-serif">← Desliza para ver más →</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 rounded-lg bg-gradient-to-b from-white/10 to-transparent border border-[#9C27B0]/30 backdrop-blur-xl sticky top-32">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif" }}>
                    <BookOpen className="w-5 h-5 text-[#E1BEE7]" /> Información
                  </h3>
                  <ul className="space-y-4 font-serif">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-400">Tiempo de juego</span>
                      <span className="text-white">5-7 horas</span>
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
                      <span className="text-white">1,120</span>
                    </li>
                  </ul>

                  <a 
                    href={downloadLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-[#9C27B0] to-[#E1BEE7] text-white font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(156,39,176,0.4)] transition-all group mt-8 border border-[#9C27B0]/50"
                  >
                    <Download className="w-6 h-6 group-hover:bounce" />
                    Descargar Mod PC
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default YuriProjectView;
