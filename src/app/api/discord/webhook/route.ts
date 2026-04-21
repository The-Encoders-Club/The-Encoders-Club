import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { users, discordConfigs, activityLogs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/auth';

// This endpoint receives webhook notifications from Discord bot
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);

    if (type === 'role_sync') {
      const { discordId, roles } = data;
      const userResults = await db.select().from(users).where(eq(users.discordId, discordId)).limit(1);
      const user = userResults[0];
      if (user) {
        const configResults = await db.select().from(discordConfigs).limit(1);
        const config = configResults[0];
        if (config) {
          let newRole = 'user';
          if (roles.includes(config.adminRoleId)) newRole = 'admin';
          else if (roles.includes(config.modRoleId)) newRole = 'moderator';
          else if (roles.includes(config.collabRoleId)) newRole = 'collaborator';
          
          if (user.role !== newRole) {
            const now = new Date().toISOString();
            await db.update(users).set({ role: newRole, updatedAt: now }).where(eq(users.id, user.id));
            await db.insert(activityLogs).values({
              id: generateId(),
              userId: user.id,
              action: 'discord_role_sync',
              details: JSON.stringify({ oldRole: user.role, newRole, discordRoles: roles }),
              createdAt: now,
            });
          }
        }
      }
    }
    
    if (type === 'nickname_sync') {
      const { discordId, nickname, avatar } = data;
      const userResults = await db.select().from(users).where(eq(users.discordId, discordId)).limit(1);
      const user = userResults[0];
      if (user) {
        const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
        if (nickname) updateData.nickname = nickname;
        if (avatar) updateData.avatar = avatar;
        await db.update(users).set(updateData).where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
