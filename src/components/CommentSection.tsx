'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Flag, Trash2, Send, User, Pencil, ChevronDown, ChevronUp, Loader2, ArrowUpDown } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import type { Comment, CommentReply } from '@/hooks/useComments';

interface CommentSectionProps {
  targetId: string;
  targetType: 'project' | 'news';
}

/* ──────────────────────────────────────────────────────────────
   SHARED THEME TYPES
   ────────────────────────────────────────────────────────────── */

interface CommentTheme {
  name: string;
  titleStroke: string;
  titleClass: string;
  primary: string;
  primaryBg: string;
  primaryHover: string;
  avatarBg: string;
  avatarBgMuted: string;
  border: string;
  cardBg: string;
  cardHover: string;
  replyBorder: string;
  cancelBg: string;
  sortArrowColor: string;
}

const MONIKA_THEME: CommentTheme = {
  name: 'monika',
  titleStroke: '#ba609e',
  titleClass: 'monika-title',
  primary: '#FF2D78',
  primaryBg: '#FF2D78',
  primaryHover: '#d6336c',
  avatarBg: '#FF2D78',
  avatarBgMuted: '#FFB6C8/50',
  border: '#FFB6C8/40',
  cardBg: '#FFE6EA/50',
  cardHover: '#FFE6EA/70',
  replyBorder: '#FFB6C8/40',
  cancelBg: '#FFE6EA',
  sortArrowColor: '#FF2D78',
};

const NATSUKI_THEME: CommentTheme = {
  name: 'natsuki',
  titleStroke: '#FF3D7F',
  titleClass: 'natsuki-title',
  primary: '#E84393',
  primaryBg: '#E84393',
  primaryHover: '#D63384',
  avatarBg: '#E84393',
  avatarBgMuted: '#FF7EB3/50',
  border: '#FF7EB3/50',
  cardBg: '#FFE6EE/60',
  cardHover: '#FFE6EE/80',
  replyBorder: '#FF7EB3/40',
  cancelBg: '#FFE6EE',
  sortArrowColor: '#E84393',
};

const YURI_THEME: CommentTheme = {
  name: 'yuri',
  titleStroke: '#8A2BE2',
  titleClass: 'yuri-title',
  primary: '#8A2BE2',
  primaryBg: '#8A2BE2',
  primaryHover: '#6A1B9A',
  avatarBg: '#8A2BE2',
  avatarBgMuted: '#9B59B6/50',
  border: '#9B59B6/50',
  cardBg: '#F3E5F5/60',
  cardHover: '#F3E5F5/80',
  replyBorder: '#9B59B6/40',
  cancelBg: '#F3E5F5',
  sortArrowColor: '#8A2BE2',
};

/* ──────────────────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
   ────────────────────────────────────────────────────────────── */

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: 'bg-red-100 text-red-600',
    moderator: 'bg-blue-100 text-blue-600',
    owner: 'bg-yellow-100 text-yellow-700',
    collaborator: 'bg-green-100 text-green-600',
  };
  return role !== 'user'
    ? <span className={`role-badge ${colors[role] || ''}`}>{role}</span>
    : null;
}

function Avatar({ src, size, bg }: { src?: string | null; size: 'sm' | 'md'; bg: string }) {
  const s = size === 'sm' ? 'w-8 h-8' : 'w-11 h-11';
  const iconS = size === 'sm' ? 13 : 20;
  return (
    <div className={`${s} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`} style={{ backgroundColor: bg }}>
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <User size={iconS} className="text-white" />}
    </div>
  );
}

