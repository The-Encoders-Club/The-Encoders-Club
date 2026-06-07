import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDB, nowISO } from '@/lib/db';

// POST: Push roles from local DB to Discord (admin+ only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const body = await request.json() as Record<string, unknown>;
    const targetUserId = body.userId as string | undefined;
    const syncAll = body.syncAll as boolean | undefined;

    const db = await getDB();

    // Get Discord config
    const config = await db
      .prepare('SELECT botToken, serverId, adminRoleId, modRoleId, collabRoleId FROM DiscordConfig LIMIT 1')
      .first();

    if (!config || !config.botToken || !config.serverId) {
      return NextResponse.json({
        error: 'Para sincronizar roles necesitas configurar el Bot Token y Server ID en la base de datos directamente (no estan disponibles en el panel). Consulta la documentacion de Discord Developers.',
      }, { status: 400 });
    }

    const botToken = config.botToken as string;
    const serverId = config.serverId as string;
    const adminRoleId = config.adminRoleId as string | null;
    const modRoleId = config.modRoleId as string | null;
    const collabRoleId = config.collabRoleId as string | null;

    if (!adminRoleId && !modRoleId && !collabRoleId) {
      return NextResponse.json({ error: 'No Discord role IDs configured. Set at least one role ID in the Discord config.' }, { status: 400 });
    }

    const roleMap: Record<string, string[]> = {
      admin: adminRoleId ? [adminRoleId] : [],
      moderator: modRoleId ? [modRoleId] : [],
      collaborator: collabRoleId ? [collabRoleId] : [],
    };

    // Also assign lower roles (admin gets mod + collab, mod gets collab)
    if (adminRoleId && modRoleId) roleMap.admin.push(modRoleId);
    if (adminRoleId && collabRoleId) roleMap.admin.push(collabRoleId);
    if (modRoleId && collabRoleId) roleMap.moderator.push(collabRoleId);

    const allDiscordRoles = [adminRoleId, modRoleId, collabRoleId].filter(Boolean) as string[];
    let syncedCount = 0;
    let errorCount = 0;
    const results: { userId: string; nickname: string; status: string; message: string }[] = [];

    const getUsers = async () => {
      if (targetUserId) {
        const u = await db.prepare('SELECT id, nickname, role, discordId FROM User WHERE id = ? AND discordId IS NOT NULL').bind(targetUserId).first();
        return u ? [u] : [];
      }
      if (syncAll) {
        return await db.prepare('SELECT id, nickname, role, discordId FROM User WHERE discordId IS NOT NULL AND discordLinked = 1').all();
      }
      // Default: sync users with special roles
      return await db.prepare("SELECT id, nickname, role, discordId FROM User WHERE discordId IS NOT NULL AND role IN ('admin', 'moderator', 'collaborator')").all();
    };

    const users = await getUsers();
    const userList = Array.isArray(users) ? users : (users as { results: unknown[] }).results || [];

    if (userList.length === 0) {
      return NextResponse.json({
        message: 'No hay usuarios vinculados a Discord para sincronizar.',
        synced: 0,
        errors: 0,
        total: 0,
        results: [],
      });
    }

    for (const u of userList) {
      const user = u as { id: string; nickname: string; role: string; discordId: string };
      const targetRole = user.role as string;
      const rolesToAdd = roleMap[targetRole] || [];

      try {
        // Get current Discord member roles
        const memberRes = await fetch(
          `https://discord.com/api/guilds/${serverId}/members/${user.discordId}`,
          { headers: { Authorization: `Bot ${botToken}` } }
        );

        if (!memberRes.ok) {
          results.push({ userId: user.id, nickname: user.nickname, status: 'error', message: `Failed to fetch member (HTTP ${memberRes.status})` });
          errorCount++;
          continue;
        }

        const member = await memberRes.json() as { roles: string[]; user: { username: string } };
        const currentRoles = (member.roles || []).filter((r: string) => !allDiscordRoles.includes(r));

        // Build new role set: keep non-synced roles + add mapped roles
        const newRoles = [...new Set([...currentRoles, ...rolesToAdd])];

        // Update member roles via Discord API
        const updateRes = await fetch(
          `https://discord.com/api/guilds/${serverId}/members/${user.discordId}/roles`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bot ${botToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roles: newRoles }),
          }
        );

        if (updateRes.ok) {
          syncedCount++;
          results.push({ userId: user.id, nickname: user.nickname, status: 'success', message: `Roles pushed: [${rolesToAdd.join(', ')}]` });
        } else {
          const errText = await updateRes.text();
          results.push({ userId: user.id, nickname: user.nickname, status: 'error', message: `Discord API error: ${errText}` });
          errorCount++;
        }
      } catch (err) {
        results.push({ userId: user.id, nickname: user.nickname, status: 'error', message: `Network error` });
        errorCount++;
      }
    }

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        session.id,
        'discord_role_push',
        `Pushed roles to Discord: ${syncedCount} synced, ${errorCount} errors`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
        nowISO()
      )
      .run();

    return NextResponse.json({
      message: 'Role synchronization completed.',
      synced: syncedCount,
      errors: errorCount,
      total: userList.length,
      results,
    });
  } catch (error) {
    console.error('Discord sync push error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
