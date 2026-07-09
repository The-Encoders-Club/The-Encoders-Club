'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, DollarSign, Activity, Shield, Search,
  Ban, CheckCircle, UserCog, Trash2, Save, AlertTriangle, RefreshCw,
  Bot, Crown, Eye, EyeOff, TrendingUp, Zap, Globe,
  ArrowUpDown, Wifi, WifiOff, Loader2, Info,
  LayoutDashboard, FileText, ChevronLeft, Menu, X, Heart,
  UserPlus, LogIn, LogOut, ShieldCheck, MessageCircle, Bell, Download,
  Terminal, Code2, Key, ShieldQuestion, Copy, Check,
  FolderKanban, Plus, Pencil, ImagePlus, ExternalLink, Star, GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { DynamicProject, ProjectDownload, ProjectDetails, ProjectSections, ProjectResource, ResourceIcon } from '@/data/dynamic-projects';
import { validateProjectSlug, isReservedSlug, parseMusicInput, DEFAULT_SECTIONS } from '@/data/dynamic-projects';

// ─── Interfaces ───
interface AdminUser {
  id: string; nickname: string; email?: string; avatar?: string;
  role: string; isPremium: boolean; isBanned: boolean; banReason?: string;
  discordLinked: boolean; discordId?: string; createdAt: string; commentCount?: number;
}
interface RecentComment {
  id: string; content: string; createdAt: string; isDeleted: boolean;
  reports: number; author: { nickname: string };
}
interface ActivityLog {
  id: string; action: string; details?: string; createdAt: string; user?: { nickname: string };
}
interface Donation {
  id: string; amount: number; currency: string; message?: string; createdAt: string;
}
interface StatsData {
  stats: {
    totalUsers: number;
    totalComments: number;
    totalDonations: number;
    totalVisits: number;
    totalDownloads: number;
    realVisits: number;
    realDownloads: number;
    visitsBase: number;
    downloadsBase: number;
    websiteDownloads: number;
    githubDownloads: number;
    externalBase: number;
  };
  recentUsers: { id: string; nickname: string; avatar?: string; role: string; createdAt: string }[];
  recentComments: RecentComment[]; recentLogs: ActivityLog[]; donations: Donation[];
  usersByRole: { role: string; _count: number }[];
}
interface DiscordConfig {
  id: string; serverId?: string; channelId?: string; webhookUrl?: string;
  modRoleId?: string; adminRoleId?: string; collabRoleId?: string;
  hasBotToken: boolean; discordClientId?: string; hasClientId: boolean;
  hasClientSecret: boolean; siteUrl?: string;
}
interface DiscordBotStatus {
  connected: boolean; configured: boolean; botUsername: string | null;
  botAvatar: string | null; botId?: string; isBot?: boolean;
  linkedUsers: number; server: { name: string | null; memberCount: number | null };
  roleConfig: { hasAdminRole: boolean; hasModRole: boolean; hasCollabRole: boolean };
  hasClientId: boolean; hasClientSecret: boolean; message: string;
}

// ─── Constants ───
const roleColors: Record<string, string> = {
  owner: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  admin: 'bg-red-500/10 text-red-400 border-red-500/30',
  moderator: 'bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/30',
  collaborator: 'bg-green-500/10 text-green-400 border-green-500/30',
  user: 'bg-white/5 text-white/50 border-white/15',
};
const roleLabels: Record<string, string> = { owner: 'Owner', admin: 'Admin', moderator: 'Mod', collaborator: 'Colab', user: 'User' };
const actionLabels: Record<string, string> = {
  admin_user_updated: 'Usuario modificado',
  admin_user_update: 'Usuario modificado',
  discord_config_updated: 'Config Discord actualizada',
  discord_config_update: 'Config Discord actualizada',
  discord_role_sync: 'Rol sincronizado (Discord)',
  discord_linked: 'Discord vinculado',
  discord_unlinked: 'Discord desvinculado',
  discord_role_push: 'Roles empujados a Discord',
  user_login: 'Inicio de sesion',
  user_register: 'Registro',
  user_logout: 'Cierre de sesion',
  comment_create: 'Comentario creado',
  comment_deleted: 'Comentario eliminado',
  comment_delete: 'Comentario eliminado',
  comment_self_deleted: 'Comentario auto-eliminado',
  donation_received: 'Donacion recibida',
  password_change: 'Contrasena cambiada',
  stats_config_updated: 'Config. de estadisticas actualizada',
};

const getActionColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'text-green-400';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'text-[#00F2FE]';
  if (action.includes('delete') || action.includes('unlinked')) return 'text-red-400';
  if (action.includes('report')) return 'text-yellow-400';
  return 'text-white/50';
};

const getActionIcon = (action: string) => {
  if (action.includes('register') || action.includes('create')) return <UserPlus size={14} />;
  if (action.includes('login') || action.includes('logout')) return <LogIn size={14} />;
  if (action.includes('delete') || action.includes('unlinked')) return <Trash2 size={14} />;
  if (action.includes('update') || action.includes('sync') || action.includes('push')) return <RefreshCw size={14} />;
  if (action.includes('donation')) return <Heart size={14} />;
  if (action.includes('discord')) return <MessageCircle size={14} />;
  if (action.includes('password')) return <ShieldCheck size={14} />;
  return <Zap size={14} />;
};

const getActionDotColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'bg-green-400';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'bg-[#00F2FE]';
  if (action.includes('delete') || action.includes('unlinked')) return 'bg-red-400';
  if (action.includes('report')) return 'bg-yellow-400';
  return 'bg-white/30';
};

const getActionBgColor = (action: string) => {
  if (action.includes('create') || action.includes('register') || action.includes('linked') || action.includes('received')) return 'bg-green-400/10';
  if (action.includes('update') || action.includes('sync') || action.includes('push') || action.includes('login') || action.includes('logout')) return 'bg-[#00F2FE]/10';
  if (action.includes('delete') || action.includes('unlinked')) return 'bg-red-400/10';
  if (action.includes('report')) return 'bg-yellow-400/10';
  return 'bg-white/5';
};

// ─── Skeleton Component ───
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-white/[0.04] ${className}`} />
);

// ─── Nav Items ───
const navItems = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'comments', label: 'Comentarios', icon: MessageSquare },
  { id: 'projects', label: 'Proyectos', icon: FolderKanban },
  { id: 'discord', label: 'Discord', icon: MessageCircle },
  { id: 'logs', label: 'Actividad', icon: FileText },
];

// ─── Input Component — Cyberpunk/IDE themed ───
const AdminInput = ({ value, onChange, placeholder, type = 'text', className = '' }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; className?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40 focus:shadow-[0_0_10px_rgba(255,45,120,0.1)] placeholder:text-white/20 transition-all ${className}`}
  />
);

// ─── Card Component — Cyberpunk clip-card themed ───
const AdminCard = ({ children, className = '', padding = true }: { children: React.ReactNode; className?: string; padding?: boolean }) => (
  <div className={`bg-[#0b0b16] border border-white/[0.06] clip-card ${padding ? 'p-6' : ''} shadow-lg shadow-black/10 backdrop-blur-sm relative overflow-hidden ${className}`}>
    {children}
  </div>
);

// ─── Empty State Component ───
const EmptyState = ({ icon: Icon, message, submessage }: { icon: React.ElementType; message: string; submessage?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-white/20">
    <Icon size={36} strokeWidth={1} />
    <p className="font-code text-sm mt-3">{message}</p>
    {submessage && <p className="font-code text-[10px] mt-1 text-white/15">{submessage}</p>}
  </div>
);

// ─── Project form types & helpers ───
interface AdminProjectForm {
  id: string;
  name: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  coverBg: string;
  coverFit: 'contain' | 'cover';
  tags: string;
  status: string;
  statusEn: string;
  statusColor: string;
  rating: string;
  featured: boolean;
  previews: string;
  downloads: ProjectDownload[];
  music: string;
  themeColor: string;
  bgImage: string;
  bgFit: 'cover' | 'contain' | 'solid';
  // Visual customization (empty string = use default / themeColor)
  pageBgColor: string;
  cardBgColor: string;
  borderColor: string;
  textColor: string;
  titleStrokeColor: string;
  accentColor: string;
  sections: Required<ProjectSections>;
  resources: ProjectResource[];
  isPublished: boolean;
  sortOrder: string;
  details: ProjectDetails;
}

function emptyProjectForm(): AdminProjectForm {
  return {
    id: '',
    name: '',
    subtitle: '',
    subtitleEn: '',
    description: '',
    descriptionEn: '',
    image: '',
    coverBg: '',
    coverFit: 'contain',
    tags: '',
    status: 'Disponible',
    statusEn: '',
    statusColor: '#22c55e',
    rating: '0',
    featured: false,
    previews: '',
    downloads: [],
    music: '',
    themeColor: '#FF2D78',
    bgImage: '',
    bgFit: 'cover',
    pageBgColor: '',
    cardBgColor: '',
    borderColor: '',
    textColor: '',
    titleStrokeColor: '',
    accentColor: '',
    sections: { ...DEFAULT_SECTIONS },
    resources: [],
    isPublished: true,
    sortOrder: '0',
    details: { playTime: '', playTimeEn: '', language: 'Español', languageEn: 'Spanish', engine: "Ren'Py", downloadsLabel: '' },
  };
}

function projectToForm(p: DynamicProject): AdminProjectForm {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subtitle || '',
    subtitleEn: p.subtitleEn || '',
    description: p.description,
    descriptionEn: p.descriptionEn || '',
    image: p.image,
    coverBg: p.coverBg || '',
    coverFit: p.coverFit === 'cover' ? 'cover' : 'contain',
    tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
    status: p.status,
    statusEn: p.statusEn || '',
    statusColor: p.statusColor,
    rating: String(p.rating ?? 0),
    featured: !!p.featured,
    previews: Array.isArray(p.previews) ? p.previews.join('\n') : '',
    downloads: Array.isArray(p.downloads) ? p.downloads : [],
    music: p.music || '',
    themeColor: p.themeColor,
    bgImage: p.bgImage || '',
    bgFit: p.bgFit === 'contain' ? 'contain' : p.bgFit === 'solid' ? 'solid' : 'cover',
    pageBgColor: p.pageBgColor || '',
    cardBgColor: p.cardBgColor || '',
    borderColor: p.borderColor || '',
    textColor: p.textColor || '',
    titleStrokeColor: p.titleStrokeColor || '',
    accentColor: p.accentColor || '',
    sections: { ...DEFAULT_SECTIONS, ...(p.sections || {}) },
    resources: Array.isArray(p.resources) ? p.resources : [],
    isPublished: !!p.isPublished,
    sortOrder: String(p.sortOrder ?? 0),
    details: {
      playTime: p.details?.playTime || '',
      playTimeEn: p.details?.playTimeEn || '',
      language: p.details?.language || '',
      languageEn: p.details?.languageEn || '',
      engine: p.details?.engine || "Ren'Py",
      downloadsLabel: p.details?.downloadsLabel || '',
    },
  };
}

function formToPayload(form: AdminProjectForm, isCreate: boolean): Record<string, unknown> {
  const tags = form.tags.split(',').map(s => s.trim()).filter(Boolean);
  const previews = form.previews.split('\n').map(s => s.trim()).filter(Boolean);
  // Validate music input — if user pasted something unrecognizable, send null instead.
  const musicRaw = form.music.trim();
  const musicParsed = parseMusicInput(musicRaw);
  return {
    ...(isCreate ? { id: form.id.trim().toLowerCase() } : {}),
    name: form.name.trim(),
    subtitle: form.subtitle.trim() || null,
    subtitleEn: form.subtitleEn.trim() || null,
    description: form.description.trim(),
    descriptionEn: form.descriptionEn.trim() || null,
    image: form.image.trim(),
    coverBg: form.coverBg.trim() || null,
    coverFit: form.coverFit,
    tags,
    status: form.status.trim() || 'Disponible',
    statusEn: form.statusEn.trim() || null,
    statusColor: form.statusColor.trim() || '#22c55e',
    rating: Number(form.rating) || 0,
    featured: !!form.featured,
    previews,
    downloads: form.downloads,
    music: musicParsed ? musicRaw : null,
    themeColor: form.themeColor.trim() || '#FF2D78',
    bgImage: form.bgImage.trim() || null,
    bgFit: form.bgFit,
    pageBgColor: form.pageBgColor.trim() || null,
    cardBgColor: form.cardBgColor.trim() || null,
    borderColor: form.borderColor.trim() || null,
    textColor: form.textColor.trim() || null,
    titleStrokeColor: form.titleStrokeColor.trim() || null,
    accentColor: form.accentColor.trim() || null,
    sections: form.sections,
    resources: form.resources,
    isPublished: !!form.isPublished,
    sortOrder: Number(form.sortOrder) || 0,
    details: form.details,
  };
}

const PROJECT_DOWNLOAD_ICONS = [
  { value: 'Smartphone', label: 'Smartphone (móvil)' },
  { value: 'Monitor', label: 'Monitor (PC)' },
  { value: 'Download', label: 'Download (genérico)' },
] as const;

const PROJECT_RESOURCE_ICONS: { value: ResourceIcon; label: string }[] = [
  { value: 'BookOpen', label: 'Libro (Wiki)' },
  { value: 'Shirt', label: 'Camisa (Spritepacks)' },
  { value: 'Puzzle', label: 'Puzzle (Submods)' },
  { value: 'Star', label: 'Estrella (Favoritos)' },
  { value: 'Search', label: 'Lupa (Búsqueda)' },
  { value: 'Download', label: 'Descarga' },
  { value: 'Heart', label: 'Corazón' },
  { value: 'ExternalLink', label: 'Link externo' },
  { value: 'FileText', label: 'Documento' },
];

