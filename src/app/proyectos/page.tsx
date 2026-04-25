'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download,
  Share2, X, Sparkles, ArrowRight, Gamepad2, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Search, Shirt, Puzzle, FileText
} from 'lucide-react';
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
    lightTheme: true,
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

/* ─── Animated pink dots background ─── */
function PinkDots() {
  const dots = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            left: `${d.x}%`,
            top: `${d.y}%`,
            backgroundColor: '#FFB6C8',
            opacity: 0.45,
          }}
          animate={{
            x: [0, 300, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Image carousel (dark theme) ─── */
function ImageCarousel({ images, themeColor }: { images: string[]; themeColor: string }) {
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
          <div key={idx} className="flex-none w-64 sm:w-72 rounded-xl overflow-hidden border border-white/10 aspect-video group relative snap-start hover:border-white/20 transition-all">
            <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIcon className="text-white w-8 h-8" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white/60 text-xs px-2 py-1 rounded-full">
              {idx + 1}/{images.length}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ─── Dark theme detail view (Just Natsuki, Just Yuri, etc.) ─── */
function ProjectDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return () => {
      if (musicRef.current) musicRef.current.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (musicRef.current) {
      try {
        musicRef.current.contentWindow?.postMessage(
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

  return (
    <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
      <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex justify-between items-center">
        <button onClick={onClose} className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all" title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <header>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text mb-4"
                style={{ backgroundImage: `linear-gradient(to right, ${project.themeColor}, ${project.themeColor}99)` }}
              >
                {project.name}
              </motion.h1>
              <p className="text-xl text-gray-300 font-medium italic">{project.subtitle}</p>
            </header>

            <div className="rounded-2xl overflow-hidden border aspect-video relative group" style={{ borderColor: `${project.themeColor}80` }}>
              <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: `linear-gradient(to top, ${project.themeColor}15, transparent)` }} />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6" style={{ color: project.themeColor }} /> {isEs ? 'Sobre este proyecto' : 'About this project'}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">{desc}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.status')}</span>
                  <span className="text-white font-medium">{status}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.rating')}</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    {project.rating} <Star className="w-4 h-4 fill-current text-yellow-400" />
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border text-white/70 hover:text-white hover:bg-white/5 transition-all" style={{ borderColor: `${project.themeColor}40`, background: `${project.themeColor}10` }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" style={{ color: project.themeColor }} /> {t('projects.preview')}
                </h4>
                <ImageCarousel images={project.previews} themeColor={project.themeColor} />
              </div>

              <div className="pt-8 border-t border-white/10">
                <CommentSection targetId={project.id} targetType="project" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl sticky top-32 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
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
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-mono">{item.value}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-6 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: project.themeColor }}>
                  {isEs ? 'Opciones de Descarga' : 'Download Options'}
                </h4>
                {project.downloads.map((dl, i) => {
                  const Icon = dl.icon;
                  return (
                    <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group text-sm font-bold uppercase tracking-tight"
                      style={{ background: `linear-gradient(135deg, ${dl.color}, ${dl.hoverColor || dl.color})`, color: dl.textColor || '#ffffff', boxShadow: `0 4px 15px ${dl.color}30` }}>
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

      <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
    </div>
  );
}

/* ─── Light/pink theme detail view (Monika After History) ─── */
function MonikaDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => { if (musicRef.current) musicRef.current.src = ''; };
  }, []);

  const toggleMute = () => {
    if (musicRef.current) {
      try {
        musicRef.current.contentWindow?.postMessage(
          muted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}', '*'
        );
      } catch (e) { /* cross-origin */ }
    }
    setMuted(!muted);
  };

  const isEs = locale === 'es';
  const desc = isEs ? project.description : (project.descriptionEn || project.description);
  const status = isEs ? project.status : (project.statusEn || project.status);

  /* Preview scroll helpers */
  const scrollPreview = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  /* ─── Sidebar content (details + downloads) ─── */
  const SidebarContent = () => (
    <div className="bg-white rounded-2xl border border-[#FFB6C8]/40 shadow-sm p-6 space-y-5">
      <h3 className="text-lg font-bold text-[#FF2D78] flex items-center gap-2">
        <FileText className="w-5 h-5" /> {t('projects.details')}
      </h3>
      <ul className="space-y-3">
        {[
          { label: t('projects.playTime'), value: isEs ? project.details.playTime : (project.details.playTimeEn || project.details.playTime) },
          { label: t('projects.language'), value: isEs ? project.details.language : (project.details.languageEn || project.details.language) },
          { label: t('projects.engine'), value: project.details.engine },
          { label: t('projects.downloads'), value: project.details.downloads },
        ].map(item => (
          <li key={item.label} className="flex justify-between text-sm py-2 border-b border-[#FFB6C8]/20 last:border-0">
            <span className="text-gray-500">{item.label}</span>
            <span className="text-gray-800 font-mono">{item.value}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-[#FFB6C8]/20 pt-4 space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF2D78]">
          {isEs ? 'Opciones de Descarga' : 'Download Options'}
        </h4>
        {project.downloads.map((dl, i) => {
          const Icon = dl.icon;
          return (
            <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer"
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group text-sm font-bold uppercase tracking-tight"
              style={{ background: `linear-gradient(135deg, ${dl.color}, ${dl.hoverColor || dl.color})`, color: dl.textColor || '#ffffff', boxShadow: `0 4px 15px ${dl.color}30` }}>
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isEs ? dl.label : (dl.labelEn || dl.label)}
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'm1_fixed';
          src: url('/fonts/m1_fixed.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="relative z-10 min-h-screen w-full overflow-x-hidden" style={{ fontFamily: "'m1_fixed', monospace", backgroundColor: '#FFE6EA' }}>
        <PinkDots />

        {/* Nav - NO border, NO share button */}
        <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center" style={{ backgroundColor: 'rgba(255,230,234,0.92)', backdropFilter: 'blur(12px)' }}>
          <button onClick={onClose} className="flex items-center gap-2 text-[#d6336c] hover:text-[#FF2D78] transition-colors group">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
          </button>
        </nav>

        <main ref={scrollRef} className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Title - left aligned */}
          <header>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl font-black italic tracking-tighter text-[#FF2D78] mb-1 text-left"
            >
              {project.name}
            </motion.h1>
            <p className="text-base text-[#d6336c]/60 font-medium italic text-left">{project.subtitle}</p>
          </header>

          {/* ─── Hero Image + Sidebar (side by side on desktop, stacked on mobile) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cover Image - 2 cols on desktop */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border-2 border-[#FFB6C8] aspect-video relative group">
              <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFE6EA]/30 to-transparent" />
            </div>

            {/* Sidebar: Details + Downloads - 1 col on desktop, full width on mobile */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <SidebarContent />
            </div>
          </div>

          {/* ─── Sobre este proyecto (with volume button) ─── */}
          <div className="bg-white rounded-2xl p-6 border border-[#FFB6C8]/40 shadow-sm">
            <h3 className="text-lg font-bold text-[#FF2D78] flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> {isEs ? 'Sobre este proyecto' : 'About this project'}
              </span>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-[#FFE6EA] border border-[#FFB6C8] text-[#FF2D78] hover:bg-[#FFB6C8]/30 transition-all"
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>

            {/* Status + Rating */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="p-3 rounded-xl bg-[#FFE6EA]/50 border border-[#FFB6C8]/30">
                <span className="text-xs font-bold uppercase block mb-1 text-[#FF2D78]">{t('projects.status')}</span>
                <span className="text-gray-700 font-medium text-sm">{status}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFE6EA]/50 border border-[#FFB6C8]/30">
                <span className="text-xs font-bold uppercase block mb-1 text-[#FF2D78]">{t('projects.rating')}</span>
                <span className="text-gray-700 font-medium text-sm flex items-center gap-1">
                  {project.rating} <Star className="w-4 h-4 fill-current text-yellow-400" />
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-[#FFB6C8]/40 text-[#d6336c] bg-[#FFE6EA]/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Vista Previa (scrollable, multiple visible) ─── */}
          <div className="bg-white rounded-2xl p-6 border border-[#FFB6C8]/40 shadow-sm">
            <h4 className="text-lg font-bold text-[#FF2D78] mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> {t('projects.preview')}
            </h4>
            <div className="relative group/prev">
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x scroll-smooth">
                {project.previews.map((src, idx) => (
                  <div key={idx} className="flex-none w-48 sm:w-56 rounded-xl overflow-hidden border border-[#FFB6C8]/40 aspect-video group relative snap-start hover:border-[#FF2D78]/60 transition-all">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="text-white w-6 h-6" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#FF2D78]/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {idx + 1}/{project.previews.length}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollPreview('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-7 h-7 rounded-full bg-[#FF2D78]/80 border border-[#FFB6C8] text-white flex items-center justify-center opacity-0 group-hover/prev:opacity-100 transition-opacity z-10">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => scrollPreview('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-7 h-7 rounded-full bg-[#FF2D78]/80 border border-[#FFB6C8] text-white flex items-center justify-center opacity-0 group-hover/prev:opacity-100 transition-opacity z-10">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ─── Recursos y Contenido Extra ─── */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#FF2D78] flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> {isEs ? 'Recursos y Contenido Extra' : 'Resources & Extra Content'}
            </h3>

            {/* Wiki del Mod */}
            <div className="bg-white rounded-2xl p-5 border border-[#FFB6C8]/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FFE6EA] flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-[#FF2D78]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Wiki del Mod</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {isEs
                      ? 'Toda la información técnica, guías y lore del mod.'
                      : 'All technical info, guides, and mod lore.'}
                  </p>
                  <button className="px-4 py-2 rounded-lg bg-[#FF2D78] text-white text-xs font-semibold hover:bg-[#d6336c] transition-colors">
                    {isEs ? 'Ver Wiki' : 'View Wiki'}
                  </button>
                </div>
              </div>
            </div>

            {/* Spritepacks */}
            <div className="bg-white rounded-2xl p-5 border border-[#FFB6C8]/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FFE6EA] flex items-center justify-center flex-shrink-0">
                  <Shirt className="w-5 h-5 text-[#FF2D78]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Spritepacks</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {isEs
                      ? 'Cambia la ropa y accesorios de Monika.'
                      : 'Change Monika\'s clothes and accessories.'}
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-[#FF2D78] text-white text-xs font-semibold hover:bg-[#d6336c] transition-colors">
                      {isEs ? 'Ver Ropa' : 'View Clothes'}
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-[#FFB6C8] text-[#FF2D78] text-xs font-semibold hover:bg-[#FFE6EA] transition-colors">
                      {isEs ? 'Ver Accesorios' : 'View Accessories'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submods */}
            <div className="bg-white rounded-2xl p-5 border border-[#FFB6C8]/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FFE6EA] flex items-center justify-center flex-shrink-0">
                  <Puzzle className="w-5 h-5 text-[#FF2D78]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Submods</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {isEs
                      ? 'Amplía las características y diálogos.'
                      : 'Expand features and dialogues.'}
                  </p>
                  <button className="px-4 py-2 rounded-lg bg-[#FF2D78] text-white text-xs font-semibold hover:bg-[#d6336c] transition-colors">
                    {isEs ? 'Explorar Submods' : 'Explore Submods'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Comentarios (solid white card with font) ─── */}
          <div className="bg-white rounded-2xl p-6 border border-[#FFB6C8]/40 shadow-sm">
            <CommentSection targetId={project.id} targetType="project" lightTheme />
          </div>

        </main>

        {/* Hidden music iframe */}
        <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
      </div>
    </>
  );
}

/* ─── Main page ─── */
export default function Proyectos() {
  const { t, locale } = useI18n();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const project = projects.find(p => p.id === activeProject);
  const isEs = locale === 'es';

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
            className={`fixed inset-0 z-[100] overflow-y-auto ${
              project.lightTheme ? 'bg-[#FFE6EA]' : 'bg-[#0a0a1a] text-white'
            }`}
          >
            {!project.lightTheme && (
              <div
                className="fixed inset-0 z-0 opacity-100 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, ${project.themeColor}26 50%, rgba(10, 10, 26, 0.95) 100%)`,
                }}
              />
            )}
            {project.lightTheme ? (
              <MonikaDetail project={project} onClose={() => setActiveProject(null)} />
            ) : (
              <ProjectDetail project={project} onClose={() => setActiveProject(null)} />
            )}
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
                    <img src={project.image} alt={project.name} className="relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-2" />
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
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
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
                        <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[#FF2D78] font-bold text-sm group-hover:translate-x-2 transition-transform">
                      {t('common.viewMore')} <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

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
                    <img src={project.image} alt={project.name} className="relative z-10 w-full h-full object-contain opacity-100 group-hover:scale-105 transition-transform duration-700 p-4" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}20`, border: `1px solid ${project.statusColor}40`, color: project.statusColor }}>
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
