'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download, Share2, X, Sparkles, ArrowRight, Gamepad2, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { CommentSection } from '@/components/CommentSection';
import { useI18n } from '@/hooks/useLocale';

const projects = [
  {
    id: 'monika',
    name: 'Monika After History',
    subtitle: 'Novela Visual Fan-Made',
    description: 'Una historia alternativa que explora qué habría pasado después de los eventos de Doki Doki Literature Club. Monika, consciente de su realidad, decide escribir su propia historia.',
    descriptionEn: 'An alternative story exploring what would have happened after the events of Doki Doki Literature Club. Monika, aware of her reality, decides to write her own story.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/QNUnZaUiQJdXtlLQ.png',
    tags: ['Fan-Made', 'Drama', 'Romance'],
    status: 'En desarrollo',
    statusEn: 'In Development',
    statusColor: '#FF2D78',
    rating: 4.8,
    featured: true,
    previews: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/aINjqqQievBxNtrH.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/PAzOiAkEnDljwtta.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/SQMbABqqTHpkrBbZ.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/imDzsZiLUZbFnwkY.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/ckanJetbgNHzoypH.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/hqcUeLHhGSFvPoUc.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/mnHvrCzqdgXUboSM.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/VNavhokubupDRauh.png',
    ],
    downloads: [
      { label: 'Descargar APK', labelEn: 'Download APK', icon: Smartphone, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Android-Espanol.apk', color: '#FF2D78', hoverColor: '#FF6B9D', textColor: '#ffffff' },
      { label: 'Descargar PC', labelEn: 'Download PC', icon: Monitor, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Espanol.zip', color: '#00F3FF', hoverColor: '#00D9FF', textColor: '#0a0a1a' },
      { label: 'Descargar Dlx PC', labelEn: 'Download Dlx PC', icon: Download, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Dlx-Espanol.zip', color: '#a855f7', hoverColor: '#d946ef', textColor: '#ffffff' },
    ],
    music: 'https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
    details: { playTime: '4-6 horas', playTimeEn: '4-6 hours', language: 'Español', languageEn: 'Spanish', engine: "Ren'Py", downloads: '1,250' },
    themeColor: '#FF2D78',
    lightTheme: true,
  },
  {
    id: 'natsuki',
    name: 'Just Natsuki',
    subtitle: 'Novela Visual Fan-Made',
    description: 'Sumérgete en la historia de Natsuki, explorando su mundo más allá del club de literatura. Una narrativa íntima que profundiza en su personalidad.',
    descriptionEn: 'Immerse yourself in Natsuki\'s story, exploring her world beyond the literature club. An intimate narrative that deepens her personality.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/ImCZGjlQqWHkygmQ.png',
    tags: ['Fan-Made', 'Slice of Life'],
    status: 'Disponible',
    statusEn: 'Available',
    statusColor: '#22c55e',
    rating: 4.5,
    featured: false,
    previews: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/fRwehLiQXmdlyzkT.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/hfJDYHHcaghUPWDY.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/LoFizNNVGrQAVrjI.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/pGPSAZuWYokOhDFV.png',
    ],
    downloads: [
      { label: 'Descargar Mod PC', labelEn: 'Download Mod PC', icon: Download, url: 'https://github.com/The-Encoders-Club/Just-Natsuki-ES/releases/download/Actualizaci%C3%B3n/Jn-ES-1.3.5.zip', color: '#FF2D78', hoverColor: '#FF9EBC', textColor: '#ffffff' },
    ],
    music: 'https://www.youtube.com/embed/BDsCNVj72ig?autoplay=1&loop=1&playlist=BDsCNVj72ig&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
    details: { playTime: '3-5 horas', playTimeEn: '3-5 hours', language: 'Español', languageEn: 'Spanish', engine: "Ren'Py", downloads: '980' },
    themeColor: '#FF6B9D',
  },
  {
    id: 'yuri',
    name: 'Just Yuri',
    subtitle: 'Novela Visual Fan-Made',
    description: 'Una aventura literaria con Yuri como protagonista. Descubre su amor por los libros, los misterios que la rodean y una historia que mezcla lo cotidiano con lo sobrenatural.',
    descriptionEn: 'A literary adventure with Yuri as the protagonist. Discover her love for books, the mysteries that surround her, and a story that mixes the everyday with the supernatural.',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663522621232/wWSuFRWkAQVXHGQp.png',
    tags: ['Fan-Made', 'Misterio', 'Literatura'],
    status: 'Disponible',
    statusEn: 'Available',
    statusColor: '#22c55e',
    rating: 4.6,
    featured: false,
    previews: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/ERFdbrscSjDMvgOl.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/MPSnrhwiqwJDyuXw.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/LchvuPEbNUgWZWIw.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/BRZHysJReWbmrUBX.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/sAQYaDjKwVKlwXno.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/RMbSaSBnofOILTNs.png',
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663532412600/HUSImWKYlSNUyFkf.png',
    ],
    downloads: [
      { label: 'Descargar Mod PC', labelEn: 'Download Mod PC', icon: Download, url: 'https://github.com/The-Encoders-Club/Just-Yuri-ES/releases/download/V1.10.4/JustYuri-Beta-ES-1.10.4-win.zip', color: '#9C27B0', hoverColor: '#E1BEE7', textColor: '#ffffff' },
    ],
    music: 'https://www.youtube.com/embed/VGwfIloNM8w?autoplay=1&loop=1&playlist=VGwfIloNM8w&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
    details: { playTime: '5-7 horas', playTimeEn: '5-7 hours', language: 'Español', languageEn: 'Spanish', engine: "Ren'Py", downloads: '1,120' },
    themeColor: '#9C27B0',
  },
];

