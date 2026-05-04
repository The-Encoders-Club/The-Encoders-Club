'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────────────────────────────
 *  MonikaChibi – animated draggable desktop pet
 *  Uses real DDLC Plus chibi Monika sprite from
 *  the official Doki Doki Literature Club Fandom Wiki
 * ──────────────────────────────────────────────── */

/* Official chibi Monika sprites from DDLC Plus Fandom Wiki */
const CHIBI_SPRITES = {
  idle:
    'https://static.wikia.nocookie.net/doki-doki-literature-club/images/1/12/Monika-Chibi-HC.png/revision/latest?cb=20210614220116',
  reddit:
    'https://i.redd.it/s7gizhd9jtm01.png',
} as const;

/* Monika's iconic quotes (DDLC) */
const MONIKA_QUOTES = [
  'Just Monika.',
  'Okay, everyone!',
  "It's poetry time!",
  "I'm your new favorite!",
  'Welcome to the Literature Club!',
  'Did you miss me?',
  'I wrote a poem for you~',
  'Just think about it...',
  'This is our special place.',
  'Can you hear me?',
  'I know your name.',
  "Don't worry, I'll wait.",
];

const MONIKA_QUOTES_ES = [
  'Solo Monika.',
  '¡Bien, todos!',
  '¡Es hora de poesía!',
  '¡Soy tu nueva favorita!',
  '¡Bienvenido al Club de Literatura!',
  '¿Me extrañaste?',
  'Escribí un poema para ti~',
  'Solo piénsalo...',
  'Este es nuestro lugar especial.',
  '¿Puedes escucharme?',
  'Sé tu nombre.',
  'No te preocupes, esperaré.',
];

type ChibiState = 'idle' | 'dragging' | 'talking';

export default function MonikaChibi() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<ChibiState>('idle');
  const [quote, setQuote] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [entered, setEntered] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);
  const bobRef = useRef(0);

  /* Random initial position — bottom-right area */
  useEffect(() => {
    const x = typeof window !== 'undefined' ? window.innerWidth - 160 : 600;
    const y = typeof window !== 'undefined' ? window.innerHeight - 260 : 400;
    setPos({ x, y });

    /* Entrance animation delay */
    const t = setTimeout(() => setEntered(true), 800);
    return () => clearTimeout(t);
  }, []);

  /* Idle bob animation via rAF */
  useEffect(() => {
    const bob = () => {
      bobRef.current += 0.04;
      animFrame.current = requestAnimationFrame(bob);
    };
    animFrame.current = requestAnimationFrame(bob);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  /* Random talk timer */
  useEffect(() => {
    if (!entered) return;

    const pickQuote = () => {
      const quotes = Math.random() > 0.5 ? MONIKA_QUOTES : MONIKA_QUOTES_ES;
      return quotes[Math.floor(Math.random() * quotes.length)];
    };

    const talk = () => {
      setQuote(pickQuote());
      setShowBubble(true);
      setState('talking');
      setTimeout(() => {
        setShowBubble(false);
        setState('idle');
      }, 2800);
    };

    const first = setTimeout(talk, 3000 + Math.random() * 4000);
    const loop = setInterval(talk, 12000 + Math.random() * 8000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [entered]);

  /* ─── Drag handlers (pointer events — mouse + touch) ─── */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      setState('dragging');
      setShowBubble(false);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (state !== 'dragging') return;
      const nx = e.clientX - dragOffset.current.x;
      const ny = e.clientY - dragOffset.current.y;
      if (nx < pos.x - 2) setFacingRight(false);
      else if (nx > pos.x + 2) setFacingRight(true);
      setPos({ x: nx, y: ny });
    },
    [state, pos.x],
  );

  const onPointerUp = useCallback(() => {
    if (state === 'dragging') setState('idle');
  }, [state]);

  /* Double-click to trigger a random quote */
  const onDoubleClick = useCallback(() => {
    const quotes = Math.random() > 0.5 ? MONIKA_QUOTES : MONIKA_QUOTES_ES;
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setShowBubble(true);
    setState('talking');
    setTimeout(() => {
      setShowBubble(false);
      setState('idle');
    }, 3000);
  }, []);

  /* Calculate bob offset */
  const bobY = state === 'idle' ? Math.sin(bobRef.current) * 4 : 0;
  const isTalking = state === 'talking';
  const isDragging = state === 'dragging';

  return (
    <>
      <style>{`
        @keyframes chibi-enter {
          0%   { opacity: 0; transform: translateY(40px) scale(0.5); }
          60%  { opacity: 1; transform: translateY(-8px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bubble-pop {
          0%   { opacity: 0; transform: scale(0.3) translateY(10px); }
          60%  { opacity: 1; transform: scale(1.08) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chibi-shadow-pulse {
          0%, 100% { opacity: 0.18; transform: scaleX(1); }
          50%      { opacity: 0.12; transform: scaleX(0.85); }
        }
        .chibi-enter-anim {
          animation: chibi-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .bubble-pop-anim {
          animation: bubble-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .chibi-shadow {
          animation: chibi-shadow-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence>
        {entered && (
          <motion.div
            className="chibi-enter-anim select-none"
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y + bobY,
              zIndex: 100,
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `scaleX(${facingRight ? -1 : 1})`,
              transformOrigin: 'bottom center',
              filter: isDragging
                ? 'drop-shadow(0 8px 16px rgba(255,45,120,0.3))'
                : 'drop-shadow(0 4px 8px rgba(255,45,120,0.15))',
              transition: 'filter 0.3s ease',
              touchAction: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={onDoubleClick}
          >
            {/* Speech bubble */}
            <AnimatePresence>
              {showBubble && quote && (
                <motion.div
                  className="bubble-pop-anim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: `translateX(${facingRight ? '30%' : '-30%'})`,
                    marginBottom: 8,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#fff',
                      border: '2px solid #FFB6C1',
                      borderRadius: 16,
                      padding: '8px 16px',
                      fontFamily: "'m1_fixed', monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#d87093',
                      boxShadow: '0 4px 12px rgba(255,45,120,0.15)',
                      lineHeight: 1.3,
                      position: 'relative',
                    }}
                  >
                    {quote}
                    {/* Bubble triangle */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -8,
                        left: facingRight ? '60%' : '40%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid #FFB6C1',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chibi Monika sprite */}
            <motion.img
              src={CHIBI_SPRITES.idle}
              alt="Chibi Monika"
              draggable={false}
              animate={{
                scaleY: isTalking ? [1, 0.94, 1.03, 1] : 1,
                scaleX: isTalking ? [1, 1.03, 0.97, 1] : 1,
              }}
              transition={{
                duration: 0.4,
                repeat: isTalking ? 2 : 0,
                ease: 'easeInOut',
              }}
              style={{
                width: 80,
                height: 'auto',
                imageRendering: 'auto',
              }}
            />

            {/* Ground shadow */}
            <div
              className="chibi-shadow"
              style={{
                width: 50,
                height: 10,
                margin: '-4px auto 0',
                borderRadius: '50%',
                backgroundColor: 'rgba(186, 96, 158, 0.2)',
                filter: 'blur(3px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
