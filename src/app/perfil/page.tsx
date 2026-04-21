'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Camera, Crown, Lock, Save,
  MessageCircle, Edit3, X, Check, Shield, Star
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
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  role: string;
  isPremium: boolean;
  isBanned: boolean;
  discordLinked: boolean;
  createdAt?: string;
  _count?: { comments: number };
}

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
      toast.error('Error de conexión');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim()) {
      toast.error('El nickname no puede estar vacío');
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
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mínimo 6 caracteres');
      return;
    }
    if (!currentPassword) {
      toast.error('Ingresa tu contraseña actual');
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
        toast.error(d.error || 'Error al cambiar contraseña');
        return;
      }
      toast.success('Contraseña actualizada');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF2D78] border-t-transparent rounded-full" />
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    owner: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    moderator: 'bg-[#4D9FFF]/20 text-[#4D9FFF] border-[#4D9FFF]/30',
    collaborator: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  const roleLabels: Record<string, string> = {
    owner: 'Owner',
    admin: 'Administrador',
    moderator: 'Moderador',
    collaborator: 'Colaborador',
    user: 'Usuario',
  };

  return (
    <div className="min-h-screen bg-[#080818] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="section-title text-white mb-8">
              Mi <span className="brand-gradient-text">Perfil</span>
            </h1>

            {/* Main Profile Card */}
            <div className="glass-card p-6 sm:p-8 mb-8">
              {/* Avatar & Info Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#FF2D78]/50 transition-all duration-300">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF2D78] to-[#a855f7] flex items-center justify-center">
                        <User size={40} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingAvatar ? (
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Camera size={24} className="text-white" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                    <h2
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {user.nickname}
                    </h2>
                    {user.isPremium && (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                        <Crown size={16} /> Premium
                      </span>
                    )}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        roleColors[user.role] || 'bg-white/10 text-white/50 border-white/20'
                      }`}
                    >
                      {roleLabels[user.role] || user.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                    {user.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {user.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Section */}
              <div className="border-t border-white/10 pt-6">
                {!editing ? (
                  <button
                    onClick={() => {
                      setEditing(true);
                      setEditNickname(user.nickname);
                      setEditEmail(user.email || '');
                    }}
                    className="btn-outline text-sm px-5 py-2.5 flex items-center gap-2"
                  >
                    <Edit3 size={16} /> Editar Perfil
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5">Nickname</label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
                        <input
                          type="text"
                          value={editNickname}
                          onChange={e => setEditNickname(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                          placeholder="Tu nickname"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5">
                        Correo electrónico (opcional)
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
                        <input
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 transition-all"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {loading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <X size={16} /> Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-[#FF2D78] transition-colors"
                >
                  <Lock size={16} /> Cambiar Contraseña
                </button>
              </div>
            </div>

            {/* Discord Link Card */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={20} className="text-[#5865F2]" />
                <h3
                  className="font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Discord
                </h3>
              </div>
              {user.discordLinked ? (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check size={16} className="text-green-400" /> Cuenta vinculada con Discord
                </div>
              ) : (
                <div>
                  <p className="text-sm text-white/50 mb-3">
                    Vincula tu cuenta de Discord para sincronizar roles, avatar y obtener
                    funciones especiales.
                  </p>
                  <button
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border hover:bg-white/5"
                    style={{ borderColor: '#5865F2', color: '#5865F2' }}
                  >
                    <MessageCircle size={14} /> Vincular Discord (Próximamente)
                  </button>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="glass-card p-6">
              <h3
                className="font-bold text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Estadísticas
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p
                    className="text-2xl font-bold text-[#FF2D78]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user._count?.comments || 0}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Comentarios</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p
                    className="text-2xl font-bold text-[#4D9FFF]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user.role !== 'user' ? '✓' : '—'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Verificado</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p
                    className="text-2xl font-bold text-[#a855f7]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user.isPremium ? '★' : '—'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Premium</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-[#0d0d24] border border-white/10 text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Ingresa tu contraseña actual y la nueva contraseña.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/25"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/25"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2D78]/50 placeholder:text-white/25"
            />
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full btn-primary text-sm py-2.5 disabled:opacity-50 mt-2"
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
