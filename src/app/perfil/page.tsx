'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, Camera, Crown, Lock, Save,
  Edit3, X, Check, Shield, Star, Loader2, Trash2, AlertTriangle,
  Clock, MessageSquare, Award, Settings, ChevronRight, Eye, EyeOff,
  Terminal, Sparkles, Code2
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useI18n } from '@/hooks/useLocale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  role: string;
  isPremium: boolean;
  isBanned: boolean;
  createdAt?: string;
  updatedAt?: string;
  commentCount?: number;
}

export default function Perfil() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-b-[#00F2FE] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
      </div>
    }>
      <PerfilContent />
    </Suspense>
  );
}

function PerfilContent() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const isEs = locale === 'es';
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(d => {
        if (!d.user) {
          router.push('/');
          return;
        }
        setUser(d.user);
      });
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(prev => (prev ? { ...prev, ...d.user } : d.user));
        }
      });
  }, [router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isEs ? 'La imagen debe ser menor a 5MB' : 'Image must be less than 5MB');
      return;
    }
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/api/user/avatar', { method: 'POST', body: formData });
      if (!res.ok) {
        toast.error(isEs ? 'Error al subir avatar' : 'Error uploading avatar');
        return;
      }
      const data = await res.json();
      setUser(prev => (prev ? { ...prev, avatar: data.avatar } : prev));
      toast.success(isEs ? 'Avatar actualizado' : 'Avatar updated');
    } catch {
      toast.error(isEs ? 'Error de conexion' : 'Connection error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim()) {
      toast.error(isEs ? 'El nickname no puede estar vacio' : 'Nickname cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: editNickname, email: editEmail }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || (isEs ? 'Error al guardar' : 'Error saving'));
        return;
      }
      setUser(prev => (prev ? { ...prev, nickname: editNickname, email: editEmail } : prev));
      setEditing(false);
      toast.success(isEs ? 'Perfil actualizado' : 'Profile updated');
    } catch {
      toast.error(isEs ? 'Error al guardar' : 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error(isEs ? 'Las contrasenas no coinciden' : 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error(isEs ? 'Minimo 6 caracteres' : 'Minimum 6 characters');
      return;
    }
    if (!currentPassword) {
      toast.error(isEs ? 'Ingresa tu contrasena actual' : 'Enter your current password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || (isEs ? 'Error al cambiar contrasena' : 'Error changing password'));
        return;
      }
      toast.success(isEs ? 'Contrasena actualizada' : 'Password updated');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      toast.error(isEs ? 'Error' : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error(isEs ? 'Ingresa tu contrasena' : 'Enter your password');
      return;
    }
    if (deleteConfirmText !== 'BORRAR') {
      toast.error(isEs ? 'Escribe BORRAR para confirmar' : 'Type DELETE to confirm');
      return;
    }
    if (user?.role === 'owner') {
      toast.error(isEs ? 'Los owners no pueden borrar su cuenta' : 'Owners cannot delete their account');
      return;
    }
    setDeletingAccount(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || (isEs ? 'Error al borrar cuenta' : 'Error deleting account'));
        return;
      }
      toast.success(isEs ? 'Tu cuenta ha sido eliminada' : 'Your account has been deleted');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      toast.error(isEs ? 'Error de conexion' : 'Connection error');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-b-[#00F2FE] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    owner: 'text-yellow-300 border-yellow-500/40 bg-yellow-500/10',
    admin: 'text-red-300 border-red-500/40 bg-red-500/10',
    moderator: 'text-[#00F2FE] border-[#00F2FE]/40 bg-[#00F2FE]/10',
    collaborator: 'text-green-300 border-green-500/40 bg-green-500/10',
  };
  const roleLabels: Record<string, string> = {
    owner: 'Owner',
    admin: isEs ? 'Administrador' : 'Administrator',
    moderator: isEs ? 'Moderador' : 'Moderator',
    collaborator: isEs ? 'Colaborador' : 'Collaborator',
    user: isEs ? 'Usuario' : 'User',
  };
  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown size={12} />,
    admin: <Shield size={12} />,
    moderator: <Shield size={12} />,
    collaborator: <Star size={12} />,
    user: <User size={12} />,
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(isEs ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : (isEs ? 'Desconocido' : 'Unknown');

  const memberDays = user.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      <main className="relative z-10 pt-16 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >

            {/* ═══════════════════════════════════════════════════════════
                PAGE HEADER — IDE // label + Cyberpunk gradient
            ═══════════════════════════════════════════════════════════ */}
            <motion.div variants={itemVariants} className="pt-8 sm:pt-12">
              <span className="font-cyber font-bold text-sm tracking-widest text-[#FF2D78] mb-3 block">
                {'// '}{isEs ? 'Tu perfil' : 'Your profile'}
              </span>
              <h1 className="font-cyber text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 uppercase tracking-tight">
                {isEs ? 'Perfil de' : 'Profile'} <span className="brand-gradient-text">{isEs ? 'Usuario' : 'User'}</span>
              </h1>
              <p className="font-code text-sm text-white/50 max-w-xl">
                {isEs
                  ? 'Administra tu cuenta, avatar y configuracion personal.'
                  : 'Manage your account, avatar, and personal settings.'}
              </p>
            </motion.div>

            {/* ── Gradient separator ── */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF2D78]/30 to-transparent" />

            {/* ═══════════════════════════════════════════════════════════
                PROFILE HERO — Cyberpunk card + Anime glow + IDE labels
            ═══════════════════════════════════════════════════════════ */}
            <motion.div
              variants={itemVariants}
              className="clip-card relative overflow-hidden bg-[#0b0b16] border border-white/8"
            >
              {/* Top brand gradient bar */}
              <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

              {/* Decorative anime-style blur orbs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF2D78]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#00F2FE]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-[#9d4edd]/6 rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

                  {/* Avatar — Cyberpunk clip-path frame + Anime glow */}
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* Neon glow ring */}
                    <div className="absolute -inset-2 clip-card bg-gradient-to-r from-[#FF2D78] via-[#9d4edd] to-[#00F2FE] opacity-40 group-hover:opacity-80 blur-sm transition-opacity duration-500" />
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 clip-card overflow-hidden border-2 border-[#FF2D78]/40 bg-[#0d0d24]">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF2D78] to-[#9d4edd] flex items-center justify-center">
                          <User size={48} className="text-white/80" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                        {uploadingAvatar ? (
                          <div className="relative">
                            <div className="w-6 h-6 border-2 border-[#00F2FE] border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Camera size={20} className="text-[#00F2FE]" />
                            <span className="font-code text-[9px] text-[#00F2FE]/80 uppercase">{isEs ? 'Cambiar' : 'Change'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Online status dot — Anime style */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 clip-card bg-[#0b0b16] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  {/* User Info — IDE style labels + Cyberpunk accents */}
                  <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                      <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                        {user.nickname}
                      </h2>
                      {user.isPremium && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="clip-btn flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 font-cyber text-[10px] font-bold px-3 py-1 uppercase tracking-wider"
                        >
                          <Crown size={12} className="fill-yellow-300" />
                          PREMIUM
                        </motion.span>
                      )}
                    </div>

                    {/* Role badge — IDE code-style */}
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                      <span className={`inline-flex items-center gap-1.5 font-code text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wider ${
                        roleColors[user.role] || 'text-white/50 border-white/20 bg-white/5'
                      }`}>
                        {roleIcons[user.role]}
                        {roleLabels[user.role] || user.role}
                      </span>
                    </div>

                    {/* Meta info — IDE terminal style */}
                    <div className="flex flex-wrap items-center gap-4 text-sm justify-center md:justify-start">
                      <span className="flex items-center gap-1.5 font-code text-[11px] text-white/45">
                        <Calendar size={12} className="text-[#FF2D78]/60" />
                        {memberSince}
                      </span>
                      {memberDays > 0 && (
                        <span className="flex items-center gap-1.5 font-code text-[11px] text-white/45">
                          <Clock size={12} className="text-[#00F2FE]/60" />
                          {memberDays} {isEs ? 'dias' : 'days'} {isEs ? 'miembro' : 'member'}
                        </span>
                      )}
                      {user.email && (
                        <span className="flex items-center gap-1.5 font-code text-[11px] text-white/45">
                          <Mail size={12} className="text-[#9d4edd]/60" />
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons — Cyberpunk clip-btn */}
                  <div className="hidden md:flex shrink-0">
                    {!editing ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setEditing(true);
                          setEditNickname(user.nickname);
                          setEditEmail(user.email || '');
                        }}
                        className="btn-outline text-sm px-6 py-3"
                      >
                        <Edit3 size={16} />
                        {isEs ? 'Editar Perfil' : 'Edit Profile'}
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="btn-primary text-sm px-5 py-3 disabled:opacity-50"
                        >
                          <Save size={16} />
                          {loading ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar' : 'Save')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setEditing(false)}
                          className="clip-btn px-4 py-3 border border-white/10 bg-white/5 text-white/50 font-cyber text-sm hover:bg-white/10 transition-all"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Form — IDE terminal style inputs */}
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-[#FF2D78]/15 grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                            <span className="text-[#00F2FE]">{'>'}</span> Nickname
                          </label>
                          <div className="relative">
                            <User
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]/40"
                            />
                            <input
                              type="text"
                              value={editNickname}
                              onChange={e => setEditNickname(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#FF2D78]/20 text-white font-code text-sm focus:outline-none focus:border-[#00F2FE]/50 focus:shadow-[0_0_10px_rgba(0,242,254,0.1)] transition-all placeholder:text-white/20"
                              placeholder={isEs ? 'Tu nickname' : 'Your nickname'}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                            <span className="text-[#9d4edd]">{'>'}</span> Email
                          </label>
                          <div className="relative">
                            <Mail
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d4edd]/40"
                            />
                            <input
                              type="email"
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#9d4edd]/20 text-white font-code text-sm focus:outline-none focus:border-[#9d4edd]/50 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] transition-all placeholder:text-white/20"
                              placeholder="correo@ejemplo.com"
                            />
                          </div>
                        </div>
                        {/* Mobile save buttons */}
                        <div className="flex gap-2 sm:hidden">
                          <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50 flex-1"
                          >
                            <Save size={16} />
                            {loading ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar' : 'Save')}
                          </button>
                          <button
                            onClick={() => setEditing(false)}
                            className="clip-btn px-4 py-2.5 border border-white/10 bg-white/5 text-white/50 font-cyber text-sm hover:bg-white/10 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Gradient separator ── */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00F2FE]/20 to-transparent" />

            {/* ═══════════════════════════════════════════════════════════
                STATS ROW — Cyberpunk clip-cards + IDE font-code + Anime colors
            ═══════════════════════════════════════════════════════════ */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: <MessageSquare size={18} />,
                  value: user.commentCount || 0,
                  label: isEs ? 'Comentarios' : 'Comments',
                  color: '#FF2D78',
                  bg: 'bg-[#FF2D78]/5',
                  border: 'border-[#FF2D78]/20',
                },
                {
                  icon: <Award size={18} />,
                  value: user.role !== 'user' ? (isEs ? 'Si' : 'Yes') : (isEs ? 'No' : 'No'),
                  label: isEs ? 'Verificado' : 'Verified',
                  color: user.role !== 'user' ? '#22c55e' : '#555',
                  bg: user.role !== 'user' ? 'bg-green-500/5' : 'bg-white/3',
                  border: user.role !== 'user' ? 'border-green-500/20' : 'border-white/8',
                },
                {
                  icon: <Crown size={18} />,
                  value: user.isPremium ? (isEs ? 'Si' : 'Yes') : (isEs ? 'No' : 'No'),
                  label: 'Premium',
                  color: user.isPremium ? '#eab308' : '#555',
                  bg: user.isPremium ? 'bg-yellow-500/5' : 'bg-white/3',
                  border: user.isPremium ? 'border-yellow-500/20' : 'border-white/8',
                },
                {
                  icon: <Calendar size={18} />,
                  value: memberDays,
                  label: isEs ? 'Dias activo' : 'Days active',
                  color: '#00F2FE',
                  bg: 'bg-[#00F2FE]/5',
                  border: 'border-[#00F2FE]/20',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className={`clip-card ${stat.bg} border ${stat.border} p-4 sm:p-5 text-center group hover:shadow-[0_0_20px_color-mix(in_srgb,${stat.color}_15%,transparent)] transition-all duration-300`}
                >
                  <div className="mb-2 flex justify-center" style={{ color: stat.color }}>{stat.icon}</div>
                  <p
                    className="font-cyber text-2xl sm:text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="font-code text-[9px] sm:text-[10px] text-white/35 mt-1 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Gradient separator ── */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#9d4edd]/20 to-transparent" />

            {/* ═══════════════════════════════════════════════════════════
                SETTINGS SECTION — IDE // labels + Cyberpunk cards
            ═══════════════════════════════════════════════════════════ */}
            <motion.div variants={itemVariants}>
              <span className="font-cyber font-bold text-sm tracking-widest text-[#9d4edd] mb-4 block">
                {'// '}{isEs ? 'Configuracion' : 'Settings'}
              </span>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Change Password Card */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(true)}
                  className="clip-card group bg-[#0b0b16] border border-white/8 p-5 text-left transition-all hover:border-[#FF2D78]/30 hover:shadow-[0_0_15px_rgba(255,45,120,0.1)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 clip-card bg-[#FF2D78]/10 border border-[#FF2D78]/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_12px_rgba(255,45,120,0.2)] transition-all">
                      <Lock size={20} className="text-[#FF2D78]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cyber font-bold text-white text-sm mb-1">{isEs ? 'Cambiar Contrasena' : 'Change Password'}</p>
                      <p className="font-code text-[11px] text-white/35 leading-relaxed">
                        {isEs ? 'Actualiza tu contrasena para mantener tu cuenta segura' : 'Update your password to keep your account secure'}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-white/15 group-hover:text-[#FF2D78]/60 transition-colors shrink-0 mt-1" />
                  </div>
                </motion.button>

                {/* Edit Profile Card */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditing(true);
                    setEditNickname(user.nickname);
                    setEditEmail(user.email || '');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="clip-card group bg-[#0b0b16] border border-white/8 p-5 text-left transition-all hover:border-[#00F2FE]/30 hover:shadow-[0_0_15px_rgba(0,242,254,0.1)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 clip-card bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_12px_rgba(0,242,254,0.2)] transition-all">
                      <Edit3 size={20} className="text-[#00F2FE]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cyber font-bold text-white text-sm mb-1">{isEs ? 'Editar Informacion' : 'Edit Info'}</p>
                      <p className="font-code text-[11px] text-white/35 leading-relaxed">
                        {isEs ? 'Modifica tu nickname, correo y foto de perfil' : 'Modify your nickname, email, and profile picture'}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-white/15 group-hover:text-[#00F2FE]/60 transition-colors shrink-0 mt-1" />
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════
                DANGER ZONE — Cyberpunk red neon + IDE // label
            ═══════════════════════════════════════════════════════════ */}
            <motion.div variants={itemVariants}>
              <span className="font-cyber font-bold text-sm tracking-widest text-red-400/60 mb-4 block">
                {'// '}{isEs ? 'Zona de Peligro' : 'Danger Zone'}
              </span>
              <div className="clip-card relative overflow-hidden border border-red-500/15 bg-red-500/[0.03] p-6">
                {/* Red glow orb */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 clip-card bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <Trash2 size={22} className="text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-cyber font-bold text-white text-sm mb-1">{isEs ? 'Eliminar mi cuenta' : 'Delete my account'}</h4>
                      <p className="font-code text-[11px] text-white/35 leading-relaxed mb-4">
                        {isEs
                          ? 'Esta accion no se puede deshacer. Se eliminaran permanentemente tu perfil, tus comentarios, notificaciones y tu historial de actividad.'
                          : 'This action cannot be undone. Your profile, comments, notifications, and activity history will be permanently deleted.'}
                        {user.role === 'owner' && (
                          <span className="text-red-400 font-bold block mt-1">
                            {isEs ? 'Como owner, no puedes eliminar tu cuenta.' : "As owner, you can't delete your account."}
                          </span>
                        )}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setDeletePassword('');
                          setDeleteConfirmText('');
                          setShowDeleteDialog(true);
                        }}
                        disabled={user.role === 'owner'}
                        className="clip-btn inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-cyber font-bold text-xs uppercase tracking-wider hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                        {isEs ? 'Eliminar cuenta' : 'Delete account'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          PASSWORD MODAL — Cyberpunk/IDE/Anime themed
      ═══════════════════════════════════════════════════════════ */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-[#0b0b16] border border-[#FF2D78]/20 text-white sm:max-w-md clip-card overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 font-cyber text-lg uppercase">
              <Lock size={18} className="text-[#FF2D78]" />
              {isEs ? 'Cambiar Contrasena' : 'Change Password'}
            </DialogTitle>
            <DialogDescription className="text-white/40 font-code text-xs">
              {isEs ? 'Ingresa tu contrasena actual y la nueva contrasena.' : 'Enter your current password and the new one.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                <span className="text-[#9d4edd]">{'>'}</span> {isEs ? 'Contrasena actual' : 'Current password'}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-[#080812] border border-[#9d4edd]/20 text-white font-code text-sm focus:outline-none focus:border-[#9d4edd]/50 focus:shadow-[0_0_10px_rgba(157,78,221,0.1)] placeholder:text-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                <span className="text-[#FF2D78]">{'>'}</span> {isEs ? 'Nueva contrasena' : 'New password'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder={isEs ? 'Minimo 6 caracteres' : 'Minimum 6 characters'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-[#080812] border border-[#FF2D78]/20 text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:shadow-[0_0_10px_rgba(255,45,120,0.1)] placeholder:text-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                <span className="text-[#00F2FE]">{'>'}</span> {isEs ? 'Confirmar' : 'Confirm'}
              </label>
              <input
                type="password"
                placeholder={isEs ? 'Repite la nueva contrasena' : 'Repeat the new password'}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#080812] border border-[#00F2FE]/20 text-white font-code text-sm focus:outline-none focus:border-[#00F2FE]/50 focus:shadow-[0_0_10px_rgba(0,242,254,0.1)] placeholder:text-white/15 transition-all"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full btn-primary text-sm py-3 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEs ? 'Cambiando...' : 'Changing...'}
                </>
              ) : (
                <>
                  <Lock size={16} />
                  {isEs ? 'Cambiar Contrasena' : 'Change Password'}
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════
          DELETE ACCOUNT CONFIRMATION — Cyberpunk red neon
      ═══════════════════════════════════════════════════════════ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#0b0b16] border border-red-500/25 text-white sm:max-w-md clip-card overflow-hidden">
          {/* Top red gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2 font-cyber text-lg uppercase">
              <AlertTriangle size={18} />
              {isEs ? 'Eliminar Cuenta' : 'Delete Account'}
            </DialogTitle>
            <DialogDescription className="text-white/40 font-code text-xs">
              {isEs ? 'Esta accion es permanente y no se puede deshacer.' : 'This action is permanent and cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-4 bg-red-500/5 border border-red-500/10 clip-card">
              <p className="font-code text-[11px] text-white/40 leading-relaxed">
                {isEs
                  ? 'Se eliminara tu perfil, tus comentarios se marcaran como eliminados, se borraran tus notificaciones y tu historial de actividad.'
                  : 'Your profile will be deleted, your comments will be marked as deleted, your notifications and activity history will be erased.'}
              </p>
            </div>
            <div>
              <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                <span className="text-red-400">{'>'}</span> {isEs ? 'Tu contrasena' : 'Your password'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#080812] border border-red-500/20 text-white font-code text-sm focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_10px_rgba(239,68,68,0.1)] placeholder:text-white/15 transition-all"
              />
            </div>
            <div>
              <label className="font-code text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                <span className="text-red-400">{'>'}</span> {isEs ? 'Escribe' : 'Type'} <span className="text-red-400 font-bold">BORRAR</span> {isEs ? 'para confirmar' : 'to confirm'}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="BORRAR"
                className="w-full px-4 py-2.5 bg-[#080812] border border-red-500/20 text-white font-code text-sm focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_10px_rgba(239,68,68,0.1)] placeholder:text-white/15 transition-all"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 clip-btn px-4 py-3 border border-white/10 bg-white/5 text-white/60 font-cyber font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount || !deletePassword || deleteConfirmText !== 'BORRAR'}
              className="flex-1 clip-btn px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deletingAccount ? (
                <><Loader2 size={14} className="animate-spin" /> {isEs ? 'Eliminando...' : 'Deleting...'}</>
              ) : (
                <><Trash2 size={14} /> {isEs ? 'Eliminar Cuenta' : 'Delete Account'}</>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
