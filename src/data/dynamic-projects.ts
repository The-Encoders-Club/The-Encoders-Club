// ============================================================
// Dynamic Project Types
// Shared between API routes, admin panel and public pages.
// ============================================================

export type DownloadIconName = 'Smartphone' | 'Monitor' | 'Download';
export type BgFit = 'cover' | 'contain' | 'solid';

export interface ProjectDownload {
  label: string;
  labelEn?: string;
  icon: DownloadIconName;
  url: string;
  color: string;        // hex, e.g. '#FF2D78'
  hoverColor?: string;  // hex
  textColor?: string;   // hex (defaults to '#ffffff')
}

export interface ProjectDetails {
  playTime?: string;
  playTimeEn?: string;
  language?: string;
  languageEn?: string;
  engine?: string;
  downloadsLabel?: string; // fixed label shown in the details card, e.g. "1,250+"
}

/**
 * Per-section visibility switches. Missing fields default to true.
 * The admin can toggle any of these to hide a section on a specific project.
 */
export interface ProjectSections {
  showGallery?: boolean;
  showResources?: boolean;
  showComments?: boolean;
  showDetails?: boolean;
  showMusic?: boolean;
  showShare?: boolean;
  showFeaturedBadge?: boolean;
}

export const DEFAULT_SECTIONS: Required<ProjectSections> = {
  showGallery: true,
  showResources: true,
  showComments: true,
  showDetails: true,
  showMusic: true,
  showShare: true,
  showFeaturedBadge: true,
};

/**
 * Resource card for the "Recursos y Contenido Extra" section
 * (mirrors the Wiki / Spritepacks / Submods cards from Monika).
 */
export type ResourceIcon = 'BookOpen' | 'Shirt' | 'Puzzle' | 'Star' | 'Search' | 'Download' | 'Heart' | 'ExternalLink' | 'FileText';

export interface ProjectResource {
  title: string;
  description: string;
  descriptionEn?: string;
  url?: string;        // optional: if present, the card becomes a link/button
  urlLabel?: string;   // label for the link button (e.g. "Ver Wiki")
  urlLabelEn?: string;
  icon: ResourceIcon;
  color?: string;      // optional override (defaults to project themeColor)
}

/**
 * Full dynamic project, as stored in D1 (after JSON parsing).
 * Returned by /api/projects and /api/admin/projects.
 */
export interface DynamicProject {
  id: string;
  name: string;
  subtitle?: string;
  subtitleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  coverBg?: string | null;
  coverFit: 'contain' | 'cover';
  tags: string[];
  status: string;
  statusEn?: string;
  statusColor: string;
  rating: number;
  featured: boolean;
  previews: string[];
  downloads: ProjectDownload[];
  music?: string | null;
  details: ProjectDetails;
  themeColor: string;
  bgImage?: string | null;
  bgFit: BgFit;
  // Visual customization (all optional; fall back to themeColor when null)
  pageBgColor?: string | null;
  cardBgColor?: string | null;
  borderColor?: string | null;
  textColor?: string | null;
  titleStrokeColor?: string | null;
  accentColor?: string | null;
  sections: ProjectSections;
  resources: ProjectResource[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Slugs reserved for the hardcoded projects in src/data/projects.ts.
 * The admin API rejects any attempt to create a dynamic project with
 * one of these slugs to avoid routing conflicts with the bespoke
 * Monika / Natsuki / Yuri themed layouts.
 */
export const RESERVED_PROJECT_SLUGS = ['monika', 'natsuki', 'yuri'] as const;

export function isReservedSlug(slug: string): boolean {
  return (RESERVED_PROJECT_SLUGS as readonly string[]).includes(slug.toLowerCase());
}

/**
 * Validate a slug: lowercase, url-safe, 3-60 chars, not reserved.
 */
export function validateProjectSlug(slug: string): { ok: boolean; error?: string } {
  if (!slug) return { ok: false, error: 'El slug es obligatorio.' };
  if (slug.length < 3 || slug.length > 60) return { ok: false, error: 'El slug debe tener entre 3 y 60 caracteres.' };
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return { ok: false, error: 'El slug solo puede contener letras minúsculas, números y guiones. Debe empezar y terminar con letra o número.' };
  }
  if (isReservedSlug(slug)) {
    return { ok: false, error: `El slug "${slug}" está reservado para un proyecto existente. Elige otro.` };
  }
  return { ok: true };
}

/* ─── Music URL helpers ───
   The admin can paste any of these formats in the "music" field:
     • YouTube video ID (11 chars, e.g. "QIHUK68L9qQ")
     • YouTube watch URL (e.g. https://www.youtube.com/watch?v=QIHUK68L9qQ)
     • YouTube youtu.be short URL (e.g. https://youtu.be/QIHUK68L9qQ)
     • YouTube /embed/ URL (e.g. https://www.youtube.com/embed/QIHUK68L9qQ)
     • Direct audio URL (mp3/ogg/wav/m3u8) — used as-is

   Returns null if the input is empty or unrecognizable. */

export function parseMusicInput(raw: string | null | undefined): {
  kind: 'youtube' | 'audio';
  /** For youtube: the 11-char video ID. For audio: the original URL. */
  value: string;
} | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;

