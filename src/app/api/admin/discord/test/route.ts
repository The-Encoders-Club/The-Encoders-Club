import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST: Test notification webhook - sends a test message to Discord
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No autenticado. Inicia sesion primero.',
      }, { status: 401 });
    }

    if (session.role !== 'owner' && session.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Solo admins pueden probar el webhook.',
      }, { status: 403 });
    }

    const db = await getDB();

    // Step 1: Check config exists
    const config = await db
      .prepare('SELECT notificationWebhookUrl, notificationEnabled, siteUrl FROM DiscordConfig LIMIT 1')
      .first();

    if (!config) {
      return NextResponse.json({
        success: false,
        error: 'No hay configuracion de Discord. Ve a la seccion de arriba y guarda el Token del Bot y otros campos primero.',
      }, { status: 200 });
    }

    // Step 2: Check webhook URL
    const webhookUrl = config.notificationWebhookUrl as string | null;

    if (!webhookUrl) {
      return NextResponse.json({
        success: false,
        error: 'No hay URL de webhook. Pegala en el campo "Webhook URL para notificaciones" y guarda.',
      }, { status: 200 });
    }

    // Step 3: Check URL format
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/') && !webhookUrl.startsWith('https://discordapp.com/api/webhooks/')) {
      return NextResponse.json({
        success: false,
        error: 'La URL no parece ser un webhook valido. Debe empezar con https://discord.com/api/webhooks/',
        urlPrefix: webhookUrl.substring(0, 40) + '...',
      }, { status: 200 });
    }

    // Step 4: Check enabled
    const enabled = config.notificationEnabled as number | null;
    if (enabled === 0) {
      return NextResponse.json({
        success: false,
        error: 'Las notificaciones estan desactivadas. Activa el toggle "Activar notificaciones" y guarda.',
      }, { status: 200 });
    }

    // Step 5: Send test message to Discord
    const siteUrl = (config.siteUrl as string) || 'https://tu-dominio.pages.dev';

    const testPayload = {
      username: 'The Encoders Club',
      embeds: [{
        title: '🔔 Prueba de Webhook',
        description: 'Si ves este mensaje, el webhook de notificaciones esta funcionando correctamente. Los comentarios nuevos se enviaran a este canal.',
        color: 0x22C55E,
        timestamp: new Date().toISOString(),
        footer: { text: 'The Encoders Club - Test' },
        fields: [
          { name: 'Sitio', value: siteUrl, inline: true },
          { name: 'Fecha', value: new Date().toLocaleString('es-ES'), inline: true },
        ],
      }],
    };

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });
    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        error: `No se pudo conectar con Discord: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
      }, { status: 200 });
    }

    if (!response.ok) {
      let errorDetail = '';
      try { errorDetail = await response.text(); } catch {}

      let friendlyError = `Discord rechazo el mensaje (HTTP ${response.status}).`;

      if (response.status === 404) {
        friendlyError = 'Webhook no encontrado (404). La URL puede estar mal o el webhook fue eliminado. Crea uno nuevo en Discord y pegalo.';
      } else if (response.status === 401 || response.status === 403) {
        friendlyError = 'Webhook invalido o expirado (401/403). El token del webhook ya no es valido. Crea uno nuevo.';
      } else if (response.status === 429) {
        friendlyError = 'Rate limit de Discord (429). Espera unos segundos y prueba de nuevo.';
      }

      return NextResponse.json({
        success: false,
        error: friendlyError,
        statusCode: response.status,
        discordError: errorDetail.substring(0, 200),
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje de prueba enviado a Discord. Revisa tu canal.',
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Error interno: ${error instanceof Error ? error.message : String(error)}`,
    }, { status: 200 });
  }
}
