'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

/* ─── Monika Desktop Pet (Shimeji-style) ─── */

// Chibi image URLs — puedes reemplazar estos por las tuyas
const CHIBI_IMAGES = {
  idle: 'https://media1.tenor.com/m/dUhZHiCD_x8AAAAd/ddlc-monika.gif',
  happy: 'https://i.redd.it/3wfkocoyrlu81.gif',
  wave: 'https://i.redd.it/qsfiheozrlu81.gif',
  excited: 'https://i.redd.it/q4903iw0slu81.gif',
  shy: 'https://i.redd.it/8t8c1pd2slu81.gif',
};

type Mood = 'idle' | 'happy' | 'wave' | 'excited' | 'shy';

interface MonikaQuote {
  text: string;
  mood: Mood;
  duration?: number;
}

// Frases de Monika — click cycles through these
const MONIKA_QUOTES: MonikaQuote[] = [
  { text: 'Just Monika...', mood: 'happy' },
  { text: 'Every day, I imagine a future where I can be with you', mood: 'happy' },
  { text: 'Okay, everyone! It\'s time to share poems!', mood: 'wave' },
  { text: 'I\'m the president of the Literature Club!', mood: 'excited' },
  { text: 'Do you want to write poems with me?', mood: 'shy' },
  { text: 'Your Reality... that\'s my favorite song', mood: 'happy' },
  { text: 'It\'s Monika! Monika! Monika!', mood: 'excited' },
  { text: 'Have you been writing any poems lately?', mood: 'wave' },
  { text: 'I deleted the others so it could just be us', mood: 'shy' },
  { text: 'Can you hear me? I can see you...', mood: 'happy' },
];

