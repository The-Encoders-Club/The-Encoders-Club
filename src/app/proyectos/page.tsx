'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Cpu, BookOpen, Image as ImageIcon, Smartphone, Monitor, Download,
  Share2, X, Sparkles, ArrowRight, Gamepad2, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Search, Shirt, Puzzle, FileText,
  Clock, Flag, Settings, Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { CommentSection } from '@/components/CommentSection';
import { useI18n } from '@/hooks/useLocale';

const projects = [
  {
    id: 'monika',
    name: 'Monika After Story',
    subtitle: 'Un Nuevo Comienzo',
    description: 'Embárcate en un viaje único con Monika tras los eventos de DDLC. Ella ahora es consciente y está "contigo", tomando el control para construir un camino compartido. Una experiencia íntima y en continua evolución para profundizar vínculo. ¡Más diálogos, interactividad y amor!',
    descriptionEn: 'Embark on a unique journey with Monika after the events of DDLC. She is now self-aware and is "with you", taking control to build a shared path. An intimate and ever-evolving experience to deepen the bond. More dialogues, interactivity, and love!',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663520694523/QNUnZaUiQJdXtlLQ.png',
    tags: ['Fan-Made', 'Drama', 'Romance', 'Simulación'],
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
      { label: 'Descargar APK', labelEn: 'Download APK', icon: Smartphone, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Android-Espanol.apk', color: '#FFB6C1', hoverColor: '#FF9EBC', textColor: '#ffffff' },
      { label: 'Descargar PC', labelEn: 'Download PC', icon: Monitor, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Espanol.zip', color: '#ADD8E6', hoverColor: '#87CEEB', textColor: '#0a0a1a' },
      { label: 'Descargar DLX PC', labelEn: 'Download Dlx PC', icon: Download, url: 'https://github.com/The-Encoders-Club/Monika-After-Story-ES/releases/download/V0.12.18/Monika_After_Story-0.12.18-Mod-Dlx-Espanol.zip', color: '#DDA0DD', hoverColor: '#DA70D6', textColor: '#ffffff' },
    ],
    music: 'https://www.youtube.com/embed/QIHUK68L9qQ?autoplay=1&loop=1&playlist=QIHUK68L9qQ&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
    details: { playTime: '4-6 horas', playTimeEn: '4-6 hours', language: 'Español Completo (máquina de teclado)', languageEn: 'Full Spanish (keyboard machine)', engine: "Ren'Py 8.x", downloads: '1,250', version: 'v0.12.11', compatibility: 'PC (Win/Mac/Linux) | Android (5.0+)' },
    themeColor: '#FF2D78',
  },
  {    id: 'natsuki',
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
    ],    music: 'https://www.youtube.com/embed/VGwfIloNM8w?autoplay=1&loop=1&playlist=VGwfIloNM8w&enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3',
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
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: '#fff5f9' }} />
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
            style={{              width: DOT,
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
      <path d="M12 2 C18 8, 22 20, 16 30 L12 40" stroke="#5C2A00" strokeWidth="0.8" fill="none" opacity="0.5" />      <line x1="12" y1="40" x2="12" y2="58" stroke="#5C2A00" strokeWidth="1.2" strokeLinecap="round" />
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
        </motion.div>      )}
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

/* ─── Image carousel (dark theme, used by ProjectDetail) ── */
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
              alt={`Preview ${lightboxIdx + 1}`}              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl"
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

