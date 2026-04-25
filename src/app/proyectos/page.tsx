'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download, Share2, X, Sparkles, ArrowRight, Gamepad2, Volume2, VolumeX, ChevronLeft, ChevronRight, Search, Shirt, Puzzle, Eye } from 'lucide-react';
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
    version: 'v0.12.18',
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
      { label: 'DESCARGAR APK', labelEn: 'DOWNLOAD APK', icon: Smartphone, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Android-Espanol.apk', color: '#FF80AB', textColor: '#ffffff' },
      { label: 'DESCARGAR PC', labelEn: 'DOWNLOAD PC', icon: Monitor, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Espanol.zip', color: '#4DD0E1', textColor: '#ffffff' },
      { label: 'DESCARGAR DLX PC', labelEn: 'DOWNLOAD DLX PC', icon: Download, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Dlx-Espanol.zip', color: '#AB47BC', textColor: '#ffffff' },
    ],
    resources: [
      { title: 'Wiki del Mod', desc: 'Toda la información técnica, guías y lore.', icon: Search, btnLabel: 'Ver Wiki', btnLabelEn: 'View Wiki', url: '#', color: '#FF80AB' },
      { title: 'Spritepacks', desc: 'Cambia la ropa y accesorios de Monika.', icon: Shirt, btns: [{ label: 'Ver Ropa', labelEn: 'View Clothes', url: '#' }, { label: 'Ver Accesorios', labelEn: 'View Accessories', url: '#' }], color: '#FF80AB' },
      { title: 'Submods', desc: 'Amplía las características y diálogos.', icon: Puzzle, btnLabel: 'Explorar Submods', btnLabelEn: 'Explore Submods', url: '#', color: '#FF80AB' },
    ],
    music: 'https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
    details: { playTime: '4-6 horas', playTimeEn: '4-6 hours', language: 'Español', languageEn: 'Spanish', engine: "Ren'Py", downloads: '1,250' },
    themeColor: '#D14D7A',
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

// ─── Pink Polka Dots Background ───

function PinkDots() {
  const dots = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      size: 20 + ((i * 17 + 31) % 35),
      x: ((i * 37 + 11) % 100),
      y: ((i * 53 + 7) % 100),
      opacity: 0.35 + ((i * 13 + 7) % 40) / 100,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
            opacity: d.opacity,
          }}
          animate={{
            x: [0, 40 + d.size * 0.3, -25 + d.size * 0.15, 40 + d.size * 0.3],
            y: [0, -(30 + d.size * 0.2), 18 + d.size * 0.1, -(30 + d.size * 0.2)],
          }}
          transition={{
            duration: 12 + (i * 2) % 14,
            delay: (i * 1.5) % 7,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Image Carousel (dark theme) ───

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

// ─── Monika Light Theme Detail ───

function MonikaProjectDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return () => { if (musicRef.current) musicRef.current.src = ''; };
  }, []);

  const toggleMute = () => {
    if (musicRef.current) {
      try {
        musicRef.current.contentWindow?.postMessage(
          muted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}', '*'
        );
      } catch (e) {}
    }
    setMuted(!muted);
  };

  const isEs = locale === 'es';
  const desc = isEs ? project.description : (project.descriptionEn || project.description);
  const status = isEs ? project.status : (project.statusEn || project.status);

  const sectionDot = <span className="inline-block w-3 h-3 rounded-full bg-[#D14D7A] border-2 border-white shadow-sm mr-3 shrink-0" />;

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'M1';
          src: url('/fonts/m1_fixed.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .font-m1 { font-family: 'M1', sans-serif; }
      `}</style>

      <div className="relative z-10 min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: '#FFE6EA' }}>
        <PinkDots />

        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[200] w-10 h-10 rounded-full bg-white/90 border border-[#FFCDD2] flex items-center justify-center text-[#D14D7A] hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Audio toggle */}
        <button
          onClick={toggleMute}
          className="fixed top-4 right-16 z-[200] w-10 h-10 rounded-full bg-white/90 border border-[#FFCDD2] flex items-center justify-center text-[#D14D7A] hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          {/* Hero: Title + Image + Details Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Title */}
            <h1 className="font-m1 text-4xl sm:text-5xl lg:text-6xl font-bold text-[#D14D7A] mb-1 tracking-tight">
              {project.name}
            </h1>
            <p className="text-[#555] text-base sm:text-lg mb-6 font-m1">{project.subtitle}</p>

            {/* Hero image + Details card */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Hero Image */}
              <div className="lg:flex-[7] relative rounded-xl overflow-hidden" style={{ minHeight: '300px' }}>
                <img src={project.image} alt={project.name} className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFE6EA]/40 to-transparent pointer-events-none rounded-xl" />
                {/* Decorative circles */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-white/60 bg-[#FFB6C8]/50 hidden lg:block" />
                <div className="absolute -right-6 top-1/3 w-20 h-20 rounded-full border-4 border-white/60 bg-[#FFB6C8]/50 hidden lg:block" />
              </div>

              {/* Details Card */}
              <div className="lg:flex-[3] bg-white rounded-xl border border-[#FFCDD2] p-5 shadow-sm self-start lg:sticky lg:top-24">
                <h3 className="text-[#D14D7A] font-bold text-base mb-4 flex items-center font-m1">
                  {sectionDot} Detalles
                </h3>
                <ul className="space-y-3 mb-5">
                  {[
                    { label: isEs ? 'Tiempo de juego' : 'Play time', value: isEs ? project.details.playTime : (project.details.playTimeEn || project.details.playTime) },
                    { label: isEs ? 'Idioma' : 'Language', value: isEs ? project.details.language : (project.details.languageEn || project.details.language) },
                    { label: isEs ? 'Motor' : 'Engine', value: project.details.engine },
                    { label: isEs ? 'Descargas' : 'Downloads', value: project.details.downloads },
                  ].map(item => (
                    <li key={item.label} className="flex justify-between text-sm">
                      <span className="text-[#666]">{item.label}</span>
                      <span className="text-[#333] font-medium">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[#FFCDD2] pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D14D7A] mb-3 font-m1">
                    {isEs ? 'Opciones de Descarga' : 'Download Options'}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {project.downloads.map((dl, i) => {
                      const Icon = dl.icon;
                      return (
                        <a
                          key={i}
                          href={dl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-bold uppercase tracking-wide shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                          style={{ backgroundColor: dl.color }}
                        >
                          <Icon className="w-4 h-4" />
                          {isEs ? dl.label : (dl.labelEn || dl.label)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* About this project */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-white rounded-xl border border-[#FFCDD2] p-5 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#D14D7A] font-bold text-base flex items-center font-m1">
                    {sectionDot} {isEs ? 'Sobre este proyecto' : 'About this project'}
                  </h3>
                  <span className="text-[#999] text-xs font-m1">{project.version}</span>
                </div>
                <p className="text-[#333] text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>

            {/* Status + Rating */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-[#FFCDD2] p-4 shadow-sm">
                <span className="text-xs font-bold uppercase text-[#666] block mb-1 font-m1">{isEs ? 'Estado' : 'Status'}</span>
                <span className="text-[#333] font-medium text-sm">{status}</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl border border-[#FFCDD2] p-4 shadow-sm">
                <span className="text-xs font-bold uppercase text-[#666] block mb-1 font-m1">{isEs ? 'Calificación' : 'Rating'}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[#333] font-medium text-sm">{project.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} className={s <= Math.floor(project.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs px-4 py-1.5 rounded-full bg-[#FFCDD2] text-white font-medium font-m1">
                  {tag}
                </span>
              ))}
            </div>

            {/* Preview Grid */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
              <h3 className="text-[#D14D7A] font-bold text-base flex items-center mb-4 font-m1">
                {sectionDot} {isEs ? 'Vista Previa' : 'Preview'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.previews.slice(0, 3).map((src, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden relative group cursor-pointer">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute bottom-2 right-2 bg-black/50 text-white/70 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {idx + 1}/{project.previews.length}
                    </span>
                  </div>
                ))}
              </div>
              {project.previews.length > 3 && (
                <div className="mt-4 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-3 pb-2">
                    {project.previews.slice(3).map((src, idx) => (
                      <div key={idx} className="flex-none w-48 rounded-lg overflow-hidden relative group cursor-pointer">
                        <img src={src} alt={`Preview ${idx + 4}`} className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105" />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/50 text-white/70 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                          {idx + 4}/{project.previews.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Resources */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
              <h3 className="text-[#D14D7A] font-bold text-base flex items-center mb-4 font-m1">
                {sectionDot} {isEs ? 'Recursos y Contenido Extra' : 'Resources & Extra Content'}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {'resources' in project && (project.resources as Array<{ title: string; titleEn?: string; desc: string; descEn?: string; icon: React.ComponentType<{ size?: number; className?: string }>; btnLabel?: string; btnLabelEn?: string; btns?: Array<{ label: string; labelEn?: string; url: string }>; url?: string; color: string }>).map((res, i) => {
                  const RIcon = res.icon;
                  return (
                    <div key={i} className="bg-white rounded-xl border border-[#FFCDD2] p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <RIcon size={18} className="text-[#FF80AB]" />
                        <h4 className="text-[#333] font-bold text-sm font-m1">{isEs ? res.title : (res.titleEn || res.title)}</h4>
                      </div>
                      <p className="text-[#666] text-xs mb-4 leading-relaxed">{isEs ? res.desc : (res.descEn || res.desc)}</p>
                      {res.btns ? (
                        <div className="flex gap-2">
                          {res.btns.map((btn, bi) => (
                            <a key={bi} href={btn.url} className="flex-1 py-2 rounded-lg bg-[#FF80AB] text-white text-xs font-bold text-center hover:bg-[#F06292] transition-colors font-m1">
                              {isEs ? btn.label : (btn.labelEn || btn.label)}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <a href={res.url || '#'} className="block w-full py-2 rounded-lg bg-[#FF80AB] text-white text-xs font-bold text-center hover:bg-[#F06292] transition-colors font-m1">
                          {isEs ? (res.btnLabel || 'Ver') : (res.btnLabelEn || 'View')}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <CommentSection targetId={project.id} targetType="project" />
            </motion.div>
          </motion.div>
        </main>

        {/* Hidden music iframe */}
        <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
      </div>
    </>
  );
}

// ─── Dark Theme Project Detail (original) ───

function ProjectDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return () => { if (musicRef.current) musicRef.current.src = ''; };
  }, []);

  const toggleMute = () => {
    if (musicRef.current) {
      try {
        musicRef.current.contentWindow?.postMessage(
          muted ? '{"event":"command","func":"unMute","args":""}' : '{"event":"command","func":"mute","args":""}', '*'
        );
      } catch (e) {}
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

      <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
    </div>
  );
}

// ─── Main Page ───

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
            className="fixed inset-0 z-[100] overflow-y-auto"
          >
            {/* Choose light or dark detail */}
            {project.lightTheme ? (
              <MonikaProjectDetail project={project} onClose={() => setActiveProject(null)} />
            ) : (
              <>
                <div
                  className="fixed inset-0 z-0 opacity-100 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, ${project.themeColor}26 50%, rgba(10, 10, 26, 0.95) 100%)`,
                  }}
                />
                <ProjectDetail project={project} onClose={() => setActiveProject(null)} />
              </>
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
              {t('projects.title')}
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
          {projects.filter(p => p.featured).map(project => (
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h2>
                  <p className="text-[#FF2D78] text-sm font-medium mb-4">{project.subtitle}</p>
                  <p className="text-white/60 text-base leading-relaxed mb-6">{isEs ? project.description : (project.descriptionEn || project.description)}</p>
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

          {/* Non-featured projects grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.filter(p => !p.featured).map((project, i) => (
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
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.name}</h3>
                  <p className="text-[#00F3FF] text-xs font-medium mb-3">{project.subtitle}</p>
                  <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">{isEs ? project.description : (project.descriptionEn || project.description)}</p>
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
