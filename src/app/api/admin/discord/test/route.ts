import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Test notification webhook - sends a test message to Discord
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions.' }, { status: 403 });
    }

    const db = await getDB();

    // Read config
    const config = await db
      .prepare('SELECT notificationWebhookUrl, notificationEnabled, siteUrl FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      return NextResponse.json({
        success: false,
        step: 'config',
        error: 'No hay configuracion de Discord. Guarda la configuracion primero.',
      }, { status: 400 });
    }

    const webhookUrl = config.notificationWebhookUrl as string | null;
    const enabled = config.notificationEnabled as number | null;

    // Step 1: Check if webhook URL exists
    if (!webhookUrl) {
      return NextResponse.json({
        success: false,
        step: 'webhook_url',
        error: 'No hay URL de webhook configurada. Pegala en el campo "Webhook URL para notificaciones" y guarda.',
      }, { status: 400 });
    }

    // Step 2: Check if notifications are enabled
    if (enabled === 0) {
      return NextResponse.json({
        success: false,
        step: 'enabled',
        error: 'Las notificaciones estan desactivadas. Activa el toggle "Activar notificaciones".',
      }, { status: 400 });
    }

    // Step 3: Send test message
    const siteUrl = (config.siteUrl as string) || 'https://tu-dominio.pages.dev';

    const testPayload = {
      username: 'The Encoders Club',
      embeds: [{
        title: '🔔 Prueba de Webhook',
        description: 'Si ves este mensaje, el webhook de notificaciones esta funcionando correctamente.',
        color: 0x22C55E,
        timestamp: new Date().toISOString(),
        footer: { text: 'The Encoders Club - Test' },
        fields: [
          { name: 'Sitio', value: siteUrl, inline: true },
          { name: 'Fecha', value: new Date().toLocaleString('es-ES'), inline: true },
        ],
      }],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({
        success: false,
        step: 'send',
        error: `Discord rechazo el mensaje (HTTP ${response.status}). Verifica que la URL del webhook sea correcta.`,
        detail: errorBody,
      }, { status: 400 });
    }

    const responseData = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Mensaje de prueba enviado correctamente. Revisa tu canal en Discord.',
      discordMessageId: responseData.id,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      step: 'exception',
      error: 'Error interno al enviar la prueba.',
      detail: String(error),
    }, { status: 500 });
  }
}
