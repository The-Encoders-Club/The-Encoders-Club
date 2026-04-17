import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

// NUEVO: Reemplaza los iframes de YouTube ocultos con autoplay.
// Los navegadores móviles (Chrome Android) bloquean el autoplay con sonido.
// Este componente usa la YouTube IFrame API con postMessage para
// permitir al usuario iniciar la reproducción manualmente.

interface Props {
  videoId: string;
  title: string;
  accentColor?: string;
}

export default function ProjectAudioPlayer({ videoId, title, accentColor = "#FF2D78" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const postCommand = useCallback((func: string, args?: unknown[]) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: args ?? [] }),
      "https://www.youtube.com"
    );
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.origin.includes("youtube.com")) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onReady") setLoaded(true);
        if (data?.event === "onError") setError(true);
        if (data?.event === "onStateChange") {
          // -1=unstarted 0=ended 1=playing 2=paused 3=buffering 5=cued
          setPlaying(data.info === 1 || data.info === 3);
        }
      } catch { /* ignorar */ }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const togglePlay = () => {
    if (!loaded) return;
    playing ? postCommand("pauseVideo") : postCommand("playVideo");
  };

  const toggleMute = () => {
    if (!loaded) return;
    muted ? postCommand("unMute") : postCommand("mute");
    setMuted(m => !m);
  };

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&showinfo=0&modestbranding=1&fs=0&iv_load_policy=3`;

  return (
    <div
      style={{
        background: "rgba(13, 13, 36, 0.8)",
        border: `1px solid ${accentColor}25`,
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Iframe oculto — necesario para la API de YouTube */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={`Audio: ${title}`}
        allow="autoplay; encrypted-media"
        loading="lazy"
        onLoad={() => setTimeout(() => setLoaded(true), 1200)}
        onError={() => setError(true)}
        style={{
          position: "absolute",
          width: "1px", height: "1px",
          left: "-9999px", top: "-9999px",
          opacity: 0, pointerEvents: "none",
        }}
      />

      {/* Ícono de música */}
      <div
        style={{
          width: "42px", height: "42px", borderRadius: "10px",
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor, flexShrink: 0,
          animation: playing ? "cyber-pulse 2s ease-in-out infinite" : "none",
        }}
      >
        <Music size={18} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: "0.85rem", color: "#F0F0FF",
          marginBottom: "6px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: playing ? "60%" : "0%",
            background: `linear-gradient(90deg, ${accentColor}, #a855f7)`,
            borderRadius: "2px",
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ fontSize: "0.7rem", color: "rgba(240,240,255,0.35)", marginTop: "4px" }}>
          {error ? "Audio no disponible" : loaded ? (playing ? "Reproduciendo" : "En pausa") : "Cargando audio..."}
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={toggleMute}
          disabled={!loaded || error}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          style={{
            width: "34px", height: "34px", borderRadius: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(240,240,255,0.6)",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.4,
          }}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <button
          onClick={togglePlay}
          disabled={!loaded || error}
          aria-label={playing ? "Pausar" : "Reproducir"}
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: loaded && !error
              ? `linear-gradient(135deg, ${accentColor}, #a855f7)`
              : "rgba(255,255,255,0.06)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.4,
            transition: "box-shadow 0.2s",
          }}
          onMouseEnter={e => loaded && !error && (e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}66`)}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
        >
          {playing
            ? <Pause size={16} />
            : <Play size={16} style={{ marginLeft: "2px" }} />
          }
        </button>
      </div>
    </div>
  );
}
