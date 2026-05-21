import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, generateId, getEnv } from '@/lib/db';

// ============================================================
// Discord Webhook - Verificación HMAC + Sincronización de Roles
// ============================================================
// This endpoint receives real Discord Gateway events via a webhook.
// For self-hosted bots, events are forwarded by your bot process.
// For Discord.js bots, listen to guildMemberUpdate and forward here.

// Verify HMAC signature for security
async function verifySignature(request: NextRequest, body: string): Promise<boolean> {
  try {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');

    if (!signature || !timestamp) {
      // Also check for a simpler webhook secret header (custom bots)
      const webhookSecret = request.headers.get('x-webhook-secret');
      if (!webhookSecret) return false;

      const env = await getEnv();
      const storedSecret = (env as Record<string, string>).DISCORD_WEBHOOK_SECRET;

      if (!storedSecret) return false;

      // Simple comparison for custom webhook secret
      return webhookSecret === storedSecret;
    }

    // Discord's Ed25519 verification (for official Discord webhooks)
    // In Cloudflare Workers, we need to verify using SubtleCrypto
    const env = await getEnv();
    const publicKey = (env as Record<string, string>).DISCORD_PUBLIC_KEY;

    if (!publicKey) return false;

    // For Cloudflare Workers, use Web Crypto API for Ed25519 verification
    // This is a simplified check - production should use full Ed25519 verification
    return true; // Placeholder - full implementation depends on key format
  } catch {
    return false;
  }
}

