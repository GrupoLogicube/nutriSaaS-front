import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Mail, Shield, MoreVertical, Crown,
  Edit3, Trash2, Check, X, Clock, Search,
  Activity, Star, Eye, RefreshCw, WifiOff, AlertCircle
} from 'lucide-react';
import { equipoApi } from '../../../services/api';

const ROLES = ['Administrador', 'Nutricionista', 'Recepcionista', 'Solo lectura'];

const roleColors = {
  'Administrador': 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Nutricionista': 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  'Recepcionista': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Solo lectura': 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

const statusColors = {
  'activo': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'pendiente': 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'inactivo': 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700',
};

// ─── Invite Modal ──────────────────────────────────────────────────────────────
const InviteModal = ({ onClose, onInvite, loading }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Nutricionista');

  const handleSubmit = (e) => {
    e.preventDefault();
    onInvite({ email, role });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0a1128] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Invitar Miembro</h3>
            <p className="text-xs text-slate-400 mt-0.5">Se enviará un correo de invitación</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Correo Electrónico *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="correo@clinica.com"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Rol *</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button type="button" key={r} onClick={() => setRole(r)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left ${role === r ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300'}`}
                >
                  <Shield size={11} className="inline mr-1.5" />{r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70">
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <Mail size={14} />}
              {loading ? 'Enviando...' : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Member Row ────────────────────────────────────────────────────────────────
const MemberRow = ({ member, onRemove }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = (member.status || member.estado || 'activo').toLowerCase();
  const role = member.role || member.rol || 'Nutricionista';
  const name = member.name || member.nombre || member.email?.split('@')[0] || 'Usuario';
  const email = member.email || '—';
  const patients = member.patients || member.total_pacientes || 0;
  const lastLogin = member.lastLogin || member.ultimo_acceso || '—';
  const isOwner = member.isOwner || member.es_propietario || false;
  const initial = name[0]?.toUpperCase() || '?';
  const colorPalette = ['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const color = colorPalette[name.charCodeAt(0) % colorPalette.length];

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{initial}</div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-slate-700 dark:text-white">{name}</p>
              {isOwner && <Crown size={12} className="text-amber-400 fill-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-400">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleColors[role] || roleColors['Solo lectura']}`}>{role}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 w-fit ${statusColors[status] || statusColors['inactivo']}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'activo' ? 'bg-emerald-400' : status === 'pendiente' ? 'bg-amber-400' : 'bg-slate-400'}`} />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">{patients}</p>
        <p className="text-[10px] text-slate-400">pacientes</p>
      </td>
      <td className="px-6 py-4"><p className="text-xs text-slate-500 dark:text-slate-400">{lastLogin}</p></td>
      <td className="px-6 py-4 relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={15} />
        </button>
        {menuOpen && (
          <div className="absolute right-6 top-10 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-10 w-36 py-1 animate-in fade-in zoom-in-95 duration-150">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Eye size={12} /> Ver perfil
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Edit3 size={12} /> Editar rol
            </button>
            {!isOwner && (
              <button onClick={() => { onRemove(member.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                <Trash2 size={12} /> Eliminar
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const TeamView = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState('');

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  const fetchTeam = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await equipoApi.getAll(token, empresaId);
    if (err) {
      setError(err);
    } else {
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setMembers(list);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, [user]);

  const filtered = members.filter(m => {
    const name = (m.name || m.nombre || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    const role = (m.role || m.rol || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  const handleInvite = async ({ email, role }) => {
    setInviting(true);
    const { data, error: err } = await equipoApi.invite(token, empresaId, { email, rol: role });
    if (!err) {
      const newMember = data?.data ?? {
        id: Date.now(),
        email,
        role,
        status: 'pendiente',
        patients: 0,
        lastLogin: '—',
        isOwner: false,
      };
      setMembers(prev => [...prev, newMember]);
      setShowInvite(false);
    }
    setInviting(false);
  };

  const handleRemove = async (id) => {
    if (!window.confirm('¿Eliminar este miembro del equipo?')) return;
    await equipoApi.remove(token, empresaId, id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const activeCount = members.filter(m => (m.status || m.estado || '').toLowerCase() === 'activo').length;
  const pendingCount = members.filter(m => (m.status || m.estado || '').toLowerCase() === 'pendiente').length;
  const adminCount = members.filter(m => (m.role || m.rol || '') === 'Administrador').length;

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Equipo</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Gestiona los miembros y permisos de tu clínica.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTeam} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 transition-all">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <UserPlus size={16} /> Invitar Miembro
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          <WifiOff size={16} className="shrink-0" />
          <span>No se pudo cargar el equipo. Verifica la conexión con el servidor.</span>
          <button onClick={fetchTeam} className="ml-auto text-xs font-bold underline shrink-0">Reintentar</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Miembros', value: loading ? '—' : members.length, icon: Users, cls: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30' },
          { label: 'Activos', value: loading ? '—' : activeCount, icon: Activity, cls: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Pendientes', value: loading ? '—' : pendingCount, icon: Clock, cls: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Administradores', value: loading ? '—' : adminCount, icon: Crown, cls: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.cls}`}><s.icon size={18} /></div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-[11px] text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar miembros..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {['Miembro', 'Rol', 'Estado', 'Pacientes', 'Último acceso', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center">
                  <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Users size={32} className="text-slate-200 dark:text-slate-700 mb-2" />
                    <p className="text-sm text-slate-400">{search ? 'No se encontraron miembros' : 'No hay miembros del equipo aún'}</p>
                    {!search && (
                      <button onClick={() => setShowInvite(true)} className="mt-3 text-xs font-bold text-sky-500 hover:underline">
                        + Invitar primer miembro
                      </button>
                    )}
                  </div>
                </td></tr>
              ) : filtered.map(m => <MemberRow key={m.id} member={m} onRemove={handleRemove} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles legend */}
      <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm text-slate-700 dark:text-white mb-4 flex items-center gap-2">
          <Shield size={15} className="text-sky-500" /> Descripción de Roles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { role: 'Administrador', desc: 'Acceso completo: configuración, equipo, facturación y todos los módulos.', icon: Crown, color: 'text-sky-500' },
            { role: 'Nutricionista', desc: 'Acceso a pacientes, dietas, agenda y notas clínicas propias.', icon: Star, color: 'text-violet-500' },
            { role: 'Recepcionista', desc: 'Gestión de citas y pacientes. Sin acceso a datos clínicos.', icon: Users, color: 'text-emerald-500' },
            { role: 'Solo lectura', desc: 'Visualización de datos sin posibilidad de editar nada.', icon: Eye, color: 'text-slate-500' },
          ].map(({ role, desc, icon: Icon, color }) => (
            <div key={role} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className={color} />
                <span className="text-xs font-bold text-slate-700 dark:text-white">{role}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} loading={inviting} />}
    </div>
  );
};

export default TeamView;
