'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, Camera, Crown, Lock, Save,
  Edit3, X, Check, Shield, Star, Loader2, Trash2, AlertTriangle,
  Clock, MessageSquare, Award, Settings, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

  const roleColors: Record<string, string> = {
    owner: 'from-yellow-500/20 to-amber-600/20 text-yellow-300 border-yellow-500/30',
    admin: 'from-red-500/20 to-rose-600/20 text-red-300 border-red-500/30',
    moderator: 'from-[#4D9FFF]/20 to-blue-600/20 text-[#4D9FFF] border-[#4D9FFF]/30',
    collaborator: 'from-green-500/20 to-emerald-600/20 text-green-300 border-green-500/30',
  };
  const roleLabels: Record<string, string> = {
    owner: 'Owner',
    admin: 'Administrador',
    moderator: 'Moderador',
    collaborator: 'Colaborador',
    user: 'Usuario',
  };
  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown size={14} />,
    admin: <Shield size={14} />,
    moderator: <Shield size={14} />,
    collaborator: <Star size={14} />,
    user: <User size={14} />,
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Desconocido';

  const memberDays = user.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-[#080818] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* === PROFILE HERO HEADER === */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl"
            >
              {/* Gradient background banner */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D78]/10 via-[#7C3AED]/10 to-[#4D9FFF]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d24] via-transparent to-transparent" />
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF2D78]/8 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#4D9FFF]/8 rounded-full blur-3xl" />

              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  {/* Avatar */}
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* Avatar glow ring */}
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF2D78] via-[#a855f7] to-[#4D9FFF] opacity-60 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/10 bg-[#0d0d24]">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center">
                          <User size={48} className="text-white/80" />
                        </div>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-1 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                      {uploadingAvatar ? (
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Camera size={20} className="text-white" />
                          <span className="text-[10px] text-white/70">Cambiar</span>
                        </div>
                      )}
                    </div>
                    {/* Online status dot */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0d0d24] flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0d0d24]" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  {/* User Info */}
                  <div className="text-center md:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                      <h2
                        className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {user.nickname}
                      </h2>
                      {user.isPremium && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                          <Crown size={14} className="fill-yellow-300" />
                          PREMIUM
                        </motion.span>
                      )}
                    </div>

                    {/* Role badge */}
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-gradient-to-r ${
                          roleColors[user.role] || 'bg-white/10 text-white/50 border-white/20'
                        }`}
                      >
                        {roleIcons[user.role]}
                        {roleLabels[user.role] || user.role}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 justify-center md:justify-start">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#FF2D78]/60" />
                        {memberSince}
                      </span>
                      {memberDays > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#4D9FFF]/60" />
                          {memberDays} dias como miembro
                        </span>
                      )}
                      {user.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-[#a855f7]/60" />
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action button - desktop */}
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
                        Editar Perfil
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
                          {loading ? 'Guardando...' : 'Guardar'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setEditing(false)}
                          className="px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Form - inline below header (mobile friendly) */}
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                            Nickname
                          </label>
                          <div className="relative">
                            <User
                              size={16}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />
                            <input
                              type="text"
                              value={editNickname}
                              onChange={e => setEditNickname(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all placeholder:text-white/20"
                              placeholder="Tu nickname"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                            Correo electronico
                          </label>
                          <div className="relative">
                            <Mail
                              size={16}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />
                            <input
                              type="email"
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 focus:bg-white/8 transition-all placeholder:text-white/20"
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
                            {loading ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={() => setEditing(false)}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
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

            {/* === STATS ROW === */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: <MessageSquare size={18} />,
                  value: user.commentCount || 0,
                  label: 'Comentarios',
                  color: 'text-[#FF2D78]',
                  bg: 'from-[#FF2D78]/10 to-[#FF2D78]/5',
                  border: 'border-[#FF2D78]/15',
                },
                {
                  icon: <Award size={18} />,
                  value: user.role !== 'user' ? 'Si' : 'No',
                  label: 'Verificado',
                  color: user.role !== 'user' ? 'text-green-400' : 'text-white/30',
                  bg: user.role !== 'user' ? 'from-green-500/10 to-green-500/5' : 'from-white/5 to-white/3',
                  border: user.role !== 'user' ? 'border-green-500/15' : 'border-white/10',
                },
                {
                  icon: <Crown size={18} />,
                  value: user.isPremium ? 'Si' : 'No',
                  label: 'Premium',
                  color: user.isPremium ? 'text-yellow-400' : 'text-white/30',
                  bg: user.isPremium ? 'from-yellow-500/10 to-yellow-500/5' : 'from-white/5 to-white/3',
                  border: user.isPremium ? 'border-yellow-500/15' : 'border-white/10',
                },
                {
                  icon: <Calendar size={18} />,
                  value: memberDays,
                  label: 'Dias activo',
                  color: 'text-[#4D9FFF]',
                  bg: 'from-[#4D9FFF]/10 to-[#4D9FFF]/5',
                  border: 'border-[#4D9FFF]/15',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bg} border ${stat.border} p-4 sm:p-5 text-center`}
                >
                  <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
                  <p
                    className={`text-2xl sm:text-3xl font-bold ${stat.color}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* === SETTINGS SECTION === */}
            <motion.div variants={itemVariants}>
              <h3
                className="text-lg font-bold text-white/80 mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <Settings size={18} className="text-white/40" />
                Configuracion
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Change Password Card */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowPasswordModal(true)}
                  className="group relative overflow-hidden rounded-xl bg-white/3 border border-white/8 p-5 text-left transition-all hover:bg-white/6 hover:border-white/15"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FF2D78]/10 border border-[#FF2D78]/15 flex items-center justify-center shrink-0 group-hover:bg-[#FF2D78]/15 transition-colors">
                      <Lock size={20} className="text-[#FF2D78]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm mb-1">Cambiar Contrasena</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Actualiza tu contrasena para mantener tu cuenta segura
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-white/20 mt-1 group-hover:text-white/40 transition-colors shrink-0" />
                  </div>
                </motion.button>

                {/* Edit Profile Card */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setEditing(true);
                    setEditNickname(user.nickname);
                    setEditEmail(user.email || '');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative overflow-hidden rounded-xl bg-white/3 border border-white/8 p-5 text-left transition-all hover:bg-white/6 hover:border-white/15"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#4D9FFF]/10 border border-[#4D9FFF]/15 flex items-center justify-center shrink-0 group-hover:bg-[#4D9FFF]/15 transition-colors">
                      <Edit3 size={20} className="text-[#4D9FFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm mb-1">Editar Informacion</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Modifica tu nickname, correo y foto de perfil
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-white/20 mt-1 group-hover:text-white/40 transition-colors shrink-0" />
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* === DANGER ZONE === */}
            <motion.div variants={itemVariants}>
              <h3
                className="text-lg font-bold text-red-400/80 mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <AlertTriangle size={18} />
                Zona de Peligro
              </h3>
              <div className="relative overflow-hidden rounded-xl border border-red-500/15 bg-red-500/[0.03] p-6">
                {/* Subtle red gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <Trash2 size={22} className="text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm mb-1">Eliminar mi cuenta</h4>
                      <p className="text-xs text-white/40 leading-relaxed mb-4">
                        Esta accion no se puede deshacer. Se eliminaran permanentemente tu perfil,
                        tus comentarios (se marcaran como eliminados), tus notificaciones y tu historial de actividad.
                        {user.role === 'owner' && (
                          <span className="text-red-400 font-medium block mt-1">
                            Como owner, no puedes eliminar tu cuenta.
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
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                        Eliminar cuenta
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* === PASSWORD MODAL === */}
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
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Contrasena actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Tu contrasena actual"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/20 transition-all"
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
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Nueva contrasena
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Minimo 6 caracteres"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/20 transition-all"
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
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Confirmar nueva contrasena
              </label>
              <input
                type="password"
                placeholder="Repite la nueva contrasena"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/20 transition-all"
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
                  Cambiando...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Cambiar Contrasena
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === DELETE ACCOUNT CONFIRMATION === */}
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
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Tu contrasena
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contrasena"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 placeholder:text-white/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Escribe <span className="text-red-400 font-bold">BORRAR</span> para confirmar
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="BORRAR"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 placeholder:text-white/20 transition-all"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount || !deletePassword || deleteConfirmText !== 'BORRAR'}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

      <Footer />
    </div>
  );
}