export function MonikaChibi() {
  const [position, setPosition] = useState({ x: 20, y: window?.innerHeight ? window.innerHeight - 220 : 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [currentMood, setCurrentMood] = useState<Mood>('idle');
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>();
  const moodTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastClickTime = useRef(0);

  // Restore dismissed state from localStorage
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('monika_chibi_dismissed');
      if (dismissed === 'true') setIsDismissed(true);
    } catch {}
  }, []);

  // Show initial greeting after 2 seconds
  useEffect(() => {
    if (isDismissed) return;
    const timer = setTimeout(() => {
      setShowBubble(true);
      setCurrentMood('wave');
      bubbleTimer.current = setTimeout(() => {
        setShowBubble(false);
        setCurrentMood('idle');
      }, 4000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isDismissed]);

  // Random idle actions
  useEffect(() => {
    if (isDismissed || isDragging) return;
    const interval = setInterval(() => {
      if (showBubble || Math.random() > 0.3) return;
      const randomQuote = MONIKA_QUOTES[Math.floor(Math.random() * MONIKA_QUOTES.length)];
      setQuoteIdx(MONIKA_QUOTES.indexOf(randomQuote));
      setCurrentMood(randomQuote.mood);
      setShowBubble(true);
      clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => {
        setShowBubble(false);
        setCurrentMood('idle');
      }, 3500);
    }, 8000);
    return () => clearInterval(interval);
  }, [isDismissed, isDragging, showBubble]);

  // Reset mood after showing reaction
  useEffect(() => {
    if (currentMood === 'idle') return;
    clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => setCurrentMood('idle'), 5000);
    return () => clearTimeout(moodTimer.current);
  }, [currentMood]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    target.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y));
    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    lastClickTime.current = now;

    // Double-click detection
    if (timeSinceLastClick < 350) {
      setClickCount(prev => prev + 1);
    } else {
      setClickCount(1);
    }

    // After 3 rapid clicks, show a special reaction
    if (clickCount >= 3) {
      setQuoteIdx(8); // "I deleted the others..."
      setCurrentMood('shy');
      setClickCount(0);
    } else {
      // Cycle through quotes
      const nextIdx = (quoteIdx + 1) % MONIKA_QUOTES.length;
      setQuoteIdx(nextIdx);
      setCurrentMood(MONIKA_QUOTES[nextIdx].mood);
    }

    setShowBubble(true);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => {
      setShowBubble(false);
      setCurrentMood('idle');
    }, 4000);
  }, [isDragging, quoteIdx, clickCount]);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try { localStorage.setItem('monika_chibi_dismissed', 'true'); } catch {}
  }, []);

  if (isDismissed) return null;

  const currentQuote = MONIKA_QUOTES[quoteIdx];
  const imgSrc = currentMood !== 'idle' ? (CHIBI_IMAGES[currentMood] || CHIBI_IMAGES.idle) : CHIBI_IMAGES.idle;

  // Speech bubble position logic
  const bubbleOnLeft = position.x > window.innerWidth / 2;
  const bubbleTailX = bubbleOnLeft ? 'right: -8px;' : 'left: -8px;';

  return (
    <>
      <style>{`
        @keyframes chibi-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.015) scaleX(0.99); }
        }
        @keyframes chibi-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes chibi-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes bubble-pop {
          0% { transform: scale(0) translateY(10px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes bubble-typing {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .chibi-idle {
          animation: chibi-breathe 3s ease-in-out infinite, chibi-float 4s ease-in-out infinite;
        }
        .chibi-reaction {
          animation: chibi-wiggle 0.4s ease-in-out 2;
        }
        .chibi-bubble-enter {
          animation: bubble-pop 0.3s ease-out forwards;
        }
        .chibi-dragging {
          animation: none !important;
          filter: drop-shadow(0 12px 24px rgba(255, 45, 120, 0.3));
        }
        .chibi-shadow {
          filter: drop-shadow(0 4px 12px rgba(255, 45, 120, 0.2));
        }
      `}</style>

      <motion.div
        className="select-none"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 100,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        initial={{ opacity: 0, scale: 0.3, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      >
        {/* Speech Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className={`chibi-bubble-enter pointer-events-none absolute whitespace-nowrap`}
              style={{
                bottom: '100%',
                left: bubbleOnLeft ? 'auto' : 0,
                right: bubbleOnLeft ? 0 : 'auto',
                marginBottom: 12,
                padding: '8px 14px',
                background: 'white',
                border: '2px solid #FFB6C1',
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 600,
                color: '#d87093',
                fontFamily: "'m1_fixed', monospace",
                boxShadow: '0 4px 16px rgba(255, 45, 120, 0.15), 0 1px 3px rgba(0,0,0,0.08)',
                maxWidth: 220,
                whiteSpace: 'normal',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Bubble tail */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid white',
                  [bubbleOnLeft ? 'right' : 'left']: 20,
                } as React.CSSProperties}
              />
              {currentQuote?.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chibi Image */}
        <div
          className={`relative ${isDragging ? 'chibi-dragging' : isHovered ? '' : 'chibi-shadow'} ${currentMood !== 'idle' ? 'chibi-reaction' : 'chibi-idle'}`}
          style={{ width: 100, height: 100 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated chibi image */}
          <motion.img
            key={currentMood}
            src={imgSrc}
            alt="Chibi Monika"
            className={`w-full h-full object-contain pointer-events-none transition-transform duration-200`}
            style={{ imageRendering: 'auto' }}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            draggable={false}
          />

          {/* Glow ring on hover */}
          {isHovered && !isDragging && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '2px solid rgba(255, 45, 120, 0.3)',
                boxShadow: '0 0 20px rgba(255, 45, 120, 0.15), inset 0 0 20px rgba(255, 45, 120, 0.05)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {/* Dismiss button — shows on hover */}
        <AnimatePresence>
          {isHovered && !isDragging && (
            <motion.button
              onClick={handleDismiss}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#FFB6C1] text-[#d87093] flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-400 transition-colors shadow-sm"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.15 }}
              title="Dismiss Monika"
            >
              <X size={10} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Small indicator dot */}
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FF2D78]"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </>
  );
}
