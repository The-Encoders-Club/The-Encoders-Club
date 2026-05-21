// ============================================================
// Discord Notification Utility - Send messages via Webhook URL
// Uses webhookUrl passed as parameter (avoids duplicate getDB calls)
// ============================================================

import { getDB } from './db';

interface DiscordMessagePayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  author?: { name: string; icon_url?: string };
  footer?: { text: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  image?: { url: string };
}

// Send a message to Discord via Webhook URL
// If webhookUrl is provided, use it directly. Otherwise, read from DB.
export async function sendDiscordMessage(
  payload: DiscordMessagePayload,
  webhookUrl?: string | null
): Promise<boolean> {
  try {
    let url = webhookUrl || null;

    // If no URL provided, read from DB
    if (!url) {
      try {
        const db = await getDB();
        const config = await db
          .prepare('SELECT webhookUrl FROM DiscordConfig LIMIT 1')
          .first();

        if (!config) {
          console.error('[Discord Notif] No DiscordConfig row found in database.');
          return false;
        }

        url = config.webhookUrl as string | null;
      } catch (dbErr) {
        console.error('[Discord Notif] Error reading webhookUrl from DB:', dbErr);
        return false;
      }
    }

    if (!url) {
      console.error('[Discord Notif] webhookUrl is empty or not configured.');
      return false;
    }

    console.log('[Discord Notif] Sending message to webhook:', url.substring(0, 60) + '...');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Discord Notif] Webhook request failed:', response.status, errorText);
      return false;
    }

    const responseText = await response.text();
    console.log('[Discord Notif] Message sent successfully! Response:', responseText.substring(0, 100));
    return true;
  } catch (error) {
    console.error('[Discord Notif] Exception in sendDiscordMessage:', error);
    return false;
  }
}

// Read the webhook URL and notificationEnabled flag from DB
export async function getDiscordNotificationConfig(): Promise<{ webhookUrl: string | null; enabled: boolean }> {
  try {
    const db = await getDB();

    // Try with notificationEnabled column first
    const config = await db
      .prepare('SELECT webhookUrl, notificationEnabled FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      console.log('[Discord Notif] No DiscordConfig row found.');
      return { webhookUrl: null, enabled: false };
    }

    const webhookUrl = config.webhookUrl as string | null;
    // notificationEnabled might not exist as column — handle gracefully
    const enabled = config.notificationEnabled !== undefined
      && config.notificationEnabled !== 0
      && config.notificationEnabled !== null;

    return { webhookUrl, enabled };
  } catch (error) {
    // If column doesn't exist, fallback to just checking webhookUrl
    console.warn('[Discord Notif] getDiscordNotificationConfig fallback:', error);
    try {
      const db = await getDB();
      const config = await db
        .prepare('SELECT webhookUrl FROM DiscordConfig LIMIT 1')
        .first();
      return { webhookUrl: (config?.webhookUrl as string) || null, enabled: true };
    } catch {
      return { webhookUrl: null, enabled: false };
    }
  }
}

// Send a notification when a new comment is created
export async function notifyNewComment(params: {
  projectName: string;
  projectId: string;
  authorNickname: string;
  authorAvatar?: string | null;
  authorRole?: string;
  content: string;
  siteUrl?: string;
  isReply?: boolean;
  parentAuthor?: string;
}): Promise<boolean> {
  const {
    projectName, projectId, authorNickname, authorAvatar,
    authorRole, content, siteUrl, isReply, parentAuthor,
  } = params;

  const base = siteUrl || 'https://tu-dominio.pages.dev';
  const projectUrl = `${base}/proyectos/${projectId}`;

  // Truncate content for Discord (max 4096 chars for embed description)
  const truncatedContent = content.length > 500
    ? content.substring(0, 500) + '...'
    : content;

  // Role colors for the embed
  const roleColors: Record<string, number> = {
    owner: 0xFFD700,     // Gold
    admin: 0xFF0000,     // Red
    moderator: 0x4D9FFF, // Blue
    collaborator: 0x22C55E, // Green
  };
  const embedColor = roleColors[authorRole || ''] || 0x5865F2; // Default Discord blurple

  const titlePrefix = isReply ? '💬 Respuesta en' : '💬 Nuevo comentario en';
  const description = isReply && parentAuthor
    ? `**${authorNickname}** respondió a **${parentAuthor}**:\n> ${truncatedContent}`
    : `**${authorNickname}** comentó:\n> ${truncatedContent}`;

  const embed: DiscordEmbed = {
    title: `${titlePrefix} ${projectName}`,
    description,
    url: projectUrl,
    color: embedColor,
    timestamp: new Date().toISOString(),
    footer: { text: 'The Encoders Club' },
  };

  if (authorAvatar) {
    embed.author = { name: authorNickname, icon_url: authorAvatar };
  }

  return sendDiscordMessage({
    username: 'The Encoders Club',
    embeds: [embed],
  });
}

// Send a notification when a new user registers
export async function notifyNewUser(params: {
  nickname: string;
  avatar?: string | null;
  siteUrl?: string;
}): Promise<boolean> {
  const { nickname, avatar, siteUrl } = params;

  const embed: DiscordEmbed = {
    title: '🆕 Nuevo registro',
    description: `**${nickname}** se ha unido a The Encoders Club.`,
    color: 0x22C55E,
    timestamp: new Date().toISOString(),
    footer: { text: 'The Encoders Club' },
  };

  if (avatar) {
    embed.author = { name: nickname, icon_url: avatar };
  }

  return sendDiscordMessage({
    username: 'The Encoders Club',
    embeds: [embed],
  });
}
