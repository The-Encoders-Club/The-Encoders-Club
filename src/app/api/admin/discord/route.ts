import { NextRequest, NextResponse } from 'next/server';
import { getD1, getDb } from '@/lib/db';
import { discordConfigs, activityLogs } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { generateId } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const d1 = getD1();
    const db = getDb(d1);

    let configResults = await db.select().from(discordConfigs).limit(1);
    let config = configResults[0];

    if (!config) {
      const now = new Date().toISOString();
      config = await db.insert(discordConfigs).values({
        id: generateId(),
        botToken: null,
        serverId: null,
        channelId: null,
        webhookUrl: null,
        modRoleId: null,
        adminRoleId: null,
        collabRoleId: null,
        createdAt: now,
        updatedAt: now,
      }).returning().get();
    }

    // Mask sensitive data
    return NextResponse.json({
      config: {
        id: config.id,
        serverId: config.serverId,
        channelId: config.channelId,
        webhookUrl: config.webhookUrl ? config.webhookUrl.substring(0, 20) + '...' : null,
        modRoleId: config.modRoleId,
        adminRoleId: config.adminRoleId,
        collabRoleId: config.collabRoleId,
        hasBotToken: !!config.botToken,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { botToken, serverId, channelId, webhookUrl, modRoleId, adminRoleId, collabRoleId } = await request.json();
    
    const d1 = getD1();
    const db = getDb(d1);
    const now = new Date().toISOString();

    let configResults = await db.select().from(discordConfigs).limit(1);
    const config = configResults[0];
    
    if (config) {
      const updateData: Record<string, any> = { updatedAt: now };
      if (botToken !== undefined) updateData.botToken = botToken;
      if (serverId !== undefined) updateData.serverId = serverId;
      if (channelId !== undefined) updateData.channelId = channelId;
      if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
      if (modRoleId !== undefined) updateData.modRoleId = modRoleId;
      if (adminRoleId !== undefined) updateData.adminRoleId = adminRoleId;
      if (collabRoleId !== undefined) updateData.collabRoleId = collabRoleId;

      await db.update(discordConfigs).set(updateData).where(eq(discordConfigs.id, config.id));
    } else {
      await db.insert(discordConfigs).values({
        id: generateId(),
        botToken: botToken || null,
        serverId: serverId || null,
        channelId: channelId || null,
        webhookUrl: webhookUrl || null,
        modRoleId: modRoleId || null,
        adminRoleId: adminRoleId || null,
        collabRoleId: collabRoleId || null,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Log activity
    await db.insert(activityLogs).values({
      id: generateId(),
      userId: session.id,
      action: 'discord_config_update',
      createdAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
