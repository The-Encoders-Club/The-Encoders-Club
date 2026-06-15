'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/hooks/useLocale';

export function LoadingScreen() {
  const { t, locale } = useI18n();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);

  // Deterministic stars — 25 for a richer sky
  const stars = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: ((i * 31 + 7) % 96) + 2,
      y: ((i * 43 + 13) % 92) + 4,
      size: ((i * 3 + 2) % 6) * 0.2 + 0.6,
      duration: 4 + (i % 5) * 1.2,
      delay: (i % 6) * 0.7,
      isColored: i % 4 === 0,
      color: i % 3 === 0 ? '#FF2D78' : i % 3 === 1 ? '#9d4edd' : '#00F2FE',
    })), []
  );

  // Floating particles — 8 drifting orbs
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: ((i * 37 + 15) % 90) + 5,
      y: ((i * 53 + 9) % 85) + 8,
      size: 2 + (i % 3) * 1.5,
      duration: 6 + (i % 4) * 2,
      delay: (i % 5) * 1,
      color: ['#FF2D78', '#9d4edd', '#00F2FE', '#FF2D78', '#9d4edd', '#00F2FE', '#FF2D78', '#9d4edd'][i],
    })), []
  );

  // DDLC Poetic lines by phase
  const ddlcLines = locale === 'es' ? {
    phase1: 'Cada inicio tiene su propio latido...',
    phase2: 'Los recuerdos del club se reúnen...',
    phase3: 'El destino nos espera al otro lado...',
  } : {
    phase1: 'Every beginning has its own heartbeat...',
    phase2: 'The club memories gather together...',
    phase3: 'Destiny awaits us on the other side...',
  };

  // Boot sequence messages
  const bootMessages = locale === 'es' ? [
    '// inicializando sistema...',
    '> cargando módulos core...',
    '> sincronizando bases de datos...',
    '// compilando recursos...',
    '> conectando al servidor...',
    '> verificando integridad...',
    '// preparando interfaz...',
    '> optimizando renderizado...',
    '// sistema listo.',
  ] : [
    '// initializing system...',
    '> loading core modules...',
    '> syncing databases...',
    '// compiling resources...',
    '> connecting to server...',
    '> verifying integrity...',
    '// preparing interface...',
    '> optimizing rendering...',
    '// system ready.',
  ];

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        const increment = prev < 20 ? Math.random() * 10 + 3
          : prev < 50 ? Math.random() * 6 + 2
          : prev < 80 ? Math.random() * 4 + 1
          : Math.random() * 2 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence lines — add one per progress milestone
  useEffect(() => {
    const lineIndex = Math.floor((progress / 100) * bootMessages.length);
    const currentLines = bootMessages.slice(0, lineIndex + 1);
    setBootLines(currentLines);
  }, [progress, locale]);

  // Glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Hide after loaded
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!isVisible) return null;

  const currentPhase = progress < 33 ? 'phase1' : progress < 66 ? 'phase2' : 'phase3';

  return (
    <div
      id="loading-screen"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#030308',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: progress >= 100 ? 'loadingFadeOut 0.8s ease-out forwards' : 'none',
      }}
    >
      {/* ===== CYBERPUNK: Grid Background ===== */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,45,120,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0, pointerEvents: 'none',
        animation: 'grid-scroll 20s linear infinite',
      }} />

      {/* ===== CYBERPUNK: Scan line overlay ===== */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* ===== CYBERPUNK: Scan laser (vertical) ===== */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,242,254,0.4) 30%, rgba(0,242,254,0.8) 50%, rgba(0,242,254,0.4) 70%, transparent 100%)',
        boxShadow: '0 0 30px rgba(0,242,254,0.3), 0 0 60px rgba(0,242,254,0.1)',
        zIndex: 2, pointerEvents: 'none',
        animation: 'scan-laser 4s ease-in-out infinite',
      }} />

      {/* ===== ANIME: Character-themed nebula orbs ===== */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '35%', height: '35%',
        background: 'radial-gradient(circle, rgba(255,45,120,0.06) 0%, transparent 65%)',
        animation: 'nebula-fade 6s ease-in-out infinite', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 65%)',
        animation: 'nebula-fade 8s ease-in-out 2s infinite', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(0,242,254,0.04) 0%, transparent 60%)',
        animation: 'nebula-fade 7s ease-in-out 1s infinite', zIndex: 0, pointerEvents: 'none' }} />

      {/* ===== Stars ===== */}
      {stars.map(star => (
        <div key={`star-${star.id}`} style={{
          position: 'absolute',
          background: star.isColored ? star.color : 'white',
          borderRadius: '50%',
          width: star.size, height: star.size,
          left: `${star.x}%`, top: `${star.y}%`,
          animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          zIndex: 1, pointerEvents: 'none', willChange: 'opacity, transform',
          boxShadow: star.isColored ? `0 0 4px ${star.color}40` : 'none',
        }} />
      ))}

      {/* ===== Floating particles ===== */}
      {particles.map(p => (
        <div key={`particle-${p.id}`} style={{
          position: 'absolute',
          background: p.color,
          borderRadius: '50%',
          width: p.size, height: p.size,
          left: `${p.x}%`, top: `${p.y}%`,
          animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          zIndex: 1, pointerEvents: 'none',
          boxShadow: `0 0 6px ${p.color}60`,
        }} />
      ))}

      {/* ===== LOGO CONTAINER ===== */}
      <div style={{
        position: 'relative',
        width: 260, height: 260,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 5,
      }}>
        {/* CYBERPUNK: Outer ring — large, slow, cyan */}
        <div style={{
          position: 'absolute', inset: -30,
          border: '1px solid rgba(0,242,254,0.08)',
          borderRadius: '50%',
          animation: 'ring-rotate 15s linear infinite', zIndex: 1,
        }}>
          <div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, borderRadius: '50%', background: '#00F2FE',
            boxShadow: '0 0 10px #00F2FE, 0 0 20px rgba(0,242,254,0.5)' }} />
        </div>

        {/* CYBERPUNK: Middle ring — medium, reverse, magenta */}
        <div style={{
          position: 'absolute', inset: -18,
          border: '1.5px solid rgba(255,45,120,0.12)',
          borderRadius: '50%',
          animation: 'ring-rotate 8s linear infinite reverse', zIndex: 2,
        }}>
          <div style={{ position: 'absolute', bottom: -3, left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#FF2D78',
            boxShadow: '0 0 8px #FF2D78, 0 0 16px rgba(255,45,120,0.4)' }} />
          <div style={{ position: 'absolute', top: -3, right: '25%', width: 4, height: 4, borderRadius: '50%', background: '#9d4edd',
            boxShadow: '0 0 6px #9d4edd' }} />
        </div>

        {/* CYBERPUNK: Inner ring — small, fast, purple */}
        <div style={{
          position: 'absolute', inset: -8,
          border: '1px dashed rgba(157,78,221,0.1)',
          borderRadius: '50%',
          animation: 'ring-rotate 5s linear infinite', zIndex: 2,
        }} />

        {/* CYBERPUNK: Glow pulse behind logo */}
        <div style={{
          position: 'absolute', inset: -35,
          background: 'radial-gradient(circle, rgba(255,45,120,0.12) 0%, rgba(157,78,221,0.08) 40%, rgba(0,242,254,0.05) 60%, transparent 75%)',
          borderRadius: '50%', zIndex: 1,
          animation: 'nebula-fade 3s ease-in-out infinite',
        }} />

        {/* CYBERPUNK: Hexagonal accent ring */}
        <div style={{
          position: 'absolute', inset: -22,
          border: '1px solid rgba(255,45,120,0.06)',
          borderRadius: '50%',
          animation: 'ring-rotate 12s linear infinite', zIndex: 1,
        }}>
          {/* Clip-path corner accents */}
          <div style={{ position: 'absolute', top: -2, left: '50%', width: 8, height: 1.5, background: '#FF2D78', transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(255,45,120,0.6)' }} />
          <div style={{ position: 'absolute', bottom: -2, left: '50%', width: 8, height: 1.5, background: '#00F2FE', transform: 'translateX(-50%)',
            boxShadow: '0 0 6px rgba(0,242,254,0.6)' }} />
          <div style={{ position: 'absolute', left: -2, top: '50%', width: 1.5, height: 8, background: '#9d4edd', transform: 'translateY(-50%)',
            boxShadow: '0 0 6px rgba(157,78,221,0.6)' }} />
          <div style={{ position: 'absolute', right: -2, top: '50%', width: 1.5, height: 8, background: '#FF2D78', transform: 'translateY(-50%)',
            boxShadow: '0 0 6px rgba(255,45,120,0.6)' }} />
        </div>

        {/* Logo — ENLARGED: 180px with enhanced glow */}
        <img
          src="/logo.png"
          alt="The Encoders Club"
          style={{
            width: 180, height: 180, objectFit: 'contain',
            animation: 'logo-3d-float 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 18px rgba(255,45,120,0.4)) drop-shadow(0 0 40px rgba(157,78,221,0.15))',
            zIndex: 3,
          }}
        />

        {/* CYBERPUNK: Scan line across logo */}
        <div style={{
          position: 'absolute', left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,242,254,0.6) 50%, transparent 100%)',
          boxShadow: '0 0 8px rgba(0,242,254,0.4)',
          zIndex: 4, pointerEvents: 'none',
          animation: 'scan-laser 3s ease-in-out infinite',
        }} />
      </div>

      {/* ===== TITLE WITH GLITCH ===== */}
      <div style={{ marginTop: 24, textAlign: 'center', zIndex: 5 }}>
        <h1
          className="font-cyber"
          style={{
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0,
            position: 'relative',
            textShadow: glitchActive
              ? '2px 0 #FF2D78, -2px 0 #00F2FE, 0 0 20px rgba(255,45,120,0.5)'
              : '0 0 20px rgba(255,45,120,0.2)',
            animation: glitchActive ? 'glitch-shake 0.15s ease-in-out' : 'none',
            transition: 'text-shadow 0.1s',
          }}
        >
          The Encoders{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF2D78, #9d4edd, #00F2FE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Club
          </span>
        </h1>

        {/* ANIME: DDLC poetic subtitle */}
        <p style={{
          color: 'rgba(255,45,120,0.5)',
          fontSize: 12,
          fontFamily: "'DDLCFont', 'DM Sans', sans-serif",
          fontStyle: 'italic',
          marginTop: 6,
          letterSpacing: '0.05em',
          animation: 'fade-in-up 1s ease-out 0.5s both',
        }}>
          {ddlcLines[currentPhase]}
        </p>

        {/* ===== CYBERPUNK: Progress bar — wider & styled ===== */}
        <div style={{
          marginTop: 20, width: 280, height: 6,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 0,
          overflow: 'hidden', position: 'relative',
          margin: '20px auto 0',
          border: '1px solid rgba(255,45,120,0.15)',
          clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
        }}>
          {/* Progress fill */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FF2D78, #9d4edd, #00F2FE)',
            transition: 'width 0.15s ease',
            boxShadow: '0 0 12px rgba(255,45,120,0.5), 0 0 24px rgba(157,78,221,0.2)',
          }} />
          {/* Animated shine */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            animation: 'loading-bar-flow 2s ease-in-out infinite',
          }} />
        </div>

        {/* Progress percentage */}
        <p style={{
          color: 'rgba(0,242,254,0.6)',
          fontSize: 11,
          marginTop: 6,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.1em',
        }}>
          {Math.floor(progress)}%
        </p>
      </div>

      {/* ===== IDE: Terminal boot sequence ===== */}
      <div style={{
        marginTop: 20,
        width: 300,
        maxHeight: 90,
        overflow: 'hidden',
        zIndex: 5,
        animation: 'fade-in-up 1s ease-out 0.3s both',
      }}>
        {bootLines.slice(-4).map((line, i) => (
          <p key={`${line}-${i}`} style={{
            color: i === bootLines.slice(-4).length - 1 ? 'rgba(0,242,254,0.6)' : 'rgba(255,255,255,0.2)',
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            margin: '2px 0',
            lineHeight: 1.4,
            animation: i === bootLines.slice(-4).length - 1 ? 'fade-in-up 0.3s ease-out' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {line}
          </p>
        ))}
        {/* Blinking cursor */}
        <span style={{
          display: 'inline-block',
          width: 6, height: 10,
          background: 'rgba(0,242,254,0.6)',
          animation: 'cursor-blink 1s step-end infinite',
          marginLeft: 2,
          verticalAlign: 'middle',
        }} />
      </div>

      {/* ===== ANIME: Decorative character orbs (bottom) ===== */}
      <div style={{
        position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 16, alignItems: 'center', zIndex: 5,
        animation: 'fade-in-up 1s ease-out 1s both',
      }}>
        {/* Monika orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#FF2D78',
            boxShadow: '0 0 8px rgba(255,45,120,0.5), 0 0 16px rgba(255,45,120,0.2)',
            animation: 'nebula-fade 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,45,120,0.4)' }}>MON</span>
        </div>
        {/* Yuri orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#9d4edd',
            boxShadow: '0 0 8px rgba(157,78,221,0.5), 0 0 16px rgba(157,78,221,0.2)',
            animation: 'nebula-fade 2s ease-in-out 0.6s infinite',
          }} />
          <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(157,78,221,0.4)' }}>YURI</span>
        </div>
        {/* Natsuki orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#00F2FE',
            boxShadow: '0 0 8px rgba(0,242,254,0.5), 0 0 16px rgba(0,242,254,0.2)',
            animation: 'nebula-fade 2s ease-in-out 1.2s infinite',
          }} />
          <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(0,242,254,0.4)' }}>NAT</span>
        </div>
      </div>

      {/* ===== CYBERPUNK: Gradient line at bottom ===== */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #FF2D78, #9d4edd, #00F2FE, transparent)',
        opacity: 0.5,
        zIndex: 5,
      }} />

      {/* ===== CYBERPUNK: Corner accents ===== */}
      {/* Top-left */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 30, height: 1.5, background: 'rgba(255,45,120,0.3)', boxShadow: '0 0 8px rgba(255,45,120,0.2)' }} />
        <div style={{ width: 1.5, height: 30, background: 'rgba(255,45,120,0.3)', boxShadow: '0 0 8px rgba(255,45,120,0.2)', marginTop: -1 }} />
      </div>
      {/* Top-right */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 30, height: 1.5, background: 'rgba(0,242,254,0.3)', boxShadow: '0 0 8px rgba(0,242,254,0.2)', marginLeft: 'auto' }} />
        <div style={{ width: 1.5, height: 30, background: 'rgba(0,242,254,0.3)', boxShadow: '0 0 8px rgba(0,242,254,0.2)', marginLeft: 'auto', marginTop: -1 }} />
      </div>
      {/* Bottom-left */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 1.5, height: 30, background: 'rgba(157,78,221,0.3)', boxShadow: '0 0 8px rgba(157,78,221,0.2)' }} />
        <div style={{ width: 30, height: 1.5, background: 'rgba(157,78,221,0.3)', boxShadow: '0 0 8px rgba(157,78,221,0.2)', marginTop: -1 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 1.5, height: 30, background: 'rgba(255,45,120,0.3)', boxShadow: '0 0 8px rgba(255,45,120,0.2)', marginLeft: 'auto' }} />
        <div style={{ width: 30, height: 1.5, background: 'rgba(255,45,120,0.3)', boxShadow: '0 0 8px rgba(255,45,120,0.2)', marginLeft: 'auto', marginTop: -1 }} />
      </div>

      {/* ===== IDE: Version tag (top-right corner) ===== */}
      <div style={{
        position: 'absolute', top: 22, right: 60,
        fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(255,255,255,0.15)',
        zIndex: 5, pointerEvents: 'none',
        animation: 'fade-in-up 0.5s ease-out 1.5s both',
      }}>
        v2.0.26
      </div>

      {/* ===== IDE: System label (top-left corner) ===== */}
      <div style={{
        position: 'absolute', top: 22, left: 60,
        fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(255,255,255,0.15)',
        zIndex: 5, pointerEvents: 'none',
        animation: 'fade-in-up 0.5s ease-out 1.5s both',
      }}>
        {'// THE_ENCODERS_CLUB'}
      </div>
    </div>
  );
}
