'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommentAuthor {
  id: string;
  nickname: string;
  avatar: string | null;
  role: string;
  isPremium: boolean;
}

export interface CommentReply {
  id: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
  author: CommentAuthor;
  likes: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isDeleted: boolean;
  author: CommentAuthor;
  replies: CommentReply[];
  _count: { reactions: number };
}

interface UseCommentsReturn {
  // State
  comments: Comment[];
  user: { id: string; nickname: string; role: string; avatar?: string | null } | null;
  loading: boolean;
  loadingMore: boolean;
  submitting: boolean;
  total: number;
  hasMore: boolean;
  replyTo: string | null;
  replyToReply: string | null;
  replyText: string;
  newComment: string;
  editId: string | null;
  editText: string;
  sort: 'newest' | 'oldest' | 'most_liked';
  expandedReplies: Set<string>;
  userLikedComments: Set<string>;
  userReportedComments: Set<string>;
  canModerate: boolean;

  // Constants
  PAGE_SIZE: number;
  MAX_CHARS: number;

  // Setters
  setNewComment: (v: string) => void;
  setReplyText: (v: string) => void;
  setEditText: (v: string) => void;
  setSort: (v: 'newest' | 'oldest' | 'most_liked') => void;

  // Actions
  fetchComments: (append?: boolean) => Promise<void>;
  submitComment: (content: string, parentId?: string) => Promise<void>;
  toggleLike: (commentId: string) => Promise<void>;
  reportComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  editComment: (commentId: string) => Promise<void>;
  startEdit: (commentId: string, currentContent: string) => void;
  cancelEdit: () => void;
  startReply: (commentId: string) => void;
  startReplyToReply: (replyId: string, parentId: string) => void;
  cancelReply: () => void;
  loadMore: () => Promise<void>;
  toggleReplies: (commentId: string) => void;
  isOwnComment: (authorId: string) => boolean;
  timeAgo: (dateString: string) => string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 5;
const MAX_CHARS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMin < 1) return 'ahora mismo';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour}h`;
  if (diffDay < 7) return `hace ${diffDay}d`;
  if (diffMonth < 1) return `hace ${diffWeek} sem`;
  return new Date(dateString).toLocaleDateString('es');
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useComments(
  targetId: string,
  targetType: 'project' | 'news',
): UseCommentsReturn {
  // ----- State ---------------------------------------------------------------
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<{
    id: string;
    nickname: string;
    role: string;
    avatar?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToReply, setReplyToReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sort, setSortInternal] = useState<'newest' | 'oldest' | 'most_liked'>(
    'newest',
  );
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const [userLikedComments, setUserLikedComments] = useState<Set<string>>(
    new Set(),
  );
  const [userReportedComments, setUserReportedComments] = useState<
    Set<string>
  >(new Set());

  // ----- Derived -------------------------------------------------------------
  const hasMore = useMemo(() => comments.length < total, [comments.length, total]);

  const canModerate = useMemo(
    () => user !== null && ['moderator', 'admin', 'owner'].includes(user.role),
    [user],
  );

  // ----- Helpers -------------------------------------------------------------
  const isOwnComment = useCallback(
    (authorId: string) => user?.id === authorId,
    [user],
  );

  // ----- Fetch user ----------------------------------------------------------
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data?.user) {
        setUser({
          id: data.user.id,
          nickname: data.user.nickname ?? data.user.name ?? 'Anónimo',
          role: data.user.role ?? 'user',
          avatar: data.user.avatar ?? data.user.image ?? null,
        });
      } else {
        setUser(null);
      }
    } catch {
      // Silent fail – user stays null
      setUser(null);
    }
  }, []);

  // ----- Fetch comments ------------------------------------------------------
  const fetchComments = useCallback(
    async (append = false) => {
      const isAppend = append && comments.length > 0;
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams({
          targetId,
          targetType,
          limit: String(PAGE_SIZE),
          offset: String(isAppend ? comments.length : 0),
          sort,
        });

        const res = await fetch(`/api/comments?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // The API may return { comments, total } or just { comments }
        const incomingComments: Comment[] = data.comments ?? [];
        const incomingTotal: number =
          typeof data.total === 'number' ? data.total : incomingComments.length;

        setComments((prev) =>
          isAppend ? [...prev, ...incomingComments] : incomingComments,
        );
        setTotal(incomingTotal);
      } catch (err) {
        console.error('[useComments] fetchComments error:', err);
        toast.error('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [targetId, targetType, sort, comments.length],
  );

  // ----- Submit comment / reply ----------------------------------------------
  const submitComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!content.trim()) return;

      setSubmitting(true);
      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content.trim(),
            targetId,
            targetType,
            parentId: parentId ?? undefined,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Error ${res.status}`);
        }

        // Reset local input state
        setNewComment('');
        setReplyText('');
        setReplyTo(null);
        setReplyToReply(null);

        // Re-fetch to get the updated list (replace, not append)
        await fetchComments(false);
      } catch (err) {
        console.error('[useComments] submitComment error:', err);
        toast.error(
          err instanceof Error ? err.message : 'No se pudo publicar el comentario',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [targetId, targetType, fetchComments],
  );

  // ----- Toggle like (optimistic) -------------------------------------------
  const toggleLike = useCallback(
    async (commentId: string) => {
      const alreadyLiked = userLikedComments.has(commentId);

      // Optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: alreadyLiked ? c.likes - 1 : c.likes + 1 }
            : c,
        ),
      );

      // Update replies too
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId
              ? { ...r, likes: alreadyLiked ? r.likes - 1 : r.likes + 1 }
              : r,
          ),
        })),
      );

      setUserLikedComments((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) {
          next.delete(commentId);
        } else {
          next.add(commentId);
        }
        return next;
      });

      try {
        const res = await fetch(`/api/comments/${commentId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          // Revert optimistic update on failure
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId
                ? { ...c, likes: alreadyLiked ? c.likes + 1 : c.likes - 1 }
                : c,
            ),
          );
          setComments((prev) =>
            prev.map((c) => ({
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? {
                      ...r,
                      likes: alreadyLiked ? r.likes + 1 : r.likes - 1,
                    }
                  : r,
              ),
            })),
          );
          setUserLikedComments((prev) => {
            const next = new Set(prev);
            if (alreadyLiked) {
              next.add(commentId);
            } else {
              next.delete(commentId);
            }
            return next;
          });
          throw new Error(`Error ${res.status}`);
        }

        // Sync with server response if available
        const data = await res.json().catch(() => null);
        if (data) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === commentId) {
                return { ...c, likes: data.likes ?? c.likes };
              }
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === commentId
                    ? { ...r, likes: data.likes ?? r.likes }
                    : r,
                ),
              };
            }),
          );
          if (typeof data.liked === 'boolean') {
            setUserLikedComments((prev) => {
              const next = new Set(prev);
              if (data.liked) {
                next.add(commentId);
              } else {
                next.delete(commentId);
              }
              return next;
            });
          }
        }
      } catch (err) {
        console.error('[useComments] toggleLike error:', err);
        toast.error('No se pudo procesar tu reacción');
      }
    },
    [userLikedComments],
  );

  // ----- Report comment ------------------------------------------------------
  const reportComment = useCallback(
    async (commentId: string) => {
      if (userReportedComments.has(commentId)) {
        toast.info('Ya reportaste este comentario');
        return;
      }

      try {
        const res = await fetch(`/api/comments/${commentId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        setUserReportedComments((prev) => new Set(prev).add(commentId));
        toast.success(
          data.message ?? 'Comentario reportado. Gracias por tu ayuda.',
        );
      } catch (err) {
        console.error('[useComments] reportComment error:', err);
        toast.error('No se pudo reportar el comentario');
      }
    },
    [userReportedComments],
  );

  // ----- Delete comment ------------------------------------------------------
  const deleteComment = useCallback(
    async (commentId: string) => {
      const confirmed = window.confirm(
        '¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.',
      );
      if (!confirmed) return;

      try {
        const res = await fetch('/api/comments', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Error ${res.status}`);
        }

        toast.success('Comentario eliminado');
        await fetchComments(false);
      } catch (err) {
        console.error('[useComments] deleteComment error:', err);
        toast.error(
          err instanceof Error ? err.message : 'No se pudo eliminar el comentario',
        );
      }
    },
    [fetchComments],
  );

  // ----- Edit comment --------------------------------------------------------
  const editComment = useCallback(
    async (commentId: string) => {
      const trimmed = editText.trim();
      if (!trimmed) {
        toast.error('El comentario no puede estar vacío');
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: trimmed }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Error ${res.status}`);
        }

        toast.success('Comentario editado');
        cancelEdit();
        await fetchComments(false);
      } catch (err) {
        console.error('[useComments] editComment error:', err);
        toast.error(
          err instanceof Error ? err.message : 'No se pudo editar el comentario',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [editText, fetchComments],
  );

  // ----- Edit helpers --------------------------------------------------------
  const startEdit = useCallback((commentId: string, currentContent: string) => {
    setEditId(commentId);
    setEditText(currentContent);
    cancelReply();
  }, []);

  const cancelEdit = useCallback(() => {
    setEditId(null);
    setEditText('');
  }, []);

  // ----- Reply helpers -------------------------------------------------------
  const startReply = useCallback((commentId: string) => {
    cancelEdit();
    setReplyTo(commentId);
    setReplyToReply(null);
    setReplyText('');
  }, []);

  const startReplyToReply = useCallback(
    (replyId: string, parentId: string) => {
      cancelEdit();
      setReplyTo(parentId); // reply goes under the parent thread
      setReplyToReply(replyId);
      setReplyText('');
    },
    [],
  );

  const cancelReply = useCallback(() => {
    setReplyTo(null);
    setReplyToReply(null);
    setReplyText('');
  }, []);

  // ----- Pagination ----------------------------------------------------------
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchComments(true);
  }, [fetchComments, loadingMore, hasMore]);

  // ----- Sort ---------------------------------------------------------------
  const setSort = useCallback(
    (newSort: 'newest' | 'oldest' | 'most_liked') => {
      if (newSort === sort) return;
      setSortInternal(newSort);
    },
    [sort],
  );

  // Re-fetch when sort changes (reset to page 0)
  useEffect(() => {
    setComments([]);
    fetchComments(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // ----- Toggle replies visibility -------------------------------------------
  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  // ----- Initial load on mount / targetId change ----------------------------
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only fetch comments if we have a valid targetId
    if (!targetId) return;

    // Reset state for new target
    setComments([]);
    setTotal(0);
    setNewComment('');
    setReplyText('');
    setReplyTo(null);
    setReplyToReply(null);
    setEditId(null);
    setEditText('');
    setExpandedReplies(new Set());
    setUserLikedComments(new Set());
    setUserReportedComments(new Set());

    fetchComments(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  // ----- Return -------------------------------------------------------------
  return {
    // State
    comments,
    user,
    loading,
    loadingMore,
    submitting,
    total,
    hasMore,
    replyTo,
    replyToReply,
    replyText,
    newComment,
    editId,
    editText,
    sort,
    expandedReplies,
    userLikedComments,
    userReportedComments,
    canModerate,

    // Constants
    PAGE_SIZE,
    MAX_CHARS,

    // Setters
    setNewComment,
    setReplyText,
    setEditText,
    setSort,

    // Actions
    fetchComments,
    submitComment,
    toggleLike,
    reportComment,
    deleteComment,
    editComment,
    startEdit,
    cancelEdit,
    startReply,
    startReplyToReply,
    cancelReply,
    loadMore,
    toggleReplies,
    isOwnComment,
    timeAgo,
  };
}

