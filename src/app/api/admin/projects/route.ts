// ============================================================
// /api/admin/projects
//  GET    — list ALL dynamic projects (published or not) [admin+]
//  POST   — create a new dynamic project               [admin/owner]
//
// Hardcoded projects (monika / natsuki / yuri) are NOT affected
// by any of these operations: their slugs are reserved and
// rejected at validation time.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';
import {
  parseProjectRow,
  validateProjectSlug,
  isReservedSlug,
  type DynamicProject,
  type ProjectDownload,
  type ProjectDetails,
} from '@/data/dynamic-projects';

export const dynamic = 'force-dynamic';

// ─── Helpers ───

interface ProjectInput {
  id?: unknown;
  name?: unknown;
  subtitle?: unknown;
  subtitleEn?: unknown;
  description?: unknown;
  descriptionEn?: unknown;
  image?: unknown;
  coverBg?: unknown;
  coverFit?: unknown;
  tags?: unknown;
  status?: unknown;
  statusEn?: unknown;
  statusColor?: unknown;
  rating?: unknown;
  featured?: unknown;
  previews?: unknown;
  downloads?: unknown;
  music?: unknown;
  details?: unknown;
  themeColor?: unknown;
  isPublished?: unknown;
  sortOrder?: unknown;
}

function requireAdmin(session: { role: string } | null) {
  if (!session) return { ok: false, response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  if (!['admin', 'owner'].includes(session.role)) {
    return { ok: false, response: NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 }) };
  }
  return { ok: true, response: null };
}

function asString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function asStringOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = typeof v === 'string' ? v : String(v);
  return s.trim() === '' ? null : s;
}

function asNumber(v: unknown, fallback: number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

function asBool(v: unknown, fallback = false): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') return v === 'true' || v === '1';
  return fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === 'string' ? x : String(x))).filter((s) => s.length > 0);
}

function asDownloadsArray(v: unknown): ProjectDownload[] {
  if (!Array.isArray(v)) return [];
  const validIcons = ['Smartphone', 'Monitor', 'Download'];
  return v
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      label: asString(item.label),
      labelEn: asStringOrNull(item.labelEn) || undefined,
      icon: (validIcons.includes(asString(item.icon)) ? asString(item.icon) : 'Download') as ProjectDownload['icon'],
      url: asString(item.url),
      color: asString(item.color, '#FF2D78'),
      hoverColor: asStringOrNull(item.hoverColor) || undefined,
      textColor: asStringOrNull(item.textColor) || undefined,
    }))
    .filter((d) => d.label && d.url);
}

function asDetails(v: unknown): ProjectDetails {
  if (!v || typeof v !== 'object') return {};
  const obj = v as Record<string, unknown>;
  return {
    playTime: asStringOrNull(obj.playTime) || undefined,
    playTimeEn: asStringOrNull(obj.playTimeEn) || undefined,
    language: asStringOrNull(obj.language) || undefined,
    languageEn: asStringOrNull(obj.languageEn) || undefined,
    engine: asStringOrNull(obj.engine) || undefined,
    downloadsLabel: asStringOrNull(obj.downloadsLabel) || undefined,
  };
}

// ─── GET: list all dynamic projects (admin view) ───

export async function GET() {
  try {
    const session = await getSession();
    const guard = requireAdmin(session);
    if (!guard.ok) return guard.response;

    const db = await getDB();
    const { results } = await db
      .prepare('SELECT * FROM Project ORDER BY sortOrder ASC, createdAt DESC')
      .all();

    const projects: DynamicProject[] = (results || []).map((row) =>
      parseProjectRow(row as Record<string, unknown>)
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Admin list projects error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ─── POST: create a new dynamic project ───

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const guard = requireAdmin(session);
    if (!guard.ok) return guard.response;

    const body = (await request.json()) as ProjectInput;

    // ── Validate slug ──
    const slug = asString(body.id).trim().toLowerCase();
    const slugCheck = validateProjectSlug(slug);
    if (!slugCheck.ok) {
      return NextResponse.json({ error: slugCheck.error }, { status: 400 });
    }

    // ── Validate required fields ──
    const name = asString(body.name).trim();
    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 });
    }
    const description = asString(body.description).trim();
    if (!description) {
      return NextResponse.json({ error: 'La descripción es obligatoria.' }, { status: 400 });
    }
    const image = asString(body.image).trim();
    if (!image) {
      return NextResponse.json({ error: 'La imagen de portada es obligatoria.' }, { status: 400 });
    }

    // ── Normalize fields ──
    const tags = asStringArray(body.tags);
    const previews = asStringArray(body.previews);
    const downloads = asDownloadsArray(body.downloads);
    const details = asDetails(body.details);
    const themeColor = asString(body.themeColor, '#FF2D78').trim() || '#FF2D78';
    const statusColor = asString(body.statusColor, '#22c55e').trim() || '#22c55e';
    const coverFit: 'contain' | 'cover' = asString(body.coverFit) === 'cover' ? 'cover' : 'contain';
    const status = asString(body.status, 'Disponible').trim() || 'Disponible';
    const rating = Math.max(0, Math.min(5, asNumber(body.rating, 0)));
    const featured = asBool(body.featured) ? 1 : 0;
    const isPublished = asBool(body.isPublished, true) ? 1 : 0;
    const sortOrder = asNumber(body.sortOrder, 0);
    const music = asStringOrNull(body.music);
    const coverBg = asStringOrNull(body.coverBg);
    const subtitle = asStringOrNull(body.subtitle);
    const subtitleEn = asStringOrNull(body.subtitleEn);
    const descriptionEn = asStringOrNull(body.descriptionEn);
    const statusEn = asStringOrNull(body.statusEn);

    const db = await getDB();
    const now = nowISO();

    // ── Reject duplicate slug ──
    const existing = await db.prepare('SELECT id FROM Project WHERE id = ?').bind(slug).first();
    if (existing) {
      return NextResponse.json({ error: `Ya existe un proyecto con el slug "${slug}".` }, { status: 409 });
    }
    // Extra safety: reject reserved slugs (already enforced by validateProjectSlug, but be defensive).
    if (isReservedSlug(slug)) {
      return NextResponse.json({ error: 'El slug está reservado.' }, { status: 400 });
    }

    await db
      .prepare(
        `INSERT INTO Project
          (id, name, subtitle, subtitleEn, description, descriptionEn, image, coverBg, coverFit,
           tags, status, statusEn, statusColor, rating, featured, previews, downloads, music,
           details, themeColor, isPublished, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        slug,
        name,
        subtitle,
        subtitleEn,
        description,
        descriptionEn,
        image,
        coverBg,
        coverFit,
        JSON.stringify(tags),
        status,
        statusEn,
        statusColor,
        rating,
        featured,
        JSON.stringify(previews),
        JSON.stringify(downloads),
        music,
        JSON.stringify(details),
        themeColor,
        isPublished,
        sortOrder,
        now,
        now
      )
      .run();

    // ── Log activity ──
    try {
      await db
        .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          session!.id,
          'project_created',
          `Proyecto dinámico creado: ${name} (${slug})`,
          request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
          now
        )
        .run();
    } catch {
      /* activity log is best-effort */
    }

    const row = await db.prepare('SELECT * FROM Project WHERE id = ?').bind(slug).first();
    const project: DynamicProject = parseProjectRow(row as Record<string, unknown>);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

