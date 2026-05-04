/**
 * audioManager.ts
 *
 * Estrategia: precargar el video en MUTE mientras el usuario está en /proyectos.
 * Al entrar al proyecto, simplemente desmutear → sin delay, sin glitch.
 *
 * Flujo:
 *   /proyectos mount  → preload(url)  → player en mute, bufferizando
 *   /proyectos hover  → preload(url)  → igual para cada card
 *   /proyecto/[id]    → activate(url) → si ya buffereó: unmute instantáneo ✅
 *                                        si no llegó a tiempo: crea player (fallback)
 */

type YTPlayer = {
  loadVideoById: (opts: { videoId: string; startSeconds: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  destroy: () => void;
};

const players = new Map<string, YTPlayer>();
let activeVideoId: string | null = null;
let apiReady = false;
let apiLoading = false;
let apiCallbacks: Array<() => void> = [];
let containerCounter = 0;

function loadAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (apiReady) { resolve(); return; }
    apiCallbacks.push(resolve);
    if (apiLoading) return;
    apiLoading = true;
    const w = window as any;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    w.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      apiLoading = false;
      apiCallbacks.forEach(cb => cb());
      apiCallbacks = [];
    };
  });
}

function parseUrl(musicUrl: string) {
  const match = musicUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const startMatch = musicUrl.match(/start=(\d+)/);
  return { videoId: match[1], startSec: startMatch ? parseInt(startMatch[1]) : 0 };
}

function createPlayer(videoId: string, startSec: number, muted: boolean): Promise<YTPlayer> {
  return new Promise((resolve) => {
    const w = window as any;
    const div = document.createElement('div');
    div.id = `yt-p-${videoId}-${++containerCounter}`;
    div.style.cssText =
      'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0;';
    document.body.appendChild(div);

    new w.YT.Player(div.id, {
      width: '1', height: '1', videoId,
      playerVars: {
        autoplay: 1, mute: muted ? 1 : 0, loop: 1, playlist: videoId,
        controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3, start: startSec,
      },
      events: {
        onReady: (e: any) => { e.target.playVideo(); resolve(e.target as YTPlayer); },
        onStateChange: (e: any) => {
          if (e.data === (window as any).YT?.PlayerState?.ENDED) {
            e.target.seekTo(startSec, true);
            e.target.playVideo();
          }
        },
      },
    });
  });
}

export const audioManager = {
  /** Descarga el script de YT sin crear player. Llamar al montar /proyectos. */
  preloadAPI(): void {
    if (typeof window === 'undefined') return;
    loadAPI();
  },

  /**
   * Crea un player en MUTE que bufferiza el video en background.
   * Llamar al montar /proyectos (proyecto destacado) y al hacer hover en cada card.
   */
  async preload(musicUrl: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const parsed = parseUrl(musicUrl);
    if (!parsed) return;
    const { videoId, startSec } = parsed;
    if (players.has(videoId)) return; // ya precargado

    await loadAPI();
    if (players.has(videoId)) return; // llegó mientras esperábamos

    const p = await createPlayer(videoId, startSec, true /* muted */);
    players.set(videoId, p);
  },

  /**
   * Activa el audio del proyecto.
   * Si fue precargado → unmute instantáneo sin ningún glitch ✅
   * Si no → crea el player como fallback.
   */
  async activate(musicUrl: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const parsed = parseUrl(musicUrl);
    if (!parsed) return;
    const { videoId, startSec } = parsed;

    // Pausar el player anterior
    if (activeVideoId && activeVideoId !== videoId) {
      const prev = players.get(activeVideoId);
      try { prev?.mute(); prev?.pauseVideo(); } catch { /* ignore */ }
    }
    activeVideoId = videoId;

    if (players.has(videoId)) {
      // ✅ Ya bufferizó → solo unmute
      const p = players.get(videoId)!;
      try { p.unMute(); p.playVideo(); } catch { /* ignore */ }
      return;
    }

    // Fallback: crear con sonido
    await loadAPI();
    if (players.has(videoId)) {
      const p = players.get(videoId)!;
      try { p.unMute(); p.playVideo(); } catch { /* ignore */ }
      return;
    }
    const p = await createPlayer(videoId, startSec, false);
    players.set(videoId, p);
  },

  stop(): void {
    const p = activeVideoId ? players.get(activeVideoId) : null;
    try { p?.pauseVideo(); } catch { /* ignore */ }
  },

  mute(): void {
    const p = activeVideoId ? players.get(activeVideoId) : null;
    try { p?.mute(); } catch { /* ignore */ }
  },

  unmute(): void {
    const p = activeVideoId ? players.get(activeVideoId) : null;
    try { p?.unMute(); } catch { /* ignore */ }
  },

  isMuted(): boolean {
    const p = activeVideoId ? players.get(activeVideoId) : null;
    try { return p?.isMuted() ?? false; } catch { return false; }
  },
};
