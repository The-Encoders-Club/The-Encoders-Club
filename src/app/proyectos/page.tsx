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
    }
    finally { setSubmitting(false); }
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
    <div className="mt-4 space-y-4" style={lightTheme ? { fontFamily: "'m1_fixed', monospace" } : undefined}>
      <style>{`
        @font-face {
          font-family: 'RifficFree';
          src: url('/fonts/RifficFree-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <h3
        className={`text-xl font-bold flex items-center gap-2 ${lightTheme ? '' : 'text-white'}`}
        style={{
          fontFamily: "'RifficFree', cursive",
          ...(lightTheme
            ? { WebkitTextStroke: '2px #6B1530', paintOrder: 'stroke fill', color: '#F092A6' }
            : {})
        }}
      >
        <MessageCircle className={`w-5 h-5 ${lightTheme ? 'text-[#FF2D78]' : 'text-[#FF2D78]'}`} style={{ flexShrink: 0 }} /> Comentarios
      </h3>

      {/* New comment input */}
      <div className="flex gap-3">
        {user ? (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${lightTheme ? 'bg-[#FF2D78]' : 'bg-gradient-to-r from-[#FF2D78] to-[#a855f7]'}`}>
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={16} className="text-white" />}
          </div>
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${lightTheme ? 'bg-[#FFB6C8]/50' : 'bg-white/10'}`}>
            <User size={16} className={lightTheme ? 'text-[#FF2D78]/50' : 'text-white/30'} />
          </div>
        )}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${inputCls}`}
          />
          <button
            onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }}
            disabled={submitting}
            className={`px-4 py-2.5 rounded-xl text-white text-base font-semibold disabled:opacity-50 transition-all ${sendBtnCls}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl transition-all ${cardBg}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-13 h-13 rounded-full flex items-center justify-center flex-shrink-0 ${lightTheme ? 'bg-[#FF2D78]' : 'bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF]'}`}>
                {comment.author.avatar
                  ? <img src={comment.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  : <User size={22} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-lg font-semibold ${lightTheme ? 'text-gray-800' : 'text-white'}`}>
                    {comment.author.nickname}
                  </span>
                  {comment.author.role !== 'user' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comment.author.role === 'admin'
                        ? (lightTheme ? 'bg-red-100 text-red-600' : 'bg-red-500/20 text-red-400')
                        : comment.author.role === 'moderator'
                          ? (lightTheme ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400')
                          : comment.author.role === 'owner'
                            ? (lightTheme ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-400')
                            : (lightTheme ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400')
                    }`}>
                      {comment.author.role}
                    </span>
                  )}
                  {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                  <span className={`text-xs ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {comment.isDeleted ? (
                  <p className={`text-lg italic mt-1 ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                    Este comentario fue eliminado
                  </p>
                ) : (
                  <p className={`text-lg mt-1 ${lightTheme ? 'text-gray-600' : 'text-white/70'}`}>
                    {comment.content}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1.5 text-base transition-colors ${lightTheme ? 'text-gray-400 hover:text-[#FF2D78]' : 'text-white/30 hover:text-[#FF2D78]'}`}
                  >
                    <Heart size={17} /> {comment.likes > 0 ? comment.likes : ''}
                  </button>
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className={`flex items-center gap-1.5 text-base transition-colors ${lightTheme ? 'text-gray-400 hover:text-[#4D9FFF]' : 'text-white/30 hover:text-[#4D9FFF]'}`}
                  >
                    <MessageCircle size={17} /> Responder
                  </button>
                  <button
                    onClick={() => reportComment(comment.id)}
                    className={`flex items-center gap-1.5 text-base transition-colors ${lightTheme ? 'text-gray-400 hover:text-yellow-500' : 'text-white/30 hover:text-yellow-400'}`}
                  >
                    <Flag size={17} /> Reportar
                  </button>
                  {canModerate && !comment.isDeleted && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className={`flex items-center gap-1.5 text-base transition-colors ${lightTheme ? 'text-gray-400 hover:text-red-500' : 'text-white/30 hover:text-red-400'}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                {/* Reply input */}
                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Escribe una respuesta..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) { submitComment(replyText.trim(), comment.id); } }}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none transition-all ${replyInputCls}`}
                    />
                    <button
                      onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      disabled={submitting}
                      className="px-3 py-2 rounded-lg bg-[#FF2D78] text-white text-xs font-semibold disabled:opacity-50"
                    >
                      <Send size={12} />
                    </button>
                    <button
                      onClick={() => { setReplyTo(null); setReplyText(''); }}
                      className={`px-3 py-2 rounded-lg text-xs ${lightTheme ? 'bg-[#FFE6EA] text-gray-500' : 'bg-white/5 text-white/40'}`}
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={`mt-3 space-y-3 pl-3 ${lightTheme ? 'border-l border-[#FFB6C8]/40' : 'border-l border-white/10'}`}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${lightTheme ? 'bg-[#FF2D78]/80' : 'bg-white/10'}`}>
                          {reply.author.avatar
                            ? <img src={reply.author.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            : <User size={16} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${lightTheme ? 'text-gray-700' : 'text-white/80'}`}>
                              {reply.author.nickname}
                            </span>
                            <span className={`text-xs ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-base ${lightTheme ? 'text-gray-500' : 'text-white/60'}`}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {comment.replies.length > 0 && (
                      <p className={`text-sm pl-10 ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
                        {comment.replies.length} respuestas
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <div className={`text-center py-8 text-lg ${lightTheme ? 'text-gray-400' : 'text-white/20'}`}>
            No hay comentarios aún. ¡Sé el primero!
          </div>
        )}
      </div>
    </div>
  );
}
