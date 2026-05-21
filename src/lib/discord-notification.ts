// ============================================================
// Discord Notification Utility - Send messages to Discord channels
// Uses bot token + channel ID from DiscordConfig
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

// Send a message to a Discord channel using the bot API
export async function sendDiscordMessage(payload: DiscordMessagePayload): Promise<boolean> {
  try {
    const db = await getDB();

    const config = await db
      .prepare('SELECT botToken, channelId, notificationEnabled FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) return false;

    const botToken = config.botToken as string | null;
    const channelId = config.channelId as string | null;
    const enabled = config.notificationEnabled as number | null;

    if (!botToken || !channelId) return false;
    if (enabled === 0) return false; // Notifications explicitly disabled

    const response = await fetch(`https://discord.com/api/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord message send failed:', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Discord notification error:', error);
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
    owner: 0xFFD700,    // Gold
    admin: 0xFF0000,    // Red
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

  return sendDiscordMessage({ embeds: [embed] });
}
