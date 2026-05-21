// ============================================================
// Discord Notification Utility - Send messages via Webhook
// Uses a Discord Webhook URL from DiscordConfig
// ============================================================

import { getDB } from './db';

interface DiscordWebhookPayload {
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

// Send a message to Discord using a Webhook URL
export async function sendDiscordWebhook(payload: DiscordWebhookPayload): Promise<boolean> {
  try {
    const db = await getDB();

    const config = await db
      .prepare('SELECT notificationWebhookUrl, notificationEnabled FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      console.warn('[Discord Webhook] No hay fila DiscordConfig en la base de datos.');
      return false;
    }

    const webhookUrl = config.notificationWebhookUrl as string | null;
    const enabled = config.notificationEnabled as number | null;

    if (!webhookUrl) {
      console.warn('[Discord Webhook] notificationWebhookUrl esta vacio.');
      return false;
    }

    if (enabled === 0) {
      console.log('[Discord Webhook] Notificaciones desactivadas.');
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Discord Webhook] Error HTTP', response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Discord Webhook] Excepcion:', error);
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
    projectName, projectId, authorNickname,
    authorRole, content, siteUrl, isReply, parentAuthor,
  } = params;

  const base = siteUrl || 'https://tu-dominio.pages.dev';
  const projectUrl = `${base}/proyectos/${projectId}`;

  const truncatedContent = content.length > 300
    ? content.substring(0, 300) + '...'
    : content;

  const roleColors: Record<string, number> = {
    owner: 0xFFD700,
    admin: 0xFF0000,
    moderator: 0x4D9FFF,
    collaborator: 0x22C55E,
  };
  const embedColor = roleColors[authorRole || ''] || 0x5865F2;

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

  if (params.authorAvatar) {
    embed.author = { name: authorNickname, icon_url: params.authorAvatar };
  }

  return sendDiscordWebhook({
    username: 'The Encoders Club',
    embeds: [embed],
  });
}

// Send a notification when a new user registers
export async function notifyNewUser(params: {
  nickname: string;
  avatar?: string | null;
}): Promise<boolean> {
  const { nickname, avatar } = params;

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

  return sendDiscordWebhook({
    username: 'The Encoders Club',
    embeds: [embed],
  });
}
