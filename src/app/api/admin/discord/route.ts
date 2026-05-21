import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Get Discord config (admin+ only, with masked sensitive values)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const db = await getDB();

    const config = await db
      .prepare('SELECT * FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      return NextResponse.json({ config: null });
    }

    const maskSecret = (val: string | null) =>
      val ? val.substring(0, 6) + '•'.repeat(Math.max(0, val.length - 6)) : null;

    return NextResponse.json({
      config: {
        id: config.id,
        botToken: maskSecret(config.botToken as string | null),
        hasBotToken: !!config.botToken,
        serverId: config.serverId,
        channelId: config.channelId,
        webhookUrl: config.webhookUrl,
        modRoleId: config.modRoleId,
        adminRoleId: config.adminRoleId,
        collabRoleId: config.collabRoleId,
        discordClientId: config.discordClientId,
        hasClientId: !!config.discordClientId,
        discordClientSecret: maskSecret(config.discordClientSecret as string | null),
        hasClientSecret: !!config.discordClientSecret,
        siteUrl: config.siteUrl,
        notificationEnabled: config.notificationEnabled !== undefined && config.notificationEnabled !== 0,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get Discord config error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PUT: Save Discord config (admin+ only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const {
      botToken, serverId, channelId, webhookUrl,
      modRoleId, adminRoleId, collabRoleId,
      discordClientId, discordClientSecret, siteUrl,
      notificationEnabled,
    } = body;

    const db = await getDB();
    const now = nowISO();

    const existing = await db
      .prepare('SELECT id FROM DiscordConfig LIMIT 1')
      .first();

    if (existing) {
      const updates: string[] = [];
      const values: unknown[] = [];

      const fields: Record<string, unknown> = {
        botToken, serverId, channelId, webhookUrl,
        modRoleId, adminRoleId, collabRoleId,
        discordClientId, discordClientSecret, siteUrl,
        notificationEnabled: notificationEnabled !== undefined ? (notificationEnabled ? 1 : 0) : undefined,
      };

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
      }

      updates.push('updatedAt = ?');
      values.push(now);
      values.push(existing.id as string);

      await db
        .prepare(`UPDATE DiscordConfig SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    } else {
      const configId = generateId();

      await db
        .prepare(
          `INSERT INTO DiscordConfig (
            id, botToken, serverId, channelId, webhookUrl,
            modRoleId, adminRoleId, collabRoleId,
            discordClientId, discordClientSecret, siteUrl,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          configId,
          botToken ? String(botToken) : null,
          serverId ? String(serverId) : null,
          channelId ? String(channelId) : null,
          webhookUrl ? String(webhookUrl) : null,
          modRoleId ? String(modRoleId) : null,
          adminRoleId ? String(adminRoleId) : null,
          collabRoleId ? String(collabRoleId) : null,
          discordClientId ? String(discordClientId) : null,
          discordClientSecret ? String(discordClientSecret) : null,
          siteUrl ? String(siteUrl) : null,
          now,
          now
        )
        .run();
    }

    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'discord_config_updated',
        'Discord configuration updated',
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        now
      )
      .run();

    return NextResponse.json({ message: 'Discord configuration saved successfully.' });
  } catch (error) {
    console.error('Save Discord config error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
                                }
