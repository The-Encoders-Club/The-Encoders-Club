import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sendDiscordMessage } from '@/lib/discord-notification';

// POST: Send a test notification via Webhook URL
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    console.log('[Discord Test] Sending test notification via webhook...');

    const success = await sendDiscordMessage({
      username: 'The Encoders Club',
      embeds: [
        {
          title: '🔔 Prueba de Notificacion',
          description: `**${session.nickname}** configuro correctamente las notificaciones por Webhook.\n\nSi recibes este mensaje, las notificaciones de comentarios tambien funcionaran.`,
          color: 0x22C55E,
          timestamp: new Date().toISOString(),
          footer: { text: 'The Encoders Club - Test Webhook' },
        },
      ],
    });

    if (success) {
      return NextResponse.json({ success: true, message: 'Test notification sent successfully!' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send test. Check the webhook URL in your Discord config.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Discord Test] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
                              }
