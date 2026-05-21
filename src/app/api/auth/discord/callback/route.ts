import { NextRequest, NextResponse } from 'next/server';
import { getDB, nowISO, generateId } from '@/lib/db';
import { getSession } from '@/lib/session';

// GET: Handle Discord OAuth2 callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=missing_params`);
    }

    // Validate state (contains userId)
    const [userId] = state.split(':');
    if (!userId) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=invalid_state`);
    }

    const db = await getDB();

    // Verify user exists
    const user = await db
      .prepare('SELECT id, nickname, avatar, role FROM User WHERE id = ?')
      .bind(userId)
      .first();

    if (!user) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=user_not_found`);
    }

    // Check if already linked
    if (user.discordId) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=already_linked`);
    }

    // Get Discord config
    const config = await db
      .prepare('SELECT * FROM DiscordConfig LIMIT 1')
      .first();

    if (!config || !config.discordClientId || !config.discordClientSecret) {
      return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=oauth_not_configured`);
    }

    const clientId = config.discordClientId as string;
    const clientSecret = config.discordClientSecret as string;
    const siteUrl = process.env.SITE_URL || config.siteUrl || 'http://localhost:3000';
    const redirectUri = `${siteUrl}/api/auth/discord/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Discord token exchange failed:', tokenError);
      return NextResponse.redirect(`${siteUrl}/perfil?discord_error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json() as { access_token: string; token_type: string; expires_in: number; refresh_token: string; scope: string };

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${siteUrl}/perfil?discord_error=user_fetch_failed`);
    }

    const discordUser = await userResponse.json() as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      global_name: string | null;
    };

    // Check if this Discord ID is already linked to another account
    const existingLink = await db
      .prepare('SELECT id, nickname FROM User WHERE discordId = ?')
      .bind(discordUser.id)
      .first();

    if (existingLink) {
      return NextResponse.redirect(`${siteUrl}/perfil?discord_error=discord_already_linked`);
    }

    // Construct avatar URL if available
    const discordAvatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
      : null;

    const now = nowISO();

    // Update user with Discord info
    await db
      .prepare('UPDATE User SET discordId = ?, discordLinked = 1, discordAccessToken = ?, discordRefreshToken = ?, updatedAt = ? WHERE id = ?')
      .bind(
        discordUser.id,
        discordAvatar || user.avatar, // keep existing avatar if Discord has none
        tokenData.access_token,
        tokenData.refresh_token,
        now,
        userId
      )
      .run();

    // Try to sync roles from the Discord server
    let syncedRole: string | null = null;
    if (config.serverId && config.adminRoleId && config.modRoleId && config.collabRoleId) {
      try {
        const memberResponse = await fetch(
          `https://discord.com/api/guilds/${config.serverId}/members/${discordUser.id}`,
          { headers: { Authorization: `Bot ${config.botToken}` } }
        );

        if (memberResponse.ok) {
          const member = await memberResponse.json() as { roles: string[] };
          const roles = member.roles || [];
          const adminRoleId = config.adminRoleId as string;
          const modRoleId = config.modRoleId as string;
          const collabRoleId = config.collabRoleId as string;

          if (adminRoleId && roles.includes(adminRoleId)) {
            syncedRole = 'admin';
          } else if (modRoleId && roles.includes(modRoleId)) {
            syncedRole = 'moderator';
          } else if (collabRoleId && roles.includes(collabRoleId)) {
            syncedRole = 'collaborator';
          }

          if (syncedRole) {
            await db
              .prepare('UPDATE User SET role = ?, updatedAt = ? WHERE id = ?')
              .bind(syncedRole, now, userId)
              .run();
          }
        }
      } catch (err) {
        console.error('Failed to sync roles during link:', err);
        // Non-critical: link succeeds even if role sync fails
      }
    }

    // Log activity
    await db
      .prepare('INSERT INTO ActivityLog (id, userId, action, details, ipAddress, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        'discord_linked',
        `Discord account linked: ${discordUser.username}#${discordUser.discriminator}${syncedRole ? ` (role synced: ${syncedRole})` : ''}`,
        request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'discord-oauth',
        now
      )
      .run();

    // Create notification
    await db
      .prepare('INSERT INTO Notification (id, userId, type, title, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(
        `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId,
        'discord_linked',
        'Discord vinculado',
        `Tu cuenta de Discord (${discordUser.global_name || discordUser.username}) ha sido vinculada correctamente.${syncedRole ? ` Tu rol se ha sincronizado a: ${syncedRole}` : ''}`,
        now
      )
      .run();

    const redirectMsg = syncedRole
      ? `discord_success&role=${encodeURIComponent(syncedRole)}`
      : 'discord_success';

    return NextResponse.redirect(`${siteUrl}/perfil?${redirectMsg}`);
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/perfil?discord_error=internal_error`);
  }
}
