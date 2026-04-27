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
}

export function CommentSection({ targetId, targetType }: CommentSectionProps) {
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

  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <MessageCircle className="w-5 h-5 text-[#FF2D78]" /> Comentarios
      </h3>

      {/* New comment */}
      <div className="flex gap-3">
        {user ? (
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#a855f7] flex items-center justify-center flex-shrink-0">
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={16} className="text-white" />}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><User size={16} className="text-white/30" /></div>
        )}
        <div className="flex-1 flex gap-2">
          <input type="text" placeholder="Escribe un comentario..." value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newComment.trim()) submitComment(newComment.trim()); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all" />
          <button onClick={() => { if (newComment.trim()) submitComment(newComment.trim()); }} disabled={submitting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D78] to-[#a855f7] text-white text-sm font-semibold disabled:opacity-50 transition-all">
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.map(comment => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#4D9FFF] flex items-center justify-center flex-shrink-0">
                {comment.author.avatar ? <img src={comment.author.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={14} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{comment.author.nickname}</span>
                  {comment.author.role !== 'user' && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      comment.author.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      comment.author.role === 'moderator' ? 'bg-blue-500/20 text-blue-400' :
                      comment.author.role === 'owner' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{comment.author.role}</span>
                  )}
                  {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
                  <span className="text-[10px] text-white/20">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {comment.isDeleted ? (
                  <p className="text-sm text-white/20 italic mt-1">Este comentario fue eliminado</p>
                ) : (
                  <p className="text-sm text-white/70 mt-1">{comment.content}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => toggleLike(comment.id)} className="flex items-center gap-1 text-xs text-white/30 hover:text-[#FF2D78] transition-colors">
                    <Heart size={12} /> {comment.likes > 0 ? comment.likes : ''}
                  </button>
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="flex items-center gap-1 text-xs text-white/30 hover:text-[#4D9FFF] transition-colors">
                    <MessageCircle size={12} /> Responder
                  </button>
                  <button onClick={() => reportComment(comment.id)} className="flex items-center gap-1 text-xs text-white/30 hover:text-yellow-400 transition-colors">
                    <Flag size={12} /> Reportar
                  </button>
                  {canModerate && !comment.isDeleted && (
                    <button onClick={() => deleteComment(comment.id)} className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* Reply input */}
                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-3">
                    <input type="text" placeholder="Escribe una respuesta..." value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && replyText.trim()) { submitComment(replyText.trim(), comment.id); } }}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#FF2D78]/50 transition-all" />
                    <button onClick={() => { if (replyText.trim()) submitComment(replyText.trim(), comment.id); }} disabled={submitting}
                      className="px-3 py-2 rounded-lg bg-[#FF2D78] text-white text-xs font-semibold disabled:opacity-50">
                      <Send size={12} />
                    </button>
                    <button onClick={() => { setReplyTo(null); setReplyText(''); }} className="px-3 py-2 rounded-lg bg-white/5 text-white/40 text-xs">
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3 pl-3 border-l border-white/10">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          {reply.author.avatar ? <img src={reply.author.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={10} className="text-white/50" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white/80">{reply.author.nickname}</span>
                            <span className="text-[10px] text-white/20">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-white/60">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                    {comment.replies.length > 0 && (
                      <p className="text-[10px] text-white/20 pl-8">{comment.replies.length} respuestas</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm">No hay comentarios aún. ¡Sé el primero!</div>
        )}
      </div>
    </div>
  );
}
