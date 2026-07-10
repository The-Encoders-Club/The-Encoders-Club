// ============================================================
// /api/admin/projects/[id]
//  GET    — fetch a single dynamic project (admin view) [admin+]
//  PUT    — update a dynamic project                   [admin/owner]
//  DELETE — delete a dynamic project                   [admin/owner]
//
// The slug (id) cannot be changed after creation. To rename a
// slug, delete the project and re-create it with the new slug.
// Reserved slugs (monika / natsuki / yuri) are never served or
// modified here.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';
import {
  parseProjectRow,
  isReservedSlug,
  DEFAULT_SECTIONS,
  type DynamicProject,
  type ProjectDownload,
  type ProjectDetails,
  type ProjectSections,
  type ProjectResource,
  type ResourceIcon,
} from '@/data/dynamic-projects';

export const dynamic = 'force-dynamic';

// ─── Helpers (mirrors /api/admin/projects/route.ts) ───

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
    .filter((d) => d.label || d.url);
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

function asSections(v: unknown): ProjectSections {
  if (!v || typeof v !== 'object') return {};
  const obj = v as Record<string, unknown>;
  const out: ProjectSections = {};
  for (const key of Object.keys(DEFAULT_SECTIONS) as (keyof ProjectSections)[]) {
    if (obj[key] !== undefined) {
      const val = obj[key];
      if (typeof val === 'boolean') out[key] = val;
      else if (typeof val === 'number') out[key] = val === 1;
      else if (typeof val === 'string') out[key] = val === 'true' || val === '1';
    }
  }
  return out;
}

const VALID_RESOURCE_ICONS: ResourceIcon[] = ['BookOpen', 'Shirt', 'Puzzle', 'Star', 'Search', 'Download', 'Heart', 'ExternalLink', 'FileText'];

function asResources(v: unknown): ProjectResource[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      title: asString(item.title),
      description: asString(item.description),
      descriptionEn: asStringOrNull(item.descriptionEn) || undefined,
      url: asStringOrNull(item.url) || undefined,
      urlLabel: asStringOrNull(item.urlLabel) || undefined,
      urlLabelEn: asStringOrNull(item.urlLabelEn) || undefined,
      icon: (VALID_RESOURCE_ICONS.includes(asString(item.icon) as ResourceIcon) ? asString(item.icon) : 'FileText') as ResourceIcon,
      color: asStringOrNull(item.color) || undefined,
    }))
    .filter((r) => r.title && r.description);
}

