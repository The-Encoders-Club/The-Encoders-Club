'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ArrowLeft,
  BookOpen,
  Download,
  Heart,
  Gift,
  Music,
  Settings,
  HelpCircle,
  Headphones,
  User,
  Puzzle,
  Home,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { wikiSections, wikiContentMap } from '@/data/wikiContent';

// ─── Icon Mapper ──────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Download,
  Heart,
  Gift,
  Music,
  Settings,
  HelpCircle,
  Headphones,
  User,
  Puzzle,
  Home,
};

function getIcon(name: string) {
  return iconMap[name] || HelpCircle;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface LightboxProps {
  src: string;
  onClose: () => void;
}

// ─── Lightbox Component ───────────────────────────────────────────────────────
function Lightbox({ src, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-zoom-out"
      style={{ background: 'rgba(0, 0, 0, 0.92)', padding: '1rem' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full text-[#e4e4e7] transition-colors hover:bg-white/18"
        style={{ background: 'rgba(255, 255, 255, 0.08)', fontSize: '2rem' }}
        aria-label="Cerrar imagen"
      >
        <X size={24} />
      </button>

      {/* Image */}
      <motion.img
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        src={src}
        alt="Imagen ampliada"
        className="max-w-[95%] max-h-[95vh] rounded-xl cursor-default object-contain"
        style={{
          boxShadow: '0 0 40px rgba(192, 132, 252, 0.15)',
        }}
      />
    </motion.div>
  );
}

// ─── Main Wiki Page ───────────────────────────────────────────────────────────
export default function WikiPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeSection, setActiveSection] = useState('instalacion');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Only allow 'monika' project
  if (projectId !== 'monika') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0f', color: '#e4e4e7' }}
      >
        <div className="text-center px-4">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#c084fc' }} />
          <h1 className="text-2xl font-bold mb-2">Wiki no disponible</h1>
          <p className="mb-6" style={{ color: '#71717a' }}>
            La wiki para este proyecto aún no ha sido creada.
          </p>
          <button
            onClick={() => router.push('/proyectos')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
            style={{
              background: '#1f1f24',
              color: '#e4e4e7',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a30';
              e.currentTarget.style.color = '#c084fc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1f1f24';
              e.currentTarget.style.color = '#e4e4e7';
            }}
          >
            <ArrowLeft size={16} />
            Volver a proyectos
          </button>
        </div>
      </div>
    );
  }

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSectionClick = useCallback((key: string) => {
    setActiveSection(key);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentContent = wikiContentMap[activeSection] || '';

  // ─── Markdown Custom Components ────────────────────────────────────────────
  const markdownComponents = {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        {...props}
        className="text-4xl md:text-[2.5rem] font-bold mb-4"
        style={{
          background: 'linear-gradient(135deg, #e4e4e7 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        className="text-2xl md:text-[1.75rem] font-semibold mt-8 mb-4 pb-2"
        style={{ borderBottom: '2px solid #27272a' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        className="text-xl md:text-[1.35rem] font-semibold mt-6 mb-3"
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        {...props}
        className="mb-4 text-[0.95rem] md:text-base leading-relaxed"
        style={{ color: '#d4d4d8' }}
      >
        {children}
      </p>
    ),
    a: ({
      children,
      href,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        {...props}
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="transition-colors"
        style={{
          color: '#c084fc',
          borderBottom: '1px dashed #c084fc',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = '#e9d5ff';
          (e.target as HTMLElement).style.borderBottomStyle = 'solid';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = '#c084fc';
          (e.target as HTMLElement).style.borderBottomStyle = 'dashed';
        }}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="my-4 ml-6 md:ml-8 list-disc space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="my-4 ml-6 md:ml-8 list-decimal space-y-1">
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li
        {...props}
        className="mb-1 text-[0.93rem] md:text-base"
        style={{ color: '#d4d4d8' }}
      >
        {children}
      </li>
    ),
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div
        className="my-6 rounded-xl overflow-x-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <table
          {...props}
          className="w-full border-collapse text-[0.82rem] md:text-sm"
          style={{
            background: '#111114',
            borderRadius: '12px',
            minWidth: '500px',
          }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr {...props}>{children}</tr>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        {...props}
        className="text-left px-3 py-2 md:px-4 md:py-3 font-semibold"
        style={{
          background: '#1f1f24',
          border: '1px solid #27272a',
          color: '#e4e4e7',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td
        {...props}
        className="text-left px-3 py-2 md:px-4 md:py-3"
        style={{
          border: '1px solid #27272a',
          color: '#d4d4d8',
        }}
      >
        {children}
      </td>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      // If the child is a code element with a className (from react-syntax-highlighter), render directly
      const child = children as React.ReactElement;
      if (child?.props?.className) {
        return (
          <pre
            {...props}
            className="my-6 rounded-xl overflow-x-auto"
            style={{
              background: '#111114',
              border: '1px solid #27272a',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            {children}
          </pre>
        );
      }
      return (
        <pre
          {...props}
          className="my-6 rounded-xl overflow-x-auto"
          style={{
            background: '#111114',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '1rem',
          }}
        >
          {children}
        </pre>
      );
    },
    code: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      const match = /language-(\w+)/.exec(className || '');
      // Check if this code block is inside a pre (block code) or inline
      const isBlock = match;

      if (isBlock) {
        return (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              background: 'transparent',
              margin: 0,
              padding: 0,
              fontSize: '0.85rem',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }

      return (
        <code
          {...props}
          className="px-1.5 py-0.5 rounded-md text-[0.85rem]"
          style={{
            background: '#1f1f24',
            color: '#c084fc',
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}
        >
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        {...props}
        className="my-6 px-6 py-4 rounded-xl"
        style={{
          borderLeft: '4px solid #c084fc',
          background: '#1a1a20',
        }}
      >
        {children}
      </blockquote>
    ),
    img: ({
      src,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        {...props}
        src={src}
        alt={alt || 'Imagen de la wiki'}
        className="max-w-full h-auto rounded-[10px] my-2 block cursor-zoom-in"
        loading="lazy"
        onClick={() => {
          if (src) setLightboxSrc(src);
        }}
      />
    ),
    hr: () => (
      <hr
        className="my-8"
        style={{ borderColor: '#27272a', borderWidth: '1px' }}
      />
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong {...props} className="font-semibold" style={{ color: '#e4e4e7' }}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <em {...props} className="italic" style={{ color: '#d4d4d8' }}>
        {children}
      </em>
    ),
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0a0a0f', color: '#e4e4e7', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ─── Fixed Menu Button ──────────────────────────────────────────────── */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 z-[1000] w-11 h-11 flex items-center justify-center rounded-xl transition-colors md:top-6 md:right-6 sm:top-4 sm:right-4"
        style={{
          background: 'rgba(17, 17, 20, 0.85)',
          border: '1px solid #27272a',
          color: '#e4e4e7',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = '#c084fc';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = '#e4e4e7';
        }}
        aria-label="Abrir menú de la wiki"
      >
        <Menu size={22} />
      </button>

      {/* ─── Dark Overlay ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[998]"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Side Menu (Slide from Right) ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-[280px] md:w-[280px] sm:w-[260px] z-[999] overflow-y-auto"
            style={{
              background: '#111114',
              borderLeft: '1px solid #27272a',
              padding: '2rem 1rem',
            }}
            aria-label="Menú de la wiki"
          >
            {/* Menu Header */}
            <div
              className="flex items-center gap-3 mb-6 pb-4"
              style={{ borderBottom: '1px solid #27272a' }}
            >
              <BookOpen size={24} style={{ color: '#c084fc' }} />
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#e4e4e7' }}>
                  Monika After Story
                </h3>
                <p
                  className="text-[0.7rem]"
                  style={{ color: '#a1a1aa' }}
                >
                  Wiki oficial &middot; The Encoders Club
                </p>
              </div>
            </div>

            {/* Menu Sections */}
            {wikiSections.map((section) => (
              <div key={section.title}>
                <div
                  className="uppercase tracking-wider text-[0.75rem] mb-2 mt-4 first:mt-0 pl-3.5"
                  style={{ color: '#71717a', letterSpacing: '0.05em' }}
                >
                  {section.title}
                </div>
                <ul className="list-none space-y-1">
                  {section.items.map((item) => {
                    const Icon = getIcon(item.icon);
                    const isActive = activeSection === item.key;
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => handleSectionClick(item.key)}
                          className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-[10px] text-[0.9rem] transition-all min-h-[44px]"
                          style={{
                            color: isActive ? '#c084fc' : '#d4d4d8',
                            background: isActive ? '#2a2a30' : 'transparent',
                            fontWeight: isActive ? 500 : 400,
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = '#1f1f24';
                              (e.currentTarget as HTMLElement).style.color = '#c084fc';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#d4d4d8';
                            }
                          }}
                        >
                          <Icon
                            size={18}
                            style={{
                              color: isActive ? '#c084fc' : '#71717a',
                              minWidth: '20px',
                            }}
                          />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ─── Main Content Area ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-8 md:px-8 md:py-12 lg:max-w-[960px] lg:px-8 lg:py-16">
        {/* Back Button */}
        <button
          onClick={() => router.push('/proyectos')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] mb-8 transition-all"
          style={{
            background: '#1f1f24',
            color: '#e4e4e7',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#2a2a30';
            (e.currentTarget as HTMLElement).style.color = '#c084fc';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#1f1f24';
            (e.currentTarget as HTMLElement).style.color = '#e4e4e7';
          }}
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

        {/* Wiki Article */}
        <article className="wiki-article w-full">
          <ReactMarkdown components={markdownComponents}>
            {currentContent}
          </ReactMarkdown>
        </article>

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <footer
          className="mt-12 pt-8 border-t text-center text-[0.85rem] leading-loose"
          style={{ borderColor: '#27272a', color: '#a1a1aa' }}
        >
          <p>&copy; 2026 The Encoders Club. Todos los derechos reservados.</p>
          <p>
            Hecho con{' '}
            <span
              className="inline-block"
              style={{ color: '#ef4444', animation: 'heartbeat 1.4s ease-in-out infinite' }}
            >
              &#10084;
            </span>{' '}
            para la comunidad hispanohablante de Ren&apos;Py
          </p>
        </footer>
      </main>

      {/* ─── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox
            src={lightboxSrc}
            onClose={() => setLightboxSrc(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── Heartbeat keyframes (injected as style tag) ───────────────────── */}
      <style jsx global>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Touch-friendly areas */
        @media (hover: none) and (pointer: coarse) {
          .wiki-article img {
            min-height: 44px;
          }
        }

        /* Safe area for notched devices */
        @supports (padding: env(safe-area-inset-right)) {
          .wiki-container-wrapper {
            padding-left: calc(0.8rem + env(safe-area-inset-left));
            padding-right: calc(0.8rem + env(safe-area-inset-right));
          }
        }
      `}</style>
    </div>
  );
}