const SECTION_LABELS: { key: keyof ProjectSections; label: string; desc: string }[] = [
  { key: 'showGallery', label: 'Galería', desc: 'Carrusel de imágenes de preview' },
  { key: 'showResources', label: 'Recursos extra', desc: 'Cards de recursos (Wiki, Spritepacks, etc.)' },
  { key: 'showComments', label: 'Comentarios', desc: 'Sección de comentarios al final' },
  { key: 'showDetails', label: 'Detalles técnicos', desc: 'Card lateral con playTime, idioma, motor, descargas' },
  { key: 'showMusic', label: 'Música', desc: 'Reproductor de música + botón mute (requiere URL de música)' },
  { key: 'showShare', label: 'Compartir', desc: 'Botón de compartir en la navbar' },
  { key: 'showFeaturedBadge', label: 'Badge destacado', desc: 'Badge "DESTACADO" en la esquina (requiere "featured" activo)' },
];

// ─── Main Component ───
export default function AdminPanel() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allComments, setAllComments] = useState<RecentComment[]>([]);
  const [discordConfig, setDiscordConfig] = useState<DiscordConfig | null>(null);
  const [botStatus, setBotStatus] = useState<DiscordBotStatus | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState<AdminUser | null>(null);
  // ─── Security Dialog state ───
  const [securityUser, setSecurityUser] = useState<AdminUser | null>(null);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [securityData, setSecurityData] = useState<{
    securityQuestion: string | null;
    hasPassword: boolean;
    hasSecurityAnswer: boolean;
    hasRecoveryCode: boolean;
    passwordHash?: string | null;
    securityAnswerHash?: string | null;
    recoveryCodeHash?: string | null;
  } | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMode, setSecurityMode] = useState<'view' | 'form_security' | 'form_password' | 'result'>('view');
  const [securityAction, setSecurityAction] = useState<'reset_password' | 'reset_security' | 'regen_recovery' | null>(null);
  const [securityResult, setSecurityResult] = useState<string>('');
  const [securityResultLabel, setSecurityResultLabel] = useState<string>('');
  const [securityBusy, setSecurityBusy] = useState(false);
  const [showHashes, setShowHashes] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  // form fields
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newSecurityQuestion, setNewSecurityQuestion] = useState('');
  const [newSecurityAnswer, setNewSecurityAnswer] = useState('');
  const [dcForm, setDcForm] = useState({
    webhookUrl: '',
    modRoleId: '', adminRoleId: '', collabRoleId: '',
    discordClientId: '', discordClientSecret: '', siteUrl: '',
    notificationEnabled: true,
  });
  const [syncTarget, setSyncTarget] = useState<'special' | 'all'>('special');
  const rolePopoverRef = useRef<HTMLDivElement>(null);
  const [statsConfig, setStatsConfig] = useState({ visits_base: 0, downloads_base: 0, external_downloads_base: 0, website_downloads: 0, github_downloads: 0, github_per_repo: {} as Record<string, number> });
  const [statsConfigSaving, setStatsConfigSaving] = useState(false);

  // ─── Projects (dynamic, admin-managed) state ───
  const [adminProjects, setAdminProjects] = useState<DynamicProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectDialogMode, setProjectDialogMode] = useState<'create' | 'edit'>('create');
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<DynamicProject | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const coverUploadRef = useRef<HTMLInputElement>(null);
  const previewUploadRef = useRef<HTMLInputElement>(null);
  const bgUploadRef = useRef<HTMLInputElement>(null);
  const [projectForm, setProjectForm] = useState<AdminProjectForm>(emptyProjectForm());

  useEffect(() => { setMounted(true); }, []);

  // Close role popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rolePopoverRef.current && !rolePopoverRef.current.contains(e.target as Node)) {
        setRoleChangeUser(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStats = useCallback(async () => {
    try { const res = await fetch('/api/admin/stats'); if (!res.ok) return; const data = await res.json(); setStats(data); setAllComments(data.recentComments || []); setLogs(data.recentLogs || []); } catch {}
  }, []);
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try { const res = await fetch('/api/admin/users'); if (!res.ok) return; const data = await res.json(); setUsers(data.users || []); } catch {} finally { setUsersLoading(false); }
  }, []);
  const fetchDiscordConfig = useCallback(async () => {
    setDiscordLoading(true);
    try {
      const res = await fetch('/api/admin/discord'); if (!res.ok) return;
      const data = await res.json(); setDiscordConfig(data.config);
      setDcForm({
        webhookUrl: data.config?.webhookUrl || '', modRoleId: data.config?.modRoleId || '',
        adminRoleId: data.config?.adminRoleId || '', collabRoleId: data.config?.collabRoleId || '',
        discordClientId: data.config?.discordClientId || '', discordClientSecret: '',
        siteUrl: data.config?.siteUrl || '',
        notificationEnabled: data.config?.notificationEnabled !== false,
      });
    } catch {} finally { setDiscordLoading(false); }
  }, []);
  const fetchBotStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/admin/discord/status');
      if (res.ok) { const data = await res.json(); setBotStatus(data); }
    } catch {} finally { setStatusLoading(false); }
  }, []);
  const fetchStatsConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats/config');
      if (res.ok) { const data = await res.json(); setStatsConfig({ visits_base: data.visits_base || 0, downloads_base: data.downloads_base || 0, external_downloads_base: data.external_downloads_base || 0, website_downloads: data.website_downloads || 0, github_downloads: data.github_downloads || 0, github_per_repo: data.github_per_repo || {} }); }
    } catch {}
  }, []);

  // ─── Projects (dynamic) handlers ───
  const fetchAdminProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) { setAdminProjects([]); return; }
      const data = (await res.json()) as { projects?: DynamicProject[] };
      setAdminProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch {
      setAdminProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const openCreateProject = () => {
    setProjectForm(emptyProjectForm());
    setProjectDialogMode('create');
    setShowProjectDialog(true);
  };

  const openEditProject = (p: DynamicProject) => {
    setProjectForm(projectToForm(p));
    setProjectDialogMode('edit');
    setShowProjectDialog(true);
  };

  const closeProjectDialog = () => {
    if (projectSaving) return;
    setShowProjectDialog(false);
  };

  const saveProject = async () => {
    const isCreate = projectDialogMode === 'create';
    // Basic validation
    if (isCreate) {
      const slugCheck = validateProjectSlug(projectForm.id.trim().toLowerCase());
      if (!slugCheck.ok) { toast.error(slugCheck.error!); return; }
    }
    if (!projectForm.name.trim()) { toast.error('El nombre es obligatorio.'); return; }
    if (!projectForm.description.trim()) { toast.error('La descripción es obligatoria.'); return; }
    if (!projectForm.image.trim()) { toast.error('La imagen de portada es obligatoria.'); return; }

    setProjectSaving(true);
    try {
      const payload = formToPayload(projectForm, isCreate);
      const url = isCreate ? '/api/admin/projects' : `/api/admin/projects/${encodeURIComponent(projectForm.id)}`;
      const method = isCreate ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        toast.error((data.error as string) || 'Error al guardar el proyecto');
        return;
      }
      toast.success(isCreate ? 'Proyecto creado' : 'Proyecto actualizado');
      setShowProjectDialog(false);
      await fetchAdminProjects();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setProjectSaving(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectDeleteTarget) return;
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(projectDeleteTarget.id)}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) { toast.error((data.error as string) || 'Error al eliminar'); return; }
      toast.success('Proyecto eliminado');
      setProjectDeleteTarget(null);
      await fetchAdminProjects();
    } catch {
      toast.error('Error de conexión');
    }
  };

  const uploadProjectImage = async (file: File, target: 'cover' | 'preview' | 'background') => {
    if (!file) return;
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/projects/upload', { method: 'POST', body: fd });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) { toast.error((data.error as string) || 'Error al subir la imagen'); return; }
      const url: string = data.url as string;
      if (target === 'cover') {
        setProjectForm(prev => ({ ...prev, image: url }));
      } else if (target === 'background') {
        setProjectForm(prev => ({ ...prev, bgImage: url }));
      } else {
        setProjectForm(prev => ({
          ...prev,
          previews: (prev.previews ? prev.previews + '\n' : '') + url,
        }));
      }
      toast.success('Imagen subida');
    } catch {
      toast.error('Error de conexión al subir imagen');
    } finally {
      setImageUploading(false);
    }
  };

  const onCoverFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) uploadProjectImage(f, 'cover');
    e.target.value = '';
  };
  const onPreviewFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => uploadProjectImage(f, 'preview'));
    e.target.value = '';
  };
  const onBgFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) uploadProjectImage(f, 'background');
    e.target.value = '';
  };

  const addDownloadRow = () => {
    setProjectForm(prev => ({
      ...prev,
      downloads: [...prev.downloads, { label: '', labelEn: '', icon: 'Download', url: '', color: '#FF2D78', hoverColor: '#FF6B9D', textColor: '#ffffff' }],
    }));
  };
  const updateDownloadRow = (i: number, patch: Partial<ProjectDownload>) => {
    setProjectForm(prev => ({ ...prev, downloads: prev.downloads.map((d, idx) => idx === i ? { ...d, ...patch } : d) }));
  };
  const removeDownloadRow = (i: number) => {
    setProjectForm(prev => ({ ...prev, downloads: prev.downloads.filter((_, idx) => idx !== i) }));
  };

  // ─── Resource rows (for "Recursos y Contenido Extra" section) ───
  const addResourceRow = () => {
    setProjectForm(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', description: '', icon: 'FileText', url: '', urlLabel: '', urlLabelEn: '', color: '' }],
    }));
  };
  const updateResourceRow = (i: number, patch: Partial<ProjectResource>) => {
    setProjectForm(prev => ({ ...prev, resources: prev.resources.map((r, idx) => idx === i ? { ...r, ...patch } : r) }));
  };
  const removeResourceRow = (i: number) => {
    setProjectForm(prev => ({ ...prev, resources: prev.resources.filter((_, idx) => idx !== i) }));
  };

  // ─── Section visibility toggles ───
  const toggleSection = (key: keyof ProjectSections) => {
    setProjectForm(prev => ({ ...prev, sections: { ...prev.sections, [key]: !prev.sections[key] } }));
  };

  useEffect(() => {
    if (!mounted) return;
    fetch('/api/auth/session')
      .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
      .then(d => { if (!d.user || !['admin', 'owner', 'moderator'].includes(d.user.role)) { router.push('/'); return; } setUser({ id: d.user.id, role: d.user.role }); if (d.user.role === 'moderator') setActiveTab('users'); })
      .catch(() => { router.push('/'); });
  }, [router, mounted]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchStats(), fetchUsers(), fetchDiscordConfig(), fetchBotStatus(), fetchStatsConfig(), fetchAdminProjects()]).finally(() => { setLoading(false); });
  }, [user, fetchStats, fetchUsers, fetchDiscordConfig, fetchBotStatus, fetchStatsConfig, fetchAdminProjects]);

  // Auto-refresh stats every 60 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchBotStatus();
      fetchStatsConfig();
    }, 60000);
    return () => clearInterval(interval);
  }, [user, fetchStats, fetchBotStatus, fetchStatsConfig]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role: newRole }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))); toast.success('Rol actualizado'); } catch { toast.error('Error de conexion'); }
  };
  const handleBanToggle = async (targetUser: AdminUser, shouldBan: boolean) => {
    if (shouldBan) { setSelectedUser(targetUser); setBanReason(''); setShowBanDialog(true); return; }
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: targetUser.id, isBanned: false }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === targetUser.id ? { ...u, isBanned: false, banReason: undefined } : u))); toast.success(`${targetUser.nickname} desbaneado`); } catch { toast.error('Error'); }
  };
  const confirmBan = async () => {
    if (!selectedUser) return;
    try { const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: selectedUser.id, isBanned: true, banReason: banReason || 'Sin razon' }) }); if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; } setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, isBanned: true, banReason } : u))); toast.success(`${selectedUser.nickname} baneado`); setShowBanDialog(false); } catch { toast.error('Error'); }
  };

  // ─── Security dialog handlers ───
  const openSecurityDialog = async (targetUser: AdminUser) => {
    setSecurityUser(targetUser);
    setShowSecurityDialog(true);
    setSecurityData(null);
    setSecurityMode('view');
    setSecurityAction(null);
    setSecurityResult('');
    setSecurityResultLabel('');
    setShowHashes(false);
    setNewPasswordInput('');
    setNewSecurityQuestion('');
    setNewSecurityAnswer('');
    setSecurityLoading(true);
    try {
      const res = await fetch(`/api/admin/user-security?userId=${targetUser.id}`);
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al cargar info de seguridad');
        setShowSecurityDialog(false);
        return;
      }
      const data = await res.json();
      setSecurityData(data);
    } catch {
      toast.error('Error de conexion');
      setShowSecurityDialog(false);
    } finally {
      setSecurityLoading(false);
    }
  };

  const closeSecurityDialog = () => {
    setShowSecurityDialog(false);
    setSecurityUser(null);
    setSecurityData(null);
    setSecurityMode('view');
    setSecurityAction(null);
    setSecurityResult('');
    setSecurityResultLabel('');
    setShowHashes(false);
    setNewPasswordInput('');
    setNewSecurityQuestion('');
    setNewSecurityAnswer('');
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const executeSecurityAction = async () => {
    if (!securityUser || !securityAction) return;
    setSecurityBusy(true);
    try {
      const body: Record<string, unknown> = { userId: securityUser.id, action: securityAction };
      if (securityAction === 'reset_password' && newPasswordInput.trim()) {
        body.newPassword = newPasswordInput;
      }
      if (securityAction === 'reset_security') {
        body.securityQuestion = newSecurityQuestion;
        body.securityAnswer = newSecurityAnswer;
      }
      const res = await fetch('/api/admin/user-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error');
        return;
      }
      if (securityAction === 'reset_password') {
        setSecurityResult(data.newPassword);
        setSecurityResultLabel('Nueva contraseña');
      } else if (securityAction === 'regen_recovery') {
        setSecurityResult(data.recoveryCode);
        setSecurityResultLabel('Nuevo código de recuperación');
      } else if (securityAction === 'reset_security') {
        toast.success('Pregunta y respuesta actualizadas');
        closeSecurityDialog();
        return;
      }
      setSecurityMode('result');
      toast.success('Acción completada');
    } catch {
      toast.error('Error de conexion');
    } finally {
      setSecurityBusy(false);
    }
  };

  const startSecurityAction = (action: 'reset_password' | 'reset_security' | 'regen_recovery') => {
    setSecurityAction(action);
    setSecurityResult('');
    setSecurityResultLabel('');
    if (action === 'reset_security') {
      setSecurityMode('form_security');
    } else {
      // reset_password and regen_recovery both go through a confirm step (form_password mode)
      setSecurityMode('form_password');
    }
  };

  const handleDiscordSave = async () => {
    setDiscordLoading(true);
    try {
      const payload: Record<string, string | boolean> = {};
      if (dcForm.webhookUrl) payload.webhookUrl = dcForm.webhookUrl;
      if (dcForm.modRoleId) payload.modRoleId = dcForm.modRoleId;
      if (dcForm.adminRoleId) payload.adminRoleId = dcForm.adminRoleId;
      if (dcForm.collabRoleId) payload.collabRoleId = dcForm.collabRoleId;
      if (dcForm.discordClientId) payload.discordClientId = dcForm.discordClientId;
      if (dcForm.discordClientSecret) payload.discordClientSecret = dcForm.discordClientSecret;
      if (dcForm.siteUrl) payload.siteUrl = dcForm.siteUrl;
      payload.notificationEnabled = dcForm.notificationEnabled;
      const res = await fetch('/api/admin/discord', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Configuracion de Discord guardada');
      fetchDiscordConfig();
      fetchBotStatus();
    } catch { toast.error('Error'); } finally { setDiscordLoading(false); }
  };
  const handleDeleteComment = async (commentId: string) => {
    try { const res = await fetch('/api/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId }) }); if (!res.ok) { toast.error('Error'); return; } setAllComments(prev => prev.filter(c => c.id !== commentId)); toast.success('Comentario eliminado'); } catch { toast.error('Error'); }
  };
  const handleStatsConfigSave = async () => {
    setStatsConfigSaving(true);
    try {
      const res = await fetch('/api/admin/stats/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visits_base: statsConfig.visits_base, downloads_base: statsConfig.downloads_base, external_downloads_base: statsConfig.external_downloads_base }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Configuracion de estadisticas guardada');
      fetchStats();
    } catch { toast.error('Error de conexion'); } finally { setStatsConfigSaving(false); }
  };
  const handleSyncRoles = async () => {
    setSyncLoading(true);
    try {
      const body: Record<string, unknown> = {};
      if (syncTarget === 'all') body.syncAll = true;
      const res = await fetch('/api/admin/discord/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      const data = await res.json();
      toast.success(`Sincronizacion completada: ${data.synced} actualizados, ${data.errors} errores`);
      setShowSyncDialog(false);
      fetchStats();
      fetchUsers();
    } catch { toast.error('Error de conexion'); } finally { setSyncLoading(false); }
  };

  const filteredUsers = users.filter(u => u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())));
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasNoSearchResults = hasSearchQuery && filteredUsers.length === 0;

  const isEs = true; // Admin panel is Spanish-only based on existing code

  // Role helpers for permissions
  const isMod = user?.role === 'moderator';
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  const canSeeAllTabs = isAdmin || isOwner; // moderators only see users tab
  const visibleNavItems = canSeeAllTabs ? navItems : navItems.filter(i => i.id === 'users');

  if (!mounted || !user || loading) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-b-[#00F2FE] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>
          <p className="font-code text-sm text-white/30">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 30) return `Hace ${diffDays}d`;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const primaryStatCards = [
    { icon: Users, label: 'Miembros Totales', value: stats?.stats.totalUsers || 0, color: '#FF2D78', bg: 'bg-[#FF2D78]/5', border: 'border-[#FF2D78]/20', trend: 'total' },
    { icon: MessageSquare, label: 'Comentarios Totales', value: stats?.stats.totalComments || 0, color: '#00F2FE', bg: 'bg-[#00F2FE]/5', border: 'border-[#00F2FE]/20', trend: 'up' },
    { icon: DollarSign, label: 'Donaciones ($)', value: `$${(stats?.stats.totalDonations || 0).toFixed(2)}`, color: '#22C55E', bg: 'bg-green-500/5', border: 'border-green-500/20', trend: 'up' },
    { icon: TrendingUp, label: 'Registros Hoy', value: stats?.recentUsers?.length || 0, color: '#9d4edd', bg: 'bg-[#9d4edd]/5', border: 'border-[#9d4edd]/20', trend: 'neutral' },
  ];

  const secondaryStatCards = [
    { icon: Eye, label: 'Visitas del Sitio', value: stats?.stats.totalVisits || 0, color: '#22c55e', bg: 'bg-green-500/5', border: 'border-green-500/20' },
    { icon: Download, label: 'Descargas de Proyectos', value: stats?.stats.totalDownloads || 0, color: '#FF2D78', bg: 'bg-[#FF2D78]/5', border: 'border-[#FF2D78]/20' },
  ];

  return (
    <div className="min-h-screen bg-[#030308] text-white">
      {/* ─── Mobile Overlay ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════ Sidebar — Cyberpunk/IDE/Anime ═══════════════ */}
      <aside className={`fixed top-0 left-0 h-full w-[270px] bg-[#080812] border-r border-white/[0.05] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header — brand gradient accent */}
        <div className="p-5 border-b border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 brand-gradient" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 clip-card bg-gradient-to-br from-[#FF2D78] to-[#9d4edd] flex items-center justify-center shadow-lg shadow-[#FF2D78]/25">
                <Shield size={19} className="text-white" />
              </div>
              <div>
                <h2 className="font-cyber text-sm font-bold text-white tracking-tight uppercase">Administracion</h2>
                <p className="font-code text-[9px] text-[#9d4edd]/60 uppercase tracking-widest">{'// '}The Encoders Club</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden clip-btn w-7 h-7 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* IDE label for nav */}
        <div className="px-4 pt-4 pb-1">
          <span className="font-code text-[9px] font-bold text-white/20 uppercase tracking-widest">{'// '}Navegacion</span>
        </div>

        {/* Nav Items — Cyberpunk hover + Anime dot */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {visibleNavItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-[#FF2D78]/8 text-white'
                    : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,0.5)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-[#FF2D78]' : 'group-hover:text-white/50'}`} />
                <span className="font-code text-xs uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer — Anime poetic line */}
        <div className="p-4 border-t border-white/[0.05]">
          <p className="font-code text-[8px] text-[#9d4edd]/30 text-center mb-3 italic">&ldquo;El poder requiere responsabilidad&rdquo;</p>
          <button
            onClick={() => router.push('/')}
            className="w-full clip-btn flex items-center gap-3 px-3 py-2.5 bg-white/3 border border-white/[0.06] text-white/35 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={14} />
            <span className="font-code text-xs">Volver al sitio</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════ Main Content ═══════════════ */}
      <div className="lg:pl-[270px] min-h-screen flex flex-col">
        {/* Top Bar — Cyberpunk/IDE */}
        <header className="sticky top-0 z-30 bg-[#030308]/80 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden clip-btn w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <Menu size={16} />
              </button>
              <div className="hidden sm:flex items-center gap-2 font-code text-[11px] text-white/25">
                <span className="text-[#FF2D78]/50">{'//'} admin</span>
                <span className="text-white/10">/</span>
                <span className="text-white/50 uppercase">{activeTab}</span>
              </div>
              <h1 className="sm:hidden font-code text-[11px] text-white/50 uppercase">{visibleNavItems.find(n => n.id === activeTab)?.label}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 clip-card bg-[#0b0b16] border border-white/[0.06]">
                <div className="w-6 h-6 clip-card bg-gradient-to-br from-[#FF2D78] to-[#9d4edd] flex items-center justify-center">
                  <Shield size={11} className="text-white" />
                </div>
                <span className="hidden sm:block font-code text-[10px] text-white/50">{user.role === 'owner' ? 'Creador' : user.role === 'admin' ? 'Admin' : 'Mod'}</span>
                <Badge className={`font-code text-[9px] px-1.5 py-0 border uppercase tracking-wider font-bold ${
                  user.role === 'owner'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : user.role === 'admin'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/20'
                }`}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">

            {/* ═══════════════ DASHBOARD ═══════════════ */}
            {activeTab === 'dashboard' && canSeeAllTabs && (
              <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Welcome Banner — Cyberpunk card + IDE label + Anime glow */}
                <div className="clip-card relative overflow-hidden bg-[#0b0b16] border border-[#FF2D78]/10 p-6">
                  <div className="absolute top-0 left-0 w-full h-1 brand-gradient" />
                  {/* Anime-style blur orbs */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF2D78]/6 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#00F2FE]/6 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-[#9d4edd]/4 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <span className="font-code text-[10px] font-bold text-[#FF2D78]/50 uppercase tracking-widest block mb-3">
                      {'// '}panel de control
                    </span>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 clip-card bg-gradient-to-br from-[#FF2D78] to-[#9d4edd] flex items-center justify-center shadow-lg shadow-[#FF2D78]/20 animate-pulse-glow">
                        <Shield size={22} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-cyber text-xl font-bold text-white uppercase tracking-tight">Panel de Administracion</h2>
                        <p className="font-code text-[10px] text-white/30">The Encoders Club — {user.role === 'owner' ? 'Creador del sitio' : 'Administrador'}</p>
                      </div>
                    </div>
                    <p className="font-code text-[11px] text-white/40 max-w-lg leading-relaxed">
                      Vista general de la plataforma. Monitoriza estadisticas, gestiona usuarios, moderacion de comentarios, integraciones de Discord y actividad reciente del sistema.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                      <span className="font-code text-[10px] text-green-400/60">Estadisticas en vivo</span>
                      <button onClick={() => { fetchStats(); fetchBotStatus(); fetchUsers(); }} className="ml-auto font-code text-[10px] text-white/25 hover:text-[#00F2FE] transition-colors flex items-center gap-1">
                        <RefreshCw size={10} /> Actualizar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Stat Cards — Cyberpunk clip-card + IDE font-code + Anime colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {primaryStatCards.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="clip-card relative overflow-hidden bg-[#0b0b16] border border-white/[0.06] p-5 hover:border-white/[0.10] transition-all duration-300 group"
                    >
                      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: stat.color, opacity: 0 }} />
                      <div className="flex items-start justify-between relative">
                        <div>
                          <p className="font-code text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
                          <p className="font-cyber text-3xl font-bold text-white tracking-tight" style={{ color: stat.color }}>{stat.value}</p>
                          {stat.trend === 'up' && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <TrendingUp size={11} className="text-green-400/60" />
                              <span className="font-code text-[9px] text-green-400/50">Activo</span>
                            </div>
                          )}
                          {stat.trend === 'total' && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <Users size={11} className="text-white/15" />
                              <span className="font-code text-[9px] text-white/15">Creciendo</span>
                            </div>
                          )}
                        </div>
                        <div className="w-10 h-10 clip-card flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                          <stat.icon size={16} style={{ color: stat.color }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {secondaryStatCards.map((stat, i) => (
                    <motion.div
                      key={`secondary-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                      className="clip-card relative overflow-hidden bg-[#0b0b16] border border-white/[0.06] p-5 hover:border-white/[0.10] transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between relative">
                        <div>
                          <p className="font-code text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
                          <p className="font-cyber text-3xl font-bold" style={{ color: stat.color }}>{stat.value.toLocaleString()}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <motion.div
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                            />
                            <span className="font-code text-[9px] text-white/25">En tiempo real</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 clip-card flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                          <stat.icon size={16} style={{ color: stat.color }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Configuration — IDE terminal style */}
                <AdminCard>
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#22C55E] to-[#00F2FE]" />
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 clip-card bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                        <TrendingUp size={14} className="text-[#22C55E]" />
                      </div>
                      <div>
                        <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Configuracion de Estadisticas</h3>
                        <p className="font-code text-[9px] text-white/25">{'// '}numeros base que se suman a los conteos reales</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {/* Visits Breakdown */}
                    <div className="p-4 bg-[#080812] border border-white/[0.05]">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye size={12} className="text-[#22c55e]" />
                        <span className="font-code text-[10px] font-bold text-white/50 uppercase tracking-wider">Visitas del Sitio</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">Base configurada</span>
                          <span className="font-code text-[10px] text-white/70 font-semibold">{(statsConfig.visits_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">Visitas reales</span>
                          <span className="font-code text-[10px] text-green-400/80 font-semibold">{(stats?.stats.realVisits || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/[0.05] pt-2 flex items-center justify-between">
                          <span className="font-code text-[10px] font-medium text-white/50">Total mostrado</span>
                          <span className="font-cyber text-lg font-bold text-[#22c55e]">{(stats?.stats.totalVisits || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Downloads Breakdown */}
                    <div className="p-4 bg-[#080812] border border-white/[0.05]">
                      <div className="flex items-center gap-2 mb-3">
                        <Download size={12} className="text-[#FF2D78]" />
                        <span className="font-code text-[10px] font-bold text-white/50 uppercase tracking-wider">Descargas</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">1. Base fija</span>
                          <span className="font-code text-[10px] text-white/70 font-semibold">{(statsConfig.downloads_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">2. Web (auto)</span>
                          <span className="font-code text-[10px] text-[#22c55e]/80 font-semibold">{(statsConfig.website_downloads || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">3. GitHub (auto)</span>
                          <span className="font-code text-[10px] text-[#00F2FE]/80 font-semibold">{(statsConfig.github_downloads || 0).toLocaleString()}</span>
                        </div>
                        {Object.entries(statsConfig.github_per_repo || {}).map(([repo, count]) => (
                          <div key={repo} className="flex items-center justify-between text-xs pl-3">
                            <span className="font-code text-[9px] text-white/20 truncate">{repo.split('/').pop()}</span>
                            <span className="font-code text-[9px] text-white/40">{count.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-code text-[10px] text-white/30">4. Otra plataforma</span>
                          <span className="font-code text-[10px] text-[#9d4edd]/80 font-semibold">{(statsConfig.external_downloads_base || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/[0.05] pt-2 flex items-center justify-between">
                          <span className="font-code text-[10px] font-medium text-white/50">Total mostrado</span>
                          <span className="font-cyber text-lg font-bold text-[#FF2D78]">{(stats?.stats.totalDownloads || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#22C55E]">{'>'}</span> Base de Visitas
                      </label>
                      <AdminInput type="number" min="0" value={statsConfig.visits_base} onChange={e => setStatsConfig(prev => ({ ...prev, visits_base: Math.max(0, parseInt(e.target.value) || 0) }))} placeholder="Ej: 50000" />
                    </div>
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#FF2D78]">{'>'}</span> Base de Descargas
                      </label>
                      <AdminInput type="number" min="0" value={statsConfig.downloads_base} onChange={e => setStatsConfig(prev => ({ ...prev, downloads_base: Math.max(0, parseInt(e.target.value) || 0) }))} placeholder="Ej: 15000" />
                    </div>
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#9d4edd]">{'>'}</span> Descargas Otra Plataforma
                      </label>
                      <AdminInput type="number" min="0" value={statsConfig.external_downloads_base} onChange={e => setStatsConfig(prev => ({ ...prev, external_downloads_base: Math.max(0, parseInt(e.target.value) || 0) }))} placeholder="Ej: 5000" />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 clip-card bg-[#22C55E]/[0.03] border border-[#22C55E]/10 mb-4">
                    <Info size={12} className="text-[#22C55E]/60 shrink-0 mt-0.5" />
                    <p className="font-code text-[10px] text-white/30 leading-relaxed">Las descargas se calculan como: <b className='text-white/45'>Base Fija</b> + <b className='text-[#22c55e]/60'>Web (auto)</b> + <b className='text-[#00F2FE]/60'>GitHub (auto)</b> + <b className='text-[#9d4edd]/60'>Otra Plataforma</b>. La Web y GitHub se actualizan en tiempo real.</p>
                  </div>

                  <button
                    onClick={handleStatsConfigSave}
                    disabled={statsConfigSaving}
                    className="w-full btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50"
                  >
                    {statsConfigSaving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><Save size={14} /> Guardar Configuracion</>}
                  </button>
                </AdminCard>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Recent Activity */}
                  <AdminCard className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 clip-card bg-[#FF2D78]/10 border border-[#FF2D78]/20 flex items-center justify-center">
                          <Activity size={14} className="text-[#FF2D78]" />
                        </div>
                        <div>
                          <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Actividad Reciente</h3>
                          <p className="font-code text-[9px] text-white/25">{'// '}eventos de la plataforma</p>
                        </div>
                      </div>
                      <span className="font-code text-[9px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 border border-white/[0.04]">{logs?.length || 0} eventos</span>
                    </div>
                    <div className="space-y-0 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
                      {(!logs || logs.length === 0) ? (
                        <EmptyState icon={FileText} message="Sin actividad reciente" submessage="Los eventos apareceran aqui" />
                      ) : logs.map((log, idx) => (
                        <div key={log.id} className="relative flex items-start gap-3 pb-4">
                          {idx < logs.length - 1 && (
                            <div className="absolute left-[10px] top-6 bottom-0 w-px bg-white/[0.03]" />
                          )}
                          <div className={`w-[20px] h-[20px] clip-card ${getActionBgColor(log.action)} flex items-center justify-center shrink-0 mt-0.5`}>
                            <div className={`w-[6px] h-[6px] rounded-full ${getActionDotColor(log.action)}`} />
                          </div>
                          <div className="flex-1 min-w-0 -mt-0.5">
                            <p className="font-code text-xs text-white/60 leading-relaxed">
                              <span className="font-bold text-white/85">{log.user?.nickname || 'Sistema'}</span>
                              {' — '}
                              <span className={getActionColor(log.action)}>{actionLabels[log.action] || log.action}</span>
                            </p>
                            <p className="font-code text-[10px] text-white/20 mt-1">{formatTimeAgo(log.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AdminCard>

                  {/* Users by Role */}
                  <AdminCard className="lg:col-span-2">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 clip-card bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-center">
                        <Users size={14} className="text-[#00F2FE]" />
                      </div>
                      <div>
                        <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Usuarios por Rol</h3>
                        <p className="font-code text-[9px] text-white/25">{'// '}distribucion de roles</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {(!stats?.usersByRole || stats.usersByRole.length === 0) ? (
                        <EmptyState icon={Users} message="Sin datos" />
                      ) : (stats.usersByRole || []).map(r => {
                        const total = stats?.stats.totalUsers || 1;
                        const pct = Math.round((r._count / total) * 100);
                        const barColor = r.role === 'owner' ? 'bg-yellow-400' : r.role === 'admin' ? 'bg-red-400' : r.role === 'moderator' ? 'bg-[#00F2FE]' : r.role === 'collaborator' ? 'bg-green-400' : 'bg-white/30';
                        return (
                          <div key={r.role}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${barColor}`} />
                                <span className="font-code text-[10px] text-white/45 uppercase tracking-wider">{roleLabels[r.role] || r.role}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-code text-xs font-bold text-white/80">{r._count}</span>
                                <span className="font-code text-[10px] text-white/20">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/[0.03] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                                className={`h-full ${barColor}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AdminCard>
                </div>

                {/* Recent Users */}
                <AdminCard>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 clip-card bg-[#FF2D78]/10 border border-[#FF2D78]/20 flex items-center justify-center">
                        <TrendingUp size={14} className="text-[#FF2D78]" />
                      </div>
                      <div>
                        <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Usuarios Recientes</h3>
                        <p className="font-code text-[9px] text-white/25">{'// '}ultimos registros</p>
                      </div>
                    </div>
                    <span className="font-code text-[9px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 border border-white/[0.04]">
                      {stats?.recentUsers?.length || 0} nuevos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {(stats?.recentUsers || []).map(u => (
                      <div key={u.id} className="flex items-center gap-3 p-3 bg-[#080812] border border-white/[0.04] hover:border-[#FF2D78]/15 transition-all">
                        <div className="w-9 h-9 clip-card overflow-hidden shrink-0 bg-gradient-to-br from-[#FF2D78] to-[#9d4edd]">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={12} className="text-white" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-code text-xs font-bold text-white truncate">{u.nickname}</p>
                          <span className={`font-code text-[8px] px-1.5 py-0.5 border uppercase tracking-wider font-bold ${roleColors[u.role] || roleColors.user}`}>{roleLabels[u.role] || u.role}</span>
                        </div>
                      </div>
                    ))}
                    {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                      <EmptyState icon={Users} message="Sin usuarios" />
                    )}
                  </div>
                </AdminCard>

                {/* Recent Donations — Anime Heart theme */}
                <AdminCard>
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 clip-card bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                      <Heart size={14} className="text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Donaciones Recientes</h3>
                      <p className="font-code text-[9px] text-white/25">{'// '}contribuciones de la comunidad</p>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {(stats?.donations || []).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-[#080812] border border-white/[0.04] hover:border-[#22C55E]/15 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 clip-card bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                            <DollarSign size={14} className="text-[#22C55E]" />
                          </div>
                          <div>
                            <p className="font-code text-xs font-bold text-white">${d.amount.toFixed(2)}</p>
                            {d.message && <p className="font-code text-[10px] text-white/25 truncate max-w-xs">{d.message}</p>}
                          </div>
                        </div>
                        <span className="font-code text-[10px] text-white/20">{formatTimeAgo(d.createdAt)}</span>
                      </div>
                    ))}
                    {(!stats?.donations || stats.donations.length === 0) && (
                      <EmptyState icon={Heart} message="Sin donaciones" />
                    )}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ═══════════════ USERS ═══════════════ */}
            {activeTab === 'users' && (
              <motion.div key="users" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Search — IDE terminal style */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2D78]/40" />
                    <input
                      type="text"
                      placeholder="Buscar por nickname o email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#080812] border border-[#FF2D78]/10 text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/30 focus:shadow-[0_0_10px_rgba(255,45,120,0.08)] placeholder:text-white/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="clip-btn px-4 py-2.5 bg-white/3 border border-white/[0.06] text-white/40 font-code text-xs uppercase tracking-wider hover:bg-white/5 hover:text-white/60 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={12} className={usersLoading ? 'animate-spin' : ''} />
                    Refrescar
                  </button>
                </div>

                {/* Stats Row — Anime dot indicators */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-code text-[10px] text-white/30 px-3 py-1.5 bg-[#080812] border border-white/[0.05] uppercase tracking-wider">
                    {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                  </span>
                  <span className="font-code text-[10px] text-green-400/80 px-3 py-1.5 bg-green-500/[0.05] border border-green-500/10 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
                    {filteredUsers.filter(u => !u.isBanned).length} activos
                  </span>
                  <span className="font-code text-[10px] text-red-400/80 px-3 py-1.5 bg-red-500/[0.05] border border-red-500/10 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
                    {filteredUsers.filter(u => u.isBanned).length} baneados
                  </span>
                  <span className="font-code text-[10px] text-[#5865F2]/80 px-3 py-1.5 bg-[#5865F2]/[0.05] border border-[#5865F2]/10 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#5865F2] shadow-[0_0_4px_rgba(88,101,242,0.5)]" />
                    {filteredUsers.filter(u => u.discordLinked).length} Discord
                  </span>
                </div>

                {/* Users Table */}
                <AdminCard padding={false}>
                  <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.04] hover:bg-transparent bg-white/[0.01]">
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest">Usuario</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest">Rol</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest hidden md:table-cell">Discord</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest hidden md:table-cell">Estado</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest hidden lg:table-cell">Comentarios</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest hidden lg:table-cell">Registro</TableHead>
                          <TableHead className="font-code text-[9px] font-bold text-white/30 uppercase tracking-widest text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u, idx) => (
                          <TableRow key={u.id} className={`border-white/[0.03] hover:bg-white/[0.02] transition-colors ${idx % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 clip-card overflow-hidden shrink-0 bg-gradient-to-br from-[#FF2D78] to-[#9d4edd]">
                                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users size={12} className="text-white" /></div>}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-code text-xs font-bold text-white truncate max-w-[160px]">
                                    {u.nickname}
                                    {u.isPremium && <Crown size={10} className="inline text-yellow-400 ml-1.5" />}
                                  </p>
                                  {u.email && <p className="font-code text-[10px] text-white/20 truncate max-w-[160px]">{u.email}</p>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative" ref={roleChangeUser?.id === u.id ? rolePopoverRef : undefined}>
                                <button
                                  onClick={() => canSeeAllTabs && setRoleChangeUser(roleChangeUser?.id === u.id ? null : u)}
                                  className={`font-code text-[9px] px-2 py-1 border uppercase tracking-wider font-bold transition-all ${canSeeAllTabs ? 'hover:opacity-80' : 'cursor-default'} ${roleColors[u.role] || roleColors.user}`}
                                  title={canSeeAllTabs ? 'Cambiar rol' : 'Solo lectura'}
                                >
                                  {roleLabels[u.role] || u.role}
                                </button>
                                {canSeeAllTabs && roleChangeUser?.id === u.id && u.role !== 'owner' && (
                                  <div className="absolute top-full mt-1 left-0 z-50 bg-[#0b0b16] border border-white/[0.08] shadow-xl shadow-black/30 p-1 min-w-[120px]">
                                    {['user', 'collaborator', 'moderator', 'admin'].map(role => (
                                      <button
                                        key={role}
                                        onClick={() => { handleRoleChange(u.id, role); setRoleChangeUser(null); }}
                                        className={`w-full text-left px-3 py-2 font-code text-[10px] uppercase tracking-wider hover:bg-white/5 transition-all ${
                                          role === u.role ? 'text-[#FF2D78]' : 'text-white/50'
                                        }`}
                                      >
                                        {roleLabels[role]}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {u.discordLinked ? (
                                <span className="font-code text-[9px] text-[#5865F2] uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-[#5865F2] shadow-[0_0_4px_rgba(88,101,242,0.5)]" /> Vinculado
                                </span>
                              ) : (
                                <span className="font-code text-[9px] text-white/20 uppercase tracking-wider">—</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {u.isBanned ? (
                                <span className="font-code text-[9px] text-red-400 uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-red-400 shadow-[0_0_4px_rgba(239,68,68,0.5)]" /> Baneado
                                </span>
                              ) : (
                                <span className="font-code text-[9px] text-green-400/60 uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.5)]" /> Activo
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell font-code text-xs text-white/40">{u.commentCount || 0}</TableCell>
                            <TableCell className="hidden lg:table-cell font-code text-[10px] text-white/25">{new Date(u.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* Security & Credentials — available to mod/admin/owner */}
                                <button
                                  onClick={() => openSecurityDialog(u)}
                                  className="p-1.5 text-white/15 hover:text-[#00F2FE] hover:bg-[#00F2FE]/10 transition-all"
                                  title="Seguridad y credenciales"
                                >
                                  <Key size={14} />
                                </button>
                                {/* Role change + ban — admin/owner only */}
                                {canSeeAllTabs && u.role !== 'owner' && (
                                  <button
                                    onClick={() => handleBanToggle(u, !u.isBanned)}
                                    className={`p-1.5 transition-all ${u.isBanned ? 'text-green-400/50 hover:text-green-400 hover:bg-green-500/10' : 'text-white/15 hover:text-red-400 hover:bg-red-500/10'}`}
                                    title={u.isBanned ? 'Desbanear' : 'Banear'}
                                  >
                                    {u.isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <EmptyState icon={Users} message={hasNoSearchResults ? 'Sin resultados' : 'No hay usuarios'} submessage={hasNoSearchResults ? `No se encontro "${searchQuery}"` : undefined} />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ═══════════════ COMMENTS ═══════════════ */}
            {activeTab === 'comments' && canSeeAllTabs && (
              <motion.div key="comments" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="clip-card relative overflow-hidden bg-[#0b0b16] border border-[#9d4edd]/10 p-5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#9d4edd] to-[#00F2FE]" />
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 clip-card bg-gradient-to-br from-[#9d4edd] to-[#00F2FE] flex items-center justify-center">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">Moderacion de Comentarios</h2>
                      <p className="font-code text-[10px] text-white/30">{'// '}revisa y elimina comentarios reportados</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {allComments.map(c => (
                    <div key={c.id} className="group clip-card bg-[#0b0b16] border border-white/[0.05] p-4 hover:border-white/[0.08] transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 clip-card bg-gradient-to-br from-[#9d4edd] to-[#00F2FE] flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare size={12} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-code text-xs font-bold text-white/85">{c.author?.nickname || 'Anonimo'}</span>
                            {c.reports > 0 && (
                              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] py-0 px-1.5 font-code">
                                <AlertTriangle size={8} className="mr-0.5" />
                                {c.reports} reporte{c.reports > 1 ? 's' : ''}
                              </Badge>
                            )}
                            <span className="font-code text-[10px] text-white/15 ml-auto">{formatTimeAgo(c.createdAt)}</span>
                          </div>
                          <p className="font-code text-xs text-white/45 line-clamp-2 leading-relaxed">{c.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-1.5 text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {allComments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                      <MessageSquare size={44} strokeWidth={1} />
                      <p className="font-code text-sm mt-3 text-white/25">No hay comentarios aun</p>
                      <p className="font-code text-[10px] text-white/15 mt-1">Los comentarios nuevos apareceran aqui</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══════════════ DISCORD ═══════════════ */}
            {activeTab === 'discord' && canSeeAllTabs && (
              <motion.div key="discord" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Section Header */}
                <div className="clip-card relative overflow-hidden bg-[#0b0b16] border border-[#5865F2]/15 p-5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#5865F2] to-[#9d4edd]" />
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 clip-card bg-gradient-to-br from-[#5865F2] to-[#9d4edd] flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">Integracion con Discord</h2>
                      <p className="font-code text-[10px] text-white/30">{'// '}bot, webhook, roles y OAuth2</p>
                    </div>
                  </div>
                </div>

                {/* Bot Status Card */}
                <AdminCard>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 clip-card bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                        {botStatus?.connected ? <Wifi size={16} className="text-green-400" /> : <WifiOff size={16} className="text-red-400/60" />}
                      </div>
                      <div>
                        <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Estado del Bot</h3>
                        <p className="font-code text-[9px] text-white/25">{'// '}conectividad y estadisticas</p>
                      </div>
                    </div>
                    <button onClick={fetchBotStatus} disabled={statusLoading} className="clip-btn px-3 py-1.5 bg-white/3 border border-white/[0.06] text-white/35 font-code text-[10px] uppercase tracking-wider hover:bg-white/5 transition-all flex items-center gap-1.5 disabled:opacity-50">
                      <RefreshCw size={10} className={statusLoading ? 'animate-spin' : ''} /> Verificar
                    </button>
                  </div>

                  {statusLoading && !botStatus ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={20} className="animate-spin text-white/20" />
                    </div>
                  ) : botStatus ? (
                    <div className="space-y-4">
                      <div className={`flex items-center gap-3 p-3.5 clip-card border ${botStatus.connected ? 'bg-green-500/[0.03] border-green-500/15' : 'bg-red-500/[0.03] border-red-500/15'}`}>
                        {botStatus.connected ? (
                          <>
                            {botStatus.botAvatar && <img src={botStatus.botAvatar} alt="" className="w-10 h-10 clip-card" />}
                            <div>
                              <p className="font-code text-xs font-bold text-green-400">{botStatus.botUsername}</p>
                              <p className="font-code text-[10px] text-white/25">Conectado correctamente</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 clip-card bg-red-500/15 flex items-center justify-center"><Bot size={16} className="text-red-400/60" /></div>
                            <div>
                              <p className="font-code text-xs font-bold text-red-400">Desconectado</p>
                              <p className="font-code text-[10px] text-white/25">{botStatus.message}</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Vinculadas', value: botStatus.linkedUsers, check: null },
                          { label: 'Miembros', value: botStatus.server?.memberCount || '—', check: null },
                          { label: 'Rol Admin', value: null, check: botStatus.roleConfig?.hasAdminRole },
                          { label: 'OAuth2', value: null, check: botStatus.hasClientId },
                        ].map((s, i) => (
                          <div key={i} className="text-center p-3 bg-[#080812] border border-white/[0.04]">
                            <p className="font-cyber text-lg font-bold text-white/80">{s.check !== null ? (s.check ? '\u2713' : '\u2014') : s.value}</p>
                            <p className="font-code text-[9px] text-white/20 mt-0.5 uppercase tracking-wider">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => setShowSyncDialog(true)} className="w-full clip-btn py-2.5 bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2]/90 font-code text-xs uppercase tracking-wider hover:bg-[#5865F2]/15 hover:shadow-[0_0_12px_rgba(88,101,242,0.15)] transition-all flex items-center justify-center gap-2">
                        <ArrowUpDown size={14} /> Sincronizar roles con Discord
                      </button>
                    </div>
                  ) : (
                    <p className="font-code text-xs text-white/25 text-center py-8">No se pudo obtener el estado</p>
                  )}
                </AdminCard>

                {/* Webhook Configuration */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 clip-card bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                      <Zap size={16} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Webhook</h3>
                      <p className="font-code text-[9px] text-white/25">{'// '}canal de Discord para alertas</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#5865F2]">{'>'}</span> Webhook URL
                      </label>
                      <AdminInput value={dcForm.webhookUrl} onChange={e => setDcForm(prev => ({ ...prev, webhookUrl: e.target.value }))} placeholder="https://discord.com/api/webhooks/xxx/xxx" />
                    </div>
                    <div className="flex items-start gap-2.5 p-3 clip-card bg-[#5865F2]/[0.03] border border-[#5865F2]/10">
                      <Info size={12} className="text-[#5865F2]/60 shrink-0 mt-0.5" />
                      <p className="font-code text-[10px] text-white/30 leading-relaxed">Crea un webhook en tu servidor de Discord: Editar Canal &gt; Integraciones &gt; Webhooks &gt; Nuevo Webhook. Copia la URL y pegala aqui.</p>
                    </div>
                  </div>
                </AdminCard>

                {/* Role Mapping */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 clip-card bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Mapeo de Roles</h3>
                      <p className="font-code text-[9px] text-white/25">{'// '}sincronizacion bidireccional</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'adminRoleId' as const, label: 'ID Rol Admin', color: '#FF2D78' },
                      { key: 'modRoleId' as const, label: 'ID Rol Moderador', color: '#00F2FE' },
                      { key: 'collabRoleId' as const, label: 'ID Rol Colaborador', color: '#9d4edd' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                          <span style={{ color: field.color }}>{'>'}</span> {field.label}
                        </label>
                        <AdminInput value={dcForm[field.key]} onChange={e => setDcForm(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder="123456789012345678" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2.5 p-3 clip-card bg-[#5865F2]/[0.03] border border-[#5865F2]/10 mt-4">
                    <Info size={12} className="text-[#5865F2]/60 shrink-0 mt-0.5" />
                    <p className="font-code text-[10px] text-white/30 leading-relaxed">Los roles se sincronizan bidireccionalmente. Los admins obtienen automaticamente los roles de mod y colab.</p>
                  </div>
                </AdminCard>

                {/* OAuth2 Configuration */}
                <AdminCard>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 clip-card bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                      <Globe size={16} className="text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">OAuth2</h3>
                      <p className="font-code text-[9px] text-white/25">{'// '}vinculacion de cuentas</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#5865F2]">{'>'}</span> Client ID
                      </label>
                      <AdminInput value={dcForm.discordClientId} onChange={e => setDcForm(prev => ({ ...prev, discordClientId: e.target.value }))} placeholder="123456789012345678" />
                    </div>
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#FF2D78]">{'>'}</span> Client Secret
                      </label>
                      <div className="relative">
                        <AdminInput type={showClientSecret ? 'text' : 'password'} value={dcForm.discordClientSecret} onChange={e => setDcForm(prev => ({ ...prev, discordClientSecret: e.target.value }))} placeholder={discordConfig?.hasClientSecret ? 'Secret configurado (dejar vacio para mantener)' : 'Client Secret de Discord'} className="pr-10" />
                        <button onClick={() => setShowClientSecret(!showClientSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                          {showClientSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
                        <span className="text-[#00F2FE]">{'>'}</span> URL del Sitio
                      </label>
                      <AdminInput value={dcForm.siteUrl} onChange={e => setDcForm(prev => ({ ...prev, siteUrl: e.target.value }))} placeholder="https://tu-sitio.pages.dev" />
                    </div>
                    <div className="flex items-start gap-2.5 p-3 clip-card bg-[#5865F2]/[0.03] border border-[#5865F2]/10">
                      <Info size={12} className="text-[#5865F2]/60 shrink-0 mt-0.5" />
                      <p className="font-code text-[10px] text-white/30 leading-relaxed">
                        Crea una aplicacion en el <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] underline underline-offset-2">Portal de Desarrolladores de Discord</a>. En OAuth2, agrega el redirect URI: <code className="text-white/50 bg-[#080812] px-1.5 py-0.5 text-[9px]">TU_SITIO/api/auth/discord/callback</code>
                      </p>
                    </div>
                  </div>
                </AdminCard>

                {/* Notification Toggle */}
                <div className="clip-card bg-[#0b0b16] border border-white/[0.05] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 clip-card bg-[#9d4edd]/10 border border-[#9d4edd]/20 flex items-center justify-center">
                      <Bell size={14} className="text-[#9d4edd]" />
                    </div>
                    <div>
                      <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Notificaciones</p>
                      <p className="font-code text-[9px] text-white/25">Enviar alertas a Discord al publicar comentarios</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDcForm(prev => ({ ...prev, notificationEnabled: !prev.notificationEnabled }))}
                    className={`relative w-11 h-6 clip-btn transition-colors ${dcForm.notificationEnabled ? 'bg-[#5865F2] shadow-[0_0_10px_rgba(88,101,242,0.3)]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white shadow-md transition-transform ${dcForm.notificationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Save & Test Buttons */}
                <div className="flex gap-3">
                  <button onClick={handleDiscordSave} disabled={discordLoading} className="flex-1 btn-primary text-sm py-3 uppercase tracking-wider disabled:opacity-50">
                    {discordLoading ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><Save size={14} /> Guardar Configuracion</>}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/discord/test', { method: 'POST' });
                        const data = await res.json();
                        if (data.success) { toast.success('Notificacion de prueba enviada!'); }
                        else { toast.error(data.message || 'No se pudo enviar la prueba.'); }
                      } catch { toast.error('Error de conexion'); }
                    }}
                    className="clip-btn py-3 px-5 bg-white/3 border border-white/[0.06] text-white/40 font-code text-xs uppercase tracking-wider hover:bg-white/5 hover:text-white/60 transition-all flex items-center gap-2"
                  >
                    <Zap size={14} /> Probar Webhook
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ PROJECTS (dynamic) ═══════════════ */}
            {activeTab === 'projects' && canSeeAllTabs && (
              <motion.div key="projects" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Section Header */}
                <div className="clip-card relative overflow-hidden bg-[#0b0b16] border border-[#FF2D78]/10 p-5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF2D78] to-[#9d4edd]" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 clip-card bg-gradient-to-br from-[#FF2D78] to-[#9d4edd] flex items-center justify-center">
                        <FolderKanban size={16} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">Proyectos Dinámicos</h2>
                        <p className="font-code text-[10px] text-white/30 uppercase tracking-widest">{'// '}Creados desde el panel</p>
                      </div>
                    </div>
                    <button
                      onClick={openCreateProject}
                      className="clip-btn py-2.5 px-4 bg-[#FF2D78] hover:bg-[#ff4d8d] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,45,120,0.4)] transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Nuevo Proyecto
                    </button>
                  </div>
                </div>

                {/* Info banner */}
                <div className="clip-card bg-[#0b0b16] border border-[#00F2FE]/10 p-4 flex items-start gap-3">
                  <Info size={16} className="text-[#00F2FE] flex-shrink-0 mt-0.5" />
                  <p className="font-code text-[11px] text-white/50 leading-relaxed">
                    Los proyectos <span className="text-[#FF2D78]">Monika</span>, <span className="text-[#FF6B9D]">Natsuki</span> y <span className="text-[#9C27B0]">Yuri</span> están hardcodeados en el repositorio y <strong className="text-white/70">no aparecen aquí</strong>. Esta sección solo gestiona los proyectos nuevos que crees desde el panel. Sus botones de descarga contribuyen al mismo contador global que los demás.
                  </p>
                </div>

                {/* Projects list */}
                <AdminCard padding={false}>
                  {projectsLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#FF2D78]" /></div>
                  ) : adminProjects.length === 0 ? (
                    <EmptyState icon={FolderKanban} message="Aún no hay proyectos dinámicos" submessage="Crea tu primer proyecto con el botón 'Nuevo Proyecto'" />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Portada</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Nombre / Slug</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Estado</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Descargas</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Destacado</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider">Publicado</TableHead>
                          <TableHead className="font-code text-[10px] text-white/40 uppercase tracking-wider text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminProjects.map(p => (
                          <TableRow key={p.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                            <TableCell className="py-2">
                              <div className="w-12 h-12 rounded-md overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center" style={{ background: p.coverBg || `linear-gradient(145deg, ${p.themeColor}18 0%, #0d0d24 40%)` }}>
                                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImagePlus size={14} className="text-white/20" />}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-cyber text-sm text-white font-bold">{p.name}</div>
                              <div className="font-code text-[10px] text-white/30">/proyectos/{p.id}</div>
                            </TableCell>
                            <TableCell>
                              <span className="font-code text-[10px] px-2 py-1 border" style={{ borderColor: `${p.statusColor}40`, color: p.statusColor }}>{p.status}</span>
                            </TableCell>
                            <TableCell className="font-code text-xs text-white/60">{p.downloads?.length || 0}</TableCell>
                            <TableCell>
                              {p.featured ? <Star size={14} className="text-yellow-400 fill-yellow-400" /> : <span className="text-white/20 text-xs">—</span>}
                            </TableCell>
                            <TableCell>
                              <span className={`font-code text-[10px] px-2 py-1 border ${p.isPublished ? 'border-green-500/30 text-green-400' : 'border-white/10 text-white/30'}`}>
                                {p.isPublished ? 'Publicado' : 'Borrador'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <a
                                  href={`/proyectos/${p.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-white/40 hover:text-[#00F2FE] transition-colors"
                                  title="Ver página pública"
                                >
                                  <ExternalLink size={13} />
                                </a>
                                <button
                                  onClick={() => openEditProject(p)}
                                  className="p-1.5 text-white/40 hover:text-[#00F2FE] transition-colors"
                                  title="Editar"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => setProjectDeleteTarget(p)}
                                  className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </AdminCard>
              </motion.div>
            )}

            {/* ═══════════════ LOGS ═══════════════ */}
            {activeTab === 'logs' && canSeeAllTabs && (
              <motion.div key="logs" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                {/* Section Header */}
                <div className="clip-card relative overflow-hidden bg-[#0b0b16] border border-[#00F2FE]/10 p-5">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00F2FE] to-[#9d4edd]" />
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 clip-card bg-gradient-to-br from-[#00F2FE] to-[#9d4edd] flex items-center justify-center">
                        <FileText size={16} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">Registro de Actividad</h2>
                        <p className="font-code text-[10px] text-white/30">{'// '}historial de eventos de la plataforma</p>
                      </div>
                    </div>
                    <span className="font-code text-[9px] text-white/20 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 border border-white/[0.04]">{logs?.length || 0} registros</span>
                  </div>
                </div>

                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide pr-1">
                  {(!logs || logs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/20">
                      <FileText size={44} strokeWidth={1} />
                      <p className="font-code text-sm mt-3 text-white/25">Sin registros de actividad</p>
                      <p className="font-code text-[10px] text-white/15 mt-1">Los eventos apareceran aqui</p>
                    </div>
                  ) : logs.map((log, idx) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-3 p-3.5 transition-all hover:bg-white/[0.02] ${idx < logs.length - 1 ? 'border-b border-white/[0.02]' : ''}`}
                    >
                      <div className={`w-8 h-8 clip-card ${getActionBgColor(log.action)} flex items-center justify-center shrink-0 ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-code text-xs font-bold text-white/85">{log.user?.nickname || 'Sistema'}</span>
                          <span className="text-white/10">&middot;</span>
                          <span className={`font-code text-[10px] font-bold ${getActionColor(log.action)}`}>{actionLabels[log.action] || log.action}</span>
                        </div>
                        {log.details && <p className="font-code text-[10px] text-white/25 mt-1">{log.details}</p>}
                      </div>
                      <span className="font-code text-[9px] text-white/15 shrink-0 mt-0.5 bg-[#080812] px-2 py-0.5 border border-white/[0.03] uppercase tracking-wider">{formatTimeAgo(log.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ═══════════════ Ban Dialog — Cyberpunk/IDE ═══════════════ */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-[#0d0d24] border border-red-500/20 text-white sm:max-w-md clip-card overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2 font-cyber text-lg uppercase">
              <div className="w-8 h-8 clip-card bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Ban size={14} className="text-red-400" />
              </div>
              Banear Usuario
            </DialogTitle>
            <DialogDescription className="font-code text-[11px] text-white/40">
              Estas a punto de banear a <strong className="text-white/70">{selectedUser?.nickname}</strong>
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="font-code text-[10px] font-bold text-white/30 block mb-1.5 uppercase tracking-widest">
              <span className="text-red-400">{'>'}</span> Razon del ban
            </label>
            <Input placeholder="Razon del ban (opcional)" value={banReason} onChange={e => setBanReason(e.target.value)} className="bg-[#080812] border-red-500/15 text-white font-code text-sm placeholder:text-white/20 focus:border-red-500/40" />
          </div>
          <DialogFooter className="gap-2 mt-4">
            <button onClick={() => setShowBanDialog(false)} className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 transition-all">Cancelar</button>
            <button onClick={confirmBan} className="flex-1 clip-btn px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2"><Ban size={12} /> Banear</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════ Sync Dialog — Cyberpunk/IDE ═══════════════ */}
      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="bg-[#0d0d24] border border-[#5865F2]/20 text-white sm:max-w-md clip-card overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5865F2] to-[#9d4edd]" />
          <DialogHeader>
            <DialogTitle className="text-[#5865F2] flex items-center gap-2 font-cyber text-lg uppercase">
              <div className="w-8 h-8 clip-card bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
                <ArrowUpDown size={14} className="text-[#5865F2]" />
              </div>
              Sincronizar Roles
            </DialogTitle>
            <DialogDescription className="font-code text-[11px] text-white/40">
              Empuja los roles locales a Discord. Admin/Mod/Colab se asignaran como roles de Discord.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 p-3 clip-card cursor-pointer hover:bg-white/[0.02] transition-all border border-white/[0.04]">
              <input type="radio" name="syncTarget" checked={syncTarget === 'special'} onChange={() => setSyncTarget('special')} className="accent-[#5865F2]" />
              <div>
                <p className="font-code text-xs text-white/70 font-bold">Roles especiales</p>
                <p className="font-code text-[10px] text-white/25">Solo Admin, Mod, Colab</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 clip-card cursor-pointer hover:bg-white/[0.02] transition-all border border-white/[0.04]">
              <input type="radio" name="syncTarget" checked={syncTarget === 'all'} onChange={() => setSyncTarget('all')} className="accent-[#5865F2]" />
              <div>
                <p className="font-code text-xs text-white/70 font-bold">Todas las cuentas</p>
                <p className="font-code text-[10px] text-white/25">Cuentas vinculadas a Discord</p>
              </div>
            </label>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <button onClick={() => setShowSyncDialog(false)} className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 transition-all">Cancelar</button>
            <button onClick={handleSyncRoles} disabled={syncLoading} className="flex-1 clip-btn px-4 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(88,101,242,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {syncLoading ? <><Loader2 size={12} className="animate-spin" /> Sincronizando...</> : <><ArrowUpDown size={12} /> Sincronizar</>}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════ Security & Credentials Dialog — Cyberpunk/IDE ═══════════════ */}
      <Dialog open={showSecurityDialog} onOpenChange={(open) => { if (!open) closeSecurityDialog(); }}>
        <DialogContent className="bg-[#0d0d24] border border-[#00F2FE]/20 text-white sm:max-w-lg clip-card max-h-[90vh] overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00F2FE] to-[#9d4edd]" />
          <DialogHeader>
            <DialogTitle className="text-[#00F2FE] flex items-center gap-2 font-cyber text-lg uppercase">
              <Shield size={18} />
              Seguridad y Credenciales
            </DialogTitle>
            <DialogDescription className="font-code text-[11px] text-white/40">
              {securityUser ? `Usuario: ${securityUser.nickname} (${roleLabels[securityUser.role] || securityUser.role})` : ''}
              <br />
              Las contraseñas y respuestas se almacenan hasheadas (PBKDF2). No se pueden descifrar.
            </DialogDescription>
          </DialogHeader>

          {/* Loading */}
          {securityLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[#00F2FE]" />
            </div>
          )}

          {/* VIEW MODE */}
          {!securityLoading && securityData && securityMode === 'view' && (
            <div className="space-y-4 mt-2">
              {/* Security Question */}
              <div className="p-3 clip-card bg-[#080812] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldQuestion size={12} className="text-[#9d4edd]" />
                  <span className="font-code text-[10px] text-white/40 uppercase tracking-wider">Pregunta de seguridad</span>
                </div>
                <p className="font-code text-xs text-white/85 leading-relaxed">
                  {securityData.securityQuestion || '—'}
                </p>
                <p className="font-code text-[10px] text-white/25 mt-1.5">
                  La respuesta está hasheada (no se puede ver).
                </p>
              </div>

              {/* Hashes — admin/owner only */}
              {canSeeAllTabs && (
                <div className="p-3 clip-card bg-[#080812] border border-white/[0.06]">
                  <button
                    onClick={() => setShowHashes(!showHashes)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Key size={12} className="text-[#FF2D78]" />
                      <span className="font-code text-[10px] text-white/40 uppercase tracking-wider">Hashes (solo lectura)</span>
                    </div>
                    {showHashes ? <EyeOff size={12} className="text-white/30" /> : <Eye size={12} className="text-white/30" />}
                  </button>
                  {showHashes && (
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-code text-[9px] text-white/30 uppercase tracking-wider mb-1">passwordHash</p>
                        <p className="font-code text-[10px] text-white/40 break-all bg-black/30 p-2 border border-white/[0.04]">
                          {securityData.passwordHash || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="font-code text-[9px] text-white/30 uppercase tracking-wider mb-1">securityAnswerHash</p>
                        <p className="font-code text-[10px] text-white/40 break-all bg-black/30 p-2 border border-white/[0.04]">
                          {securityData.securityAnswerHash || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="font-code text-[9px] text-white/30 uppercase tracking-wider mb-1">recoveryCodeHash</p>
                        <p className="font-code text-[10px] text-white/40 break-all bg-black/30 p-2 border border-white/[0.04]">
                          {securityData.recoveryCodeHash || '—'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <p className="font-code text-[9px] text-white/30 uppercase tracking-wider">{'// '}acciones</p>

                {/* Reset password — admin/owner only */}
                {canSeeAllTabs && securityUser?.role !== 'owner' && !(isAdmin && securityUser?.role === 'admin') && (
                  <button
                    onClick={() => startSecurityAction('reset_password')}
                    className="w-full flex items-start gap-3 p-3 clip-card bg-[#080812] border border-[#FF2D78]/15 hover:border-[#FF2D78]/40 hover:bg-[#FF2D78]/5 transition-all text-left"
                  >
                    <Key size={14} className="text-[#FF2D78] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Resetear contraseña</p>
                      <p className="font-code text-[10px] text-white/40 mt-0.5">Genera nueva contraseña aleatoria o personalizada</p>
                    </div>
                  </button>
                )}

                {/* Reset security Q&A — admin/owner only */}
                {canSeeAllTabs && securityUser?.role !== 'owner' && !(isAdmin && securityUser?.role === 'admin') && (
                  <button
                    onClick={() => startSecurityAction('reset_security')}
                    className="w-full flex items-start gap-3 p-3 clip-card bg-[#080812] border border-[#9d4edd]/15 hover:border-[#9d4edd]/40 hover:bg-[#9d4edd]/5 transition-all text-left"
                  >
                    <ShieldQuestion size={14} className="text-[#9d4edd] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Resetear pregunta + respuesta</p>
                      <p className="font-code text-[10px] text-white/40 mt-0.5">Establece nueva pregunta y respuesta de seguridad</p>
                    </div>
                  </button>
                )}

                {/* Regenerate recovery code — mod/admin/owner (with target restrictions) */}
                {securityUser?.role !== 'owner' && !(isAdmin && securityUser?.role === 'admin') && !(isMod && (securityUser?.role === 'admin' || securityUser?.role === 'owner')) && (
                  <button
                    onClick={() => startSecurityAction('regen_recovery')}
                    className="w-full flex items-start gap-3 p-3 clip-card bg-[#080812] border border-[#00F2FE]/15 hover:border-[#00F2FE]/40 hover:bg-[#00F2FE]/5 transition-all text-left"
                  >
                    <RefreshCw size={14} className="text-[#00F2FE] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider">Regenerar código de recuperación</p>
                      <p className="font-code text-[10px] text-white/40 mt-0.5">Genera nuevo código XXXX-XXXX-XXXX-XXXX</p>
                    </div>
                  </button>
                )}

                {/* No actions available */}
                {securityUser?.role === 'owner' && (
                  <p className="font-code text-[10px] text-white/30 text-center py-2">
                    No se pueden realizar acciones sobre la cuenta owner.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* FORM_PASSWORD MODE (reset_password or regen_recovery confirmation) */}
          {!securityLoading && securityData && securityMode === 'form_password' && (
            <div className="space-y-4 mt-2">
              <div className="p-3 clip-card bg-[#FF2D78]/5 border border-[#FF2D78]/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-[#FF2D78] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider mb-1">
                      {securityAction === 'reset_password' ? 'Confirmar reseteo de contraseña' : 'Confirmar regeneración de código'}
                    </p>
                    <p className="font-code text-[10px] text-white/50 leading-relaxed">
                      {securityAction === 'reset_password'
                        ? `Se generará una nueva contraseña para ${securityUser?.nickname}. La contraseña actual dejará de funcionar inmediatamente.`
                        : `Se generará un nuevo código de recuperación para ${securityUser?.nickname}. El código anterior dejará de funcionar.`}
                    </p>
                  </div>
                </div>
              </div>

              {securityAction === 'reset_password' && (
                <div>
                  <label className="font-code text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                    Nueva contraseña <span className="text-white/25">(vacío = generar aleatoria de 12 chars)</span>
                  </label>
                  <Input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Dejar vacío para autogenerar"
                    className="bg-[#080812] border-white/[0.08] text-white font-code text-sm placeholder:text-white/20 focus:border-[#FF2D78]/40"
                  />
                  <p className="font-code text-[9px] text-white/25 mt-1">Mínimo 6 caracteres si se especifica.</p>
                </div>
              )}
            </div>
          )}

          {/* FORM_SECURITY MODE (reset Q&A) */}
          {!securityLoading && securityData && securityMode === 'form_security' && (
            <div className="space-y-3 mt-2">
              <div className="p-3 clip-card bg-[#9d4edd]/5 border border-[#9d4edd]/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-[#9d4edd] mt-0.5 shrink-0" />
                  <p className="font-code text-[10px] text-white/50 leading-relaxed">
                    Establece una nueva pregunta y respuesta de seguridad para <strong className="text-white/70">{securityUser?.nickname}</strong>. La respuesta se hasheará antes de guardarla.
                  </p>
                </div>
              </div>
              <div>
                <label className="font-code text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Nueva pregunta</label>
                <Input
                  type="text"
                  value={newSecurityQuestion}
                  onChange={(e) => setNewSecurityQuestion(e.target.value)}
                  placeholder="Ej: ¿Nombre de tu primera mascota?"
                  className="bg-[#080812] border-white/[0.08] text-white font-code text-sm placeholder:text-white/20 focus:border-[#9d4edd]/40"
                />
              </div>
              <div>
                <label className="font-code text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Nueva respuesta</label>
                <Input
                  type="text"
                  value={newSecurityAnswer}
                  onChange={(e) => setNewSecurityAnswer(e.target.value)}
                  placeholder="Respuesta (mínimo 2 caracteres)"
                  className="bg-[#080812] border-white/[0.08] text-white font-code text-sm placeholder:text-white/20 focus:border-[#9d4edd]/40"
                />
              </div>
            </div>
          )}

          {/* RESULT MODE (one-time secret display) */}
          {!securityLoading && securityData && securityMode === 'result' && (
            <div className="space-y-4 mt-2">
              <div className="p-3 clip-card bg-[#00F2FE]/5 border border-[#00F2FE]/30">
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle size={14} className="text-[#00F2FE] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-cyber text-xs font-bold text-white uppercase tracking-wider mb-1">Acción completada</p>
                    <p className="font-code text-[10px] text-white/50">
                      {securityAction === 'reset_password'
                        ? `Nueva contraseña para ${securityUser?.nickname}. Muéstrala al usuario una sola vez.`
                        : `Nuevo código de recuperación para ${securityUser?.nickname}. Muéstralo al usuario una sola vez.`}
                    </p>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/[0.06] p-3">
                  <p className="font-code text-[9px] text-white/30 uppercase tracking-wider mb-1.5">{securityResultLabel}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-code text-sm text-[#00F2FE] font-bold break-all">{securityResult}</code>
                    <button
                      onClick={() => copyToClipboard(securityResult, 'result')}
                      className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all shrink-0"
                      title="Copiar"
                    >
                      {copiedField === 'result' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <p className="font-code text-[9px] text-white/30 mt-2 flex items-center gap-1">
                  <AlertTriangle size={10} className="text-yellow-400/60" />
                  Este valor no se volverá a mostrar. Cópialo ahora.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-4">
            {securityMode === 'view' && (
              <button onClick={closeSecurityDialog} className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 transition-all">
                Cerrar
              </button>
            )}
            {(securityMode === 'form_password' || securityMode === 'form_security') && (
              <>
                <button
                  onClick={() => { setSecurityMode('view'); setSecurityAction(null); }}
                  className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={executeSecurityAction}
                  disabled={securityBusy || (securityMode === 'form_security' && (!newSecurityQuestion.trim() || !newSecurityAnswer.trim()))}
                  className="flex-1 clip-btn px-4 py-3 bg-[#FF2D78] hover:bg-[#ff4d8d] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,45,120,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {securityBusy ? <><Loader2 size={12} className="animate-spin" /> Procesando...</> : <><Save size={12} /> Confirmar</>}
                </button>
              </>
            )}
            {securityMode === 'result' && (
              <button onClick={closeSecurityDialog} className="flex-1 clip-btn px-4 py-3 bg-[#00F2FE] hover:bg-[#33f5fe] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all">
                Listo
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════ PROJECT CREATE/EDIT DIALOG ═══════════════ */}
      <Dialog open={showProjectDialog} onOpenChange={(o) => { if (!o) closeProjectDialog(); }}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0b0b16] border border-[#FF2D78]/20 text-white">
          <DialogHeader>
            <DialogTitle className="font-cyber text-base font-bold uppercase tracking-wider text-white">
              {projectDialogMode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}
            </DialogTitle>
            <DialogDescription className="font-code text-[11px] text-white/40">
              {projectDialogMode === 'create'
                ? 'Completa los campos para publicar una nueva página de proyecto. Los marcados con * son obligatorios.'
                : `Editando "${projectForm.name}" (slug: ${projectForm.id}). El slug no se puede cambiar.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* ── Slug + Name ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Slug (URL) *</label>
                <input
                  type="text"
                  value={projectForm.id}
                  onChange={e => setProjectForm(prev => ({ ...prev, id: e.target.value }))}
                  disabled={projectDialogMode === 'edit'}
                  placeholder="mi-proyecto"
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40 disabled:opacity-50"
                />
                <p className="font-code text-[9px] text-white/30 mt-1">Solo minúsculas, números y guiones. Se usará en /proyectos/<span className="text-[#FF2D78]">slug</span>.</p>
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Nombre *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={e => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Monika After History"
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40"
                />
              </div>
            </div>

            {/* ── Subtitles ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Subtítulo (ES)</label>
                <input
                  type="text"
                  value={projectForm.subtitle}
                  onChange={e => setProjectForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Novela Visual Fan-Made"
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40"
                />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Subtítulo (EN)</label>
                <input
                  type="text"
                  value={projectForm.subtitleEn}
                  onChange={e => setProjectForm(prev => ({ ...prev, subtitleEn: e.target.value }))}
                  placeholder="Fan-Made Visual Novel"
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40"
                />
              </div>
            </div>

            {/* ── Descriptions ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Descripción (ES) *</label>
                <textarea
                  value={projectForm.description}
                  onChange={e => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Una historia alternativa que explora..."
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40 resize-none"
                />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Descripción (EN)</label>
                <textarea
                  value={projectForm.descriptionEn}
                  onChange={e => setProjectForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  rows={4}
                  placeholder="An alternative story exploring..."
                  className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40 resize-none"
                />
              </div>
            </div>

            {/* ── Cover image ── */}
            <div>
              <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Imagen de portada *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={e => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://... o sube un archivo"
                  className="flex-1 px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40"
                />
                <input
                  ref={coverUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={onCoverFileSelected}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverUploadRef.current?.click()}
                  disabled={imageUploading}
                  className="clip-btn px-3 py-2 bg-white/5 border border-white/[0.08] text-white/70 font-code text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {imageUploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />} Subir
                </button>
              </div>
              {projectForm.image && (
                <div className="mt-2 w-32 h-20 rounded-md overflow-hidden border border-white/10 bg-white/5">
                  <img src={projectForm.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* ── Color / Cover fit / Theme color ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Color de tema</label>
                <input type="color" value={projectForm.themeColor} onChange={e => setProjectForm(prev => ({ ...prev, themeColor: e.target.value }))} className="w-full h-9 bg-[#080812] border border-white/[0.08] cursor-pointer" />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Color de estado</label>
                <input type="color" value={projectForm.statusColor} onChange={e => setProjectForm(prev => ({ ...prev, statusColor: e.target.value }))} className="w-full h-9 bg-[#080812] border border-white/[0.08] cursor-pointer" />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Fondo de portada (opcional)</label>
                <input type="color" value={projectForm.coverBg || '#000000'} onChange={e => setProjectForm(prev => ({ ...prev, coverBg: e.target.value }))} className="w-full h-9 bg-[#080812] border border-white/[0.08] cursor-pointer" />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Ajuste de portada</label>
                <select
                  value={projectForm.coverFit}
                  onChange={e => setProjectForm(prev => ({ ...prev, coverFit: e.target.value as 'contain' | 'cover' }))}
                  className="w-full h-9 px-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40"
                >
                  <option value="contain">contain</option>
                  <option value="cover">cover</option>
                </select>
              </div>
            </div>

            {/* ── Status / Rating / Tags ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Estado (ES)</label>
                <input type="text" value={projectForm.status} onChange={e => setProjectForm(prev => ({ ...prev, status: e.target.value }))} placeholder="Disponible / En desarrollo" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Estado (EN)</label>
                <input type="text" value={projectForm.statusEn} onChange={e => setProjectForm(prev => ({ ...prev, statusEn: e.target.value }))} placeholder="Available / In Development" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
              </div>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Rating (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" value={projectForm.rating} onChange={e => setProjectForm(prev => ({ ...prev, rating: e.target.value }))} className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
              </div>
            </div>

            <div>
              <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Tags (separados por comas)</label>
              <input type="text" value={projectForm.tags} onChange={e => setProjectForm(prev => ({ ...prev, tags: e.target.value }))} placeholder="Fan-Made, Drama, Romance" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
            </div>

            {/* ── Music (optional) ── */}
            <div>
              <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Música de fondo (opcional)</label>
              <input type="text" value={projectForm.music} onChange={e => setProjectForm(prev => ({ ...prev, music: e.target.value }))} placeholder="QIHUK68L9qQ  o  https://www.youtube.com/watch?v=QIHUK68L9qQ  o  https://.../cancion.mp3" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
              <p className="font-code text-[9px] text-white/30 mt-1">
                Formatos aceptados: <span className="text-[#00F2FE]">ID de YouTube</span> (11 chars), URL de YouTube (watch/youtu.be/embed) o URL directa a MP3/OGG. Déjalo vacío para no tener música. Se reproduce con un reproductor de audio invisible que evita el bloqueo de autoplay de los navegadores.
              </p>
              {projectForm.music.trim() && !parseMusicInput(projectForm.music.trim()) && (
                <p className="font-code text-[9px] text-red-400 mt-1">⚠ Formato no reconocido. Revisa que sea un ID de YouTube (11 chars), una URL de YouTube válida, o un MP3/OGG directo.</p>
              )}
              {projectForm.music.trim() && parseMusicInput(projectForm.music.trim()) && (
                <p className="font-code text-[9px] text-green-400 mt-1">✓ Detectado: {parseMusicInput(projectForm.music.trim())!.kind === 'youtube' ? `YouTube (video ID: ${parseMusicInput(projectForm.music.trim())!.value})` : `Audio directo (${parseMusicInput(projectForm.music.trim())!.value.split('.').pop()?.toUpperCase()})`}</p>
              )}
            </div>

            {/* ── Page background ── */}
            <div className="border-t border-white/[0.06] pt-4">
              <h4 className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Fondo de la página</h4>
              <div className="space-y-3">
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Imagen de fondo (opcional)</label>
                  <div className="flex gap-2">
                    <input type="text" value={projectForm.bgImage} onChange={e => setProjectForm(prev => ({ ...prev, bgImage: e.target.value }))} placeholder="https://... o sube un archivo" className="flex-1 px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                    <input ref={bgUploadRef} type="file" accept="image/*" onChange={onBgFileSelected} className="hidden" />
                    <button type="button" onClick={() => bgUploadRef.current?.click()} disabled={imageUploading} className="clip-btn px-3 py-2 bg-white/5 border border-white/[0.08] text-white/70 font-code text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50">
                      {imageUploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />} Subir
                    </button>
                  </div>
                  {projectForm.bgImage && (
                    <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, bgImage: '' }))} className="mt-1 font-code text-[9px] text-red-400/70 hover:text-red-400 transition-colors">Quitar imagen</button>
                  )}
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Ajuste del fondo</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, bgFit: 'cover' }))} className={`px-2 py-1.5 border font-code text-[10px] uppercase tracking-wider transition-all ${projectForm.bgFit === 'cover' ? 'bg-[#FF2D78]/20 border-[#FF2D78]/50 text-[#FF2D78]' : 'bg-[#080812] border-white/[0.08] text-white/40 hover:text-white/70'}`}>Cover (relleno)</button>
                    <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, bgFit: 'contain' }))} className={`px-2 py-1.5 border font-code text-[10px] uppercase tracking-wider transition-all ${projectForm.bgFit === 'contain' ? 'bg-[#FF2D78]/20 border-[#FF2D78]/50 text-[#FF2D78]' : 'bg-[#080812] border-white/[0.08] text-white/40 hover:text-white/70'}`}>Contain (ajustar)</button>
                    <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, bgFit: 'solid' }))} className={`px-2 py-1.5 border font-code text-[10px] uppercase tracking-wider transition-all ${projectForm.bgFit === 'solid' ? 'bg-[#FF2D78]/20 border-[#FF2D78]/50 text-[#FF2D78]' : 'bg-[#080812] border-white/[0.08] text-white/40 hover:text-white/70'}`}>Solo color</button>
                  </div>
                  <p className="font-code text-[9px] text-white/30 mt-1">'Cover' rellena toda la pantalla (recorta si hace falta). 'Contain' muestra la imagen completa. 'Solo color' ignora la imagen y usa solo el color de tema.</p>
                </div>
              </div>
            </div>

            {/* ── Visual customization panel: DISABLED ───
                The dynamic project pages now use a fixed cyberpunk/brutalist
                dark style (see DynamicProjectDetail in proyectos/[id]/page.tsx).
                The per-project color overrides (pageBgColor, cardBgColor,
                borderColor, textColor, titleStrokeColor, accentColor) are
                ignored by the renderer, so we hide the panel from the admin.
                The fields remain in the form/payload (always empty) to avoid
                breaking the API contract. */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="bg-[#080812] border border-white/[0.06] p-4 flex items-start gap-3">
                <Info size={14} className="text-[#00F2FE] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Estilo visual fijo</p>
                  <p className="font-code text-[10px] text-white/40 leading-relaxed">
                    Los proyectos dinámicos usan un estilo cyberpunk/brutalist oscuro fijo (gris oscuro, glitch titles, mono-font). La personalización avanzada de colores está desactivada. Solo puedes configurar el color de tema (que afecta botones de descarga y acentos menores) y la imagen de fondo.
                  </p>
                </div>
              </div>
            </div>


            {/* ── Section visibility switches ── */}
            <div className="border-t border-white/[0.06] pt-4">
              <h4 className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Mostrar / Ocultar secciones</h4>
              <p className="font-code text-[9px] text-white/30 mb-3">Activa o desactiva cada sección solo para este proyecto.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTION_LABELS.map(({ key, label, desc }) => (
                  <button key={key} type="button" onClick={() => toggleSection(key)} className={`flex items-start gap-2 p-2.5 border text-left transition-all ${projectForm.sections[key] ? 'bg-[#FF2D78]/8 border-[#FF2D78]/30' : 'bg-[#080812] border-white/[0.06] opacity-60'}`}>
                    <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 ${projectForm.sections[key] ? 'bg-[#FF2D78] border-[#FF2D78]' : 'border-white/20'}`}>
                      {projectForm.sections[key] && <Check size={10} className="text-black" />}
                    </div>
                    <div>
                      <div className="font-code text-xs text-white/80 font-bold">{label}</div>
                      <div className="font-code text-[9px] text-white/30">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Resources (cards for "Recursos y Contenido Extra") ── */}
            {projectForm.sections.showResources && (
              <div className="border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider">Recursos y Contenido Extra</h4>
                    <p className="font-code text-[9px] text-white/30">Cards tipo "Wiki del Mod", "Spritepacks", "Submods" — personalízalas por proyecto.</p>
                  </div>
                  <button type="button" onClick={addResourceRow} className="clip-btn px-3 py-1.5 bg-[#FF2D78]/10 border border-[#FF2D78]/30 text-[#FF2D78] font-code text-xs hover:bg-[#FF2D78]/20 transition-all flex items-center gap-1.5">
                    <Plus size={11} /> Agregar
                  </button>
                </div>
                {projectForm.resources.length === 0 ? (
                  <p className="font-code text-[11px] text-white/30 py-3 text-center border border-dashed border-white/[0.08]">Sin recursos. Agrega cards para que aparezca la sección "Recursos y Contenido Extra" en la página del proyecto.</p>
                ) : (
                  <div className="space-y-2">
                    {projectForm.resources.map((r, i) => (
                      <div key={i} className="bg-[#080812] border border-white/[0.06] p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <GripVertical size={12} className="text-white/20 flex-shrink-0" />
                          <span className="font-code text-[10px] text-white/40 uppercase tracking-wider flex-1">Recurso #{i + 1}</span>
                          <button type="button" onClick={() => removeResourceRow(i)} className="p-1 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                          <input type="text" value={r.title} onChange={e => updateResourceRow(i, { title: e.target.value })} placeholder="Título (Ej: Wiki del Mod)" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                          <select value={r.icon} onChange={e => updateResourceRow(i, { icon: e.target.value as ResourceIcon })} className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40">
                            {PROJECT_RESOURCE_ICONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <input type="text" value={r.description} onChange={e => updateResourceRow(i, { description: e.target.value })} placeholder="Descripción (ES)" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40 sm:col-span-2" />
                          <input type="text" value={r.descriptionEn || ''} onChange={e => updateResourceRow(i, { descriptionEn: e.target.value })} placeholder="Descripción (EN, opcional)" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40 sm:col-span-2" />
                          <input type="text" value={r.url || ''} onChange={e => updateResourceRow(i, { url: e.target.value })} placeholder="URL (opcional — si se pasa, se mostrará un botón)" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40 sm:col-span-2" />
                          <input type="text" value={r.urlLabel || ''} onChange={e => updateResourceRow(i, { urlLabel: e.target.value })} placeholder="Label botón (ES): Ver Wiki" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                          <input type="text" value={r.urlLabelEn || ''} onChange={e => updateResourceRow(i, { urlLabelEn: e.target.value })} placeholder="Label botón (EN): View Wiki" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <input type="color" value={r.color || projectForm.themeColor} onChange={e => updateResourceRow(i, { color: e.target.value })} className="w-8 h-8 bg-transparent border border-white/[0.06] cursor-pointer" title="Color del recurso (opcional)" />
                            <span className="font-code text-[9px] text-white/30">Color del recurso (vacío = usa themeColor)</span>
                            {r.color && <button type="button" onClick={() => updateResourceRow(i, { color: '' })} className="font-code text-[9px] text-red-400/70 hover:text-red-400 ml-auto">limpiar</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Gallery previews ── */}
            <div>
              <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Galería (una URL por línea, o sube archivos)</label>
              <textarea
                value={projectForm.previews}
                onChange={e => setProjectForm(prev => ({ ...prev, previews: e.target.value }))}
                rows={3}
                placeholder={'https://...imagen1.png\nhttps://...imagen2.png'}
                className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40 resize-none"
              />
              <input
                ref={previewUploadRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onPreviewFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => previewUploadRef.current?.click()}
                disabled={imageUploading}
                className="mt-2 clip-btn px-3 py-1.5 bg-white/5 border border-white/[0.08] text-white/70 font-code text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {imageUploading ? <Loader2 size={11} className="animate-spin" /> : <ImagePlus size={11} />} Subir imágenes
              </button>
            </div>

            {/* ── Details ── */}
            <div className="border-t border-white/[0.06] pt-4">
              <h4 className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Detalles técnicos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Tiempo de juego (ES)</label>
                  <input type="text" value={projectForm.details.playTime || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, playTime: e.target.value } }))} placeholder="Sin límites" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Tiempo de juego (EN)</label>
                  <input type="text" value={projectForm.details.playTimeEn || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, playTimeEn: e.target.value } }))} placeholder="Unlimited" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Motor</label>
                  <input type="text" value={projectForm.details.engine || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, engine: e.target.value } }))} placeholder="Ren'Py" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Idioma (ES)</label>
                  <input type="text" value={projectForm.details.language || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, language: e.target.value } }))} placeholder="Español" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Idioma (EN)</label>
                  <input type="text" value={projectForm.details.languageEn || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, languageEn: e.target.value } }))} placeholder="Spanish" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
                <div>
                  <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Label de descargas (texto fijo)</label>
                  <input type="text" value={projectForm.details.downloadsLabel || ''} onChange={e => setProjectForm(prev => ({ ...prev, details: { ...prev.details, downloadsLabel: e.target.value } }))} placeholder="1,250+" className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
                </div>
              </div>
            </div>

            {/* ── Download buttons ── */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-cyber text-xs font-bold text-white/70 uppercase tracking-wider">Botones de descarga</h4>
                <button type="button" onClick={addDownloadRow} className="clip-btn px-3 py-1.5 bg-[#FF2D78]/10 border border-[#FF2D78]/30 text-[#FF2D78] font-code text-xs hover:bg-[#FF2D78]/20 transition-all flex items-center gap-1.5">
                  <Plus size={11} /> Agregar
                </button>
              </div>
              {projectForm.downloads.length === 0 ? (
                <p className="font-code text-[11px] text-white/30 py-3 text-center border border-dashed border-white/[0.08]">Sin botones de descarga. Agrega al menos uno para que los usuarios puedan descargar el proyecto.</p>
              ) : (
                <div className="space-y-2">
                  {projectForm.downloads.map((dl, i) => (
                    <div key={i} className="bg-[#080812] border border-white/[0.06] p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical size={12} className="text-white/20 flex-shrink-0" />
                        <span className="font-code text-[10px] text-white/40 uppercase tracking-wider flex-1">Botón #{i + 1}</span>
                        <button type="button" onClick={() => removeDownloadRow(i)} className="p-1 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                        <input type="text" value={dl.label} onChange={e => updateDownloadRow(i, { label: e.target.value })} placeholder="Label (ES): Descargar APK" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                        <input type="text" value={dl.labelEn || ''} onChange={e => updateDownloadRow(i, { labelEn: e.target.value })} placeholder="Label (EN): Download APK" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40" />
                        <input type="text" value={dl.url} onChange={e => updateDownloadRow(i, { url: e.target.value })} placeholder="https://github.com/.../release.zip" className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40 sm:col-span-2" />
                        <select value={dl.icon} onChange={e => updateDownloadRow(i, { icon: e.target.value as ProjectDownload['icon'] })} className="px-2 py-1.5 bg-[#0b0b16] border border-white/[0.06] text-white font-code text-xs focus:outline-none focus:border-[#FF2D78]/40">
                          {PROJECT_DOWNLOAD_ICONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-1.5">
                            <input type="color" value={dl.color} onChange={e => updateDownloadRow(i, { color: e.target.value })} className="w-8 h-8 bg-transparent border border-white/[0.06] cursor-pointer" title="Color base" />
                            <span className="font-code text-[9px] text-white/30">Base</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input type="color" value={dl.hoverColor || '#FF6B9D'} onChange={e => updateDownloadRow(i, { hoverColor: e.target.value })} className="w-8 h-8 bg-transparent border border-white/[0.06] cursor-pointer" title="Color hover" />
                            <span className="font-code text-[9px] text-white/30">Hover</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input type="color" value={dl.textColor || '#ffffff'} onChange={e => updateDownloadRow(i, { textColor: e.target.value })} className="w-8 h-8 bg-transparent border border-white/[0.06] cursor-pointer" title="Color texto" />
                            <span className="font-code text-[9px] text-white/30">Texto</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Flags ── */}
            <div className="border-t border-white/[0.06] pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 accent-[#FF2D78]" />
                <span className="font-code text-xs text-white/60">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={projectForm.isPublished} onChange={e => setProjectForm(prev => ({ ...prev, isPublished: e.target.checked }))} className="w-4 h-4 accent-[#FF2D78]" />
                <span className="font-code text-xs text-white/60">Publicado</span>
              </label>
              <div>
                <label className="block font-code text-[10px] text-white/40 uppercase tracking-wider mb-1">Orden</label>
                <input type="number" value={projectForm.sortOrder} onChange={e => setProjectForm(prev => ({ ...prev, sortOrder: e.target.value }))} className="w-full px-3 py-2 bg-[#080812] border border-white/[0.08] text-white font-code text-sm focus:outline-none focus:border-[#FF2D78]/40" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button onClick={closeProjectDialog} disabled={projectSaving} className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 hover:text-white/60 transition-all disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={saveProject}
              disabled={projectSaving || imageUploading}
              className="flex-1 clip-btn px-4 py-3 bg-[#FF2D78] hover:bg-[#ff4d8d] text-black font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,45,120,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {projectSaving ? <><Loader2 size={12} className="animate-spin" /> Guardando...</> : <><Save size={12} /> {projectDialogMode === 'create' ? 'Crear Proyecto' : 'Guardar Cambios'}</>}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════ PROJECT DELETE CONFIRMATION ═══════════════ */}
      <Dialog open={!!projectDeleteTarget} onOpenChange={(o) => { if (!o) setProjectDeleteTarget(null); }}>
        <DialogContent className="max-w-md bg-[#0b0b16] border border-red-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="font-cyber text-base font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <AlertTriangle size={16} /> Eliminar Proyecto
            </DialogTitle>
            <DialogDescription className="font-code text-[11px] text-white/40">
              ¿Seguro que quieres eliminar <strong className="text-white/70">{projectDeleteTarget?.name}</strong>? Esta acción no se puede deshacer. Los comentarios asociados se conservarán pero la página ya no será accesible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button onClick={() => setProjectDeleteTarget(null)} className="flex-1 clip-btn px-4 py-3 bg-white/3 border border-white/[0.06] text-white/50 font-cyber text-xs uppercase tracking-wider hover:bg-white/5 hover:text-white/60 transition-all">
              Cancelar
            </button>
            <button onClick={confirmDeleteProject} className="flex-1 clip-btn px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-cyber font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2">
              <Trash2 size={12} /> Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
