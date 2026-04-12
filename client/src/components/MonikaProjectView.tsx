import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor } from 'lucide-react';

interface ProjectViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MonikaProjectView: React.FC<ProjectViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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
  const mainImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/QNUnZaUiQJdXtlLQ.png";
  
  // Imágenes de Vista Previa
  const previewImages = [
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/aINjqqQievBxNtrH.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/PAzOiAkEnDljwtta.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/SQMbABqqTHpkrBbZ.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/imDzsZiLUZbFnwkY.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/ckanJetbgNHzoypH.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/hqcUeLHhGSFvPoUc.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/mnHvrCzqdgXUboSM.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/VNavhokubupDRauh.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/FTiVNZDbNzrxYLru.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/kDfjVkwKTzlQzRPB.png",
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/hXRRqliKnkVzLsPq.png"
  ];

  // Enlaces de descarga
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
        className="project-modal-root fixed inset-0 z-[100] bg-[#0a0a1a] text-white overflow-y-auto monika-theme"
      >
        {/* FONDO TEMÁTICO - DEGRADADO MONIKA */}
        <div 
          className="fixed inset-0 z-0 opacity-100 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, rgba(255, 45, 120, 0.15) 50%, rgba(10, 10, 26, 0.95) 100%)`, backgroundColor: '#0a0a1a' }}
        />

        <iframe
          className="project-music-frame"
          width="120"
          height="80"
          src="https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&modestbranding=1&controls=0&rel=0&iv_load_policy=3&start=2&playsinline=1"
          allow="autoplay; encrypted-media"
          title="Monika Theme Music"
        />

        <div className="project-modal-shell relative z-10 min-h-screen bg-gradient-to-br from-[#0a0a1a]/95 via-[#1a0a1a]/90 to-[#0a0a1a]/95 w-full overflow-x-hidden">
          <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-[#FF2D78]/30 px-4 sm:px-6 py-4 flex justify-between items-center w-full">
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

          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 w-full">
              <div className="lg:col-span-2 space-y-8">
                <header>
                  <motion.h1 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-4xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF] mb-4"
                  >
                    Monika After History
                  </motion.h1>
                  <p className="text-xl text-gray-300 font-medium italic">Una historia alternativa de reflexión y existencia</p>
                </header>

                {/* PORTADA - AJUSTE TOTAL */}
                <div className="project-detail-cover rounded-2xl overflow-hidden border border-[#FF2D78]/50 shadow-[0_0_30px_rgba(255,45,120,0.3)] aspect-video relative group bg-[#090918]">
                  <img 
                    src={mainImage} 
                    alt="Monika After History" 
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/30 to-transparent pointer-events-none" />
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 border-b border-white/10 pb-4">
                    {['info', 'kiwi'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest transition-all text-sm ${
                          activeTab === tab 
                            ? 'bg-gradient-to-r from-[#FF2D78] to-[#00F3FF] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)]' 
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

                        {/* SECCIÓN DE IMÁGENES ACTUALIZADA */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#FF2D78]" /> Vista Previa
                          </h4>
                          <div className="project-preview-strip flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {previewImages.map((src, idx) => (
                              <button key={idx} type="button" onClick={() => setLightboxSrc(src)} className="project-preview-thumb flex-none w-64 rounded-xl overflow-hidden border border-white/10 aspect-video group relative snap-start text-left">
                                <img src={src} alt={`Vista Previa ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" decoding="async" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ImageIcon className="text-white w-8 h-8" />
                                </div>
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">← Desliza para ver más · toca una imagen para ampliar →</p>
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
                <div className="project-detail-panel p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl sticky top-32 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-[#00F3FF]" /> Detalles
                    </h3>
                    <ul className="space-y-4">
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
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF2D78]">Opciones de Descarga</h4>
                    
                    <a 
                      href={downloadLinks.apk} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all group text-sm"
                    >
                      <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar APK
                    </a>

                    <a 
                      href={downloadLinks.pc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00F3FF] to-[#00D9FF] text-[#0a0a1a] font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all group text-sm"
                    >
                      <Monitor className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar PC
                    </a>

                    <a 
                      href={downloadLinks.dlx} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white font-bold uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all group text-sm"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Descargar Dlx PC
                    </a>
                  </div>
                </div>
              </div>
              )}
            </div>
          </main>
        </div>
        <AnimatePresence>
          {lightboxSrc && (
            <motion.button
              type="button"
              className="project-lightbox"
              onClick={() => setLightboxSrc(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Cerrar imagen ampliada"
            >
              <span className="project-lightbox-close">
                <X className="w-5 h-5" />
                Cerrar
              </span>
              <img src={lightboxSrc} alt="Vista previa ampliada" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default MonikaProjectView;
