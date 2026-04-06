import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, Clock, Globe, Cpu, MessageSquare, Heart, BookOpen, Image as ImageIcon, Smartphone, Monitor } from 'lucide-react';

interface ProjectViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonikaProjectView: React.FC<ProjectViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Efecto glitch ocasional
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }, 8000);
      return () => clearInterval(glitchInterval);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const backgroundImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/ePsnmxTopyYeROdq.png";
  const logoImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663516100892/kzug5rLPLvVJzu5QVE66vY/logo_435f8d5a.png";

  const downloadLinks = {
    apk: "https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Android-Espanol.apk",
    pc: "https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Espanol.zip",
    dlx: "https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Dlx-Espanol.zip"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto monika-theme"
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
            padding: 0,
            filter: glitchActive ? 'hue-rotate(90deg) brightness(1.2)' : 'none',
            transition: 'filter 0.1s'
          }}
        />

        {/* EFECTO GLITCH OVERLAY */}
        {glitchActive && (
          <div className="fixed inset-0 z-[99] pointer-events-none">
            <div className="absolute inset-0 bg-[#FF2D78] mix-blend-multiply opacity-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 25%)' }} />
            <div className="absolute inset-0 bg-[#00F3FF] mix-blend-screen opacity-10" style={{ clipPath: 'polygon(0 75%, 100% 70%, 100% 100%, 0 100%)' }} />
          </div>
        )}

        {/* MÚSICA INVISIBLE */}
        <div style={{ display: 'none' }}>
          <iframe 
            width="0" 
            height="0" 
            src="https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&enablejsapi=1&modestbranding=1&controls=0&fs=0&rel=0&showinfo=0" 
            allow="autoplay"
            style={{ display: 'none', visibility: 'hidden', width: 0, height: 0 }}
          />
        </div>

        <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#0a0a1a]/95 via-[#1a0a1a]/90 to-[#0a0a1a]/95">
          {/* DECORACIÓN DDLC - Código flotante */}
          <div className="fixed top-10 right-10 z-20 opacity-20 pointer-events-none text-[#FF2D78] text-xs font-mono max-w-xs">
            <div className="animate-pulse">
              &lt;monika.chr&gt;<br/>
              just_monika.exe<br/>
              &lt;/monika.chr&gt;
            </div>
          </div>

          <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-[#FF2D78]/30 px-6 py-4 flex justify-between items-center">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-sm">Volver</span>
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
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    Monika After History
                  </motion.h1>
                  <p className="text-xl text-gray-300 font-medium italic">Just Monika. Just Monika. Just Monika.</p>
                </header>

                {/* MARCO DDLC */}
                <div className="rounded-2xl overflow-hidden border-4 border-[#FF2D78]/50 shadow-[0_0_30px_rgba(255,45,120,0.3),inset_0_0_20px_rgba(255,45,120,0.1)] aspect-video relative group bg-black/40">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/50 to-transparent opacity-60" />
                  {/* Efecto de marco DDLC */}
                  <div className="absolute top-2 left-2 text-[#FF2D78] text-xs font-mono opacity-50">▲</div>
                  <div className="absolute bottom-2 right-2 text-[#FF2D78] text-xs font-mono opacity-50">▼</div>
                </div>

                <div className="space-y-6">
                  {/* PESTAÑAS CON ESTILO DDLC */}
                  <div className="flex gap-4 border-b-2 border-[#FF2D78]/30 pb-4">
                    {['info', 'galeria'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-all text-sm relative ${
                          activeTab === tab 
                            ? 'bg-gradient-to-r from-[#FF2D78] to-[#00F3FF] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] border-2 border-[#FF2D78]' 
                            : 'bg-white/5 border-2 border-white/10 text-gray-400 hover:text-white hover:border-[#FF2D78]/50'
                        }`}
                      >
                        {tab === 'info' ? '📖 Información' : '🖼️ Galería'}
                      </button>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {activeTab === 'info' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border-2 border-[#FF2D78]/30 rounded-xl">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-[#FF2D78]" /> Sobre este proyecto
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg font-mono text-sm">
                          Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. 
                          Monika, consciente de su realidad, decide escribir su propia historia. Una experiencia emocional llena de 
                          reflexiones sobre la existencia, el amor y la narrativa.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <div className="p-4 rounded-xl bg-white/5 border-2 border-[#FF2D78]/30">
                            <span className="text-[#FF2D78] text-xs font-bold uppercase block mb-1">Estado</span>
                            <span className="text-white font-medium">En desarrollo</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border-2 border-[#FF2D78]/30">
                            <span className="text-[#00F3FF] text-xs font-bold uppercase block mb-1">Calificación</span>
                            <span className="text-white font-medium flex items-center gap-1">4.8 <Star className="w-4 h-4 fill-current" /></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'galeria' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/5 border-2 border-[#FF2D78]/30 rounded-xl">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="flex-none w-64 rounded-xl overflow-hidden border-2 border-[#FF2D78]/50 aspect-video group relative snap-start bg-black/40">
                              <img src={logoImage} alt={`Logo ${idx}`} className="w-full h-full object-contain p-4 bg-white/5 transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="text-[#FF2D78] w-8 h-8" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-[#FF2D78] mt-2 italic font-mono">← Desliza para ver más →</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border-2 border-[#FF2D78]/30 backdrop-blur-xl sticky top-32 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-[#00F3FF]" /> Información
                    </h3>
                    <ul className="space-y-4 font-mono text-sm">
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">&gt; Tiempo de juego</span>
                        <span className="text-white">4-6 horas</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">&gt; Idioma</span>
                        <span className="text-white">Español</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">&gt; Motor</span>
                        <span className="text-white">Ren'Py</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-gray-400">&gt; Descargas</span>
                        <span className="text-white">1,250</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-[#FF2D78]/30 pt-6 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF2D78] font-mono">&gt; Opciones de Descarga</h4>
                    
                    <a 
                      href={downloadLinks.apk} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all group text-sm border-2 border-[#FF2D78]/50"
                    >
                      <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar APK
                    </a>

                    <a 
                      href={downloadLinks.pc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00F3FF] to-[#00D9FF] text-[#0a0a1a] font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all group text-sm border-2 border-[#00F3FF]/50"
                    >
                      <Monitor className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar PC
                    </a>

                    <a 
                      href={downloadLinks.dlx} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all group text-sm border-2 border-[#a855f7]/50"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar Dlx PC
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

export default MonikaProjectView;
