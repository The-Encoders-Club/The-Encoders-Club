export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages/worker';
import { getDb } from '@/lib/db';

// This endpoint receives webhook notifications from Discord bot
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    const { env } = getRequestContext();
    const db = getDb(env.DB);
    
    if (type === 'role_sync') {
      const { discordId, roles } = data;
      const user = await db.user.findUnique({ where: { discordId } });
      if (user) {
        const config = await db.discordConfig.findFirst();
        if (config) {
          let newRole = 'user';
          if (roles.includes(config.adminRoleId)) newRole = 'admin';
          else if (roles.includes(config.modRoleId)) newRole = 'moderator';
          else if (roles.includes(config.collabRoleId)) newRole = 'collaborator';
          
          if (user.role !== newRole) {
            await db.user.update({ where: { id: user.id }, data: { role: newRole } });
            await db.activityLog.create({
              data: {
                userId: user.id,
                action: 'discord_role_sync',
                details: JSON.stringify({ oldRole: user.role, newRole, discordRoles: roles }),
              },
            });
          }
        }
      }
    }
    
    if (type === 'nickname_sync') {
      const { discordId, nickname, avatar } = data;
      const user = await db.user.findUnique({ where: { discordId } });
      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: {
            ...(nickname ? { nickname } : {}),
            ...(avatar ? { avatar } : {}),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