  // Direct audio URL?
  if (/\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(s) || /\.(m3u8|mpd)$/i.test(s)) {
    return { kind: 'audio', value: s };
  }

  // Plain 11-char YouTube ID?
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) {
    return { kind: 'youtube', value: s };
  }

  // youtu.be/ID
  const shortMatch = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return { kind: 'youtube', value: shortMatch[1] };

  // youtube.com/watch?v=ID
  const watchMatch = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return { kind: 'youtube', value: watchMatch[1] };

  // youtube.com/embed/ID
  const embedMatch = s.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return { kind: 'youtube', value: embedMatch[1] };

  return null;
}

/**
 * Parse a project row coming from D1 into a typed DynamicProject.
 * Throws if required JSON columns cannot be parsed.
 */
export function parseProjectRow(row: Record<string, unknown>): DynamicProject {
  const tags = safeParseArray<string>(row.tags as string, []);
  const previews = safeParseArray<string>(row.previews as string, []);
  const downloads = safeParseArray<ProjectDownload>(row.downloads as string, []);
  const details = safeParseObject<ProjectDetails>(row.details as string, {});
  const sections = mergeDefaultSections(safeParseObject<ProjectSections>(row.sections as string, {}));
  const resources = safeParseArray<ProjectResource>(row.resources as string, []);

  const bgFitRaw = (row.bgFit as string) || 'cover';
  const bgFit: BgFit = bgFitRaw === 'contain' ? 'contain' : bgFitRaw === 'solid' ? 'solid' : 'cover';

  return {
    id: row.id as string,
    name: row.name as string,
    subtitle: (row.subtitle as string) || undefined,
    subtitleEn: (row.subtitleEn as string) || undefined,
    description: row.description as string,
    descriptionEn: (row.descriptionEn as string) || undefined,
    image: row.image as string,
    coverBg: (row.coverBg as string) || null,
    coverFit: ((row.coverFit as string) === 'cover' ? 'cover' : 'contain'),
    tags,
    status: row.status as string,
    statusEn: (row.statusEn as string) || undefined,
    statusColor: (row.statusColor as string) || '#22c55e',
    rating: typeof row.rating === 'number' ? row.rating : Number(row.rating) || 0,
    featured: Number(row.featured) === 1,
    previews,
    downloads,
    music: (row.music as string) || null,
    details,
    themeColor: (row.themeColor as string) || '#FF2D78',
    bgImage: (row.bgImage as string) || null,
    bgFit,
    pageBgColor: (row.pageBgColor as string) || null,
    cardBgColor: (row.cardBgColor as string) || null,
    borderColor: (row.borderColor as string) || null,
    textColor: (row.textColor as string) || null,
    titleStrokeColor: (row.titleStrokeColor as string) || null,
    accentColor: (row.accentColor as string) || null,
    sections,
    resources,
    isPublished: Number(row.isPublished) === 1,
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : Number(row.sortOrder) || 0,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

/** Merge partial sections with defaults so the renderer can rely on every key existing. */
export function mergeDefaultSections(s: ProjectSections): Required<ProjectSections> {
  return { ...DEFAULT_SECTIONS, ...s };
}

function safeParseArray<T>(raw: string | null | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function safeParseObject<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}
