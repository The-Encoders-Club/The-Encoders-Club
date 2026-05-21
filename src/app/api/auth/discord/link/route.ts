import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getDB } from '@/lib/db';

// GET: Initiate Discord OAuth2 link flow
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const db = await getDB();

    // Check if user already has Discord linked
    const user = await db
      .prepare('SELECT discordId, discordLinked FROM User WHERE id = ?')
      .bind(session.id)
      .first();

    if (user && user.discordId) {
      return NextResponse.json({ error: 'Discord account is already linked.' }, { status: 400 });
    }

    // Get Discord config for client ID
    const config = await db
      .prepare('SELECT * FROM DiscordConfig LIMIT 1')
      .first();

    if (!config || !config.botToken) {
      return NextResponse.json({ error: 'Discord integration is not configured by the administrator.' }, { status: 503 });
    }

    // We need the Discord Application Client ID (different from bot token)
    // The admin must configure this in the DiscordConfig
    if (!config.discordClientId) {
      return NextResponse.json({ error: 'Discord Client ID is not configured. Admin needs to set up OAuth2 credentials.' }, { status: 503 });
    }

    const clientId = config.discordClientId as string;
    const siteUrl = process.env.SITE_URL || config.siteUrl || 'http://localhost:3000';
    const redirectUri = `${siteUrl}/api/auth/discord/callback`;

    // Discord OAuth2 scopes:
    // identify - get user info (avatar, username, id)
    // guilds.members.read - read guild member info (roles)
    const scopes = 'identify guilds.members.read';
    const state = `${session.id}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;

    return NextResponse.json({ url: discordAuthUrl });
  } catch (error) {
    console.error('Discord link error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
