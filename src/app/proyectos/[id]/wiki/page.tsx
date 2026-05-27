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
import { projectWikiData } from '@/data/wikiContent';
import { projects } from '@/data/projects';

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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full text-[#e4e4e7] transition-colors hover:bg-white/18"
        style={{ background: 'rgba(255, 255, 255, 0.08)', fontSize: '2rem' }}
        aria-label="Cerrar imagen"
      >
        <X size={24} />
      </button>

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

  // Look up wiki data for this project
  const wikiData = projectWikiData[projectId];
  const wikiSections = wikiData?.sections || [];
  const wikiContentMap = wikiData?.content || {};

  const [activeSection, setActiveSection] = useState(() => wikiSections[0]?.id || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Find the project by ID
  const project = projects.find((p) => p.id === projectId);

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

  // Group wikiSections by group field
  const groupedSections = (wikiSections || []).reduce<Record<string, typeof wikiSections>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // ─── Early return: project not found ──────────────────
  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0f', color: '#e4e4e7' }}
      >
        <div className="text-center px-4">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#c084fc' }} />
          <h1 className="text-2xl font-bold mb-2">Proyecto no encontrado</h1>
          <p className="mb-6" style={{ color: '#71717a' }}>
            El proyecto que buscas no existe.
          </p>
          <button
            onClick={() => router.push('/proyectos')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
            style={{ background: '#1f1f24', color: '#e4e4e7' }}
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

  // If project exists but has no wiki data at all
  if (!wikiData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0f', color: '#e4e4e7' }}
      >
        <div className="text-center px-4">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#c084fc' }} />
          <h1 className="text-2xl font-bold mb-2">Wiki no disponible</h1>
          <p className="mb-6" style={{ color: '#71717a' }}>
            La wiki para {project.name} aún no ha sido creada.
          </p>
          <button
            onClick={() => router.push(`/proyectos/${projectId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
            style={{ background: '#1f1f24', color: '#e4e4e7' }}
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
            Volver al proyecto
          </button>
        </div>
      </div>
    );
  }

  // ─── Markdown Custom Components ────────────────────────────────────────────
  const markdownComponents = {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        {...props}
        className="wiki-h1"
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
      <h2 {...props} className="wiki-h2">
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props} className="wiki-h3">
        {children}
      </h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="wiki-p">
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
        className="wiki-link"
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="wiki-ul">
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol {...props} className="wiki-ol">
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props} className="wiki-li">
        {children}
      </li>
    ),
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="wiki-table-wrap">
        <table {...props} className="wiki-table">
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
      <th {...props} className="wiki-th">
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td {...props} className="wiki-td">
        {children}
      </td>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      return (
        <pre {...props} className="wiki-pre">
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
        <code {...props} className="wiki-code-inline">
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote {...props} className="wiki-blockquote">
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
        className="wiki-img"
        loading="lazy"
        onClick={() => {
          if (src) setLightboxSrc(src);
        }}
      />
    ),
    hr: () => (
      <hr className="wiki-hr" />
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong {...props} className="wiki-strong">
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <em {...props} className="wiki-em">
        {children}
      </em>
    ),
  };

  return (
    <>
      {/* ─── Global Wiki Styles (matches HTML reference exactly) ──────────── */}
      <style jsx global>{`
        /* ═══════════════════════════════════════════════════════════════
           WIKI PAGE STYLES — Adapted from TEST 1 [Wiki-TEC-Proyectos].html
           ═══════════════════════════════════════════════════════════════ */

        /* ─── Contenido principal ─────────────────────────────────────── */
        .wiki-page-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e4e4e7;
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
        }

        .wiki-container {
          min-height: 100vh;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          width: 100%;
        }

        .wiki-article {
          width: 100%;
        }

        /* ─── Markdown Content Styles ─────────────────────────────────── */
        .wiki-h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .wiki-h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #27272a;
        }

        .wiki-h3 {
          font-size: 1.35rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
        }

        .wiki-p {
          margin-bottom: 1rem;
          color: #d4d4d8;
        }

        .wiki-link {
          color: #c084fc;
          text-decoration: none;
          border-bottom: 1px dashed #c084fc;
          transition: all 0.2s;
        }

        .wiki-link:hover {
          color: #e9d5ff;
          border-bottom-style: solid;
        }

        .wiki-ul {
          margin: 1rem 0 1rem 2rem;
          list-style: disc;
          space-y: 1;
        }

        .wiki-ol {
          margin: 1rem 0 1rem 2rem;
          list-style: decimal;
          space-y: 1;
        }

        .wiki-li {
          margin-bottom: 0.5rem;
          color: #d4d4d8;
        }

        /* ─── Tables ─────────────────────────────────────────────────── */
        .wiki-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 1.5rem 0;
          border-radius: 12px;
          border: 1px solid #2a2a30;
        }

        .wiki-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #111114;
          border-radius: 12px;
          overflow: hidden;
        }

        .wiki-table thead {
          background: #1f1f24;
        }

        .wiki-th {
          border-bottom: 2px solid #3f3f46 !important;
          border-right: 1px solid #2a2a30 !important;
          border-top: none !important;
          border-left: none !important;
          padding: 12px 16px !important;
          text-align: left;
          background: #1f1f24;
          font-weight: 600;
          color: #e4e4e7;
        }

        .wiki-th:last-child {
          border-right: none !important;
        }

        .wiki-td {
          border-bottom: 1px solid #1f1f24 !important;
          border-right: 1px solid #1f1f24 !important;
          border-top: none !important;
          border-left: none !important;
          padding: 12px 16px !important;
          text-align: left;
          color: #d4d4d8;
        }

        .wiki-td:last-child {
          border-right: none !important;
        }

        .wiki-table tbody tr:last-child .wiki-td {
          border-bottom: none !important;
        }

        .wiki-table tbody tr:hover {
          background: #1a1a20;
        }

        /* ─── Code blocks ─────────────────────────────────────────────── */
        .wiki-pre {
          background: #111114;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .wiki-code-inline {
          background: #1f1f24;
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          color: #c084fc;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.85rem;
        }

        /* ─── Blockquote ──────────────────────────────────────────────── */
        .wiki-blockquote {
          border-left: 4px solid #c084fc;
          background: #1a1a20;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 12px;
        }

        .wiki-blockquote p {
          margin-bottom: 0;
        }

        /* ─── Images ──────────────────────────────────────────────────── */
        .wiki-img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 0.8rem 0;
          display: block;
          cursor: zoom-in;
        }

        /* ─── HR ──────────────────────────────────────────────────────── */
        .wiki-hr {
          margin: 1.5rem 0;
          border-color: #27272a;
          border-width: 1px;
        }

        /* ─── Strong / Em ─────────────────────────────────────────────── */
        .wiki-strong {
          font-weight: 600;
          color: #e4e4e7;
        }

        .wiki-em {
          font-style: italic;
          color: #d4d4d8;
        }

        /* ─── Menu Toggle Button ──────────────────────────────────────── */
        .wiki-menu-toggle {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 1.8rem;
          color: #e4e4e7;
          cursor: pointer;
          z-index: 1000;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 0;
        }

        .wiki-menu-toggle:hover {
          color: #c084fc;
        }

        /* ─── Side Menu ───────────────────────────────────────────────── */
        .wiki-side-menu {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 280px;
          background: #111114;
          border-left: 1px solid #27272a;
          z-index: 999;
          padding: 2rem 1rem;
          overflow-y: auto;
        }

        /* ─── Menu Section Title ──────────────────────────────────────── */
        .wiki-menu-section-title {
          font-size: 0.75rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 1.5rem 0 0.8rem 0;
          padding-left: 14px;
        }

        .wiki-menu-section-title:first-child {
          margin-top: 0;
        }

        /* ─── Menu Item ───────────────────────────────────────────────── */
        .wiki-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          color: #d4d4d8;
          border-radius: 10px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          min-height: 44px;
        }

        .wiki-menu-item:hover {
          background: #1f1f24;
          color: #c084fc;
        }

        .wiki-menu-item.active {
          background: #2a2a30;
          color: #c084fc;
          font-weight: 500;
        }

        .wiki-menu-item.active .wiki-menu-icon {
          color: #c084fc;
        }

        .wiki-menu-icon {
          width: 20px;
          flex-shrink: 0;
          color: #71717a;
        }

        /* ─── Back Button ─────────────────────────────────────────────── */
        .wiki-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1f1f24;
          color: #e4e4e7;
          padding: 8px 16px;
          border-radius: 30px;
          text-decoration: none;
          font-size: 0.85rem;
          margin-bottom: 2rem;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .wiki-back-btn:hover {
          background: #2a2a30;
          color: #c084fc;
        }

        /* ─── Footer ─────────────────────────────────────────────────── */
        .wiki-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #27272a;
          text-align: center;
          font-size: 0.85rem;
          color: #a1a1aa;
          line-height: 1.8;
        }

        .wiki-footer .heart {
          color: #ef4444;
          animation: wikiHeartbeat 1.4s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes wikiHeartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* ═══════════════════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS — Exact match from HTML reference
           ═══════════════════════════════════════════════════════════════ */

        /* 📱 Tablets y pantallas medianas */
        @media (max-width: 1024px) {
          .wiki-container {
            max-width: 100%;
            padding: 1.5rem;
          }

          .wiki-h1 {
            font-size: 2rem !important;
          }

          .wiki-h2 {
            font-size: 1.5rem !important;
          }
        }

        /* 📱 Móviles grandes */
        @media (max-width: 768px) {
          .wiki-container {
            padding: 1rem 0.8rem;
          }

          .wiki-h1 {
            font-size: 1.6rem !important;
          }

          .wiki-h2 {
            font-size: 1.3rem !important;
            margin: 1.5rem 0 0.75rem 0 !important;
          }

          .wiki-h3 {
            font-size: 1.15rem !important;
          }

          .wiki-p {
            font-size: 0.95rem !important;
            line-height: 1.7 !important;
          }

          .wiki-ul, .wiki-ol {
            margin: 0.8rem 0 0.8rem 1.2rem !important;
          }

          .wiki-li {
            font-size: 0.93rem !important;
            margin-bottom: 0.4rem !important;
          }

          .wiki-th, .wiki-td {
            padding: 8px 10px !important;
            font-size: 0.82rem !important;
          }

          .wiki-blockquote {
            padding: 0.8rem 1rem !important;
            margin: 1rem 0 !important;
          }

          .wiki-pre {
            padding: 0.8rem !important;
            font-size: 0.8rem !important;
            border-radius: 8px !important;
          }

          .wiki-table {
            min-width: 500px;
          }

          .wiki-side-menu {
            width: 260px;
          }

          .wiki-back-btn {
            margin-bottom: 1.5rem;
            padding: 6px 14px;
            font-size: 0.8rem;
          }

          .wiki-footer {
            font-size: 0.75rem;
          }
        }

        /* 📱 Móviles pequeños */
        @media (max-width: 480px) {
          .wiki-container {
            padding: 0.8rem 0.6rem;
          }

          .wiki-h1 {
            font-size: 1.35rem !important;
          }

          .wiki-h2 {
            font-size: 1.15rem !important;
            border-bottom-width: 1px !important;
          }

          .wiki-h3 {
            font-size: 1.05rem !important;
          }

          .wiki-p {
            font-size: 0.9rem !important;
            line-height: 1.75 !important;
          }

          .wiki-ul, .wiki-ol {
            margin: 0.6rem 0 0.6rem 1rem !important;
          }

          .wiki-li {
            font-size: 0.88rem !important;
          }

          .wiki-th, .wiki-td {
            padding: 6px 8px !important;
            font-size: 0.78rem !important;
          }

          .wiki-blockquote {
            padding: 0.7rem 0.8rem !important;
            border-radius: 8px !important;
          }

          .wiki-pre {
            padding: 0.6rem !important;
            font-size: 0.75rem !important;
            border-radius: 8px !important;
          }

          .wiki-code-inline {
            font-size: 0.78rem !important;
            padding: 0.15rem 0.3rem !important;
          }

          .wiki-side-menu {
            width: 85vw;
            max-width: 300px;
            padding: 1.5rem 0.8rem;
          }

          .wiki-menu-toggle {
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            background: rgba(17, 17, 20, 0.85);
            border-radius: 12px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid #27272a;
          }

          .wiki-menu-item {
            padding: 12px 12px;
            font-size: 0.88rem;
            border-radius: 8px;
          }

          .wiki-back-btn {
            margin-bottom: 1rem;
            padding: 6px 12px;
            font-size: 0.78rem;
          }

          .wiki-footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            font-size: 0.7rem;
          }
        }

        /* 📱 Pantallas muy pequeñas (iPhone SE, etc.) */
        @media (max-width: 360px) {
          .wiki-container {
            padding: 0.6rem 0.5rem;
          }

          .wiki-h1 {
            font-size: 1.2rem !important;
          }

          .wiki-h2 {
            font-size: 1.05rem !important;
          }

          .wiki-p {
            font-size: 0.85rem !important;
          }

          .wiki-th, .wiki-td {
            padding: 5px 6px !important;
            font-size: 0.72rem !important;
          }

          .wiki-side-menu {
            width: 90vw;
          }
        }

        /* 🖥️ Pantallas grandes — centrado elegante */
        @media (min-width: 1200px) {
          .wiki-container {
            max-width: 960px;
            padding: 3rem 2rem;
          }
        }

        /* Touch-friendly: áreas clickeables más grandes en móvil */
        @media (hover: none) and (pointer: coarse) {
          .wiki-menu-item {
            min-height: 44px;
          }

          .wiki-menu-toggle {
            width: 48px;
            height: 48px;
          }

          .wiki-img {
            min-height: 44px;
          }
        }

        /* Safe area para móviles con notch */
        @supports (padding: env(safe-area-inset-right)) {
          .wiki-menu-toggle {
            right: calc(1rem + env(safe-area-inset-right));
            top: calc(1rem + env(safe-area-inset-top));
          }

          .wiki-side-menu {
            padding-right: calc(1rem + env(safe-area-inset-right));
          }

          .wiki-container {
            padding-left: calc(0.8rem + env(safe-area-inset-left));
            padding-right: calc(0.8rem + env(safe-area-inset-right));
          }
        }
      `}</style>

      <div className="wiki-page-root">
        {/* ─── Fixed Menu Button ──────────────────────────────────────── */}
        <button
          onClick={() => setMenuOpen(true)}
          className="wiki-menu-toggle"
          aria-label="Abrir menú de la wiki"
        >
          <Menu size={22} />
        </button>

        {/* ─── Dark Overlay ───────────────────────────────────────────── */}
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

        {/* ─── Side Menu (Slide from Right) ──────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="wiki-side-menu"
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
                    {project.name}
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
              {Object.entries(groupedSections).map(([groupTitle, items]) => (
                <div key={groupTitle}>
                  <div className="wiki-menu-section-title">
                    {groupTitle}
                  </div>
                  <ul className="list-none space-y-1">
                    {items.map((item) => {
                      const Icon = getIcon(item.icon);
                      const isActive = activeSection === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSectionClick(item.id)}
                            className={`wiki-menu-item ${isActive ? 'active' : ''}`}
                          >
                            <Icon
                              size={18}
                              className="wiki-menu-icon"
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

        {/* ─── Main Content Area ─────────────────────────────────────── */}
        <main className="wiki-container">
          {/* Back Button */}
          <button
            onClick={() => router.push(`/proyectos/${projectId}`)}
            className="wiki-back-btn"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </button>

          {/* Wiki Article */}
          <article className="wiki-article">
            <ReactMarkdown components={markdownComponents}>
              {currentContent}
            </ReactMarkdown>
          </article>

          {/* ─── Footer ──────────────────────────────────────────────── */}
          <footer className="wiki-footer">
            <p>&copy; 2026 The Encoders Club. Todos los derechos reservados.</p>
            <p>
              Hecho con{' '}
              <span className="heart">&#10084;</span>{' '}
              para la comunidad hispanohablante de Ren&apos;Py
            </p>
          </footer>
        </main>

        {/* ─── Lightbox ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {lightboxSrc && (
            <Lightbox
              src={lightboxSrc}
              onClose={() => setLightboxSrc(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
