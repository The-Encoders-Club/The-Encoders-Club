'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download,
  Share2, X, Sparkles, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Search, Shirt, Puzzle, FileText,
  Clock, Flag, Settings
} from 'lucide-react';
import { CommentSection } from '@/components/CommentSection';
import MonikaChibi from '@/components/MonikaChibi';
import { useI18n } from '@/hooks/useLocale';
import { projects, getIcon } from '@/data/projects';

/* ─── Animated diagonal pink polka dots background ─── */
function PinkDots() {
  const DOT = 72;
  const GAP = 130;
  // Extra columns/rows so the seamless loop has room to translate
  const cols = Math.ceil(1800 / GAP) + 2;
  const rows = Math.ceil(1800 / GAP) + 2;
  const dots: { id: number; x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) {
        dots.push({ id: r * cols + c, x: c * GAP, y: r * GAP });
      }
    }
  }
  // The pattern repeats every GAP*2 diagonally, so we animate exactly that distance
  const shift = GAP * 2;
  return (
    <>
      <style>{`
        @keyframes diagonalScroll {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(-${shift}px, -${shift}px); }
        }
        .pink-dots-layer {
          animation: diagonalScroll 6s linear infinite;
        }
      `}</style>
      {/* White base */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: '#ffffff' }} />
      {/* Animated dots — oversized so the moving layer never shows edges */}
      <div
        className="pink-dots-layer pointer-events-none"
        style={{
          position: 'fixed',
          top: -shift * 2,
          left: -shift * 2,
          width: `calc(100vw + ${shift * 4}px)`,
          height: `calc(100vh + ${shift * 4}px)`,
        }}
      >
        {dots.map(d => (
          <div
            key={d.id}
            className="absolute rounded-full"
            style={{
              width: DOT,
              height: DOT,
              left: d.x - DOT / 2,
              top: d.y - DOT / 2,
              backgroundColor: '#ffeef8',
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Floating decoration SVGs ─── */
function HeartSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.593c-.425-.437-6.67-6.16-8.398-8.049C1.518 11.318 1.5 9.01 3.27 7.24c1.71-1.71 4.52-1.69 6.225.025L12 9.77l2.506-2.506C16.21 5.55 19.02 5.53 20.73 7.24c1.77 1.77 1.752 4.078-.331 6.305C18.672 15.434 12.425 21.156 12 21.593z" />
    </svg>
  );
}

function BookSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none">
      <rect x="4" y="2" width="32" height="44" rx="3" fill={color} opacity="0.9" />
      <rect x="4" y="2" width="6" height="44" rx="2" fill="#6B1530" opacity="0.4" />
      <rect x="12" y="10" width="18" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="12" y="15" width="14" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="12" y="20" width="16" height="2" rx="1" fill="white" opacity="0.4" />
    </svg>
  );
}

function BowSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 56 40" fill="none">
      <ellipse cx="14" cy="20" rx="14" ry="10" fill={color} opacity="0.85" transform="rotate(-20 14 20)" />
      <ellipse cx="42" cy="20" rx="14" ry="10" fill={color} opacity="0.85" transform="rotate(20 42 20)" />
      <circle cx="28" cy="20" r="5" fill="#fff" opacity="0.9" />
      <circle cx="28" cy="20" r="3" fill={color} />
    </svg>
  );
}

function QuillSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size * 0.6} height={size * 1.5} viewBox="0 0 24 60" fill="none">
      <path d="M12 2 C18 8, 22 20, 16 30 L12 58 L8 30 C2 20, 6 8, 12 2Z" fill={color} opacity="0.75" />
      <path d="M12 2 C18 8, 22 20, 16 30 L12 40" stroke="#5C2A00" strokeWidth="0.8" fill="none" opacity="0.5" />
      <line x1="12" y1="40" x2="12" y2="58" stroke="#5C2A00" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const DECO_POOL = [
  { type: 'heart', size: 28, color: '#FF6B9D' },
  { type: 'heart', size: 20, color: '#FF2D78' },
  { type: 'heart', size: 36, color: '#FFB6D9' },
  { type: 'heart', size: 22, color: '#FF6B9D' },
  { type: 'heart', size: 16, color: '#FF2D78' },
  { type: 'book',  size: 38, color: '#C85A8A' },
  { type: 'book',  size: 30, color: '#8B3A6B' },
  { type: 'book',  size: 44, color: '#D4699A' },
  { type: 'bow',   size: 32, color: '#FF2D78' },
  { type: 'bow',   size: 24, color: '#FFB6D9' },
  { type: 'quill', size: 36, color: '#A0522D' },
  { type: 'quill', size: 28, color: '#8B4513' },
] as const;

type DecoItem = typeof DECO_POOL[number];

