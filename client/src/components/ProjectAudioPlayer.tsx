import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward } from "lucide-react";

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
        if (data?.event === "onReady") {
          setLoaded(true);
          // Autoplay al cargar
          setTimeout(() => {
            postCommand("playVideo");
          }, 300);
        }
        if (data?.event === "onError") setError(true);
        if (data?.event === "onStateChange") {
          setPlaying(data.info === 1 || data.info === 3);
          // Loop manual si termina
          if (data.info === 0) {
            setTimeout(() => postCommand("playVideo"), 500);
          }
        }
      } catch { /* ignorar */ }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postCommand]);

  const togglePlay = () => {
    if (!loaded) return;
    playing ? postCommand("pauseVideo") : postCommand("playVideo");
  };

  const toggleMute = () => {
    if (!loaded) return;
    muted ? postCommand("unMute") : postCommand("mute");
    setMuted(m => !m);
  };

  const seekBackward = () => {
    if (!loaded) return;
    postCommand("seekTo", [-10, true]);
  };

  const seekForward = () => {
    if (!loaded) return;
    postCommand("seekTo", [10, true]);
  };

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&showinfo=0&modestbranding=1&fs=0&iv_load_policy=3`;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, rgba(13, 13, 36, 0.95) 0%, ${accentColor}10 100%)`,
        border: `1px solid ${accentColor}30`,
        borderRadius: "16px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 20% 50%, ${accentColor}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={`Audio: ${title}`}
        allow="autoplay; encrypted-media"
        loading="eager"
        onLoad={() => setTimeout(() => setLoaded(true), 800)}
        onError={() => setError(true)}
        style={{
          position: "absolute",
          width: "1px", height: "1px",
          left: "-9999px", top: "-9999px",
          opacity: 0, pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "46px", height: "46px", borderRadius: "12px",
          background: `${accentColor}20`,
          border: `1.5px solid ${accentColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor, flexShrink: 0,
          animation: playing ? "cyber-pulse 2s ease-in-out infinite" : "none",
          boxShadow: playing ? `0 0 16px ${accentColor}40` : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Music size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: "0.875rem", color: "#F0F0FF",
          marginBottom: "8px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: playing ? "100%" : "0%",
            background: `linear-gradient(90deg, ${accentColor}, #a855f7, ${accentColor})`,
            backgroundSize: "200% 100%",
            borderRadius: "4px",
            transition: playing ? "width 30s linear" : "width 0.5s ease",
            animation: playing ? "player-gradient-shift 3s linear infinite" : "none",
          }} />
        </div>
        <div style={{ fontSize: "0.7rem", color: "rgba(240,240,255,0.4)", marginTop: "5px" }}>
          {error
            ? "Audio no disponible"
            : loaded
              ? (playing ? "♪ Reproduciendo" : "⏸ En pausa")
              : "Cargando audio..."}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, alignItems: "center" }}>
        <button
          onClick={seekBackward}
          disabled={!loaded || error}
          aria-label="Retroceder 10s"
          title="Retroceder 10s"
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(240,240,255,0.55)",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.35,
            transition: "all 0.2s",
          }}
        >
          <SkipBack size={13} />
        </button>

        <button
          onClick={toggleMute}
          disabled={!loaded || error}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: muted ? accentColor : "rgba(240,240,255,0.55)",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.35,
            transition: "all 0.2s",
          }}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        <button
          onClick={togglePlay}
          disabled={!loaded || error}
          aria-label={playing ? "Pausar" : "Reproducir"}
          style={{
            width: "42px", height: "42px", borderRadius: "50%",
            background: loaded && !error
              ? `linear-gradient(135deg, ${accentColor}, #a855f7)`
              : "rgba(255,255,255,0.06)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.4,
            transition: "box-shadow 0.2s, transform 0.1s",
            boxShadow: playing ? `0 0 20px ${accentColor}55` : "none",
          }}
          onMouseEnter={e => { if (loaded && !error) e.currentTarget.style.boxShadow = `0 0 24px ${accentColor}77`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = playing ? `0 0 20px ${accentColor}55` : "none"; }}
        >
          {playing
            ? <Pause size={17} />
            : <Play size={17} style={{ marginLeft: "2px" }} />
          }
        </button>

        <button
          onClick={seekForward}
          disabled={!loaded || error}
          aria-label="Adelantar 10s"
          title="Adelantar 10s"
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(240,240,255,0.55)",
            cursor: loaded && !error ? "pointer" : "default",
            opacity: loaded && !error ? 1 : 0.35,
            transition: "all 0.2s",
          }}
        >
          <SkipForward size={13} />
        </button>
      </div>

      <style>{`
        @keyframes player-gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
