'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Flag, Trash2, Send, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface CommentAuthor {
  id: string; nickname: string; avatar: string | null; role: string; isPremium: boolean;
}
interface CommentReply {
  id: string; content: string; createdAt: string; isDeleted: boolean;
  author: CommentAuthor; likes: number; dislikes: number;
}
interface Comment {
  id: string; content: string; createdAt: string; likes: number; dislikes: number; isDeleted: boolean;
  author: CommentAuthor; replies: CommentReply[];
  _count: { reactions: number };
}

interface CommentSectionProps {
  targetId: string;
  targetType: 'project' | 'news';
}

/* ──────────────────────────────────────────────────────────────
   1. MONIKA COMMENTS (Original Pink)
   ────────────────────────────────────────────────────────────── */
export function MonikaComments({ targetId, targetType }: CommentSectionProps) {
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetId, targetType, parentId }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      setNewComment(''); setReplyTo(null); setReplyText('');
      fetchComments();
      toast.success('Comentario publicado');
    } catch { toast.error('Error al enviar'); } finally { setSubmitting(false); }
  };

  const toggleLike    = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/like`,    { method: 'POST' }); fetchComments(); } catch {} };
  const toggleDislike = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/dislike`, { method: 'POST' }); fetchComments(); } catch {} };
  const reportComment = async (id: string) => { try { await fetch(`/api/comments/${id}/report`, { method: 'POST' }); toast.success('Comentario reportado'); } catch {} };
  const deleteComment = async (id: string) => { try { await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: id }) }); fetchComments(); toast.success('Comentario eliminado'); } catch {} };
  const canModerate = user && ['moderator', 'admin', 'owner'].includes(user.role);

  // Responder a una reply: abre el input del comentario padre y precarga @mención
  const replyToReply = (parentCommentId: string, authorNickname: string) => {
    setReplyTo(parentCommentId);
    setReplyText(`@${authorNickname} `);
  };

  return (
    <div className="mt-4 space-y-4" style={{ fontFamily: "'m1_fixed', monospace" }}>
      <style>{`
        @font-face { font-family: 'RifficFree'; src: url('/fonts/RifficFree-Bold.ttf') format('truetype'); font-weight: bold; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Aller'; src: url('/fonts/Aller_Rg.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
        .monika-title { font-family: 'RifficFree', monospace; font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; color: #fefefe; -webkit-text-stroke: 5px #ba609e; paint-order: stroke fill; }
        .role-badge { font-family: 'Aller', sans-serif; font-size: 10px; padding: 2px 7px; border-radius: 9999px; line-height: 1.4; }
      `}</style>

      <h3 className="monika-title"><MessageCircle className="w-5 h-5 text-[#FF2D78] flex-shrink-0" />Comentarios</h3>

      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${user ? 'bg-[#FF2D78]' : 'bg-[#FFB6C8]/50'}`}>
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={16} className={user ? 'text-white' : 'text-[#FF2D78]/50'} />}
        </div>
        <div className="flex flex-1 gap-2">
          <input type="text" placeholder="Escribe un comentario..." value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-white border border-[#FFB6C8]/40 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FF2D78]/50 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
          <button onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }} disabled={submitting || !newComment.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white bg-[#FF2D78] hover:bg-[#d6336c] disabled:opacity-40 transition-all">
            <Send size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {comments.length === 0 && <div className="text-center py-8 text-sm text-gray-400" style={{ fontFamily: "'Aller', sans-serif" }}>No hay comentarios aún. ¡Sé el primero!</div>}
        {comments.map(comment => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-[#FFE6EA]/50 border border-[#FFB6C8]/30 hover:bg-[#FFE6EA]/70 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#FF2D78]">
                {comment.author.avatar ? <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.author.nickname}</span>
                  {comment.author.role !== 'user' && <span className={`role-badge ${comment.author.role === 'admin' ? 'bg-red-100 text-red-600' : comment.author.role === 'moderator' ? 'bg-blue-100 text-blue-600' : comment.author.role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'}`}>{comment.author.role}</span>}
                  {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                  <span className="text-[11px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {comment.isDeleted ? <p className="text-sm italic mt-1 text-gray-400">Este comentario fue eliminado</p> :
                  <p className="text-sm mt-1 break-words text-gray-700" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.content}</p>}

                <div className="flex items-center gap-3 mt-2" style={{ fontFamily: "'Aller', sans-serif" }}>
                  {/* ❤ likes — siempre visible */}
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF2D78] transition-colors">
                    <Heart size={14} /><span>{comment.likes}</span>
                  </button>
                  {/* 👍 thumbs up */}
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF2D78] transition-colors">
                    <ThumbsUp size={13} /><span>{comment.likes}</span>
                  </button>
                  {/* 👎 thumbs down */}
                  <button onClick={() => toggleDislike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-500 transition-colors">
                    <ThumbsDown size={13} /><span>{comment.dislikes}</span>
                  </button>
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4D9FFF] transition-colors"><MessageCircle size={14} />Responder</button>
                  <button onClick={() => reportComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-500 transition-colors"><Flag size={14} />Reportar</button>
                  {canModerate && !comment.isDeleted && <button onClick={() => deleteComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                </div>

                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="Escribe una respuesta..." value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white border border-[#FFB6C8]/40 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FF2D78]/50 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
                    <button onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }} disabled={submitting} className="px-2.5 py-1.5 rounded-lg bg-[#FF2D78] text-white disabled:opacity-50 flex items-center"><Send size={11} /></button>
                    <button onClick={() => { setReplyTo(null); setReplyText(''); }} className="px-2.5 py-1.5 rounded-lg text-xs bg-[#FFE6EA] text-gray-500">Cancelar</button>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-3 border-l border-[#FFB6C8]/40">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#FF2D78]/80">
                          {reply.author.avatar ? <img src={reply.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={13} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">{reply.author.nickname}</span>
                            <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs break-words text-gray-500" style={{ fontFamily: "'Aller', sans-serif" }}>{reply.content}</p>
                          {/* Acciones de la reply */}
                          <div className="flex items-center gap-3 mt-1">
                            <button onClick={() => toggleLike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#FF2D78] transition-colors">
                              <ThumbsUp size={11} /><span>{reply.likes}</span>
                            </button>
                            <button onClick={() => toggleDislike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-500 transition-colors">
                              <ThumbsDown size={11} /><span>{reply.dislikes}</span>
                            </button>
                            <button onClick={() => replyToReply(comment.id, reply.author.nickname)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#4D9FFF] transition-colors">
                              <MessageCircle size={11} />Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] pl-10 text-gray-400">{comment.replies.length} {comment.replies.length === 1 ? 'respuesta' : 'respuestas'}</p>
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

/* ──────────────────────────────────────────────────────────────
   2. NATSUKI COMMENTS (Strong Pink)
   ────────────────────────────────────────────────────────────── */
export function NatsukiComments({ targetId, targetType }: CommentSectionProps) {
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetId, targetType, parentId }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      setNewComment(''); setReplyTo(null); setReplyText('');
      fetchComments();
      toast.success('Comentario publicado');
    } catch { toast.error('Error al enviar'); } finally { setSubmitting(false); }
  };

  const toggleLike    = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/like`,    { method: 'POST' }); fetchComments(); } catch {} };
  const toggleDislike = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/dislike`, { method: 'POST' }); fetchComments(); } catch {} };
  const reportComment = async (id: string) => { try { await fetch(`/api/comments/${id}/report`, { method: 'POST' }); toast.success('Comentario reportado'); } catch {} };
  const deleteComment = async (id: string) => { try { await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: id }) }); fetchComments(); toast.success('Comentario eliminado'); } catch {} };
  const canModerate = user && ['moderator', 'admin', 'owner'].includes(user.role);

  const replyToReply = (parentCommentId: string, authorNickname: string) => {
    setReplyTo(parentCommentId);
    setReplyText(`@${authorNickname} `);
  };

  return (
    <div className="mt-4 space-y-4" style={{ fontFamily: "'m1_fixed', monospace" }}>
      <style>{`
        @font-face { font-family: 'RifficFree'; src: url('/fonts/RifficFree-Bold.ttf') format('truetype'); font-weight: bold; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Aller'; src: url('/fonts/Aller_Rg.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
        .natsuki-title { font-family: 'RifficFree', monospace; font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; color: #fefefe; -webkit-text-stroke: 5px #FF3D7F; paint-order: stroke fill; }
        .role-badge { font-family: 'Aller', sans-serif; font-size: 10px; padding: 2px 7px; border-radius: 9999px; line-height: 1.4; }
      `}</style>
      <h3 className="natsuki-title"><MessageCircle className="w-5 h-5 text-[#E84393] flex-shrink-0" />Comentarios</h3>

      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${user ? 'bg-[#E84393]' : 'bg-[#FF7EB3]/50'}`}>
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={16} className={user ? 'text-white' : 'text-[#E84393]/50'} />}
        </div>
        <div className="flex flex-1 gap-2">
          <input type="text" placeholder="Escribe un comentario..." value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-white border border-[#FF7EB3]/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#E84393]/60 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
          <button onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }} disabled={submitting || !newComment.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white bg-[#E84393] hover:bg-[#D63384] disabled:opacity-40 transition-all">
            <Send size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {comments.length === 0 && <div className="text-center py-8 text-sm text-gray-400" style={{ fontFamily: "'Aller', sans-serif" }}>No hay comentarios aún. ¡Sé el primero!</div>}
        {comments.map(comment => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-[#FFE6EE]/60 border border-[#FF7EB3]/40 hover:bg-[#FFE6EE]/80 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#E84393]">
                {comment.author.avatar ? <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.author.nickname}</span>
                  {comment.author.role !== 'user' && <span className={`role-badge ${comment.author.role === 'admin' ? 'bg-red-100 text-red-600' : comment.author.role === 'moderator' ? 'bg-blue-100 text-blue-600' : comment.author.role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'}`}>{comment.author.role}</span>}
                  {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                  <span className="text-[11px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {comment.isDeleted ? <p className="text-sm italic mt-1 text-gray-400">Este comentario fue eliminado</p> :
                  <p className="text-sm mt-1 break-words text-gray-700" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.content}</p>}

                <div className="flex items-center gap-3 mt-2" style={{ fontFamily: "'Aller', sans-serif" }}>
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E84393] transition-colors">
                    <Heart size={14} /><span>{comment.likes}</span>
                  </button>
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E84393] transition-colors">
                    <ThumbsUp size={13} /><span>{comment.likes}</span>
                  </button>
                  <button onClick={() => toggleDislike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-500 transition-colors">
                    <ThumbsDown size={13} /><span>{comment.dislikes}</span>
                  </button>
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4D9FFF] transition-colors"><MessageCircle size={14} />Responder</button>
                  <button onClick={() => reportComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-500 transition-colors"><Flag size={14} />Reportar</button>
                  {canModerate && !comment.isDeleted && <button onClick={() => deleteComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                </div>

                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="Escribe una respuesta..." value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white border border-[#FF7EB3]/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#E84393]/60 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
                    <button onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }} disabled={submitting} className="px-2.5 py-1.5 rounded-lg bg-[#E84393] text-white disabled:opacity-50 flex items-center"><Send size={11} /></button>
                    <button onClick={() => { setReplyTo(null); setReplyText(''); }} className="px-2.5 py-1.5 rounded-lg text-xs bg-[#FFE6EE] text-gray-500">Cancelar</button>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-3 border-l border-[#FF7EB3]/40">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#E84393]/80">
                          {reply.author.avatar ? <img src={reply.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={13} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">{reply.author.nickname}</span>
                            <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs break-words text-gray-500" style={{ fontFamily: "'Aller', sans-serif" }}>{reply.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <button onClick={() => toggleLike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#E84393] transition-colors">
                              <ThumbsUp size={11} /><span>{reply.likes}</span>
                            </button>
                            <button onClick={() => toggleDislike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-500 transition-colors">
                              <ThumbsDown size={11} /><span>{reply.dislikes}</span>
                            </button>
                            <button onClick={() => replyToReply(comment.id, reply.author.nickname)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#4D9FFF] transition-colors">
                              <MessageCircle size={11} />Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] pl-10 text-gray-400">{comment.replies.length} {comment.replies.length === 1 ? 'respuesta' : 'respuestas'}</p>
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

/* ──────────────────────────────────────────────────────────────
   3. YURI COMMENTS (Purple)
   ────────────────────────────────────────────────────────────── */
export function YuriComments({ targetId, targetType }: CommentSectionProps) {
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetId, targetType, parentId }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error); return; }
      setNewComment(''); setReplyTo(null); setReplyText('');
      fetchComments();
      toast.success('Comentario publicado');
    } catch { toast.error('Error al enviar'); } finally { setSubmitting(false); }
  };

  const toggleLike    = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/like`,    { method: 'POST' }); fetchComments(); } catch {} };
  const toggleDislike = async (id: string) => { if (!user) return; try { await fetch(`/api/comments/${id}/dislike`, { method: 'POST' }); fetchComments(); } catch {} };
  const reportComment = async (id: string) => { try { await fetch(`/api/comments/${id}/report`, { method: 'POST' }); toast.success('Comentario reportado'); } catch {} };
  const deleteComment = async (id: string) => { try { await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: id }) }); fetchComments(); toast.success('Comentario eliminado'); } catch {} };
  const canModerate = user && ['moderator', 'admin', 'owner'].includes(user.role);

  const replyToReply = (parentCommentId: string, authorNickname: string) => {
    setReplyTo(parentCommentId);
    setReplyText(`@${authorNickname} `);
  };

  return (
    <div className="mt-4 space-y-4" style={{ fontFamily: "'m1_fixed', monospace" }}>
      <style>{`
        @font-face { font-family: 'RifficFree'; src: url('/fonts/RifficFree-Bold.ttf') format('truetype'); font-weight: bold; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Aller'; src: url('/fonts/Aller_Rg.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
        .yuri-title { font-family: 'RifficFree', monospace; font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; color: #fefefe; -webkit-text-stroke: 5px #8A2BE2; paint-order: stroke fill; }
        .role-badge { font-family: 'Aller', sans-serif; font-size: 10px; padding: 2px 7px; border-radius: 9999px; line-height: 1.4; }
      `}</style>

      <h3 className="yuri-title"><MessageCircle className="w-5 h-5 text-[#8A2BE2] flex-shrink-0" />Comentarios</h3>

      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${user ? 'bg-[#8A2BE2]' : 'bg-[#9B59B6]/50'}`}>
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={16} className={user ? 'text-white' : 'text-[#8A2BE2]/50'} />}
        </div>
        <div className="flex flex-1 gap-2">
          <input type="text" placeholder="Escribe un comentario..." value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className="flex-1 px-4 py-2 rounded-xl text-sm bg-white border border-[#9B59B6]/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8A2BE2]/60 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
          <button onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }} disabled={submitting || !newComment.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-white bg-[#8A2BE2] hover:bg-[#6A1B9A] disabled:opacity-40 transition-all">
            <Send size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {comments.length === 0 && <div className="text-center py-8 text-sm text-gray-400" style={{ fontFamily: "'Aller', sans-serif" }}>No hay comentarios aún. ¡Sé el primero!</div>}
        {comments.map(comment => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-[#F3E5F5]/60 border border-[#9B59B6]/40 hover:bg-[#F3E5F5]/80 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#8A2BE2]">
                {comment.author.avatar ? <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.author.nickname}</span>
                  {comment.author.role !== 'user' && <span className={`role-badge ${comment.author.role === 'admin' ? 'bg-red-100 text-red-600' : comment.author.role === 'moderator' ? 'bg-blue-100 text-blue-600' : comment.author.role === 'owner' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'}`}>{comment.author.role}</span>}
                  {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                  <span className="text-[11px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {comment.isDeleted ? <p className="text-sm italic mt-1 text-gray-400">Este comentario fue eliminado</p> :
                  <p className="text-sm mt-1 break-words text-gray-700" style={{ fontFamily: "'Aller', sans-serif" }}>{comment.content}</p>}

                <div className="flex items-center gap-3 mt-2" style={{ fontFamily: "'Aller', sans-serif" }}>
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#8A2BE2] transition-colors">
                    <Heart size={14} /><span>{comment.likes}</span>
                  </button>
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#8A2BE2] transition-colors">
                    <ThumbsUp size={13} /><span>{comment.likes}</span>
                  </button>
                  <button onClick={() => toggleDislike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-500 transition-colors">
                    <ThumbsDown size={13} /><span>{comment.dislikes}</span>
                  </button>
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4D9FFF] transition-colors"><MessageCircle size={14} />Responder</button>
                  <button onClick={() => reportComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-500 transition-colors"><Flag size={14} />Reportar</button>
                  {canModerate && !comment.isDeleted && <button onClick={() => deleteComment(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>}
                </div>

                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="Escribe una respuesta..." value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) submitComment(replyText.trim(), comment.id); }}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white border border-[#9B59B6]/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8A2BE2]/60 transition-all" style={{ fontFamily: "'Aller', sans-serif" }} />
                    <button onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }} disabled={submitting} className="px-2.5 py-1.5 rounded-lg bg-[#8A2BE2] text-white disabled:opacity-50 flex items-center"><Send size={11} /></button>
                    <button onClick={() => { setReplyTo(null); setReplyText(''); }} className="px-2.5 py-1.5 rounded-lg text-xs bg-[#F3E5F5] text-gray-500">Cancelar</button>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-3 border-l border-[#9B59B6]/40">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#8A2BE2]/80">
                          {reply.author.avatar ? <img src={reply.author.avatar} alt="" className="w-full h-full object-cover" /> : <User size={13} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">{reply.author.nickname}</span>
                            <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs break-words text-gray-500" style={{ fontFamily: "'Aller', sans-serif" }}>{reply.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <button onClick={() => toggleLike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#8A2BE2] transition-colors">
                              <ThumbsUp size={11} /><span>{reply.likes}</span>
                            </button>
                            <button onClick={() => toggleDislike(reply.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-500 transition-colors">
                              <ThumbsDown size={11} /><span>{reply.dislikes}</span>
                            </button>
                            <button onClick={() => replyToReply(comment.id, reply.author.nickname)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#4D9FFF] transition-colors">
                              <MessageCircle size={11} />Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] pl-10 text-gray-400">{comment.replies.length} {comment.replies.length === 1 ? 'respuesta' : 'respuestas'}</p>
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