function FloatingDeco({ item, x, y, delay }: { item: DecoItem; x: number; y: number; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setVisible(false), delay + 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  const icon = () => {
    if (item.type === 'heart') return <HeartSvg size={item.size} color={item.color} />;
    if (item.type === 'book')  return <BookSvg  size={item.size} color={item.color} />;
    if (item.type === 'bow')   return <BowSvg   size={item.size} color={item.color} />;
    return <QuillSvg size={item.size} color={item.color} />;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none select-none"
          style={{ position: 'fixed', left: x, top: y, zIndex: 6 }}
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut', exit: { duration: 0.65, ease: 'easeIn' } } as any}
        >
          {icon()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DecorationLayer() {
  const [bursts, setBursts] = useState<{ id: number; items: { item: DecoItem; x: number; y: number; delay: number }[] }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const count = 4 + Math.floor(Math.random() * 4);
      const items = Array.from({ length: count }, (_, i) => ({
        item: DECO_POOL[Math.floor(Math.random() * DECO_POOL.length)],
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800),
        y: Math.random() * 500 + 80,
        delay: i * 110,
      }));
      const id = ++idRef.current;
      setBursts(prev => [...prev, { id, items }]);
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 2200);
    };
    spawn();
    const iv = setInterval(spawn, 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {bursts.map(burst =>
        burst.items.map((d, i) => (
          <FloatingDeco key={`${burst.id}-${i}`} item={d.item} x={d.x} y={d.y} delay={d.delay} />
        ))
      )}
    </>
  );
}

/* ─── Image carousel (dark theme, used by ProjectDetail) ─── */
function ImageCarousel({ images, themeColor }: { images: string[]; themeColor: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () => setLightboxIdx(i => (i !== null ? Math.max(0, i - 1) : null));
  const nextImage = () => setLightboxIdx(i => (i !== null ? Math.min(images.length - 1, i + 1) : null));

  return (
    <>
      <div className="relative group/carousel">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth">
          {images.map((src, idx) => (
            <div key={idx} onClick={() => setLightboxIdx(idx)} className="flex-none w-64 sm:w-72 rounded-xl overflow-hidden border border-white/10 aspect-video group relative snap-start hover:border-white/20 transition-all cursor-zoom-in">
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10">
              <X size={20} />
            </button>
            {lightboxIdx > 0 && (
              <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10">
                <ChevronLeft size={22} />
              </button>
            )}
            {lightboxIdx < images.length - 1 && (
              <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10">
                <ChevronRight size={22} />
              </button>
            )}
            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`Preview ${lightboxIdx + 1}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/70 text-xs px-3 py-1.5 rounded-full">
              {lightboxIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Preview carousel (pink theme, used by MonikaDetail) ─── */
function PinkPreviewCarousel({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const total = images.length;

  const scroll = (dir: 'left' | 'right') => {
    const next = dir === 'right' ? Math.min(current + 1, total - 1) : Math.max(current - 1, 0);
    setCurrent(next);
    if (ref.current) {
      (ref.current.children[next] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () => setLightboxIdx(i => (i !== null ? Math.max(0, i - 1) : null));
  const nextImage = () => setLightboxIdx(i => (i !== null ? Math.min(total - 1, i + 1) : null));

  return (
    <>
      <div className="relative">
        <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x scroll-smooth pb-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxIdx(idx)}
              className="flex-none rounded-xl overflow-hidden border-2 border-[#FFB6C1] aspect-video relative snap-start cursor-zoom-in hover:border-[#FF6B9D] transition-all"
              style={{ width: 'calc(43% - 8px)', minWidth: 140 }}
            >
              <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400" />
              <div className="absolute bottom-1.5 right-1.5 bg-[#d87093]/80 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {idx + 1}/{total}
              </div>
            </div>
          ))}
        </div>
        {current > 0 && (
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-7 h-7 rounded-full bg-white border-2 border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-pink-50 z-10 shadow-sm">
            <ChevronLeft size={14} />
          </button>
        )}
        {current < total - 1 && (
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-7 h-7 rounded-full bg-white border-2 border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-pink-50 z-10 shadow-sm">
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border-2 border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-white transition-all z-10 shadow-md">
              <X size={20} />
            </button>
            {lightboxIdx > 0 && (
              <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border-2 border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-white transition-all z-10 shadow-md">
                <ChevronLeft size={22} />
              </button>
            )}
            {lightboxIdx < total - 1 && (
              <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border-2 border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-white transition-all z-10 shadow-md">
                <ChevronRight size={22} />
              </button>
            )}
            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`Preview ${lightboxIdx + 1}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl border-2 border-[#FFB6C1]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 text-[#d87093] text-xs px-3 py-1.5 rounded-full font-bold border border-[#FFB6C1]">
              {lightboxIdx + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Dark theme detail view (Just Natsuki, Just Yuri, etc.) ─── */
function ProjectDetail({ project }: { project: typeof projects[number] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
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
        <Link href="/proyectos" className="flex items-center gap-2 text-[#FF2D78] hover:text-white transition-colors group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
        </Link>
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
                  const Icon = getIcon(dl.icon);
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

/* ─── Light/pink theme detail view — REDESIGNED (Monika After History) ─── */
function MonikaDetail({ project }: { project: typeof projects[number] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
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
      } catch (e) { /* cross-origin */ }
    }
    setMuted(!muted);
  };

  const isEs = locale === 'es';
  const desc = isEs ? project.description : (project.descriptionEn || project.description);
  const status = isEs ? project.status : (project.statusEn || project.status);

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'm1_fixed';
          src: url('/fonts/m1_fixed.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: 'RifficFree';
          src: url('/fonts/RifficFree-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: block;
        }
        .monika-title {
          font-family: 'RifficFree', 'm1_fixed', monospace;
          color: #fefefe;
          -webkit-text-stroke: 6px #ba609e;
          paint-order: stroke fill;
        }
        .pink-stroke-lg {
          font-family: 'RifficFree', 'm1_fixed', monospace;
          color: #fefefe;
          -webkit-text-stroke: 4px #ba609e;
          paint-order: stroke fill;
        }
        .pink-stroke-sm {
          font-family: 'RifficFree', 'm1_fixed', monospace;
          color: #fefefe;
          -webkit-text-stroke: 3px #ba609e;
          paint-order: stroke fill;
        }
        .pink-stroke-xs {
          font-family: 'RifficFree', 'm1_fixed', monospace;
          color: #fefefe;
          -webkit-text-stroke: 2px #ba609e;
          paint-order: stroke fill;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="relative z-10 min-h-screen w-full overflow-hidden"
        style={{ fontFamily: "'m1_fixed', monospace", backgroundColor: '#ffffff' }}
      >
        {/* Pink polka dots — animated diagonal */}
        <PinkDots />

        {/* Chibi Monika desktop pet */}
        <MonikaChibi />

        {/* Floating decorations */}
        <DecorationLayer />

        {/* ── Nav ── */}
        <nav
          className="sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,224,236,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #FFB6C1' }}
        >
          <Link href="/proyectos" className="flex items-center gap-2 text-[#d6336c] hover:text-[#FF2D78] transition-colors group">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-bold tracking-wider uppercase text-[15px]">{t('projects.backToProjects')}</span>
          </Link>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/70 border border-[#FFB6C1] text-[#d87093] hover:bg-white transition-all"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </nav>

        {/* ── Main content ── */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ── HERO: Title + Image (full width) ── */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="monika-title text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                {project.name}
              </h1>
              <p className="text-gray-800 text-[24px] font-semibold mt-1 flex items-center gap-1.5">
                {project.subtitle} <span>💗</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-2xl overflow-hidden border-2 border-[#FFB6C1] aspect-video relative group"
              style={{ boxShadow: '0 8px 32px #FF6B9D30' }}
            >
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* ── Sobre este proyecto ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="pink-stroke-lg text-xl font-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
              {isEs ? 'Sobre este proyecto' : 'About this project'}
            </h3>
            <p className="text-gray-800 leading-relaxed text-[23px] font-semibold">{desc}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border-2 border-[#FFB6C1] shadow-sm">
                <span className="text-[20px] font-bold uppercase block mb-0.5 text-gray-800">{t('projects.status')}</span>
                <span className="text-gray-800 font-bold text-[22px]">{status}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border-2 border-[#FFB6C1] shadow-sm">
                <span className="text-[20px] font-bold uppercase block mb-0.5 text-gray-800">{t('projects.rating')}</span>
                <span className="text-gray-800 font-bold text-[22px] flex items-center gap-1">
                  {project.rating} <Star className="w-4.5 h-4.5 fill-current text-yellow-400" />
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[19px] px-4 py-2 rounded-full bg-white/80 border-2 border-[#FFB6C1] text-gray-800 font-semibold hover:border-[#FF6B9D] transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Vista Previa ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h4 className="pink-stroke-lg text-xl font-black flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
              {t('projects.preview')}
            </h4>
            <PinkPreviewCarousel images={project.previews} />
          </motion.div>

          {/* ── Detalles + Descargas (after Vista Previa) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/85 rounded-2xl border-2 border-[#FFB6C1] p-5 shadow-sm space-y-5"
          >
            <h3 className="pink-stroke-lg text-[22px] font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#F092A6]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
              {t('projects.details')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { icon: Clock,    label: t('projects.playTime'), value: isEs ? project.details.playTime    : (project.details.playTimeEn    || project.details.playTime)    },
                { icon: Flag,     label: t('projects.language'), value: isEs ? project.details.language    : (project.details.languageEn    || project.details.language)    },
                { icon: Settings, label: t('projects.engine'),   value: project.details.engine },
                { icon: Download, label: t('projects.downloads'),value: project.details.downloads },
              ].map(item => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.label} className="flex items-center gap-2 text-[21px]">
                    <ItemIcon className="w-5 h-5 text-[#d87093] flex-shrink-0" />
                    <span className="text-gray-800 flex-1 font-semibold">{item.label}</span>
                    <span className="text-gray-800 font-semibold">{item.value}</span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-[#FFB6C1]/50 pt-4 space-y-2">
              <h4 className="pink-stroke-sm text-[19px] font-black uppercase tracking-widest mb-2">
                {isEs ? 'Opciones de Descarga' : 'Download Options'}
              </h4>
              {project.downloads.map((dl, i) => {
                const Icon = getIcon(dl.icon);
                const strokeColors = ['#9B1A3A', '#006B6B', '#5B1890'];
                const stroke = strokeColors[i] || '#333';
                return (
                  <a
                    key={i}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] group shadow-md"
                    style={{ background: dl.color, border: `3px solid ${stroke}` }}
                  >
                    <Icon
                      className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0"
                      style={{ color: dl.textColor || '#fff', filter: `drop-shadow(0 0 1px ${stroke})` }}
                    />
                    <span
                      className="font-black uppercase tracking-wide text-[19px]"
                      style={{ color: dl.textColor || '#ffffff', WebkitTextStroke: `1.5px ${stroke}`, paintOrder: 'stroke fill' }}
                    >
                      {isEs ? dl.label : (dl.labelEn || dl.label)}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Recursos y Contenido Extra ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="pink-stroke-lg text-xl font-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
              {isEs ? 'Recursos y Contenido Extra' : 'Resources & Extra Content'}
            </h3>

            {/* Wiki + Spritepacks */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFF0F5] rounded-2xl border-2 border-[#FFB6C1] p-5 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="pink-stroke-sm text-[18px] font-black flex items-center gap-1">
                  <Search className="w-4 h-4 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
                  Wiki del Mod
                </h4>
                <p className="text-[24px] text-gray-800 leading-relaxed font-semibold">
                  {isEs ? 'Toda la información técnica, guías y lore.' : 'All technical info, guides, and lore.'}
                </p>
                <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-[#C06080] text-[#C06080] bg-white text-[16px] font-black hover:bg-[#C06080] hover:text-white transition-colors">
                  <BookOpen className="w-3 h-3" /> {isEs ? 'Ver Wiki' : 'View Wiki'}
                </button>
              </div>

              <div className="bg-[#FFF0F5] rounded-2xl border-2 border-[#FFB6C1] p-5 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="pink-stroke-sm text-[18px] font-black flex items-center gap-1">
                  <Shirt className="w-4 h-4 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
                  Spritepacks
                </h4>
                <p className="text-[24px] text-gray-800 leading-relaxed font-semibold">
                  {isEs ? 'Cambia la ropa y accesorios de Monika.' : "Change Monika's clothes and accessories."}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#C06080] text-[#C06080] bg-white text-[16px] font-black hover:bg-[#C06080] hover:text-white transition-colors">
                    <Shirt className="w-3 h-3" /> {isEs ? 'Ver Ropa' : 'View Clothes'}
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#C06080] text-[#C06080] bg-white text-[16px] font-black hover:bg-[#C06080] hover:text-white transition-colors">
                    <Star className="w-3 h-3" /> {isEs ? 'Ver Accesorios' : 'View Accessories'}
                  </button>
                </div>
              </div>
            </div>

            {/* Submods */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-[#FFF0F5] rounded-2xl border-2 border-[#FFB6C1] p-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="pink-stroke-sm text-[22px] font-black flex items-center gap-1.5">
                  <Puzzle className="w-5 h-5 text-[#C06080]" style={{ WebkitTextStroke: 0 } as React.CSSProperties} />
                  Submods
                </h4>
                <p className="text-[25px] text-gray-800 leading-relaxed font-semibold">
                  {isEs ? 'Amplía las características y diálogos.' : 'Expand features and dialogues.'}
                </p>
                <button className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#C06080] text-[#C06080] bg-white font-black text-[17px] hover:bg-[#C06080] hover:text-white transition-colors">
                  {isEs ? 'Explorar Submods' : 'Explore Submods'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Comments ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border-2 border-[#FFB6C1] p-5 shadow-sm"
          >
            <CommentSection targetId={project.id} targetType="project" lightTheme />
          </motion.div>

        </main>

        {/* Hidden music player */}
        <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
      </div>
    </>
  );
}

/* ─── Page component ─── */
export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-gray-400">Project not found</p>
          <a href="/proyectos" className="text-[#FF2D78] hover:underline">Back to projects</a>
        </div>
      </div>
    );
  }

  if (project.lightTheme) {
    return <MonikaDetail project={project} />;
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, ${project.themeColor}26 50%, rgba(10, 10, 26, 0.95) 100%)`,
      }}
    >
      <ProjectDetail project={project} />
    </div>
  );
}
