'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Download, Heart, Gift, Music, Settings, CircleHelp, Headphones,
  User, Puzzle, Home, BookOpen, ArrowLeft, X, Menu, RefreshCw, Star,
} from 'lucide-react';

/* ─── Wiki Content Imports ─── */
import { monikaWikiContent, monikaMenuSections, monikaTheme } from '@/data/wiki-monika-content';
import { natsukiWikiContent, natsukiMenuSections, natsukiTheme } from '@/data/wiki-natsuki-content';

const wikiContents: Record<string, Record<string, string>> = {
  monika: monikaWikiContent,
  natsuki: natsukiWikiContent,
};

const menuSectionsMap: Record<string, { title: string; items: { key: string; label: string; Icon: any }[] }[]> = {
  monika: monikaMenuSections,
  natsuki: natsukiMenuSections,
};

const projectTheme: Record<string, { accent: string; accentHover: string; accentGradient: string; lightboxGlow: string; title: string; subtitle: string; defaultSection: string }> = {
  monika: monikaTheme,
  natsuki: natsukiTheme,
};
/* ─── Basic Markdown Parser ─── */
function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let pendingImages: string[] = [];
  let inRawHtml = false;

  const flushImages = () => {
    if (pendingImages.length === 0) return;
    if (pendingImages.length === 1) {
      html.push(pendingImages[0]);
    } else {
      html.push(`<div class="wiki-card-row">${pendingImages.join('')}</div>`);
    }
    pendingImages = [];
  };

  const isImageOnly = (line: string) => /^!\[([^\]]*)\]\(([^)]+)\)$/.test(line.trim());

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const inlineFormat = (text: string) => {
    let result = escapeHtml(text);
    // Images: ![alt](url)
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Bold+italic: ***text***
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    // Inline code: `code`
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
    return result;
  };

  const closeList = () => {
    if (inList && listType) {
      html.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };

  const closeTable = () => {
    if (inTable && tableRows.length > 0) {
      html.push('<div class="table-wrap"><table>');
      tableRows.forEach((row, idx) => {
        const cells = row.split('|').filter(c => c.trim() !== '');
        const tag = idx === 0 ? 'th' : 'td';
        html.push(`<tr>${cells.map(c => `<${tag}>${inlineFormat(c.trim())}</${tag}>`).join('')}</tr>`);
      });
      html.push('</table></div>');
      tableRows = [];
      inTable = false;
    }
  };

  const isTableRow = (line: string) => /^[\s]*\|(.+\|[\s]*)+$/.test(line);
  const isTableSeparator = (line: string) => /^[\s]*\|[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)*\|[\s]*$/.test(line);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      flushImages();
      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        closeList();
        closeTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Empty line — flush pending images
    if (trimmed === '') {
      flushImages();
      closeList();
      if (inTable && (i + 1 >= lines.length || !isTableRow(lines[i + 1]))) {
        closeTable();
      }
      continue;
    }

    // Standalone image — accumulate for grouping
    if (isImageOnly(trimmed)) {
      pendingImages.push(inlineFormat(trimmed));
      continue;
    } else if (pendingImages.length > 0) {
      flushImages();
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeList();
      closeTable();
      html.push('<hr />');
      continue;
    }

    // Table rows
    if (isTableRow(trimmed)) {
      if (isTableSeparator(trimmed)) continue;
      closeList();
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      closeTable();
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      closeList();
      html.push(`<h3>${inlineFormat(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeList();
      html.push(`<h2>${inlineFormat(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeList();
      html.push(`<h1>${inlineFormat(trimmed.slice(2))}</h1>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      closeList();
      html.push(`<blockquote><p>${inlineFormat(trimmed.slice(2))}</p></blockquote>`);
      continue;
    }

    // Raw HTML pass-through (details, summary, br, p, img, etc.)
    if (/^<(details|summary|br|p |img )/i.test(trimmed) || /^<\/(details|summary|p|a)>/i.test(trimmed)) {
      flushImages();
      closeList();
      closeTable();
      if (trimmed.startsWith('<details')) {
        inRawHtml = true;
      }
      html.push(trimmed);
      if (trimmed.includes('</details>')) {
        inRawHtml = false;
      }
      continue;
    }
    if (inRawHtml) {
      html.push(trimmed);
      if (trimmed.includes('</details>')) {
        inRawHtml = false;
      }
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(trimmed) || /^- ### /.test(trimmed)) {
      const content = trimmed.replace(/^[-*] /, '');
      if (!inList || listType !== 'ul') {
        closeList();
        html.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      html.push(`<li>${inlineFormat(content)}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      if (!inList || listType !== 'ol') {
        closeList();
        html.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      html.push(`<li>${inlineFormat(content)}</li>`);
      continue;
    }

    // Regular paragraph
    closeList();
    html.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  flushImages();
  closeList();
  closeTable();
  return html.join('\n');
}

/* ─── Main Component ─── */
export default function WikiPage() {
  const params = useParams();
  const projectId = params?.id as string;

  // Resolve project config
  const isSupported = projectId === 'monika' || projectId === 'natsuki';
  const content = wikiContents[projectId] || wikiContents.monika;
  const menus = menuSectionsMap[projectId] || menuSectionsMap.monika;
  const theme = projectTheme[projectId] || projectTheme.monika;

  const [activeSection, setActiveSection] = useState(theme.defaultSection);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxSrc !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxSrc]);

  // Escape key to close lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSectionClick = useCallback((key: string) => {
    setActiveSection(key);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      e.stopPropagation();
      setLightboxSrc(img.src);
    }
  }, []);

  const parsedContent = useMemo(() => {
    const raw = content[activeSection];
    if (!raw) return '<p style="color: #ef4444;">❌ Error: Sección no encontrada o en construcción.</p>';
    return parseMarkdown(raw);
  }, [activeSection, content]);

  // Not a supported project
  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="text-center px-6">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#71717a' }} />
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#e4e4e7' }}>Wiki no disponible</h1>
          <p className="mb-6" style={{ color: '#a1a1aa' }}>
            La wiki para este proyecto aún no está disponible.
          </p>
          <Link
            href={`/proyectos/${projectId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{ backgroundColor: '#1f1f24', color: '#e4e4e7' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2a2a30'; (e.currentTarget as HTMLElement).style.color = '#c084fc'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1f1f24'; (e.currentTarget as HTMLElement).style.color = '#e4e4e7'; }}
          >
            <ArrowLeft size={16} />
            Volver al proyecto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700&display=swap');

        .wiki-page { font-family: 'Inter', sans-serif; background: #0a0a0f; color: #e4e4e7; line-height: 1.6; }

        /* Menu toggle */
        .wiki-menu-toggle { position: fixed; top: 1.5rem; right: 1.5rem; font-size: 1.8rem; color: #e4e4e7; cursor: pointer; z-index: 1000; transition: color 0.2s; background: none; border: none; padding: 0; }
        .wiki-menu-toggle:hover { color: ${theme.accent}; }

        /* Side menu */
        .wiki-side-menu { position: fixed; top: 0; right: 0; height: 100vh; width: 280px; background: #111114; border-left: 1px solid #27272a; transform: translateX(100%); transition: transform 0.3s ease; z-index: 999; padding: 2rem 1rem; overflow-y: auto; }
        .wiki-side-menu.active { transform: translateX(0); }
        .wiki-side-menu .menu-header { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #27272a; }
        .wiki-side-menu .menu-header .menu-icon { font-size: 1.5rem; color: ${theme.accent}; flex-shrink: 0; }
        .wiki-side-menu .menu-header h3 { color: #e4e4e7; font-size: 1rem; font-weight: 600; margin: 0; }
        .wiki-side-menu .menu-header p { font-size: 0.7rem; color: #a1a1aa; margin: 0; }
        .wiki-side-menu ul { list-style: none; padding: 0; margin: 0; }
        .wiki-side-menu .menu-section-title { font-size: 0.75rem; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin: 1.5rem 0 0.8rem 0; padding-left: 14px; }
        .wiki-side-menu li { margin-bottom: 0.6rem; }
        .wiki-side-menu a { display: flex; align-items: center; gap: 10px; padding: 10px 14px; color: #d4d4d8; text-decoration: none; border-radius: 10px; transition: all 0.2s ease; font-size: 0.9rem; background: transparent; cursor: pointer; }
        .wiki-side-menu a .menu-item-icon { width: 20px; flex-shrink: 0; color: #71717a; }
        .wiki-side-menu a:hover { background: #1f1f24; color: ${theme.accent}; }
        .wiki-side-menu a.active { background: #2a2a30; color: ${theme.accent}; font-weight: 500; }
        .wiki-side-menu a.active .menu-item-icon { color: ${theme.accent}; }

        /* Overlay */
        .wiki-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.7); z-index: 998; display: none; }
        .wiki-overlay.active { display: block; }

        /* Container */
        .wiki-container { min-height: 100vh; max-width: 900px; margin: 0 auto; padding: 2rem; }
        .wiki-content { width: 100%; }
        .wiki-article { width: 100%; }

        /* Article styles */
        .wiki-article h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; background: ${theme.accentGradient}; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .wiki-article h2 { font-size: 1.75rem; font-weight: 600; margin: 2rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 2px solid #27272a; }
        .wiki-article h3 { font-size: 1.35rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; }
        .wiki-article p { margin-bottom: 1rem; color: #d4d4d8; }
        .wiki-article a { color: ${theme.accent}; text-decoration: none; border-bottom: 1px dashed ${theme.accent}; }
        .wiki-article a:hover { color: ${theme.accentHover}; border-bottom-style: solid; }
        .wiki-article ul, .wiki-article ol { margin: 1rem 0 1rem 2rem; }
        .wiki-article li { margin-bottom: 0.5rem; }

        /* Tables */
        .wiki-article table { width: 100%; border-collapse: collapse; margin: 0; background: #111114; border-radius: 12px; overflow: hidden; }
        .wiki-article th, .wiki-article td { border: 1px solid #27272a; padding: 12px 16px; text-align: left; }
        .wiki-article th { background: #1f1f24; font-weight: 600; }

        /* Code blocks */
        .wiki-article pre { background: #111114; border: 1px solid #27272a; border-radius: 12px; padding: 1rem; overflow-x: auto; margin: 1.5rem 0; }
        .wiki-article code { font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.85rem; }
        .wiki-article :not(pre) > code { background: #1f1f24; padding: 0.2rem 0.4rem; border-radius: 6px; color: ${theme.accent}; }

        /* Blockquotes */
        .wiki-article blockquote { border-left: 4px solid ${theme.accent}; background: #1a1a20; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 12px; }
        .wiki-article blockquote p { margin-bottom: 0; }

        /* Images */
        .wiki-article img { max-width: 100%; height: auto; border-radius: 10px; margin: 0.8rem 0; display: block; cursor: zoom-in; }

        /* Card row (horizontal scroll for NOU cards) */
        .wiki-card-row { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 0.8rem; padding: 0.8rem 0; margin: 1rem 0; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: #3f3f46 transparent; }
        .wiki-card-row::-webkit-scrollbar { height: 6px; }
        .wiki-card-row::-webkit-scrollbar-track { background: transparent; }
        .wiki-card-row::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        .wiki-card-row::-webkit-scrollbar-thumb:hover { background: #52525b; }
        .wiki-card-row img { min-width: 90px; max-width: 120px; height: auto; flex-shrink: 0; margin: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .wiki-card-row img:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5); }

        /* Custom color emojis (UNO-style chips) */
        .wiki-emoji { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; vertical-align: middle; margin-right: 5px; position: relative; top: -1px; border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 2px 6px rgba(0,0,0,0.35); flex-shrink: 0; }
        .wiki-emoji::after { content: ''; display: block; width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.35); position: absolute; top: 3px; left: 3px; }
        .wiki-emoji.emoji-red { background: linear-gradient(135deg, #f87171 0%, #dc2626 100%); }
        .wiki-emoji.emoji-blue { background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%); }
        .wiki-emoji.emoji-green { background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%); }
        .wiki-emoji.emoji-yellow { background: linear-gradient(135deg, #fde047 0%, #ca8a04 100%); }

        /* Table wrap */
        .wiki-article .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1.5rem 0; border-radius: 12px; }

        /* HR */
        .wiki-article hr { border: none; border-top: 2px solid #27272a; margin: 1.5rem 0; }

        /* Back button */
        .wiki-back-button { display: inline-flex; align-items: center; gap: 8px; background: #1f1f24; color: #e4e4e7; padding: 8px 16px; border-radius: 30px; text-decoration: none; font-size: 0.85rem; margin-bottom: 2rem; transition: all 0.2s; border: none; cursor: pointer; }
        .wiki-back-button:hover { background: #2a2a30; color: ${theme.accent}; }

        /* Footer */
        .wiki-footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #27272a; text-align: center; font-size: 0.85rem; color: #a1a1aa; line-height: 1.8; }
        .wiki-footer .heart { color: #ef4444; animation: wikiHeartbeat 1.4s ease-in-out infinite; display: inline-block; }

        @keyframes wikiHeartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }

        /* Lightbox */
        .wiki-lightbox-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: zoom-out; opacity: 0; transition: opacity 0.25s ease; padding: 1rem; }
        .wiki-lightbox-overlay.active { opacity: 1; }
        .wiki-lightbox-overlay img { max-width: 95%; max-height: 95vh; border-radius: 12px; box-shadow: 0 0 40px ${theme.lightboxGlow}; object-fit: contain; cursor: default; }
        .wiki-lightbox-close { position: absolute; top: 1rem; right: 1rem; color: #e4e4e7; font-size: 2rem; cursor: pointer; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255, 255, 255, 0.08); transition: background 0.2s; border: none; }
        .wiki-lightbox-close:hover { background: rgba(255, 255, 255, 0.18); }

        /* Responsive: Tablets */
        @media (max-width: 1024px) {
          .wiki-container { max-width: 100%; padding: 1.5rem; }
          .wiki-article h1 { font-size: 2rem; }
          .wiki-article h2 { font-size: 1.5rem; }
          .wiki-article table { min-width: 500px; }
        }

        /* Responsive: Large mobile */
        @media (max-width: 768px) {
          .wiki-container { padding: 1rem 0.8rem; }
          .wiki-article h1 { font-size: 1.6rem; }
          .wiki-article h2 { font-size: 1.3rem; margin: 1.5rem 0 0.75rem 0; }
          .wiki-article h3 { font-size: 1.15rem; }
          .wiki-article p { font-size: 0.95rem; line-height: 1.7; }
          .wiki-article ul, .wiki-article ol { margin: 0.8rem 0 0.8rem 1.2rem; }
          .wiki-article li { font-size: 0.93rem; margin-bottom: 0.4rem; }
          .wiki-article th, .wiki-article td { padding: 8px 10px; font-size: 0.82rem; }
          .wiki-article blockquote { padding: 0.8rem 1rem; margin: 1rem 0; }
          .wiki-article pre { padding: 0.8rem; font-size: 0.8rem; border-radius: 8px; }
          .wiki-article code { font-size: 0.8rem; }
          .wiki-side-menu { width: 260px; }
          .wiki-back-button { margin-bottom: 1.5rem; padding: 6px 14px; font-size: 0.8rem; }
          .wiki-footer { font-size: 0.75rem; }
        }

        /* Responsive: Small mobile */
        @media (max-width: 480px) {
          .wiki-container { padding: 0.8rem 0.6rem; }
          .wiki-article h1 { font-size: 1.35rem; }
          .wiki-article h2 { font-size: 1.15rem; border-bottom-width: 1px; }
          .wiki-article h3 { font-size: 1.05rem; }
          .wiki-article p { font-size: 0.9rem; line-height: 1.75; }
          .wiki-article ul, .wiki-article ol { margin: 0.6rem 0 0.6rem 1rem; }
          .wiki-article li { font-size: 0.88rem; }
          .wiki-article th, .wiki-article td { padding: 6px 8px; font-size: 0.78rem; }
          .wiki-article blockquote { padding: 0.7rem 0.8rem; border-radius: 8px; }
          .wiki-article pre { padding: 0.6rem; font-size: 0.75rem; border-radius: 8px; }
          .wiki-article :not(pre) > code { font-size: 0.78rem; padding: 0.15rem 0.3rem; }
          .wiki-side-menu { width: 85vw; max-width: 300px; padding: 1.5rem 0.8rem; }
          .wiki-menu-toggle { top: 1rem; right: 1rem; font-size: 1.5rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(17, 17, 20, 0.85); border-radius: 12px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid #27272a; }
          .wiki-side-menu .menu-header h3 { font-size: 0.95rem; }
          .wiki-side-menu a { padding: 12px 12px; font-size: 0.88rem; border-radius: 8px; }
          .wiki-back-button { margin-bottom: 1rem; padding: 6px 12px; font-size: 0.78rem; }
          .wiki-footer { margin-top: 2rem; padding-top: 1.5rem; font-size: 0.7rem; }
        }

        /* Responsive: Very small */
        @media (max-width: 360px) {
          .wiki-container { padding: 0.6rem 0.5rem; }
          .wiki-article h1 { font-size: 1.2rem; }
          .wiki-article h2 { font-size: 1.05rem; }
          .wiki-article p { font-size: 0.85rem; }
          .wiki-article th, .wiki-article td { padding: 5px 6px; font-size: 0.72rem; }
          .wiki-side-menu { width: 90vw; }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .wiki-container { max-width: 960px; padding: 3rem 2rem; }
        }

        /* Touch-friendly */
        @media (hover: none) and (pointer: coarse) {
          .wiki-side-menu a { min-height: 44px; }
          .wiki-menu-toggle { width: 48px; height: 48px; }
        }

        /* Safe area */
        @supports (padding: env(safe-area-inset-right)) {
          .wiki-menu-toggle { right: calc(1rem + env(safe-area-inset-right)); top: calc(1rem + env(safe-area-inset-top)); }
          .wiki-side-menu { padding-right: calc(1rem + env(safe-area-inset-right)); }
          .wiki-container { padding-left: calc(0.8rem + env(safe-area-inset-left)); padding-right: calc(0.8rem + env(safe-area-inset-right)); }
        }

        /* Details/Summary styling */
        .wiki-article details { background: #111114; border: 1px solid #27272a; border-radius: 12px; padding: 0; margin: 1.5rem 0; overflow: hidden; }
        .wiki-article summary { padding: 1rem 1.5rem; cursor: pointer; color: #e4e4e7; font-weight: 500; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
        .wiki-article summary:hover { background: #1a1a20; }
        .wiki-article summary::-webkit-details-marker { display: none; }
        .wiki-article details[open] summary { border-bottom: 1px solid #27272a; }
        .wiki-article details > :not(summary) { padding: 1rem 1.5rem; }
        .wiki-article details > :not(summary):first-child { padding-top: 0.5rem; }
      ` }} />

      <div className="wiki-page">
        {/* Menu Toggle Button */}
        <button
          className="wiki-menu-toggle"
          onClick={() => { setMenuOpen(!menuOpen); }}
          aria-label="Abrir menú"
        >
          <Menu size={28} />
        </button>

        {/* Overlay */}
        <div
          className={`wiki-overlay ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Side Menu */}
        <nav className={`wiki-side-menu ${menuOpen ? 'active' : ''}`}>
          <div className="menu-header">
            <BookOpen size={24} className="menu-icon" />
            <div>
              <h3>{theme.title}</h3>
              <p>{theme.subtitle}</p>
            </div>
          </div>

          {menus.map((section) => (
            <div key={section.title}>
              <div className="menu-section-title">{section.title}</div>
              <ul>
                {section.items.map((item) => {
                  const ItemIcon = item.Icon;
                  return (
                    <li key={item.key}>
                      <a
                        className={activeSection === item.key ? 'active' : ''}
                        onClick={() => handleSectionClick(item.key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSectionClick(item.key); }}
                      >
                        <ItemIcon size={18} className="menu-item-icon" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Main Content */}
        <div className="wiki-container">
          <main className="wiki-content">
            <Link
              href={`/proyectos/${projectId}`}
              className="wiki-back-button"
            >
              <ArrowLeft size={16} />
              Volver al proyecto
            </Link>

            <div
              className="wiki-article"
              ref={articleRef}
              onClick={handleImageClick}
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />

            <div className="wiki-footer">
              &copy; 2026 The Encoders Club. Todos los derechos reservados.<br />
              Hecho con <span className="heart">&#10084;</span> para la comunidad hispanohablante de Ren&apos;Py
            </div>
          </main>
        </div>

        {/* Lightbox */}
        {lightboxSrc !== null && (
          <div
            className={`wiki-lightbox-overlay active`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxSrc(null);
            }}
          >
            <button
              className="wiki-lightbox-close"
              onClick={() => setLightboxSrc(null)}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            <img src={lightboxSrc} alt="Imagen ampliada" />
          </div>
        )}
      </div>
    </>
  );
}
