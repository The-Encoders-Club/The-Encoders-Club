import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDB } from '@/lib/db';

// GET: Check Discord integration status (admin+ only)
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
      .prepare('SELECT botToken, serverId, webhookUrl, adminRoleId, modRoleId, collabRoleId, discordClientId, discordClientSecret FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      return NextResponse.json({
        connected: false,
        configured: false,
        botUsername: null,
        botAvatar: null,
        linkedUsers: 0,
        server: { name: null, memberCount: null },
        roleConfig: { hasAdminRole: false, hasModRole: false, hasCollabRole: false },
        hasClientId: false,
        hasClientSecret: false,
        hasWebhookUrl: false,
        message: 'Discord no esta configurado. Configura el Webhook URL y los roles.',
      });
    }

    const hasWebhookUrl = !!config.webhookUrl;
    const hasBotToken = !!config.botToken;
    const hasServerId = !!config.serverId;
    const hasAdminRole = !!config.adminRoleId;
    const hasModRole = !!config.modRoleId;
    const hasCollabRole = !!config.collabRoleId;
    const hasClientId = !!config.discordClientId;
    const hasClientSecret = !!config.discordClientSecret;

    // Get linked user count
    const linkedCount = await db
      .prepare('SELECT COUNT(*) as count FROM User WHERE discordLinked = 1')
      .first();

    // If no bot token, return webhook-only status
    if (!hasBotToken) {
      return NextResponse.json({
        connected: false,
        configured: hasWebhookUrl,
        botUsername: null,
        botAvatar: null,
        linkedUsers: (linkedCount?.count as number) || 0,
        server: { name: null, memberCount: null },
        roleConfig: { hasAdminRole, hasModRole, hasCollabRole },
        hasClientId,
        hasClientSecret,
        hasWebhookUrl,
        message: hasWebhookUrl
          ? 'Webhook configurado. El Bot no esta configurado (las notificaciones de comentarios funcionan, pero la sincronizacion de roles requiere un Bot Token en la base de datos).'
          : 'Webhook no configurado. Configura el Webhook URL para recibir notificaciones.',
      });
    }

    // Bot token exists — try to connect
    try {
      const botResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bot ${config.botToken}` },
      });

      if (!botResponse.ok) {
        const errStatus = botResponse.status;
        let message = 'No se pudo conectar a Discord.';
        if (errStatus === 401) message = 'Token de bot invalido.';
        else if (errStatus === 429) message = 'Rate limited por Discord. Intenta mas tarde.';

        return NextResponse.json({
          connected: false,
          configured: true,
          botUsername: null,
          botAvatar: null,
          linkedUsers: (linkedCount?.count as number) || 0,
          server: { name: null, memberCount: null },
          roleConfig: { hasAdminRole, hasModRole, hasCollabRole },
          hasClientId,
          hasClientSecret,
          hasWebhookUrl,
          message,
        });
      }

      const botData = await botResponse.json() as {
        id: string;
        username: string;
        discriminator: string;
        avatar: string | null;
        bot: boolean;
      };

      const avatarUrl = botData.avatar
        ? `https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png?size=128`
        : null;

      // Get server info if server ID is set
      let serverInfo: { name: string | null; memberCount: number | null } = { name: null, memberCount: null };
      if (hasServerId) {
        try {
          const guildResponse = await fetch(
            `https://discord.com/api/guilds/${config.serverId}?with_counts=true`,
            { headers: { Authorization: `Bot ${config.botToken}` } }
          );
          if (guildResponse.ok) {
            const guild = await guildResponse.json() as { name: string; approximate_member_count: number };
            serverInfo = { name: guild.name, memberCount: guild.approximate_member_count };
          }
        } catch {
          // Non-critical
        }
      }

      return NextResponse.json({
        connected: true,
        configured: true,
        botUsername: botData.username,
        botAvatar: avatarUrl,
        botId: botData.id,
        isBot: botData.bot,
        linkedUsers: (linkedCount?.count as number) || 0,
        server: serverInfo,
        roleConfig: { hasAdminRole, hasModRole, hasCollabRole },
        hasClientId,
        hasClientSecret,
        hasWebhookUrl,
        message: hasWebhookUrl ? 'Bot conectado y Webhook configurado.' : 'Bot conectado, pero el Webhook URL no esta configurado.',
      });
    } catch (err) {
      return NextResponse.json({
        connected: false,
        configured: true,
        botUsername: null,
        botAvatar: null,
        linkedUsers: (linkedCount?.count as number) || 0,
        server: { name: null, memberCount: null },
        roleConfig: { hasAdminRole, hasModRole, hasCollabRole },
        hasClientId,
        hasClientSecret,
        hasWebhookUrl,
        message: 'No se pudo conectar con la API de Discord.',
      });
    }
  } catch (error) {
    console.error('Discord status error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