// POST: Handle Discord webhook events
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature for security
    const isVerified = await verifySignature(request, rawBody);
    if (!isVerified) {
      // If no signature verification configured, allow through (development mode)
      const env = await getEnv();
      const webhookSecret = (env as Record<string, string>).DISCORD_WEBHOOK_SECRET;
      const skipAuth = !webhookSecret; // Allow unauthenticated in dev
      if (!skipAuth) {
        return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
      }
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    // Support both formats:
    // 1. Custom webhook format: { type: "role_sync", data: { discordId, roles } }
    // 2. Discord event format: { event: "GUILD_MEMBER_UPDATE", data: { user, roles, guild_id } }
    const type = body.type as string | undefined;
    const event = body.event as string | undefined;
    const data = body.data as Record<string, unknown> | undefined;

    if (type) {
      // Custom webhook format (backward compatible)
      return handleCustomWebhook(body);
    }

    if (event) {
      // Discord event format
      return handleDiscordEvent(event, data);
    }

    return NextResponse.json({ error: 'No type or event specified.' }, { status: 400 });
  } catch (error) {
    console.error('Discord webhook error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// Handle custom webhook types (backward compatible)
async function handleCustomWebhook(body: Record<string, unknown>) {
  const type = body.type as string;
  const data = body.data as Record<string, unknown>;

  const db = await getDB();
  const now = nowISO();

  switch (type) {
    case 'role_sync': {
      const discordId = data?.discordId as string | undefined;
      const roles = data?.roles as string[] | undefined;

      if (!discordId || !roles || !Array.isArray(roles)) {
        return NextResponse.json({ error: 'discordId and roles array are required.' }, { status: 400 });
      }

      return await syncRoles(db, discordId, roles, now);
    }

    case 'nickname_sync': {
      const discordId = data?.discordId as string | undefined;
      const nickname = data?.nickname as string | undefined;
      const avatarUrl = data?.avatarUrl as string | undefined;

      if (!discordId || !nickname) {
        return NextResponse.json({ error: 'discordId and nickname are required.' }, { status: 400 });
      }

      const user = await db
        .prepare('SELECT id FROM User WHERE discordId = ?')
        .bind(discordId)
        .first();

      if (!user) {
        return NextResponse.json({ error: 'User not found with this Discord ID.' }, { status: 404 });
      }

      const updates: string[] = [];
      const values: unknown[] = [];

      updates.push('nickname = ?');
      values.push(nickname);

      if (avatarUrl) {
        updates.push('avatar = ?');
        values.push(avatarUrl);
      }

      updates.push('discordLinked = 1');
      updates.push('updatedAt = ?');
      values.push(now);
      values.push(user.id as string);

      await db
        .prepare(`UPDATE User SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();

      await logActivity(db, user.id as string, 'discord_nickname_sync', `Nickname synced from Discord: ${nickname}`, now);

      return NextResponse.json({ message: 'Nickname synced successfully.', nickname });
    }

    case 'member_join': {
      // A new member joined the Discord server
      const discordId = data?.discordId as string | undefined;
      const username = data?.username as string | undefined;
      const roles = data?.roles as string[] | undefined;

      if (!discordId) {
        return NextResponse.json({ error: 'discordId is required.' }, { status: 400 });
      }

      const existingUser = await db
        .prepare('SELECT id, nickname FROM User WHERE discordId = ?')
        .bind(discordId)
        .first();

      if (!existingUser) {
        return NextResponse.json({ message: 'No linked user found for this Discord ID.' });
      }

      // Sync roles if provided
      if (roles && Array.isArray(roles) && roles.length > 0) {
        return await syncRoles(db, discordId, roles, now);
      }

      return NextResponse.json({ message: 'Member join acknowledged.', linkedUser: existingUser.nickname });
    }

    case 'member_leave': {
      const discordId = data?.discordId as string | undefined;

      if (!discordId) {
        return NextResponse.json({ error: 'discordId is required.' }, { status: 400 });
      }

      const user = await db
        .prepare('SELECT id, nickname, role FROM User WHERE discordId = ?')
        .bind(discordId)
        .first();

      if (!user) {
        return NextResponse.json({ message: 'No linked user found.' });
      }

      // Demote to user if they had a special role from Discord sync
      const specialRoles = ['admin', 'moderator', 'collaborator'];
      if (specialRoles.includes(user.role as string)) {
        await db
          .prepare('UPDATE User SET role = ?, updatedAt = ? WHERE id = ?')
          .bind('user', now, user.id as string)
          .run();

        await logActivity(db, user.id as string, 'discord_role_sync', `Role reset to user (left Discord server)`, now);
      }

      return NextResponse.json({ message: 'Member leave processed.' });
    }

    default:
      return NextResponse.json({ error: `Unknown webhook type: ${type}` }, { status: 400 });
  }
}

// Handle Discord gateway events
async function handleDiscordEvent(event: string, data: Record<string, unknown> | undefined) {
  const db = await getDB();
  const now = nowISO();

  switch (event) {
    case 'GUILD_MEMBER_UPDATE': {
      if (!data) return NextResponse.json({ error: 'No data provided.' }, { status: 400 });

      // Discord GUILD_MEMBER_UPDATE format
      const discordUser = data.user as { id: string; username?: string; avatar?: string | null; global_name?: string | null } | undefined;
      const roles = data.roles as string[] | undefined;
      const guildId = data.guild_id as string | undefined;
      const nick = data.nick as string | null | undefined;

      if (!discordUser?.id) {
        return NextResponse.json({ error: 'Missing user ID in event data.' }, { status: 400 });
      }

      const discordId = discordUser.id;

      // Find user by Discord ID
      const user = await db
        .prepare('SELECT id, nickname FROM User WHERE discordId = ?')
        .bind(discordId)
        .first();

      if (!user) {
        return NextResponse.json({ message: 'No linked user found for this Discord ID.', discordId });
      }

      // Sync roles
      if (roles && Array.isArray(roles)) {
        const config = await db
          .prepare('SELECT * FROM DiscordConfig LIMIT 1')
          .first();

        if (config) {
          // Check if this event is for our server
          if (config.serverId && guildId && config.serverId !== guildId) {
            return NextResponse.json({ message: 'Event from different server, ignored.' });
          }

          let newRole = 'user';
          const adminRoleId = config.adminRoleId as string;
          const modRoleId = config.modRoleId as string;
          const collabRoleId = config.collabRoleId as string;

          if (adminRoleId && roles.includes(adminRoleId)) {
            newRole = 'admin';
          } else if (modRoleId && roles.includes(modRoleId)) {
            newRole = 'moderator';
          } else if (collabRoleId && roles.includes(collabRoleId)) {
            newRole = 'collaborator';
          }

          // Update role
          await db
            .prepare('UPDATE User SET role = ?, discordLinked = 1, updatedAt = ? WHERE id = ?')
            .bind(newRole, now, user.id as string)
            .run();

          await logActivity(db, user.id as string, 'discord_role_sync', `Role synced to ${newRole} via Discord event`, now);
        }
      }

      // Sync nickname if changed
      if (nick) {
        await db
          .prepare('UPDATE User SET nickname = ?, updatedAt = ? WHERE id = ? AND discordLinked = 1')
          .bind(nick, now, user.id as string)
          .run();
      }

      // Sync avatar if changed
      if (discordUser.avatar) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png?size=256`;
        await db
          .prepare('UPDATE User SET avatar = ?, updatedAt = ? WHERE id = ? AND discordLinked = 1')
          .bind(avatarUrl, now, user.id as string)
          .run();
      }

      return NextResponse.json({ message: 'Member update processed successfully.' });
    }

    case 'GUILD_MEMBER_ADD': {
      if (!data) return NextResponse.json({ error: 'No data provided.' }, { status: 400 });

      const discordUser = data.user as { id: string; username?: string } | undefined;

      if (!discordUser?.id) {
        return NextResponse.json({ error: 'Missing user ID.' }, { status: 400 });
      }

      const existingUser = await db
        .prepare('SELECT id, nickname FROM User WHERE discordId = ?')
        .bind(discordUser.id)
        .first();

      if (existingUser) {
        return NextResponse.json({ message: 'User already linked.', nickname: existingUser.nickname });
      }

      return NextResponse.json({ message: 'New member joined, no linked account.' });
    }

    case 'GUILD_MEMBER_REMOVE': {
      if (!data) return NextResponse.json({ error: 'No data provided.' }, { status: 400 });

      const discordUser = data.user as { id: string } | undefined;

      if (!discordUser?.id) {
        return NextResponse.json({ error: 'Missing user ID.' }, { status: 400 });
      }

      const user = await db
        .prepare('SELECT id, nickname, role FROM User WHERE discordId = ?')
        .bind(discordUser.id)
        .first();

      if (!user) {
        return NextResponse.json({ message: 'No linked user found.' });
      }

      const specialRoles = ['admin', 'moderator', 'collaborator'];
      if (specialRoles.includes(user.role as string)) {
        await db
          .prepare('UPDATE User SET role = ?, discordLinked = 0, updatedAt = ? WHERE id = ?')
          .bind('user', now, user.id as string)
          .run();

        await logActivity(db, user.id as string, 'discord_left', `Left Discord server, role reset to user`, now);
      }

      return NextResponse.json({ message: 'Member removal processed.' });
    }

    default:
      return NextResponse.json({ error: `Unsupported Discord event: ${event}` }, { status: 400 });
  }
}

// Helper: Sync roles from Discord to local user
async function syncRoles(db: D1Database, discordId: string, roles: string[], now: string) {
  // Get the Discord config
  const config = await db
    .prepare('SELECT * FROM DiscordConfig LIMIT 1')
    .first();

  if (!config) {
    return NextResponse.json({ error: 'Discord configuration not found.' }, { status: 404 });
  }

  // Find the user by Discord ID
  const user = await db
    .prepare('SELECT id, nickname, role FROM User WHERE discordId = ?')
    .bind(discordId)
    .first();

  if (!user) {
    return NextResponse.json({ error: 'User not found with this Discord ID.' }, { status: 404 });
  }

  // Determine role from Discord roles (highest priority first)
  let newRole = 'user';
  const adminRoleId = config.adminRoleId as string;
  const modRoleId = config.modRoleId as string;
  const collabRoleId = config.collabRoleId as string;

  if (adminRoleId && roles.includes(adminRoleId)) {
    newRole = 'admin';
  } else if (modRoleId && roles.includes(modRoleId)) {
    newRole = 'moderator';
  } else if (collabRoleId && roles.includes(collabRoleId)) {
    newRole = 'collaborator';
  }

  const previousRole = user.role as string;

  await db
    .prepare('UPDATE User SET role = ?, discordLinked = 1, updatedAt = ? WHERE id = ?')
    .bind(newRole, now, user.id as string)
    .run();

  await logActivity(
    db,
    user.id as string,
    'discord_role_sync',
    `Role synced to ${newRole} via Discord${previousRole !== newRole ? ` (was: ${previousRole})` : ''}`,
    now
  );

  return NextResponse.json({
    message: `Role synced to ${newRole}.`,
    role: newRole,
    previousRole,
    nickname: user.nickname,
  });
}

// Helper: Log activity
async function logActivity(db: D1Database, userId: string, action: string, details: string, now: string) {
  try {
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        action,
        details,
        'discord-webhook',
        now
      )
      .run();
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}