// ─── GET ───

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const guard = requireAdmin(session);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    if (!id || isReservedSlug(id)) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const db = await getDB();
    const row = await db.prepare('SELECT * FROM Project WHERE id = ?').bind(id).first();
    if (!row) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    const project: DynamicProject = parseProjectRow(row as Record<string, unknown>);
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Admin get project error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ─── PUT ───

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const guard = requireAdmin(session);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    if (!id || isReservedSlug(id)) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const db = await getDB();

    const existing = await db.prepare('SELECT id FROM Project WHERE id = ?').bind(id).first();
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Validate required fields if present
    if (body.name !== undefined && asString(body.name).trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 });
    }
    if (body.description !== undefined && asString(body.description).trim() === '') {
      return NextResponse.json({ error: 'La descripción es obligatoria.' }, { status: 400 });
    }
    if (body.image !== undefined && asString(body.image).trim() === '') {
      return NextResponse.json({ error: 'La imagen de portada es obligatoria.' }, { status: 400 });
    }

    const name = asString(body.name).trim();
    const description = asString(body.description).trim();
    const image = asString(body.image).trim();
    const tags = asStringArray(body.tags);
    const previews = asStringArray(body.previews);
    const downloads = asDownloadsArray(body.downloads);
    const details = asDetails(body.details);
    const themeColor = asString(body.themeColor, '#FF2D78').trim() || '#FF2D78';
    const statusColor = asString(body.statusColor, '#22c55e').trim() || '#22c55e';
    const coverFit: 'contain' | 'cover' = asString(body.coverFit) === 'cover' ? 'cover' : 'contain';
    const coverBgColor = asStringOrNull(body.coverBgColor);
    const coverHeightRaw = asString(body.coverHeight, 'auto');
    const coverHeight: 'auto' | 'small' | 'medium' | 'large' | 'full' = ['small', 'medium', 'large', 'full'].includes(coverHeightRaw) ? (coverHeightRaw as 'small' | 'medium' | 'large' | 'full') : 'auto';
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
    const bgImage = asStringOrNull(body.bgImage);
    const bgFitRaw = asString(body.bgFit, 'cover');
    const bgFit: 'cover' | 'contain' | 'solid' = bgFitRaw === 'contain' ? 'contain' : bgFitRaw === 'solid' ? 'solid' : 'cover';
    const bgOpacity = Math.max(0, Math.min(100, asNumber(body.bgOpacity, 85)));
    const pageBgColor = asStringOrNull(body.pageBgColor);
    const cardBgColor = asStringOrNull(body.cardBgColor);
    const borderColor = asStringOrNull(body.borderColor);
    const textColor = asStringOrNull(body.textColor);
    const titleStrokeColor = asStringOrNull(body.titleStrokeColor);
    const accentColor = asStringOrNull(body.accentColor);
    const sections = asSections(body.sections);
    const resources = asResources(body.resources);
    const now = nowISO();

    await db
      .prepare(
        `UPDATE Project SET
          name = ?, subtitle = ?, subtitleEn = ?, description = ?, descriptionEn = ?,
          image = ?, coverBg = ?, coverFit = ?, coverBgColor = ?, coverHeight = ?,
          tags = ?, status = ?, statusEn = ?, statusColor = ?, rating = ?, featured = ?,
          previews = ?, downloads = ?, music = ?, details = ?, themeColor = ?,
          bgImage = ?, bgFit = ?, bgOpacity = ?,
          pageBgColor = ?, cardBgColor = ?, borderColor = ?, textColor = ?, titleStrokeColor = ?, accentColor = ?,
          sections = ?, resources = ?,
          isPublished = ?, sortOrder = ?, updatedAt = ?
         WHERE id = ?`
      )
      .bind(
        name,
        subtitle,
        subtitleEn,
        description,
        descriptionEn,
        image,
        coverBg,
        coverFit,
        coverBgColor,
        coverHeight,
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
        bgImage,
        bgFit,
        bgOpacity,
        pageBgColor,
        cardBgColor,
        borderColor,
        textColor,
        titleStrokeColor,
        accentColor,
        JSON.stringify(sections),
        JSON.stringify(resources),
        isPublished,
        sortOrder,
        now,
        id
      )
      .run();

    // Log activity
    try {
      await db
        .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          session!.id,
          'project_updated',
          `Proyecto dinámico actualizado: ${name} (${id})`,
          request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
          now
        )
        .run();
    } catch {
      /* best-effort */
    }

    const row = await db.prepare('SELECT * FROM Project WHERE id = ?').bind(id).first();
    const project: DynamicProject = parseProjectRow(row as Record<string, unknown>);
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: `No se pudo actualizar el proyecto: ${message}` }, { status: 500 });
  }
}

// ─── DELETE ───

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const guard = requireAdmin(session);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    if (!id || isReservedSlug(id)) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const db = await getDB();
    const existing = await db.prepare('SELECT name FROM Project WHERE id = ?').bind(id).first();
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    await db.prepare('DELETE FROM Project WHERE id = ?').bind(id).run();

    // Log activity
    try {
      await db
        .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          session!.id,
          'project_deleted',
          `Proyecto dinámico eliminado: ${(existing as Record<string, unknown>).name} (${id})`,
          request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
          nowISO()
        )
        .run();
    } catch {
      /* best-effort */
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: `No se pudo eliminar el proyecto: ${message}` }, { status: 500 });
  }
}