const PROYECTOS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663520694523/gdw63Pfk2mCpqaap3WKi6Q/ProyectoFondo_c3356f10.jpg';

// ─── Animated Pink Circles Background ───

function FloatingCircles() {
  const circles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 24 + (i * 17 + 31) % 96,
      x: ((i * 37 + 11) % 100),
      y: ((i * 53 + 7) % 100),
      duration: 14 + (i * 3 + 5) % 18,
      delay: (i * 1.7) % 8,
      opacity: 0.35 + ((i * 13 + 7) % 45) / 100,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {circles.map(c => (
        <motion.div
          key={c.id}
          className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            left: `${c.x}%`,
            top: `${c.y}%`,
            backgroundColor: '#ffeef8',
            opacity: c.opacity,
          }}
          animate={{
            x: [0, 50 + c.size * 0.4, -30 + c.size * 0.2, 50 + c.size * 0.4],
            y: [0, -(35 + c.size * 0.25), 20 + c.size * 0.15, -(35 + c.size * 0.25)],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Image Carousel ───

function ImageCarousel({ images, themeColor, isLight }: { images: string[]; themeColor: string; isLight?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = dir === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth">
        {images.map((src, idx) => (
          <div key={idx} className={`flex-none w-64 sm:w-72 rounded-xl overflow-hidden border aspect-video group relative snap-start transition-all ${isLight ? 'border-gray-200 hover:border-gray-300' : 'border-white/10 hover:border-white/20'}`}>
            <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIcon className={`w-8 h-8 ${isLight ? 'text-gray-700' : 'text-white'}`} />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white/60 text-xs px-2 py-1 rounded-full">
              {idx + 1}/{images.length}
            </div>
          </div>
        ))}
      </div>
      {/* Carousel controls */}
      <button onClick={() => scroll('left')} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full text-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 ${isLight ? 'bg-white/70 border border-gray-300 text-gray-700 hover:bg-white' : 'bg-black/50 border border-white/20 text-white hover:bg-black/70'}`}>
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => scroll('right')} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full text-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 ${isLight ? 'bg-white/70 border border-gray-300 text-gray-700 hover:bg-white' : 'bg-black/50 border border-white/20 text-white hover:bg-black/70'}`}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Project Detail ───

function ProjectDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);

  const isLight = !!project.lightTheme;

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.src = '';
      }
    };
  }, []);

  const toggleMute = () => {
    if (musicRef.current) {
      const iframe = musicRef.current;
      try {
        iframe.contentWindow?.postMessage(
          muted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}',
          '*'
        );
      } catch (e) { /* cross-origin */ }
    }
    setMuted(!muted);
  };

  const isEs = locale === 'es';
  const desc = isEs ? project.description : (project.descriptionEn || project.description);
  const status = isEs ? project.status : (project.statusEn || project.status);

  // Theme-aware color classes
  const txt = isLight ? 'text-gray-900' : 'text-white';
  const txtSub = isLight ? 'text-gray-500' : 'text-gray-300';
  const txtMuted = isLight ? 'text-gray-400' : 'text-white/50';
  const txtLabel = isLight ? 'text-gray-500' : 'text-gray-400';
  const card = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10';
  const cardHover = isLight ? 'hover:border-gray-300' : 'hover:border-white/20';
  const divider = isLight ? 'border-gray-200' : 'border-white/10';

  return (
    <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
      {/* Floating pink circles for light theme */}
      {isLight && <FloatingCircles />}

      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex justify-between items-center ${isLight ? 'bg-white/90 border-gray-200' : 'bg-[#0a0a1a]/90 border-white/20'}`}>
        <button onClick={onClose} className="flex items-center gap-2 text-[#FF2D78] hover:text-[#ff6b9d] transition-colors group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className={`p-2 rounded-full border transition-all ${isLight ? 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`} title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className={`p-2 rounded-full border transition-all ${isLight ? 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <header>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl sm:text-6xl font-black italic tracking-tighter mb-4"
                style={{
                  color: project.themeColor,
                }}
              >
                {project.name}
              </motion.h1>
              <p className={`text-xl font-medium italic ${txtSub}`}>{project.subtitle}</p>
            </header>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border aspect-video relative group" style={{ borderColor: `${project.themeColor}60` }}>
              <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {isLight ? (
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/30 to-transparent" />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: `linear-gradient(to top, ${project.themeColor}15, transparent)` }} />
            </div>

            <div className="space-y-6">
              <h3 className={`text-2xl font-bold flex items-center gap-2 ${txt}`}>
                <BookOpen className="w-6 h-6" style={{ color: project.themeColor }} /> {isEs ? 'Sobre este proyecto' : 'About this project'}
              </h3>
              <p className={`leading-relaxed text-lg ${txtSub}`}>{desc}</p>

              {/* Status & Rating Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border transition-all ${card} ${cardHover}`}>
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.status')}</span>
                  <span className={`font-medium ${txt}`}>{status}</span>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${card} ${cardHover}`}>
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.rating')}</span>
                  <span className={`font-medium flex items-center gap-1 ${txt}`}>
                    {project.rating} <Star className="w-4 h-4 fill-current text-yellow-400" />
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border transition-all cursor-default" style={{
                    borderColor: `${project.themeColor}40`,
                    background: isLight ? '#fff5f9' : `${project.themeColor}10`,
                    color: project.themeColor,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Preview Images Carousel */}
              <div className={`pt-8 border-t ${divider}`}>
                <h4 className={`text-xl font-bold mb-4 flex items-center gap-2 ${txt}`}>
                  <ImageIcon className="w-5 h-5" style={{ color: project.themeColor }} /> {t('projects.preview')}
                </h4>
                <ImageCarousel images={project.previews} themeColor={project.themeColor} isLight={isLight} />
              </div>

              {/* Comments */}
              <div className={`pt-8 border-t ${divider}`}>
                <CommentSection targetId={project.id} targetType="project" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className={`p-8 rounded-3xl border backdrop-blur-xl sticky top-32 space-y-6 ${isLight ? 'bg-white/90 border-gray-200 shadow-lg' : 'bg-gradient-to-b from-white/10 to-transparent border-white/10'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${txt}`}>
                <Cpu className="w-5 h-5" style={{ color: project.themeColor }} /> {t('projects.details')}
              </h3>
              <ul className="space-y-4">
                {[
                  { label: t('projects.playTime'), value: isEs ? project.details.playTime : (project.details.playTimeEn || project.details.playTime) },
                  { label: t('projects.language'), value: isEs ? project.details.language : (project.details.languageEn || project.details.language) },
                  { label: t('projects.engine'), value: project.details.engine },
                  { label: t('projects.downloads'), value: project.details.downloads },
                ].map(item => (
                  <li key={item.label} className="flex justify-between text-sm">
                    <span className={txtLabel}>{item.label}</span>
                    <span className={`font-mono ${txt}`}>{item.value}</span>
                  </li>
                ))}
              </ul>
              <div className={`border-t pt-6 space-y-3 ${divider}`}>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: project.themeColor }}>
                  {isEs ? 'Opciones de Descarga' : 'Download Options'}
                </h4>
                {project.downloads.map((dl, i) => {
                  const Icon = dl.icon;
                  return (
                    <a
                      key={i}
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group text-sm font-bold uppercase tracking-tight"
                      style={{
                        background: `linear-gradient(135deg, ${dl.color}, ${dl.hoverColor || dl.color})`,
                        color: dl.textColor || '#ffffff',
                        boxShadow: `0 4px 15px ${dl.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      {isEs ? dl.label : (dl.labelEn || dl.label)}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden music iframe */}
      <iframe
        ref={musicRef}
        className="hidden"
        width="0"
        height="0"
        src={project.music}
        allow="autoplay"
        title={`${project.name} Music`}
      />
    </div>
  );
}

export default function Proyectos() {
  const { t, locale } = useI18n();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const project = projects.find(p => p.id === activeProject);
  const isEs = locale === 'es';

  // Lock body scroll when project detail is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden relative bg-[#080818]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(8, 8, 24, 0.85) 0%, rgba(26, 10, 26, 0.8) 50%, rgba(8, 8, 24, 0.85) 100%), url("${PROYECTOS_BG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <BackgroundParticles />
      <Navbar />

      {/* PROJECT DETAIL VIEW */}
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-[100] overflow-y-auto ${project.lightTheme ? 'bg-[#ffffff] text-gray-900' : 'bg-[#0a0a1a] text-white'}`}
          >
            {/* Dark gradient overlay only for dark theme */}
            {!project.lightTheme && (
              <div
                className="fixed inset-0 z-0 opacity-100 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, ${project.themeColor}26 50%, rgba(10, 10, 26, 0.95) 100%)`,
                }}
              />
            )}
            <ProjectDetail project={project} onClose={() => setActiveProject(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE HEADER */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#FF2D78] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              {isEs ? 'Nuestras creaciones' : 'Our creations'}
            </span>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t('projects.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]">
                {t('projects.title').includes('Destacados') ? '' : ''}
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              {isEs
                ? 'Novelas visuales creadas con pasión por nuestra comunidad usando el motor Ren\'Py.'
                : 'Visual novels created with passion by our community using the Ren\'Py engine.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured project */}
          {projects
            .filter(p => p.featured)
            .map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                onClick={() => setActiveProject(project.id)}
                className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 cursor-pointer group hover:border-[#FF2D78]/40 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#00F3FF]" />
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-48 sm:h-64 lg:h-auto min-h-[200px] bg-[#0d0d24] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
                    <img src={project.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
                    <img
                      src={project.image}
                      alt={project.name}
                      className="relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-2"
                    />
                    <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF2D78] text-white">
                      {t('projects.featured')}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="bg-white/10 border border-white/20 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold backdrop-blur-sm">
                        <Sparkles size={16} className="text-[#FF2D78]" />{t('projects.explore')}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}
                      >
                        {isEs ? project.status : (project.statusEn || project.status)}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star size={12} fill="currentColor" />
                        <span>{project.rating}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {project.name}
                    </h2>
                    <p className="text-[#FF2D78] text-sm font-medium mb-4">{project.subtitle}</p>
                    <p className="text-white/60 text-base leading-relaxed mb-6">
                      {isEs ? project.description : (project.descriptionEn || project.description)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[#FF2D78] font-bold text-sm group-hover:translate-x-2 transition-transform">
                      {t('common.viewMore')} <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Non-featured projects grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {projects
              .filter(p => !p.featured)
              .map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setActiveProject(project.id)}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group hover:border-[#00F3FF]/40 transition-all duration-300"
                >
                  <div className="relative h-48 bg-[#0d0d24] flex items-center justify-center overflow-hidden border-b border-white/5">
                    <img src={project.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" />
                    <img
                      src={project.image}
                      alt={project.name}
                      className="relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-4"
                    />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}
                      >
                        {isEs ? project.status : (project.statusEn || project.status)}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star size={11} fill="currentColor" />
                        <span>{project.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {project.name}
                    </h3>
                    <p className="text-[#00F3FF] text-xs font-medium mb-3">{project.subtitle}</p>
                    <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">
                      {isEs ? project.description : (project.descriptionEn || project.description)}
                    </p>
                    <div className="flex items-center gap-2 text-[#00F3FF] font-bold text-xs group-hover:translate-x-2 transition-transform">
                      {t('common.viewMore')} <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D78]/5 via-[#a855f7]/5 to-[#00F3FF]/5 pointer-events-none" />
            <Gamepad2 size={32} className="text-[#FF2D78] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEs ? 'Más proyectos en camino' : 'More projects coming'}
            </h3>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              {isEs
                ? 'Estamos trabajando en nuevas novelas visuales. Únete a nuestro Discord para ser el primero en enterarte.'
                : 'We are working on new visual novels. Join our Discord to be the first to know.'}
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
