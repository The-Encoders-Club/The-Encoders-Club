// ============================================================
// Discord Notification Utility - Send messages via Webhook URL
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

    console.log('[Discord Notif] Message sent successfully!');
    return true;
  } catch (error) {
    console.error('[Discord Notif] Exception in sendDiscordMessage:', error);
    return false;
  }
}

// Build a valid absolute URL from a potentially relative path
function toAbsoluteUrl(path: string | null | undefined, baseUrl: string): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  try {
    return new URL(path, baseUrl).href;
  } catch {
    return null;
  }
}

// Get siteUrl from DB for building absolute URLs
export async function getSiteUrl(): Promise<string> {
  try {
    const db = await getDB();
    const config = await db.prepare('SELECT siteUrl FROM DiscordConfig LIMIT 1').first();
    return (config?.siteUrl as string) || 'https://tu-dominio.pages.dev';
  } catch {
    return 'https://tu-dominio.pages.dev';
  }
}

// =============================================
// NOTIFICATION FUNCTIONS
// =============================================

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
  parentContent?: string;
}): Promise<boolean> {
  const {
    projectName, projectId, authorNickname, authorAvatar,
    authorRole, content, siteUrl, isReply, parentAuthor, parentContent,
  } = params;

  const base = siteUrl || 'https://tu-dominio.pages.dev';
  const projectUrl = `${base}/proyectos/${projectId}`;

  const truncate = (text: string, max: number) => text.length > max ? text.substring(0, max) + '...' : text;

  const roleColors: Record<string, number> = {
    owner: 0xFFD700,
    admin: 0xFF0000,
    moderator: 0x4D9FFF,
    collaborator: 0x22C55E,
  };
  const embedColor = roleColors[authorRole || ''] || 0x5865F2;

  const titlePrefix = isReply ? '💬 Respuesta en' : '💬 Nuevo comentario en';

  let description = '';
  if (isReply && parentAuthor && parentContent) {
    const quotedParent = truncate(parentContent, 200);
    description = `**${authorNickname}** respondio a **${parentAuthor}**:\n\n❝ *${quotedParent}* ❞\n\n> ${truncate(content, 500)}`;
  } else if (isReply && parentAuthor) {
    description = `**${authorNickname}** respondio a **${parentAuthor}**:\n> ${truncate(content, 500)}`;
  } else {
    description = `**${authorNickname}** comento:\n> ${truncate(content, 500)}`;
  }

  const embed: DiscordEmbed = {
    title: `${titlePrefix} ${projectName}`,
    description,
    url: projectUrl,
    color: embedColor,
    timestamp: new Date().toISOString(),
    footer: { text: 'The Encoders Club' },
  };

  const absoluteAvatarUrl = toAbsoluteUrl(authorAvatar, base);
  if (absoluteAvatarUrl) {
    embed.author = { name: authorNickname, icon_url: absoluteAvatarUrl };
  }

  return sendDiscordMessage({ username: 'The Encoders Club', embeds: [embed] });
}
