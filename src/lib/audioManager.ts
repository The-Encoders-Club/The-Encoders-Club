/**
 * audioManager.ts
 *
 * Singleton global de YouTube Player que NUNCA se destruye entre navegaciones.
 * En lugar de crear/destruir el player en cada página, simplemente cambiamos
 * el video con loadVideoById() — esto elimina el delay de ~1s completamente
 * en todas las navegaciones excepto la primera carga de la API.
 *
 * Uso:
 *   audioManager.load(musicUrl)  → en useEffect al montar la página
 *   audioManager.stop()          → en el cleanup del useEffect
 *   audioManager.mute()
 *   audioManager.unmute()
 *   audioManager.isMuted()
 *   audioManager.preloadAPI()    → llamar desde /proyectos para precargar
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

// ── Estado del singleton (persiste entre navegaciones en Next.js) ─────────────
let player: YTPlayer | null = null;
let container: HTMLDivElement | null = null;
let apiReady = false;
let apiLoading = false;
let apiCallbacks: Array<() => void> = [];
let currentVideoId: string | null = null;
let pendingLoad: { videoId: string; startSec: number } | null = null;

// ── Carga el script de YouTube API una sola vez ───────────────────────────────
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

// ── Crea el div contenedor oculto (una sola vez, nunca se elimina) ────────────
function ensureContainer(): HTMLDivElement {
  if (container && document.body.contains(container)) return container;

  container = document.createElement('div');
  container.id = 'yt-global-music-player';
  container.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;' +
    'overflow:hidden;pointer-events:none;opacity:0;';
  document.body.appendChild(container);
  return container;
}

// ── Crea el player YT (una sola vez) ─────────────────────────────────────────
function createPlayer(videoId: string, startSec: number): void {
  const w = window as any;
  if (!w.YT?.Player) return;

  const div = ensureContainer();

  player = new w.YT.Player(div, {
    width: '1',
    height: '1',
    videoId,
    playerVars: {
      autoplay: 1,
      mute: 0,
      loop: 1,
      playlist: videoId,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      start: startSec,
    },
    events: {
      onReady: (e: any) => {
        e.target.playVideo();
        // Si el navegador bloqueó el audio, lo reflejamos en el estado
        try {
          if (e.target.isMuted()) {
            // El caller puede consultar audioManager.isMuted() para sincronizar UI
          }
        } catch { /* ignore */ }

        // Si llegó una petición de carga mientras el player se inicializaba
        if (pendingLoad) {
          const { videoId: vid, startSec: sec } = pendingLoad;
          pendingLoad = null;
          loadVideo(vid, sec);
        }
      },
      onStateChange: (e: any) => {
        // Loop manual: al terminar, vuelve al segundo de inicio
        if (e.data === w.YT.PlayerState.ENDED && player) {
          player.loadVideoById({ videoId: currentVideoId!, startSeconds: startSec });
        }
      },
    },
  }) as unknown as YTPlayer;

  currentVideoId = videoId;
}

// ── Cambia el video del player existente ─────────────────────────────────────
function loadVideo(videoId: string, startSec: number): void {
  if (!player) { pendingLoad = { videoId, startSec }; return; }

  // Si es el mismo video, solo asegurar que esté reproduciendo
  if (currentVideoId === videoId) {
    try { player.playVideo(); } catch { /* ignore */ }
    return;
  }

  // Cambiar video instantáneamente (sin destruir el player)
  try {
    player.loadVideoById({ videoId, startSeconds: startSec });
    currentVideoId = videoId;
  } catch { /* ignore */ }
}

// ── API pública ───────────────────────────────────────────────────────────────

export const audioManager = {
  /**
   * Precarga la API de YouTube sin crear el player.
   * Llamar desde la página /proyectos para que la API esté lista
   * antes de que el usuario entre a un proyecto.
   */
  preloadAPI(): void {
    if (typeof window === 'undefined') return;
    loadAPI();
  },

  /**
   * Carga y reproduce un video. Si el player ya existe, cambia de video
   * instantáneamente. Si no existe, crea el player.
   */
  async load(musicUrl: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const match = musicUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (!match) return;
    const videoId = match[1];
    const startMatch = musicUrl.match(/start=(\d+)/);
    const startSec = startMatch ? parseInt(startMatch[1]) : 0;

    await loadAPI();

    if (player) {
      // ✅ Player ya existe → cambio instantáneo, sin delay
      loadVideo(videoId, startSec);
    } else {
      // Primera vez → crear el player
      ensureContainer();
      createPlayer(videoId, startSec);
    }
  },

  /** Pausa la música (no destruye el player) */
  stop(): void {
    try { player?.pauseVideo(); } catch { /* ignore */ }
  },

  mute(): void {
    try { player?.mute(); } catch { /* ignore */ }
  },

  unmute(): void {
    try { player?.unMute(); } catch { /* ignore */ }
  },

  isMuted(): boolean {
    try { return player?.isMuted() ?? false; } catch { return false; }
  },
};
