import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, fromBool } from '@/lib/db';

// POST: Handle Discord webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { type, data } = body as { type: string; data: Record<string, unknown> };

    if (!type) {
      return NextResponse.json({ error: 'Webhook type is required.' }, { status: 400 });
    }

    const db = await getDB();
    const now = nowISO();

    switch (type) {
      case 'role_sync': {
        const discordId = data?.discordId as string | undefined;
        const roles = data?.roles as string[] | undefined;

        if (!discordId || !roles || !Array.isArray(roles)) {
          return NextResponse.json({ error: 'discordId and roles array are required for role_sync.' }, { status: 400 });
        }

        // Get the Discord config to check role mappings
        const config = await db
          .prepare('SELECT * FROM DiscordConfig LIMIT 1')
          .first();

        if (!config) {
          return NextResponse.json({ error: 'Discord configuration not found.' }, { status: 404 });
        }

        // Find the user by Discord ID
        const user = await db
          .prepare('SELECT id FROM User WHERE discordId = ?')
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

        await db
          .prepare('UPDATE User SET role = ?, discordLinked = 1, updatedAt = ? WHERE id = ?')
          .bind(newRole, now, user.id as string)
          .run();

        // Log activity
        await db
          .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(
            `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            user.id as string,
            'discord_role_sync',
            `Role synced to ${newRole} via Discord`,
            'discord-webhook',
            now
          )
          .run();

        return NextResponse.json({ message: `Role synced to ${newRole}.`, role: newRole });
      }

      case 'nickname_sync': {
        const discordId = data?.discordId as string | undefined;
        const nickname = data?.nickname as string | undefined;
        const avatarUrl = data?.avatarUrl as string | undefined;

        if (!discordId || !nickname) {
          return NextResponse.json({ error: 'discordId and nickname are required for nickname_sync.' }, { status: 400 });
        }

        const user = await db
          .prepare('SELECT id, nickname FROM User WHERE discordId = ?')
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

        // Log activity
        await db
          .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(
            `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            user.id as string,
            'discord_nickname_sync',
            `Nickname/avatar synced from Discord: ${nickname}`,
            'discord-webhook',
            now
          )
          .run();

        return NextResponse.json({ message: 'Nickname synced successfully.', nickname });
      }

      default:
        return NextResponse.json({ error: `Unknown webhook type: ${type}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Discord webhook error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
