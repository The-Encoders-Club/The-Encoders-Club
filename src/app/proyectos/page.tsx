'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download,
  Share2, X, Sparkles, ArrowRight, Gamepad2, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Search, Shirt, Puzzle, FileText,
  Clock, Flag, Settings
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

/* ─── Animated diagonal pink polka dots background ─── */
function PinkDots() {
  const DOT = 72;
  const GAP = 130;
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
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: '#ffffff' }} />
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

/* ─── Image carousel (dark theme) ─── */
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

/* ─── Preview carousel (pink theme) ─── */
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

/* ─── Dark theme detail view ─── */
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
              <p className="text-xl text-gray-300 font-bold italic">{project.subtitle}</p>
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
              <p className="text-gray-300 leading-relaxed text-xl font-medium">{desc}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.status')}</span>
                  <span className="text-white font-bold">{status}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <span className="text-xs font-bold uppercase block mb-1" style={{ color: project.themeColor }}>{t('projects.rating')}</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    {project.rating} <Star className="w-4 h-4 fill-current text-yellow-400" />
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border text-white/70 hover:text-white hover:bg-white/5 transition-all font-bold" style={{ borderColor: `${project.themeColor}40`, background: `${project.themeColor}10` }}>
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
                    <span className="text-gray-400 font-bold">{item.label}</span>
                    <span className="text-white font-mono font-bold">{item.value}</span>
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
                    <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group text-sm font-bold uppercase tracking-tight" style={{ background: `linear-gradient(135deg, ${dl.color}, ${dl.hoverColor || dl.color})`, color: dl.textColor || '#ffffff', boxShadow: `0 4px 15px ${dl.color}30` }}>
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

/* ─── Light theme detail view (Monika After History) ─── */
function MonikaDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
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
    <div className="relative min-h-screen bg-transparent overflow-x-hidden flex flex-col items-center">
      <PinkDots />
      <DecorationLayer />

      <nav className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-[#FFB6C1] px-4 py-3 flex justify-between items-center shadow-sm">
        <button onClick={onClose} className="flex items-center gap-2 text-[#d87093] hover:text-[#FF2D78] transition-colors group">
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-wider uppercase text-sm">{t('projects.backToProjects')}</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="p-2 rounded-full bg-pink-50 border border-[#FFB6C1] text-[#d87093] hover:bg-pink-100 transition-all shadow-sm">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="p-2 rounded-full bg-pink-50 border border-[#FFB6C1] text-[#d87093] hover:bg-pink-100 transition-all shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-5xl px-4 sm:px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 bg-pink-100 text-[#d87093] rounded-full text-xs font-bold uppercase tracking-widest border border-[#FFB6C1]">
                {status}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl sm:text-6xl font-black text-[#6B1530] tracking-tight leading-none drop-shadow-sm">
                {project.name}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-[#d87093] font-bold italic">
                {project.subtitle}
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-video relative group">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-200/40 to-transparent" />
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#6B1530] flex items-center gap-2">
                <HeartSvg size={24} color="#FF2D78" /> {isEs ? 'Historia' : 'Story'}
              </h3>
              <p className="text-[#8B3A6B] leading-relaxed text-xl font-medium">{desc}</p>
            </div>

            <div className="pt-6 border-t border-[#FFB6C1]/40">
              <h4 className="text-xl font-black text-[#6B1530] mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-[#FF2D78]" /> {t('projects.preview')}
              </h4>
              <PinkPreviewCarousel images={project.previews} />
            </div>
            
            <div className="pt-8">
               <CommentSection targetId={project.id} targetType="project" lightTheme={true} />
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border-4 border-white shadow-xl p-8 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#6B1530] tracking-tight">{t('projects.details')}</h3>
                <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  <Star className="w-4 h-4 fill-[#FF2D78] text-[#FF2D78]" />
                  <span className="font-black text-[#FF2D78]">{project.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: t('projects.playTime'), value: isEs ? project.details.playTime : project.details.playTimeEn, icon: Clock },
                  { label: t('projects.language'), value: isEs ? project.details.language : project.details.languageEn, icon: Flag },
                  { label: t('projects.engine'), value: project.details.engine, icon: Settings },
                  { label: t('projects.downloads'), value: project.details.downloads, icon: Download },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 border border-pink-100 hover:bg-pink-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <item.icon size={16} className="text-[#d87093]" />
                      <span className="text-xs font-black uppercase text-[#8B3A6B] tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-[#6B1530]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                {project.downloads.map((dl, i) => {
                  const Icon = dl.icon;
                  return (
                    <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="group w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest shadow-md hover:shadow-lg" style={{ background: `linear-gradient(135deg, ${dl.color}, ${dl.hoverColor || dl.color})`, color: dl.textColor || '#ffffff' }}>
                      <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      {isEs ? dl.label : dl.labelEn}
                    </a>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 justify-center">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-3 py-1 rounded-full bg-pink-100 text-[#d87093] font-black uppercase tracking-tighter border border-pink-200">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
    </div>
  );
}

export default function ProjectsPage() {
  const { t, locale } = useI18n();
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  if (!mounted) return null;

  const isEs = locale === 'es';
  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (isEs ? p.description.toLowerCase() : p.descriptionEn.toLowerCase()).includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === 'All' || p.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-[#0a0a1a]">
        {selectedProject.id === 'monika' ? (
          <MonikaDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] selection:bg-[#00F3FF]/30 selection:text-white">
      <Navbar />
      <BackgroundParticles />
      
      <main className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[#00F3FF] font-bold text-sm uppercase tracking-widest mb-4">
                <Sparkles size={16} />
                {t('projects.label')}
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter leading-none mb-6">
                {t('projects.title')}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/60 text-xl leading-relaxed">
                {t('projects.description')}
              </motion.p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00F3FF] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={t('projects.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00F3FF]/50 focus:bg-white/10 transition-all w-full md:w-80"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-12">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeTag === tag
                    ? 'bg-[#00F3FF] border-[#00F3FF] text-[#0a0a1a]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#00F3FF]/50 transition-all duration-500 cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${project.statusColor}20`, color: project.statusColor, border: `1px solid ${project.statusColor}40` }}
                    >
                      {isEs ? project.status : project.statusEn}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00F3FF] transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[#00F3FF] text-sm font-bold">
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-bold">{project.rating}</span>
                    </div>
                  </div>

                  <p className="text-white/70 text-base leading-relaxed mb-6 line-clamp-3 font-medium">
                    {isEs ? project.description : (project.descriptionEn || project.description)}
                  </p>
                  <div className="flex items-center gap-2 text-[#00F3FF] font-bold text-sm group-hover:translate-x-2 transition-transform">
                    {t('common.viewMore')} <ArrowRight size={16} />
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
            <p className="text-white/50 text-base font-medium max-w-md mx-auto">
              {isEs
                ? 'Estamos trabajando en nuevas novelas visuales. Únete a nuestro Discord para ser el primero en enterarte.'
                : 'We are working on new visual novels. Join our Discord to be the first to know.'}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

