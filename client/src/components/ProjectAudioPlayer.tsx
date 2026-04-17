import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

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
  const [progress, setProgress] = useState(0);      // 0‑100
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* ── Send command to YouTube iframe ── */
  const postCmd = useCallback((func: string, args: unknown[] = []) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    /* Use "*" so it works with both youtube.com and youtube-nocookie.com */
    win.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }, []);

  /* ── Listen for YouTube events ── */
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      try {
        const data = typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data;

        if (data?.event === "onReady") {
          setLoaded(true);
          /* Ask for duration */
          postCmd("getDuration");
          /* Autoplay with a brief delay so the browser allows it */
          setTimeout(() => postCmd("playVideo"), 200);
        }

        if (data?.event === "infoDelivery" && data?.info) {
          if (typeof data.info.duration === "number" && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (typeof data.info.currentTime === "number") {
            setCurrentTime(data.info.currentTime);
            if (duration > 0) setProgress((data.info.currentTime / duration) * 100);
          }
        }

        if (data?.event === "onStateChange") {
          const state = data.info;
          const isPlaying = state === 1 || state === 3;
          setPlaying(isPlaying);
          /* Loop: restart when ended (state 0) */
          if (state === 0) setTimeout(() => postCmd("playVideo"), 400);
        }

        if (data?.event === "onError") setError(true);
      } catch { /* ignore */ }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postCmd, duration]);

  /* ── Polling interval for real-time progress ── */
  useEffect(() => {
    if (playing && loaded) {
      tickRef.current = setInterval(() => {
        postCmd("getCurrentTime");
        if (duration === 0) postCmd("getDuration");
      }, 750);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [playing, loaded, duration, postCmd]);

  /* ── Controls ── */
  const togglePlay = () => {
    if (!loaded) return;
    playing ? postCmd("pauseVideo") : postCmd("playVideo");
  };

  const toggleMute = () => {
    if (!loaded) return;
    if (muted) {
      postCmd("unMute");
      setMuted(false);
    } else {
      postCmd("mute");
      setMuted(true);
    }
  };

  /* ── Seek on bar click ── */
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!loaded || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = ratio * (duration || 240);   /* fallback 4 min if duration unknown */
    postCmd("seekTo", [target, true]);
    setProgress(ratio * 100);
    setCurrentTime(target);
  };

  /* ── Format time mm:ss ── */
  const fmt = (s: number) => {
    if (!s || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* embed URL — enablejsapi + autoplay + loop */
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&showinfo=0&modestbranding=1&fs=0&iv_load_policy=3&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(13,13,36,0.95) 0%, ${accentColor}10 100%)`,
      border: `1px solid ${accentColor}30`,
      borderRadius: "16px",
      padding: "1.1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.7rem",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
    }}>
      {/* background radial */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${accentColor}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Hidden iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        title={`Audio: ${title}`}
        allow="autoplay; encrypted-media"
        loading="eager"
        onLoad={() => { setTimeout(() => setLoaded(true), 600); }}
        onError={() => setError(true)}
        style={{ position: "absolute", width: "1px", height: "1px", top: 0, left: "-2px", opacity: 0, pointerEvents: "none" }}
      />

      {/* ── Row 1: Icon + Title + Buttons ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        {/* Music icon */}
        <div style={{
          width: 42, height: 42, borderRadius: "10px", flexShrink: 0,
          background: `${accentColor}20`, border: `1.5px solid ${accentColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor,
          boxShadow: playing ? `0 0 14px ${accentColor}45` : "none",
          transition: "box-shadow 0.3s",
        }}>
          <Music size={18} />
        </div>

        {/* Title + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem",
            color: "#F0F0FF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {title}
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(240,240,255,0.38)", marginTop: "2px" }}>
            {error ? "Audio no disponible" : loaded ? (playing ? "♪ Reproduciendo" : "⏸ En pausa") : "Cargando audio..."}
          </div>
        </div>

        {/* Mute + Play/Pause */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={toggleMute}
            disabled={!loaded || error}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            style={{
              width: 32, height: 32, borderRadius: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
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
              width: 40, height: 40, borderRadius: "50%",
              background: loaded && !error ? `linear-gradient(135deg, ${accentColor}, #a855f7)` : "rgba(255,255,255,0.06)",
              border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white",
              cursor: loaded && !error ? "pointer" : "default",
              opacity: loaded && !error ? 1 : 0.4,
              boxShadow: playing ? `0 0 18px ${accentColor}55` : "none",
              transition: "box-shadow 0.2s, transform 0.1s",
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
          </button>
        </div>
      </div>

      {/* ── Row 2: Seekable progress bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.65rem", color: "rgba(240,240,255,0.35)", width: "2.8rem", textAlign: "right", flexShrink: 0 }}>
          {fmt(currentTime)}
        </span>

        <div
          ref={barRef}
          onClick={handleBarClick}
          style={{
            flex: 1,
            height: 5,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "6px",
            overflow: "hidden",
            cursor: loaded && !error ? "pointer" : "default",
            position: "relative",
          }}
          title="Clic para saltar a esa posición"
        >
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accentColor}, #a855f7)`,
            borderRadius: "6px",
            transition: "width 0.6s linear",
            boxShadow: playing ? `0 0 8px ${accentColor}60` : "none",
          }} />
        </div>

        <span style={{ fontSize: "0.65rem", color: "rgba(240,240,255,0.35)", width: "2.8rem", flexShrink: 0 }}>
          {duration > 0 ? fmt(duration) : "--:--"}
        </span>
      </div>

      <style>{`
        @keyframes cyber-pulse {
          0%,100% { box-shadow: 0 0 8px ${accentColor}40; }
          50% { box-shadow: 0 0 20px ${accentColor}80; }
        }
      `}</style>
    </div>
  );
}
