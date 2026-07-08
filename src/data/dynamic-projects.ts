// ============================================================
// Dynamic Project Types
// Shared between API routes, admin panel and public pages.
// ============================================================

export type DownloadIconName = 'Smartphone' | 'Monitor' | 'Download';

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

/**
 * Parse a project row coming from D1 into a typed DynamicProject.
 * Throws if required JSON columns cannot be parsed.
 */
export function parseProjectRow(row: Record<string, unknown>): DynamicProject {
  const tags = safeParseArray<string>(row.tags as string, []);
  const previews = safeParseArray<string>(row.previews as string, []);
  const downloads = safeParseArray<ProjectDownload>(row.downloads as string, []);
  const details = safeParseObject<ProjectDetails>(row.details as string, {});

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
    isPublished: Number(row.isPublished) === 1,
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : Number(row.sortOrder) || 0,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
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

