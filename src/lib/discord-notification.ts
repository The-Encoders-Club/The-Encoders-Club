// ============================================================
// Discord Notification Utility - Send messages via Webhook URL
// Uses webhookUrl from DiscordConfig (NOT Bot API)
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

// Send a message to Discord via Webhook URL (from DiscordConfig.webhookUrl)
export async function sendDiscordMessage(payload: DiscordMessagePayload): Promise<boolean> {
  try {
    const db = await getDB();

    // Read webhookUrl from DB — only query columns that exist in the schema
    const config = await db
      .prepare('SELECT webhookUrl FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      console.error('[Discord Notif] No DiscordConfig row found in database.');
      return false;
    }

    const webhookUrl = config.webhookUrl as string | null;

    if (!webhookUrl) {
      console.error('[Discord Notif] webhookUrl is empty or not configured in DiscordConfig.');
      return false;
    }

    console.log('[Discord Notif] Sending message to webhook:', webhookUrl.substring(0, 50) + '...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Discord Notif] Webhook failed:', response.status, errorText);
      return false;
    }

    console.log('[Discord Notif] Message sent successfully!');
    return true;
  } catch (error) {
    console.error('[Discord Notif] Exception:', error);
    return false;
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

  // Truncate content for Discord
  const truncatedContent = content.length > 300
    ? content.substring(0, 300) + '...'
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
  const base = siteUrl || 'https://tu-dominio.pages.dev';

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
