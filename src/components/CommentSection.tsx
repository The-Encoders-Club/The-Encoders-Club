'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Flag, Trash2, Send, User } from 'lucide-react';
import { toast } from 'sonner';

interface CommentAuthor {
  id: string; nickname: string; avatar: string | null; role: string; isPremium: boolean;
}

interface CommentReply {
  id: string; content: string; createdAt: string; isDeleted: boolean;
  author: CommentAuthor; likes: number;
}

interface Comment {
  id: string; content: string; createdAt: string; likes: number; isDeleted: boolean;
  author: CommentAuthor; replies: CommentReply[];
  _count: { reactions: number };
}

interface CommentSectionProps {
  targetId: string;
  targetType: 'project' | 'news';
  lightTheme?: boolean;
}

export function CommentSection({ targetId, targetType, lightTheme }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [user, setUser] = useState<{ id: string; nickname: string; role: string; avatar?: string | null } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    fetch('/api/auth/session').then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
  }, [targetId]);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?targetId=${targetId}&targetType=${targetType}`);
    const data = await res.json();
    setComments(data.comments || []);
  };

  const submitComment = async (content: string, parentId?: string) => {
    if (!user) { toast.error('Inicia sesión para comentar'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetId, targetType, parentId }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      setNewComment(''); setReplyTo(null); setReplyText('');
      fetchComments();
      toast.success('Comentario publicado');
    } catch {
      toast.error('Error al enviar');
    } finally { setSubmitting(false); }
  };

  const toggleLike = async (commentId: string) => {
    if (!user) return;
    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
      fetchComments();
    } catch { /* ignore */ }
  };

  const reportComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/report`, { method: 'POST' });
      toast.success('Comentario reportado');
    } catch { /* ignore */ }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId }) });
      fetchComments();
      toast.success('Comentario eliminado');
    } catch { /* ignore */ }
  };

  const canModerate = user && ['moderator', 'admin', 'owner'].includes(user.role);

  /* ─── Theme-aware style helpers ─── */
  const cardBg = lightTheme
    ? 'bg-[#FFE6EA]/50 border border-[#FFB6C8]/30 hover:bg-[#FFE6EA]/70'
    : 'bg-white/3 border border-white/5 hover:bg-white/5';
  const inputCls = lightTheme
    ? 'bg-white border border-[#FFB6C8]/40 text-gray-700 placeholder-gray-400 focus:border-[#FF2D78]/50'
    : 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF2D78]/50';
  const sendBtnCls = lightTheme
    ? 'bg-[#FF2D78] hover:bg-[#d6336c]'
    : 'bg-gradient-to-r from-[#FF2D78] to-[#a855f7]';
  const replyInputCls = lightTheme
    ? 'bg-white border border-[#FFB6C8]/40 text-gray-700 placeholder-gray-400 focus:border-[#FF2D78]/50'
    : 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#FF2D78]/50';

  return (
    <div
      className="mt-4 space-y-4"
      style={{ fontFamily: lightTheme ? "'m1_fixed', monospace" : undefined }}
    >
      <style>{`
        @font-face {
          font-family: 'RifficFree';
          src: url('/fonts/RifficFree-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aller';
          src: url('/fonts/Aller_Rg.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        /* ── Título con stroke igual al resto del sitio (pink-stroke-sm de page.tsx) ── */
        .comment-section-title {
          font-family: 'RifficFree', 'm1_fixed', monospace;
          font-size: 1.5rem;
          line-height: 1.2;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .comment-section-title.light {
          color: #fefefe;
          -webkit-text-stroke: 2px #ba609e;
          paint-order: stroke fill;
        }
        .comment-section-title.dark {
          color: #fff;
        }
        /* ── Badges de rol con Aller ── */
        .role-badge {
          font-family: 'Aller', sans-serif;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 9999px;
          line-height: 1.4;
          font-weight: normal;
        }
      `}</style>

      {/* ── Título ── */}
      <h3 className={`comment-section-title ${lightTheme ? 'light' : 'dark'}`}>
        <MessageCircle
          className="text-[#FF2D78] flex-shrink-0"
          style={{ width: '1.25rem', height: '1.25rem', strokeWidth: 2.2 }}
        />
        Comentarios
      </h3>

      {/* ── Input nuevo comentario ── */}
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden self-center ${
          user
            ? lightTheme ? 'bg-[#FF2D78]' : 'bg-gradient-to-r from-[#FF2D78] to-[#a855f7]'
            : lightTheme ? 'bg-[#FFB6C8]/50' : 'bg-white/10'
        }`}>
          {user?.avatar
            ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            : <User size={16} className={user ? 'text-white' : lightTheme ? 'text-[#FF2D78]/50' : 'text-white/30'} />
          }
        </div>

        {/* Campo + botón enviar */}
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className={`flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputCls}`}
            style={{ fontFamily: "'Aller', sans-serif" }}
          />
          <button
            onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }}
            disabled={submitting || !newComment.trim()}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0 disabled:opacity-40 transition-all ${sendBtnCls}`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* ── Lista de comentarios ── */}
      <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {comments.length === 0 && (
          <div className={`text-center py-8 text-sm ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}
            style={{ fontFamily: "'Aller', sans-serif" }}>
            No hay comentarios aún. ¡Sé el primero!
          </div>
        )}

        {comments.map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl transition-all ${cardBg}`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar comentario */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden self-start ${
                lightTheme ? 'bg-[#FF2D78]' : 'bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]'
              }`}>
                {comment.author.avatar
                  ? <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" />
                  : <User size={20} className="text-white" />}
              </div>

              <div className="flex-1 min-w-0">
                {/* Cabecera: nombre + rol + fecha */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span
                    className={`text-sm font-semibold leading-none ${lightTheme ? 'text-gray-800' : 'text-white'}`}
                    style={{ fontFamily: "'Aller', sans-serif" }}
                  >
                    {comment.author.nickname}
                  </span>

                  {comment.author.role !== 'user' && (
                    <span className={`role-badge ${
                      comment.author.role === 'admin'
                        ? lightTheme ? 'bg-red-100 text-red-600'         : 'bg-red-500/20 text-red-400'
                        : comment.author.role === 'moderator'
                          ? lightTheme ? 'bg-blue-100 text-blue-600'     : 'bg-blue-500/20 text-blue-400'
                          : comment.author.role === 'owner'
                            ? lightTheme ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-400'
                            : lightTheme ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {comment.author.role}
                    </span>
                  )}

                  {comment.author.isPremium && (
                    <span className="text-yellow-400 text-xs leading-none">★</span>
                  )}

                  <span
                    className={`text-[11px] leading-none ${lightTheme ? 'text-gray-400' : 'text-white/30'}`}
                    style={{ fontFamily: "'Aller', sans-serif" }}
                  >
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Contenido */}
                {comment.isDeleted ? (
                  <p className={`text-sm italic mt-1 ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                    Este comentario fue eliminado
                  </p>
                ) : (
                  <p
                    className={`text-sm mt-1 break-words ${lightTheme ? 'text-gray-700' : 'text-white/70'}`}
                    style={{ fontFamily: "'Aller', sans-serif" }}
                  >
                    {comment.content}
                  </p>
                )}

                {/* Acciones */}
                <div
                  className="flex items-center gap-3 mt-2"
                  style={{ fontFamily: "'Aller', sans-serif" }}
                >
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${lightTheme ? 'text-gray-400 hover:text-[#FF2D78]' : 'text-white/30 hover:text-[#FF2D78]'}`}
                  >
                    <Heart size={14} />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${lightTheme ? 'text-gray-400 hover:text-[#4D9FFF]' : 'text-white/30 hover:text-[#4D9FFF]'}`}
                  >
                    <MessageCircle size={14} /> Responder
                  </button>
                  <button
                    onClick={() => reportComment(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${lightTheme ? 'text-gray-400 hover:text-yellow-500' : 'text-white/30 hover:text-yellow-400'}`}
                  >
                    <Flag size={14} /> Reportar
                  </button>
                  {canModerate && !comment.isDeleted && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${lightTheme ? 'text-gray-400 hover:text-red-500' : 'text-white/30 hover:text-red-400'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Input respuesta */}
                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Escribe una respuesta..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all ${replyInputCls}`}
                      style={{ fontFamily: "'Aller', sans-serif" }}
                    />
                    <button
                      onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FF2D78] text-white disabled:opacity-50 flex items-center"
                    >
                      <Send size={11} />
                    </button>
                    <button
                      onClick={() => { setReplyTo(null); setReplyText(''); }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs ${lightTheme ? 'bg-[#FFE6EA] text-gray-500' : 'bg-white/5 text-white/40'}`}
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Respuestas */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={`mt-3 space-y-2 pl-3 ${lightTheme ? 'border-l border-[#FFB6C8]/40' : 'border-l border-white/10'}`}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${lightTheme ? 'bg-[#FF2D78]/80' : 'bg-white/10'}`}>
                          {reply.author.avatar
                            ? <img src={reply.author.avatar} alt="" className="w-full h-full object-cover" />
                            : <User size={13} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${lightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                              {reply.author.nickname}
                            </span>
                            <span className={`text-[10px] ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-xs break-words ${lightTheme ? 'text-gray-500' : 'text-white/60'}`}
                            style={{ fontFamily: "'Aller', sans-serif" }}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    <p className={`text-[10px] pl-10 ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                      {comment.replies.length} {comment.replies.length === 1 ? 'respuesta' : 'respuestas'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