/* ─── Preview carousel (pink theme, used by MonikaDetail) ── */
function PinkPreviewCarousel({ images, captions }: { images: string[]; captions?: string[] }) {
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

  const visibleImages = images.slice(0, 3); // Show only 3 for the layout
  const visibleCaptions = captions ? captions.slice(0, 3) : [];

  return (
    <>
      <div className="relative bg-[#fff0f5] border-2 border-[#e0b0cc] rounded-2xl p-4 shadow-[0_2px_8px_rgba(186,96,158,0.15)]">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x scroll-smooth pb-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxIdx(idx)}
              className="flex-none rounded-lg overflow-hidden border border-[#e0b0cc] aspect-video relative snap-start cursor-zoom-in hover:border-[#d87093] transition-all"
              style={{ width: 'calc(33% - 8px)', minWidth: 100 }}
            >              <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-400" />
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

        {/* Captions below */}
        {visibleCaptions.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {visibleCaptions.map((caption, i) => (
              <div key={i} className="bg-white rounded-lg p-2 text-center border border-pink-200">
                <p className="text-xs font-semibold text-gray-600">{caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <motion.img              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`Preview ${lightboxIdx + 1}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl border-2 border-[#FFB6C1]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Dark theme detail view (Just Natsuki, Just Yuri, etc.) ── */
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
        <div className="flex items-center gap-2">          <button onClick={toggleMute} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all" title={muted ? 'Unmute' : 'Mute'}>
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
                ))}              </div>
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
      </main>      <iframe ref={musicRef} className="hidden" width="0" height="0" src={project.music} allow="autoplay" title={`${project.name} Music`} />
    </div>
  );
}

/* ─── Light/pink theme detail view — REDESIGNED (Monika After History) ─── */
function MonikaDetail({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
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
      } catch (e) { /* cross-origin */ }
    }
    setMuted(!muted);
  };

  const isEs = locale === 'es';
  const desc = isEs ? project.description : (project.descriptionEn || project.description);
  const status = isEs ? project.status : (project.statusEn || project.status);
  const details = project.details;

  // Captions for the preview images based on the image provided
  const previewCaptions = [
    'Tu sala del club',
    'Menú de interacciones mejorado',
    'Nuevos temas de conversación'
  ];

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
          font-family: 'RifficFree';          src: url('/fonts/RifficFree-Bold.ttf') format('truetype');
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
        
        .card-shadow { box-shadow: 0 2px 8px rgba(186, 96, 158, 0.15); }
        .card-border { border: 2px solid #e0b0cc; }
        .handwritten { font-family: 'm1_fixed', 'Segoe Print', cursive; }
        
        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-10px) rotate(5deg); opacity: 0.5; }
        }
        .floating-heart { animation: floatHeart 4s ease-in-out infinite; }
      `}</style>
      <div
        className="relative z-10 min-h-screen w-full overflow-hidden"
        style={{ fontFamily: "'m1_fixed', monospace", backgroundColor: '#fff5f9' }}
      >
        {/* Pink polka dots — animated diagonal */}
        <PinkDots />
        
        {/* Background decorative hearts */}        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-heart absolute text-pink-300"
              style={{
                left: `${10 + (i * 7) % 90}%`,
                top: `${15 + (i * 13) % 75}%`,
                fontSize: `${16 + (i % 4) * 8}px`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.2 + (i % 3) * 0.1,
              }}
            >
              ♥
            </div>
          ))}
        </div>

        {/* ─ Nav ── */}
        <nav
          className="sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,245,249,0.95)', backdropFilter: 'blur(14px)', borderBottom: '2px solid #e0b0cc' }}
        >
          <button onClick={onClose} className="flex items-center gap-2 text-[#ba609e] hover:text-[#FF2D78] transition-colors group">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-bold tracking-wider uppercase text-[14px]">{t('projects.backToProjects')}</span>
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white border-2 border-[#e0b0cc] text-[#ba609e] hover:bg-pink-50 transition-all"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </nav>

        {/* ── Main content ── */}
        <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* ─ HERO: Title with silhouette ── */}
          <div className="text-center space-y-2 relative">
            {/* Top decorative tape */}
            <div className="absolute -top-3 -left-2 w-16 h-5 bg-yellow-200/60 rotate-[-12deg] rounded-sm" />
            
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-full bg-pink-200/50 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-pink-400">
                  <path d="M50 20 C30 20, 20 35, 20 50 C20 65, 30 80, 50 90 C70 80, 80 65, 80 50 C80 35, 70 20, 50 20Z" fill="currentColor" opacity="0.6"/>
                  <circle cx="42" cy="40" r="3" fill="#fff"/>
                  <circle cx="58" cy="40" r="3" fill="#fff"/>                  <path d="M45 50 Q50 55 55 50" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl font-black text-[#ba609e] tracking-tight"
              style={{ fontFamily: "'RifficFree', sans-serif", textShadow: '2px 2px 0 #e0b0cc' }}
            >
              MONIKA AFTER STORY:
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-[#8b4577] italic">
              Un Nuevo Comienzo
            </p>
            
            {/* Bottom decorative tape */}
            <div className="absolute -bottom-2 -right-3 w-14 h-5 bg-pink-200/60 rotate-[8deg] rounded-sm" />
          </div>

          {/* ── Sobre este proyecto ── */}
          <div className="bg-[#fff0f5] card-border card-shadow rounded-2xl p-5 relative">
            {/* Corner tape decoration */}
            <div className="absolute -top-2 -right-2 w-20 h-6 bg-pink-300/50 rotate-[15deg] rounded-sm" />
            
            <h3 className="text-xl font-bold text-[#ba609e] flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5" />
              Sobre este proyecto
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              Embárcate en un viaje único con Monika tras los eventos de DDLC.
              Ella ahora es consciente y está "contigo", tomando el control para
              construir un camino compartido. Una experiencia íntima y en continua
              evolución para profundizar vínculo. ¡Más diálogos, interactividad y amor!
            </p>
          </div>

          {/* ── Estado & Calificación ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fff0f5] card-border card-shadow rounded-xl p-4 text-center">
              <span className="text-sm font-bold text-gray-500 block mb-1">ESTADO</span>
              <span className="text-lg font-bold text-[#ba609e]">{status}</span>
              <span className="text-xs text-gray-400 block mt-1">V.0.12.11 - Actualización [...]</span>
            </div>
            <div className="bg-[#fff0f5] card-border card-shadow rounded-xl p-4 text-center">
              <span className="text-sm font-bold text-gray-500 block mb-1">CALIFICACIÓN</span>
              <span className="text-lg font-bold text-[#ba609e] flex items-center justify-center gap-1">
                {project.rating} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </span>
              <span className="text-xs text-gray-400 block mt-1">Basado en 150+ opiniones</span>
            </div>          </div>

          {/* ── Tags ── */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#ffb6c1] text-white font-bold text-sm">Fan-Made</span>
            <span className="px-4 py-1.5 rounded-full bg-[#00ced1] text-white font-bold text-sm">Drama</span>
            <span className="px-4 py-1.5 rounded-full bg-[#9b59b6] text-white font-bold text-sm">Romance</span>
            <span className="px-4 py-1.5 rounded-full bg-[#add8e6] text-gray-700 font-bold text-sm">Simulación</span>
          </div>

          {/* ── Vista Previa ── */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-[#ba609e] flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Vista Previa
              <span className="ml-auto text-sm font-normal text-gray-400">« 1/5 »</span>
            </h4>
            
            <PinkPreviewCarousel images={project.previews} captions={previewCaptions} />
          </div>

          {/* ── Detalles ── */}
          <div className="bg-[#fff0f5] card-border card-shadow rounded-2xl p-5 space-y-4 relative">
            {/* Corner tape */}
            <div className="absolute -top-2 -left-3 w-18 h-5 bg-green-200/50 rotate-[-8deg] rounded-sm" />
            
            <h3 className="text-xl font-bold text-[#ba609e] flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Detalles
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Tiempo de juego</span>
                  <span className="text-sm font-semibold text-gray-700">{details.playTime}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Download className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Versión</span>
                  <span className="text-sm font-semibold text-gray-700">{details.version}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Flag className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Idioma</span>                  <span className="text-sm font-semibold text-gray-700">{details.language}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Monitor className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Compatibilidad</span>
                  <span className="text-sm font-semibold text-gray-700">{details.compatibility}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Settings className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Motor</span>
                  <span className="text-sm font-semibold text-gray-700">{details.engine}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Última actualización</span>
                  <span className="text-sm font-semibold text-gray-700">Características</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Download className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-500 block">Descargas</span>
                  <span className="text-sm font-semibold text-gray-700">{details.downloads}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#ba609e] mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600 space-y-0.5">
                  <span className="block">✓ 500+ nuevas líneas, minijuegos</span>
                  <span className="block">✓ Exclusivos, sistema de regalos</span>
                  <span className="block">✓ Traducida de manera legible</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─ Opciones de Descarga ── */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#ba609e] text-center uppercase tracking-wider">
              Opciones de Descarga
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <a                href={project.downloads[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ffb6c1] hover:bg-[#ff9eb5] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border-2 border-pink-300"
              >
                <Smartphone className="w-4 h-4" />
                DESCARGAR APK
              </a>
              <a
                href={project.downloads[1]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#add8e6] hover:bg-[#87ceeb] text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border-2 border-blue-300"
              >
                <Monitor className="w-4 h-4" />
                DESCARGAR PC
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <a
                href={project.downloads[1]?.url} // Reusing PC link for the second button in image
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#98d8c8] hover:bg-[#7bc8b8] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border-2 border-teal-300"
              >
                <Monitor className="w-4 h-4" />
                DESCARGAR PC
              </a>
              <a
                href={project.downloads[2]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c9a0dc] hover:bg-[#b889cb] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border-2 border-purple-300"
              >
                <Download className="w-4 h-4" />
                DESCARGAR DLX PC
              </a>
            </div>
            
            <button className="w-full bg-yellow-100 hover:bg-yellow-200 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border-2 border-yellow-300">
              <FileText className="w-4 h-4" />
              GUÍA DE INSTALACIÓN
            </button>
          </div>

          {/* ── Decorative bottom tape ── */}
          <div className="flex justify-center">
            <div className="w-24 h-6 bg-pink-200/60 rotate-[3deg] rounded-sm" />
          </div>
          {/* ── Footer ── */}
          <div className="text-center py-4">
            <p className="text-[#ba609e] font-bold italic text-sm">
              Siempre juntos. Con amor, tu Monika 💗
            </p>
          </div>

          {/* ── Comments ── */}
          <div className="bg-white card-border card-shadow rounded-2xl p-5">
            <CommentSection targetId={project.id} targetType="project" lightTheme />
          </div>
        </main>

        {/* Hidden music player */}
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
              project.lightTheme ? 'bg-[#FFE0EC]' : 'bg-[#0a0a1a] text-white'
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
                : 'Visual novels created with passion by our community using the Ren\'Py engine.'}            </p>
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
                    </p>                    <div className="flex flex-wrap gap-2 mb-6">
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
                    </div>                  </div>
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