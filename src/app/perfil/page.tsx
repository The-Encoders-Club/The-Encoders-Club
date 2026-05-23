'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Camera, Crown, Lock, Save,
  Edit3, X, Shield, Star, Loader2, Trash2, AlertTriangle,
  MessageSquare, Eye, EyeOff, Clock, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full" />
      </div>
    }>
      <PerfilContent />
    </Suspense>
  );
}

function PerfilContent() {
  const router = useRouter();
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
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/api/user/avatar', { method: 'POST', body: formData });
      if (!res.ok) {
        toast.error('Error al subir avatar');
        return;
      }
      const data = await res.json();
      setUser(prev => (prev ? { ...prev, avatar: data.avatar } : prev));
      toast.success('Avatar actualizado');
    } catch {
      toast.error('Error de conexion');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim()) {
      toast.error('El nickname no puede estar vacio');
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
        toast.error(d.error || 'Error al guardar');
        return;
      }
      setUser(prev => (prev ? { ...prev, nickname: editNickname, email: editEmail } : prev));
      setEditing(false);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Minimo 6 caracteres');
      return;
    }
    if (!currentPassword) {
      toast.error('Ingresa tu contrasena actual');
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
        toast.error(d.error || 'Error al cambiar contrasena');
        return;
      }
      toast.success('Contrasena actualizada');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Ingresa tu contrasena');
      return;
    }
    if (deleteConfirmText !== 'BORRAR') {
      toast.error('Escribe BORRAR para confirmar');
      return;
    }
    if (user?.role === 'owner') {
      toast.error('Los owners no pueden borrar su cuenta');
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
        toast.error(d.error || 'Error al borrar cuenta');
        return;
      }
      toast.success('Tu cuenta ha sido eliminada. Te redirigimos...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      toast.error('Error de conexion');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full" />
      </div>
    );
  }

  const roleData: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    owner: { color: '#eab308', label: 'Owner', icon: <Crown size={14} /> },
    admin: { color: '#ef4444', label: 'Administrador', icon: <Shield size={14} /> },
    moderator: { color: '#4D9FFF', label: 'Moderador', icon: <Shield size={14} /> },
    collaborator: { color: '#22c55e', label: 'Colaborador', icon: <Star size={14} /> },
    user: { color: '#94a3b8', label: 'Usuario', icon: <User size={14} /> },
  };

  const role = roleData[user.role] || roleData.user;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const memberDays = user.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-[#080818] text-white overflow-x-hidden">
      <Navbar />
      <BackgroundParticles />

      {/* PAGE HEADER — same pattern as proyectos/noticias */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#FF2D78] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              Mi cuenta
            </span>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Perfil de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#a855f7]">
                Usuario
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl">
              Administra tu informacion personal, preferencias y configuracion de seguridad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROFILE CARD — glass-card pattern like home/about */}
      <section className="pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass-card p-8 sm:p-10 relative overflow-hidden"
          >
            {/* top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />

            {/* avatar + info row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* avatar — same style as team member cards on home */}
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl mb-0 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: user.avatar
                      ? undefined
                      : 'linear-gradient(145deg, #FF2D7818 0%, #0d0d24 40%, #a855f710 100%)',
                    border: user.avatar
                      ? '2px solid rgba(255,255,255,0.1)'
                      : '2px solid #FF2D7840',
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <User size={48} className="text-[#FF2D78]/60" />
                  )}
                  {/* hover overlay — same as project images */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    {uploadingAvatar ? (
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold backdrop-blur-sm">
                        <Camera size={14} className="text-white" />
                        Cambiar
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* info */}
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user.nickname}
                  </h2>
                  {user.isPremium && (
                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                      <Crown size={16} /> Premium
                    </span>
                  )}
                </div>

                {/* role badge — same tag style as news tags */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{
                    background: `${role.color}25`,
                    border: `1px solid ${role.color}50`,
                    color: role.color,
                  }}
                >
                  {role.icon}
                  {role.label}
                </span>

                {/* meta info — same style as news item meta */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-white/40 text-xs">
                  {memberSince && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />{memberSince}
                    </span>
                  )}
                  {memberDays > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />{memberDays} dias como miembro
                    </span>
                  )}
                  {user.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={12} />{user.email}
                    </span>
                  )}
                </div>
              </div>

              {/* edit button — right side, desktop */}
              <div className="hidden sm:block shrink-0">
                {!editing ? (
                  <button
                    onClick={() => {
                      setEditing(true);
                      setEditNickname(user.nickname);
                      setEditEmail(user.email || '');
                    }}
                    className="btn-outline text-sm px-6 py-2.5"
                  >
                    <Edit3 size={16} /> Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* EDIT FORM — inline, same input style as search bar on proyectos */}
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-white/10 grid sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Nickname</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={editNickname}
                      onChange={e => setEditNickname(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/35 outline-none focus:border-[#FF2D78]/50 focus:ring-1 focus:ring-[#FF2D78]/30 transition-all duration-200"
                      placeholder="Tu nickname"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Correo electronico</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/35 outline-none focus:border-[#FF2D78]/50 focus:ring-1 focus:ring-[#FF2D78]/30 transition-all duration-200"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
                {/* mobile save */}
                <div className="flex gap-2 sm:hidden">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50 flex-1"
                  >
                    <Save size={16} />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* STATS — same divide grid pattern as home stats section */}
      <section className="pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/8">
            {/* stat 1: comments */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: '#FF2D7820', border: '1px solid #FF2D7840' }}>
                <MessageSquare size={22} style={{ color: '#FF2D78' }} />
              </div>
              <span className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#FF2D78' }}>
                {user.commentCount || 0}
              </span>
              <span className="text-sm text-white/50">Comentarios</span>
            </div>
            {/* stat 2: verified */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: user.role !== 'user' ? '#22c55e20' : '#ffffff10',
                  border: user.role !== 'user' ? '1px solid #22c55e40' : '1px solid #ffffff15',
                }}>
                <Shield size={22} style={{ color: user.role !== 'user' ? '#22c55e' : '#ffffff30' }} />
              </div>
              <span className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: user.role !== 'user' ? '#22c55e' : '#ffffff30' }}>
                {user.role !== 'user' ? 'Si' : 'No'}
              </span>
              <span className="text-sm text-white/50">Verificado</span>
            </div>
            {/* stat 3: premium */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: user.isPremium ? '#eab30820' : '#ffffff10',
                  border: user.isPremium ? '1px solid #eab30840' : '1px solid #ffffff15',
                }}>
                <Crown size={22} style={{ color: user.isPremium ? '#eab308' : '#ffffff30' }} />
              </div>
              <span className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: user.isPremium ? '#eab308' : '#ffffff30' }}>
                {user.isPremium ? 'Si' : 'No'}
              </span>
              <span className="text-sm text-white/50">Premium</span>
            </div>
            {/* stat 4: days active */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: '#4D9FFF20', border: '1px solid #4D9FFF40' }}>
                <Calendar size={22} style={{ color: '#4D9FFF' }} />
              </div>
              <span className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#4D9FFF' }}>
                {memberDays}
              </span>
              <span className="text-sm text-white/50">Dias activo</span>
            </div>
          </div>
        </div>
      </section>

      {/* SETTINGS — glass-card rows like about section on home */}
      <section className="pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#4D9FFF] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              Configuracion
            </span>
            <div className="space-y-4">
              {/* Change Password */}
              <div
                onClick={() => setShowPasswordModal(true)}
                className="glass-card p-6 sm:p-8 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D78] to-[#a855f7]" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D78]/15 border border-[#FF2D78]/30 flex items-center justify-center shrink-0">
                    <Lock size={24} className="text-[#FF2D78]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Cambiar Contrasena
                    </h3>
                    <p className="text-sm text-white/50">
                      Actualiza tu contrasena para mantener tu cuenta segura.
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>

              {/* Edit Profile (shortcut) */}
              <div
                onClick={() => {
                  setEditing(true);
                  setEditNickname(user.nickname);
                  setEditEmail(user.email || '');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="glass-card p-6 sm:p-8 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4D9FFF] to-[#a855f7]" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4D9FFF]/15 border border-[#4D9FFF]/30 flex items-center justify-center shrink-0">
                    <Edit3 size={24} className="text-[#4D9FFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Editar Informacion
                    </h3>
                    <p className="text-sm text-white/50">
                      Modifica tu nickname, correo electronico y foto de perfil.
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DANGER ZONE — same glass-card + gradient style as CTA on home */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-red-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 block">
              Zona de Peligro
            </span>
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden border-red-500/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" />
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-red-500/8 blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Trash2 size={24} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-white text-lg mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Eliminar mi cuenta
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">
                      Esta accion no se puede deshacer. Se eliminaran permanentemente tu perfil,
                      tus comentarios (se marcaran como eliminados), tus notificaciones y tu historial
                      de actividad.
                      {user.role === 'owner' && (
                        <span className="text-red-400 font-medium block mt-2">
                          Como owner, no puedes eliminar tu cuenta.
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setDeletePassword('');
                        setDeleteConfirmText('');
                        setShowDeleteDialog(true);
                      }}
                      disabled={user.role === 'owner'}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* PASSWORD MODAL */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-[#0d0d24] border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Lock size={18} className="text-[#FF2D78]" />
              Cambiar Contrasena
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Ingresa tu contrasena actual y la nueva contrasena.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Contrasena actual</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Tu contrasena actual"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-[#FF2D78]/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Nueva contrasena</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Minimo 6 caracteres"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-[#FF2D78]/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Confirmar nueva contrasena</label>
              <input
                type="password"
                placeholder="Repite la nueva contrasena"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-[#FF2D78]/50 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full btn-primary text-sm py-3 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Cambiando...</>
              ) : (
                <><Lock size={16} /> Cambiar Contrasena</>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE ACCOUNT CONFIRMATION */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#0d0d24] border border-red-500/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <AlertTriangle size={18} />
              Eliminar Cuenta
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Esta accion es permanente y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <p className="text-xs text-white/50 leading-relaxed">
                Se eliminara tu perfil, tus comentarios se marcaran como eliminados,
                se borraran tus notificaciones y tu historial de actividad.
              </p>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Tu contrasena</label>
              <input
                type="password"
                placeholder="Ingresa tu contrasena"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-red-500/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">
                Escribe <span className="text-red-400 font-bold">BORRAR</span> para confirmar
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="BORRAR"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-red-500/50 transition-all duration-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount || !deletePassword || deleteConfirmText !== 'BORRAR'}
              className="flex-1 px-4 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deletingAccount ? (
                <><Loader2 size={14} className="animate-spin" /> Eliminando...</>
              ) : (
                <><Trash2 size={14} /> Eliminar Cuenta</>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
