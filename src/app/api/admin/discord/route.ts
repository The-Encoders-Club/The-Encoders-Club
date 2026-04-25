import { NextRequest, NextResponse } from 'next/server';
import { getDB, generateId, nowISO } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Get Discord config (admin+ only, with masked bot token)
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

    // Mask the bot token for security
    const botToken = config.botToken as string | null;
    const maskedBotToken = botToken
      ? botToken.substring(0, 8) + '•'.repeat(Math.max(0, botToken.length - 8))
      : null;

    return NextResponse.json({
      config: {
        id: config.id,
        botToken: maskedBotToken,
        hasBotToken: !!botToken,
        serverId: config.serverId,
        channelId: config.channelId,
        webhookUrl: config.webhookUrl,
        modRoleId: config.modRoleId,
        adminRoleId: config.adminRoleId,
        collabRoleId: config.collabRoleId,
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
    const { botToken, serverId, channelId, webhookUrl, modRoleId, adminRoleId, collabRoleId } = body;

    const db = await getDB();
    const now = nowISO();

    // Check if config already exists
    const existing = await db
      .prepare('SELECT id FROM DiscordConfig LIMIT 1')
      .first();

    if (existing) {
      // Build dynamic update query
      const updates: string[] = [];
      const values: unknown[] = [];

      if (botToken !== undefined) {
        updates.push('botToken = ?');
        values.push(botToken ? String(botToken) : null);
      }
      if (serverId !== undefined) {
        updates.push('serverId = ?');
        values.push(serverId ? String(serverId) : null);
      }
      if (channelId !== undefined) {
        updates.push('channelId = ?');
        values.push(channelId ? String(channelId) : null);
      }
      if (webhookUrl !== undefined) {
        updates.push('webhookUrl = ?');
        values.push(webhookUrl ? String(webhookUrl) : null);
      }
      if (modRoleId !== undefined) {
        updates.push('modRoleId = ?');
        values.push(modRoleId ? String(modRoleId) : null);
      }
      if (adminRoleId !== undefined) {
        updates.push('adminRoleId = ?');
        values.push(adminRoleId ? String(adminRoleId) : null);
      }
      if (collabRoleId !== undefined) {
        updates.push('collabRoleId = ?');
        values.push(collabRoleId ? String(collabRoleId) : null);
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
      // Create new config
      const configId = generateId();

      await db
        .prepare(
          'INSERT INTO DiscordConfig (id, botToken, serverId, channelId, webhookUrl, modRoleId, adminRoleId, collabRoleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
          now,
          now
        )
        .run();
    }

    // Log activity
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
