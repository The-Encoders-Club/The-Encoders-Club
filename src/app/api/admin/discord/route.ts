import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'owner'].includes(session.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const db = createDb();
    let config = await db.discordConfig.findFirst();
    if (!config) {
      config = await db.discordConfig.create({ data: {} });
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
    
    const db = createDb();
    let config = await db.discordConfig.findFirst();
    
    if (config) {
      await db.discordConfig.update({
        where: { id: config.id },
        data: {
          ...(botToken !== undefined ? { botToken } : {}),
          ...(serverId !== undefined ? { serverId } : {}),
          ...(channelId !== undefined ? { channelId } : {}),
          ...(webhookUrl !== undefined ? { webhookUrl } : {}),
          ...(modRoleId !== undefined ? { modRoleId } : {}),
          ...(adminRoleId !== undefined ? { adminRoleId } : {}),
          ...(collabRoleId !== undefined ? { collabRoleId } : {}),
        },
      });
    } else {
      await db.discordConfig.create({
        data: { botToken, serverId, channelId, webhookUrl, modRoleId, adminRoleId, collabRoleId },
      });
    }

    await db.activityLog.create({
      data: {
        userId: session.id,
        action: 'discord_config_update',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
