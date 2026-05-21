import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDB } from '@/lib/db';

// GET: Check Discord bot connection status (admin+ only)
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
      return NextResponse.json({
        connected: false,
        configured: false,
        botUsername: null,
        botAvatar: null,
        message: 'Discord is not configured. Please set up the bot in the Discord settings tab.',
      });
    }

    if (!config.botToken) {
      return NextResponse.json({
        connected: false,
        configured: false,
        botUsername: null,
        botAvatar: null,
        message: 'Bot token is not set.',
      });
    }

    // Try to get bot info from Discord API
    try {
      const botResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bot ${config.botToken}` },
      });

      if (!botResponse.ok) {
        const errStatus = botResponse.status;
        let message = 'Failed to connect to Discord.';
        if (errStatus === 401) message = 'Invalid bot token. Please check your bot token.';
        else if (errStatus === 429) message = 'Rate limited by Discord. Try again later.';
        else if (errStatus === 0) message = 'Network error connecting to Discord.';

        return NextResponse.json({
          connected: false,
          configured: true,
          botUsername: null,
          botAvatar: null,
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

      // Get linked user count
      const linkedCount = await db
        .prepare('SELECT COUNT(*) as count FROM User WHERE discordLinked = 1')
        .first();

      // Check server info if server ID is set
      let serverInfo: { name: string | null; memberCount: number | null } = { name: null, memberCount: null };
      if (config.serverId) {
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
        roleConfig: {
          hasAdminRole: !!config.adminRoleId,
          hasModRole: !!config.modRoleId,
          hasCollabRole: !!config.collabRoleId,
        },
        hasClientId: !!config.discordClientId,
        hasClientSecret: !!config.discordClientSecret,
        message: 'Bot is connected and working.',
      });
    } catch (err) {
      return NextResponse.json({
        connected: false,
        configured: true,
        botUsername: null,
        botAvatar: null,
        message: 'Could not reach Discord API. Check your network or token.',
      });
    }
  } catch (error) {
    console.error('Discord status error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
