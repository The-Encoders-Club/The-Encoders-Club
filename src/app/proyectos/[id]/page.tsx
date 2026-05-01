'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download, Share2, ArrowLeft, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
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
      {/* Carousel controls */}
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const musicRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(false);

  const project = projects.find(p => p.id === params.id);

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  // Cleanup music on unmount (when user navigates away)
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.src = '';
      }
    };
  }, []);

  // If project not found, show a "not found" state
  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Proyecto no encontrado</h1>
          <p className="text-white/60">El proyecto que buscas no existe.</p>
          <button onClick={() => router.push('/proyectos')} className="px-6 py-3 rounded-xl bg-[#FF2D78] text-white font-semibold hover:bg-[#FF2D78]/80 transition-all">
            Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden relative"
      style={{
        background: `linear-gradient(135deg, rgba(10, 10, 26, 0.97) 0%, ${project.themeColor}15 50%, rgba(10, 10, 26, 0.97) 100%), #0a0a1a`,
        minHeight: '100vh',
      }}
    >
      <BackgroundParticles />
      <Navbar />

      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex justify-between items-center mt-16">
        <button onClick={() => router.push('/proyectos')} className="flex items-center gap-2 hover:text-white transition-colors group" style={{ color: project.themeColor }}>
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
        </button>
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button onClick={toggleMute} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all" title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
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

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border aspect-video relative group" style={{ borderColor: `${project.themeColor}80` }}>
              <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/30 to-transparent" />
              {/* Theme color glow */}
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

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border text-white/70 hover:text-white hover:bg-white/5 transition-all" style={{ borderColor: `${project.themeColor}40`, background: `${project.themeColor}10` }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Preview Images Carousel */}
              <div className="pt-8 border-t border-white/10">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" style={{ color: project.themeColor }} /> {t('projects.preview')}
                </h4>
                <ImageCarousel images={project.previews} themeColor={project.themeColor} />
              </div>

              {/* Comments */}
              <div className="pt-8 border-t border-white/10">
                <CommentSection targetId={project.id} targetType="project" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
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

      <Footer />

      {/* Hidden music iframe - auto-plays on mount, destroyed on unmount */}
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