function CommentInput({
  value, onChange, onSubmit, disabled, placeholder, theme, compact,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder: string;
  theme: CommentTheme;
  compact?: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2 mt-2">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          maxLength={2000}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white text-gray-700 placeholder-gray-400 focus:outline-none transition-all resize-none"
          style={{ fontFamily: "'Aller', sans-serif", border: `1px solid color-mix(in srgb, ${theme.primary} 40%, transparent)` }}
        />
        <button onClick={onSubmit} disabled={disabled || !value.trim()}
          className="px-2.5 py-1.5 rounded-lg text-white disabled:opacity-50 flex items-center" style={{ backgroundColor: theme.primaryBg }}>
          <Send size={11} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        maxLength={2000}
        className="flex-1 px-4 py-2 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none transition-all resize-none min-h-[38px] max-h-[120px]"
        style={{ fontFamily: "'Aller', sans-serif", border: `1px solid color-mix(in srgb, ${theme.primary} 40%, transparent)` }}
      />
      <div className="flex flex-col items-center gap-0.5">
        <button onClick={onSubmit} disabled={disabled || !value.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white disabled:opacity-40 transition-all"
          style={{ backgroundColor: theme.primaryBg }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = theme.primaryHover)}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = theme.primaryBg)}>
          <Send size={15} />
        </button>
        {value.length > 0 && (
          <span className="text-[10px] text-gray-400">{value.length}/{2000}</span>
        )}
      </div>
    </div>
  );
}

