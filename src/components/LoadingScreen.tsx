'use client';

import { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stars] = useState(() =>
    // Reduced: 12 stars (was 80), deterministic positions
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((i * 29 + 5) % 94) + 3,
      y: ((i * 41 + 11) % 88) + 6,
      size: ((i * 3 + 2) % 8) * 0.15 + 0.8,
      duration: 5 + (i % 4) * 1.5,
      delay: (i % 5) * 0.8,
    }))
  );

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 30 ? Math.random() * 8 + 2 : prev < 70 ? Math.random() * 5 + 1 : Math.random() * 3 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Hide after loaded
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      id="loading-screen"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#080818',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: 'loadingFadeOut 0.6s ease-out 2.5s forwards',
      }}
    >
      {/* Nebula backgrounds — simplified to 1 layer */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-15%', width: '80%', height: '80%',
        background: 'radial-gradient(circle, rgba(255,45,120,0.08) 0%, transparent 70%)',
        animation: 'nebula-fade 8s ease-in-out infinite', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Stars — reduced to 12 (was 80) */}
      {stars.map(star => (
        <div key={star.id} style={{
          position: 'absolute', background: 'white', borderRadius: '50%',
          width: star.size, height: star.size, left: `${star.x}%`, top: `${star.y}%`,
          animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          zIndex: 1, pointerEvents: 'none', willChange: 'opacity, transform',
        }} />
      ))}

      {/* Logo container — simplified: removed scan laser, 1 ring instead of 2 */}
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: -25,
          background: 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, rgba(77,159,255,0.08) 50%, transparent 70%)',
          borderRadius: '50%', zIndex: 1,
          animation: 'nebula-fade 3s ease-in-out infinite',
        }} />

        {/* Single ring */}
        <div style={{
          position: 'absolute', inset: -15,
          border: '1px solid rgba(77,159,255,0.12)',
          borderRadius: '50%',
          animation: 'ring-rotate 10s linear infinite reverse', zIndex: 2,
        }}>
          <div style={{ position: 'absolute', top: -3, left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#4D9FFF' }} />
        </div>

        {/* Logo — simple float instead of 3D rotation */}
        <img
          src="/logo.png"
          alt="The Encoders Club"
          style={{
            width: 140, height: 140, objectFit: 'contain',
            animation: 'logo-3d-float 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 12px rgba(255,45,120,0.35))',
            zIndex: 3,
          }}
        />
      </div>

      {/* Title */}
      <div style={{ marginTop: 30, textAlign: 'center', zIndex: 5, animation: 'fade-in-up 0.8s ease-out both' }}>
        <h1 style={{
          color: 'white', fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22, fontWeight: 'bold', letterSpacing: '0.25em',
          textTransform: 'uppercase', margin: 0,
        }}>
          The Encoders <span style={{ color: '#FF2D78' }}>Club</span>
        </h1>

        {/* Loading bar */}
        <div style={{
          marginTop: 18, width: 200, height: 5,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 10, overflow: 'hidden', position: 'relative',
          margin: '18px auto 0',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #FF2D78, #a855f7, #4D9FFF)',
            borderRadius: 10,
            boxShadow: '0 0 15px rgba(255, 45, 120, 0.6)',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
          {progress < 30 ? 'Cargando recursos...' : progress < 70 ? 'Preparando experiencia...' : '¡Casi listo!'}
        </p>
      </div>
    </div>
  );
}
