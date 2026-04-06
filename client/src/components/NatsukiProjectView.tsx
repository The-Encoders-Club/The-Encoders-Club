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

  const backgroundImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/yXrGcrHrhnmmrmne.png";
  const logoImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

  const downloadLink = "https://github.com/The-Encoders-Club/Just-Natsuki-ES/releases/download/Actualizaci%C3%B3n/Jn-ES-1.3.5.zip";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#1a0a1a] text-white overflow-y-auto natsuki-theme"
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

        {/* DECORACIÓN DDLC - Corazones flotantes */}
        <div className="fixed top-20 left-10 z-20 opacity-30 pointer-events-none text-[#FF2D78] text-2xl">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            ♥
          </motion.div>
        </div>
        <div className="fixed bottom-20 right-10 z-20 opacity-30 pointer-events-none text-[#FF9EBC] text-2xl">
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            ♥
          </motion.div>
        </div>

        {/* MÚSICA INVISIBLE */}
        <div style={{ display: 'none' }}>
          <iframe 
            width="0" 
            height="0" 
            src="https://www.youtube.com/embed/BDsCNVj72ig?autoplay=1&loop=1&playlist=BDsCNVj72ig&enablejsapi=1&modestbranding=1&controls=0&fs=0&rel=0&showinfo=0" 
            allow="autoplay"
            style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
          />
        </div>

        <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#1a0a1a]/95 via-[#2a0a1a]/90 to-[#1a0a1a]/95">
          <nav className="sticky top-0 z-50 bg-[#1a0a1a]/90 backdrop-blur-md border-b-4 border-[#FF2D78]/30 px-6 py-4 flex justify-between items-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-sm">Volver</span>
            </button>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gradient-to-r from-[#FF2D78]/20 to-[#FF9EBC]/20 border-2 border-[#FF2D78]/30 text-[#FF2D78] hover:from-[#FF2D78] hover:to-[#FF9EBC] hover:text-white transition-all">
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
                    className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] mb-4"
                  >
                    Just Natsuki ♥
                  </motion.h1>
                  <p className="text-xl text-gray-300 font-medium italic">Sumérgete en la historia de Natsuki, explorando su mundo más allá del club</p>
                </header>

                {/* MARCO DDLC CUTE */}
                <div className="rounded-3xl overflow-hidden border-4 border-[#FF2D78]/50 shadow-[0_0_30px_rgba(255,45,120,0.3),inset_0_0_20px_rgba(255,45,120,0.1)] aspect-video relative group bg-black/40">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a1a]/50 to-transparent opacity-60" />
                  {/* Decoración de marco cute */}
                  <div className="absolute top-3 left-3 text-[#FF2D78] text-lg">♥</div>
                  <div className="absolute bottom-3 right-3 text-[#FF9EBC] text-lg">♥</div>
                </div>

                <div className="space-y-6">
                  {/* PESTAÑAS CON ESTILO DDLC CUTE */}
                  <div className="flex gap-4 border-b-4 border-[#FF2D78]/30 pb-4">
                    {['info', 'galeria'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest transition-all text-sm ${
                          activeTab === tab 
                            ? 'bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] border-2 border-[#FF2D78]' 
                            : 'bg-white/5 border-2 border-white/10 text-gray-400 hover:text-white hover:border-[#FF2D78]/50'
                        }`}
                      >
                        {tab === 'info' ? '🧁 Información' : '📸 Galería'}
                      </button>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {activeTab === 'info' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border-4 border-[#FF2D78]/30 rounded-3xl">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Heart className="w-6 h-6 text-[#FF2D78] fill-current" /> Sobre este proyecto
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          Una narrativa íntima que profundiza en su personalidad, sus sueños y los desafíos que enfrenta día a día. 
                          Descubre el lado más humano de Natsuki en esta experiencia fan-made.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <div className="p-4 rounded-2xl bg-white/5 border-4 border-[#FF2D78]/30">
                            <span className="text-[#FF2D78] text-xs font-bold uppercase block mb-1">Estado</span>
                            <span className="text-white font-medium">Disponible</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border-4 border-[#FF9EBC]/30">
                            <span className="text-[#FF9EBC] text-xs font-bold uppercase block mb-1">Calificación</span>
                            <span className="text-white font-medium flex items-center gap-1">4.5 <Star className="w-4 h-4 fill-current" /></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'galeria' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border-4 border-[#FF2D78]/30 rounded-3xl">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="flex-none w-64 rounded-2xl overflow-hidden border-4 border-[#FF2D78]/50 aspect-video group relative snap-start bg-black/40">
                              <img src={logoImage} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4 bg-white/5 transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Heart className="text-[#FF2D78] w-8 h-8 fill-current" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-[#FF2D78] mt-2 italic">← Desliza para ver más →</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border-4 border-[#FF2D78]/30 backdrop-blur-xl sticky top-32 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#FF9EBC] fill-current" /> Información
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Tiempo de juego</span>
                        <span className="text-white font-medium">3-5 horas</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Idioma</span>
                        <span className="text-white font-medium">Español</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Motor</span>
                        <span className="text-white font-medium">Ren'Py</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Descargas</span>
                        <span className="text-white font-medium">980</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t-4 border-[#FF2D78]/30 pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF2D78] mb-3">♥ Descargar</h4>
                    
                    <a 
                      href={downloadLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF9EBC] text-white font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,45,120,0.4)] transition-all group border-2 border-[#FF2D78]/50"
                    >
                      <Download className="w-6 h-6 group-hover:bounce" />
                      Descargar Mod PC
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NatsukiProjectView;