function SortDropdown({
  sort, onSort, theme,
}: {
  sort: string;
  onSort: (v: 'newest' | 'oldest' | 'most_liked') => void;
  theme: CommentTheme;
}) {
  const labels: Record<string, string> = { newest: 'Más nuevos', oldest: 'Más antiguos', most_liked: 'Más gustados' };
  return (
    <div className="flex items-center gap-1">
      <ArrowUpDown size={13} style={{ color: theme.sortArrowColor }} />
      <select
        value={sort}
        onChange={e => onSort(e.target.value as 'newest' | 'oldest' | 'most_liked')}
        className="text-[11px] bg-transparent text-gray-500 border-none focus:outline-none cursor-pointer"
        style={{ fontFamily: "'Aller', sans-serif" }}
      >
        <option value="newest">Más nuevos</option>
        <option value="oldest">Más antiguos</option>
        <option value="most_liked">Más gustados</option>
      </select>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   REPLY CARD (with all Facebook-like actions)
   ────────────────────────────────────────────────────────────── */

function ReplyCard({
  reply, theme, ctx,
}: {
  reply: CommentReply;
  theme: CommentTheme;
  ctx: ReturnType<typeof useComments>;
}) {
  const liked = ctx.userLikedComments.has(reply.id);
  const isOwn = ctx.isOwnComment(reply.author.id);
  const isEditing = ctx.editId === reply.id;
  const replyingToThis = ctx.replyToReply === reply.id;

  return (
    <div className="flex items-start gap-2">
      <Avatar src={reply.author.avatar} size="sm" bg={`${theme.avatarBg}80`} />

      <div className="flex-1 min-w-0">
        {/* Author row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold text-gray-700" style={{ fontFamily: "'Aller', sans-serif" }}>
            {reply.author.nickname}
          </span>
          <RoleBadge role={reply.author.role} />
          {reply.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
          <span className="text-[10px] text-gray-400">{ctx.timeAgo(reply.createdAt)}</span>
        </div>

        {/* Edit mode */}
        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={ctx.editText}
              onChange={e => ctx.setEditText(e.target.value)}
              rows={2}
              maxLength={2000}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-white text-gray-700 focus:outline-none transition-all resize-none"
              style={{ fontFamily: "'Aller', sans-serif", border: `1px solid color-mix(in srgb, ${theme.primary} 40%, transparent)` }}
            />
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => ctx.editComment(reply.id)} disabled={ctx.submitting || !ctx.editText.trim()}
                className="px-2.5 py-1 rounded-lg text-[10px] text-white disabled:opacity-50" style={{ backgroundColor: theme.primaryBg }}>
                Guardar
              </button>
              <button onClick={ctx.cancelEdit} className="px-2.5 py-1 rounded-lg text-[10px] text-gray-500" style={{ backgroundColor: theme.cancelBg }}>
                Cancelar
              </button>
              {ctx.editText.length > 0 && <span className="text-[10px] text-gray-400 ml-auto">{ctx.editText.length}/2000</span>}
            </div>
          </div>
        ) : (
          <p className="text-xs break-words text-gray-600 mt-0.5" style={{ fontFamily: "'Aller', sans-serif" }}>
            {reply.content}
          </p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-2.5 mt-1" style={{ fontFamily: "'Aller', sans-serif" }}>
            <button onClick={() => ctx.toggleLike(reply.id)}
              className={`flex items-center gap-0.5 text-[10px] transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
              <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
              {reply.likes > 0 && <span>{reply.likes}</span>}
            </button>
            <button onClick={() => ctx.startReplyToReply(reply.id, reply.parentCommentId || '')}
              className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-[#4D9FFF] transition-colors">
              <MessageCircle size={12} />Responder
            </button>
            {!ctx.userReportedComments.has(reply.id) && (
              <button onClick={() => ctx.reportComment(reply.id)}
                className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-yellow-500 transition-colors">
                <Flag size={12} />
              </button>
            )}
            {isOwn && (
              <button onClick={() => ctx.startEdit(reply.id, reply.content)}
                className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-blue-500 transition-colors">
                <Pencil size={12} />
              </button>
            )}
            {(isOwn || ctx.canModerate) && (
              <button onClick={() => ctx.deleteComment(reply.id)}
                className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* Reply to reply input */}
        {replyingToThis && (
          <CommentInput
            value={ctx.replyText}
            onChange={ctx.setReplyText}
            onSubmit={() => { if (ctx.replyText.trim()) ctx.submitComment(ctx.replyText.trim(), ctx.replyTo!); }}
            disabled={ctx.submitting}
            placeholder={`Respondiendo a ${reply.author.nickname}...`}
            theme={theme}
            compact
          />
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN COMMENT CARD (with all Facebook-like actions)
   ────────────────────────────────────────────────────────────── */

function CommentCard({
  comment, theme, ctx,
}: {
  comment: Comment;
  theme: CommentTheme;
  ctx: ReturnType<typeof useComments>;
}) {
  const liked = ctx.userLikedComments.has(comment.id);
  const isOwn = ctx.isOwnComment(comment.author.id);
  const isEditing = ctx.editId === comment.id;
  const showReplies = ctx.expandedReplies.has(comment.id);
  const isReplying = ctx.replyTo === comment.id && !ctx.replyToReply;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Attach parentId to each reply for reply-to-reply functionality
  const repliesWithParent = (comment.replies || []).map(r => ({
    ...r,
    parentCommentId: comment.id,
  }));

  return (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl border hover:opacity-95 transition-all"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: `color-mix(in srgb, ${theme.primary} 30%, transparent)`,
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar src={comment.author.avatar} size="md" bg={theme.avatarBg} />

        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: "'Aller', sans-serif" }}>
              {comment.author.nickname}
            </span>
            <RoleBadge role={comment.author.role} />
            {comment.author.isPremium && <span className="text-yellow-400 text-xs">★</span>}
            <span className="text-[11px] text-gray-400">{ctx.timeAgo(comment.createdAt)}</span>
          </div>

          {/* Content / Edit / Deleted */}
          {comment.isDeleted ? (
            <p className="text-sm italic mt-1 text-gray-400">Este comentario fue eliminado</p>
          ) : isEditing ? (
            <div className="mt-1">
              <textarea
                value={ctx.editText}
                onChange={e => ctx.setEditText(e.target.value)}
                rows={2}
                maxLength={2000}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white text-gray-700 focus:outline-none transition-all resize-none"
                style={{ fontFamily: "'Aller', sans-serif", border: `1px solid color-mix(in srgb, ${theme.primary} 40%, transparent)` }}
              />
              <div className="flex items-center gap-2 mt-1.5">
                <button onClick={() => ctx.editComment(comment.id)} disabled={ctx.submitting || !ctx.editText.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs text-white disabled:opacity-50 transition-all"
                  style={{ backgroundColor: theme.primaryBg }}>
                  {ctx.submitting ? <Loader2 size={13} className="animate-spin" /> : 'Guardar'}
                </button>
                <button onClick={ctx.cancelEdit} className="px-3 py-1.5 rounded-lg text-xs text-gray-500 transition-all"
                  style={{ backgroundColor: theme.cancelBg }}>
                  Cancelar
                </button>
                <span className="text-[10px] text-gray-400 ml-auto">{ctx.editText.length}/2000</span>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1 break-words text-gray-700" style={{ fontFamily: "'Aller', sans-serif" }}>
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!comment.isDeleted && !isEditing && (
            <div className="flex items-center gap-3 mt-2" style={{ fontFamily: "'Aller', sans-serif" }}>
              <button onClick={() => ctx.toggleLike(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>
              <button onClick={() => isReplying ? ctx.cancelReply() : ctx.startReply(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4D9FFF] transition-colors">
                <MessageCircle size={14} />Responder
              </button>
              {!ctx.userReportedComments.has(comment.id) && (
                <button onClick={() => ctx.reportComment(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-500 transition-colors">
                  <Flag size={14} />
                </button>
              )}
              {isOwn && (
                <button onClick={() => ctx.startEdit(comment.id, comment.content)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                  <Pencil size={14} />
                </button>
              )}
              {(isOwn || ctx.canModerate) && !comment.isDeleted && (
                <button onClick={() => ctx.deleteComment(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}

          {/* Reply input (parent comment) */}
          {isReplying && (
            <div className="mt-2">
              <CommentInput
                value={ctx.replyText}
                onChange={ctx.setReplyText}
                onSubmit={() => { if (ctx.replyText.trim()) ctx.submitComment(ctx.replyText.trim(), comment.id); }}
                disabled={ctx.submitting}
                placeholder="Escribe una respuesta..."
                theme={theme}
                compact
              />
              <button onClick={ctx.cancelReply} className="px-2.5 py-1 rounded-lg text-[10px] text-gray-500 mt-1 transition-all"
                style={{ backgroundColor: theme.cancelBg }}>
                Cancelar
              </button>
            </div>
          )}

          {/* Replies section */}
          {hasReplies && (
            <div className="mt-3 pl-3" style={{ borderLeft: `2px solid color-mix(in srgb, ${theme.primary} 30%, transparent)` }}>
              {/* Toggle replies button */}
              <button
                onClick={() => ctx.toggleReplies(comment.id)}
                className="flex items-center gap-1 text-[11px] font-medium mb-2 transition-colors"
                style={{ color: theme.primary }}
              >
                {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showReplies
                  ? 'Ocultar respuestas'
                  : `Ver ${comment.replies.length} ${comment.replies.length === 1 ? 'respuesta' : 'respuestas'}`
                }
              </button>

              {/* Replies list */}
              {showReplies && (
                <div className="space-y-2">
                  {repliesWithParent.map(reply => (
                    <ReplyCard key={reply.id} reply={reply} theme={theme} ctx={ctx} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   COMMENT SECTION WRAPPER (shared layout used by all 3 themes)
   ────────────────────────────────────────────────────────────── */

function CommentSectionInner({ targetId, targetType, theme }: CommentSectionProps & { theme: CommentTheme }) {
  const ctx = useComments(targetId, targetType);

  return (
    <div className="mt-4 space-y-4" style={{ fontFamily: "'m1_fixed', monospace" }}>
      <style>{`
        @font-face { font-family: 'RifficFree'; src: url('/fonts/RifficFree-Bold.ttf') format('truetype'); font-weight: bold; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Aller'; src: url('/fonts/Aller_Rg.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
        .${theme.titleClass} { font-family: 'RifficFree', monospace; font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; color: #fefefe; -webkit-text-stroke: 5px ${theme.titleStroke}; paint-order: stroke fill; }
        .role-badge { font-family: 'Aller', sans-serif; font-size: 10px; padding: 2px 7px; border-radius: 9999px; line-height: 1.4; }
      `}</style>

      {/* Header: title + count + sort */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className={theme.titleClass}>
          <MessageCircle className="w-5 h-5 flex-shrink-0" style={{ color: theme.primary }} />
          Comentarios
          {!ctx.loading && ctx.total > 0 && (
            <span className="text-[13px] font-normal" style={{ color: theme.primary, WebkitTextStroke: '0px', fontFamily: "'Aller', sans-serif" }}>
              ({ctx.total})
            </span>
          )}
        </h3>
        <SortDropdown sort={ctx.sort} onSort={ctx.setSort} theme={theme} />
      </div>

      {/* New comment input */}
      <div className="flex items-start gap-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: ctx.user ? theme.avatarBg : theme.avatarBgMuted }}>
          {ctx.user?.avatar
            ? <img src={ctx.user.avatar} alt="" className="w-full h-full object-cover" />
            : <User size={16} className={ctx.user ? 'text-white' : ''} style={ctx.user ? {} : { color: theme.primary, opacity: 0.5 }} />}
        </div>
        <div className="flex-1">
          <CommentInput
            value={ctx.newComment}
            onChange={ctx.setNewComment}
            onSubmit={() => { if (ctx.newComment.trim()) ctx.submitComment(ctx.newComment.trim()); }}
            disabled={ctx.submitting}
            placeholder="Escribe un comentario..."
            theme={theme}
          />
        </div>
      </div>

      {/* Loading state */}
      {ctx.loading && (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin" style={{ color: theme.primary }} />
        </div>
      )}

      {/* Comments list */}
      {!ctx.loading && (
        <div className="space-y-3 max-h-[40rem] overflow-y-auto pr-1">
          {ctx.comments.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400" style={{ fontFamily: "'Aller', sans-serif" }}>
              No hay comentarios aún. ¡Sé el primero!
            </div>
          )}
          {ctx.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} theme={theme} ctx={ctx} />
          ))}

          {/* Load more button */}
          {ctx.hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={ctx.loadMore}
                disabled={ctx.loadingMore}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white disabled:opacity-50 transition-all"
                style={{ backgroundColor: theme.primaryBg }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = theme.primaryHover)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = theme.primaryBg)}
              >
                {ctx.loadingMore ? (
                  <><Loader2 size={14} className="animate-spin" /> Cargando...</>
                ) : (
                  <>Cargar más comentarios</>
                )}
              </button>
            </div>
          )}

          {/* End of list indicator */}
          {!ctx.hasMore && ctx.comments.length > 0 && (
            <p className="text-center text-[11px] text-gray-400 py-2" style={{ fontFamily: "'Aller', sans-serif" }}>
              No hay más comentarios
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   1. MONIKA COMMENTS (Original Pink)
   ────────────────────────────────────────────────────────────── */
export function MonikaComments({ targetId, targetType }: CommentSectionProps) {
  return <CommentSectionInner targetId={targetId} targetType={targetType} theme={MONIKA_THEME} />;
}

/* ──────────────────────────────────────────────────────────────
   2. NATSUKI COMMENTS (Strong Pink)
   ────────────────────────────────────────────────────────────── */
export function NatsukiComments({ targetId, targetType }: CommentSectionProps) {
  return <CommentSectionInner targetId={targetId} targetType={targetType} theme={NATSUKI_THEME} />;
}

/* ──────────────────────────────────────────────────────────────
   3. YURI COMMENTS (Purple)
   ────────────────────────────────────────────────────────────── */
export function YuriComments({ targetId, targetType }: CommentSectionProps) {
  return <CommentSectionInner targetId={targetId} targetType={targetType} theme={YURI_THEME} />;
}

/* ──────────────────────────────────────────────────────────────
   4. GENERIC COMMENT SECTION (for noticias / dark theme)
   ────────────────────────────────────────────────────────────── */
export function CommentSection({ targetId, targetType }: CommentSectionProps) {
  return <CommentSectionInner targetId={targetId} targetType={targetType} theme={MONIKA_THEME} />;
}
