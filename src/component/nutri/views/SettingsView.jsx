import React, { useState, useEffect } from 'react';
import {
  User, CreditCard, Shield, Zap, AlertTriangle,
  Mail, Phone, Lock, Camera, Check, X, RefreshCw,
  Eye, EyeOff, Save, Loader2, Plus, Trash2, Star,
  ChevronRight, ExternalLink, WifiOff, Clock,
  CheckCircle, AlertCircle, Building2, Edit3
} from 'lucide-react';
import { suscripcionApi, configApi } from '../../../services/api';

// ─── Toast Notification ────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`toast-enter fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm text-sm font-semibold max-w-sm
    ${type === 'success'
      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
      : type === 'error'
      ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
      : 'bg-sky-50 dark:bg-sky-950/80 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300'
    }`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {message}
    <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100 transition-opacity"><X size={14} /></button>
  </div>
);

// ─── Credit Card Display ───────────────────────────────────────────────────────
const CreditCardDisplay = ({ card }) => (
  <div className="payment-card p-6 text-white w-full max-w-sm select-none">
    <div className="flex justify-between items-start mb-8">
      <div>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Tarjeta de Crédito</p>
        <p className="text-white font-bold text-sm mt-0.5">{card.brand?.toUpperCase() || 'VISA'}</p>
      </div>
      <div className="text-right">
        <div className="payment-card-chip ml-auto" />
      </div>
    </div>
    <p className="text-lg font-mono tracking-[0.25em] text-slate-200 mb-6">
      •••• •••• •••• {card.last4 || '4242'}
    </p>
    <div className="flex justify-between items-end">
      <div>
        <p className="text-slate-400 text-[9px] uppercase tracking-wider">Titular</p>
        <p className="text-sm font-bold text-white">{card.name || 'Tu nombre'}</p>
      </div>
      <div className="text-right">
        <p className="text-slate-400 text-[9px] uppercase tracking-wider">Expira</p>
        <p className="text-sm font-bold text-white">{card.exp_month || '12'}/{card.exp_year || '28'}</p>
      </div>
      <div>
        <p className="text-slate-400 text-[9px] uppercase tracking-wider mb-0.5">Red</p>
        <div className="flex">
          <div className="w-7 h-7 rounded-full bg-red-500/80" />
          <div className="w-7 h-7 rounded-full bg-amber-400/80 -ml-3" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, iconCls = 'text-sky-500', children }) => (
  <div className="bg-white dark:bg-[#0a1128] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden interactive-card">
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/30 ${iconCls}`}>
        <Icon size={16} />
      </div>
      <h3 className="font-bold text-slate-700 dark:text-white text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Field Row ────────────────────────────────────────────────────────────────
const FieldRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{value || '—'}</p>
    </div>
  </div>
);

// ─── Billing History Row ───────────────────────────────────────────────────────
const BillingRow = ({ invoice }) => {
  const date = invoice.fecha || invoice.date || '—';
  const amount = invoice.monto || invoice.amount || 0;
  const status = invoice.estado || invoice.status || 'paid';
  const desc = invoice.descripcion || invoice.description || 'Plan mensual';

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors -mx-6 px-6">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${status === 'paid' || status === 'pagado' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'}`}>
        {status === 'paid' || status === 'pagado' ? <Check size={14} strokeWidth={3} /> : <Clock size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{desc}</p>
        <p className="text-[11px] text-slate-400">{date}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-800 dark:text-white">${amount}</p>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${status === 'paid' || status === 'pagado' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'}`}>
          {status === 'paid' || status === 'pagado' ? 'Pagado' : 'Pendiente'}
        </span>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 ml-1" title="Descargar">
        <ExternalLink size={13} />
      </button>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Sk = ({ h = 'h-4', w = 'w-full', rounded = 'rounded-lg' }) => (
  <div className={`skeleton ${h} ${w} ${rounded}`} />
);

// ─── Main ──────────────────────────────────────────────────────────────────────
const SettingsView = ({ user, onViewChange }) => {
  // ── Profile state ──────────────────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    especialidad: user?.especialidad || 'Nutricionista Clínico',
  });

  // ── Password state ─────────────────────────────────────────────────────────
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', nuevo: '', confirmar: '' });
  const [showPwd, setShowPwd] = useState({ current: false, nuevo: false, confirmar: false });
  const [pwdLoading, setPwdLoading] = useState(false);

  // ── Subscription state ─────────────────────────────────────────────────────
  const [subLoading, setSubLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // ── Cancel state ───────────────────────────────────────────────────────────
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  // ── Fetch subscription data ────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      setSubLoading(true);

      const [
        { data: subData },
        { data: usageData },
      ] = await Promise.all([
        suscripcionApi.get(token, empresaId),
        suscripcionApi.getUsage(token, empresaId),
      ]);

      if (subData) {
        const s = subData?.data ?? subData;
        setSubscription(s);

        // Payment method from subscription response
        if (s.metodo_pago || s.payment_method) {
          setPaymentMethod(s.metodo_pago ?? s.payment_method);
        }

        // Billing history
        const hist = s.historial_pagos ?? s.billing_history ?? s.invoices ?? [];
        setBillingHistory(hist);
      }

      if (usageData) {
        setUsage(usageData?.data ?? usageData);
      }

      setSubLoading(false);
    };
    fetch();
  }, [user]);

  // ── Derived subscription info ──────────────────────────────────────────────
  const planNombre = subscription?.plan_nombre ?? subscription?.plan_name ?? 'Starter';
  const planEstado = subscription?.estado ?? subscription?.status ?? 'activo';
  const proximaFecha = subscription?.proxima_factura ?? subscription?.next_billing ?? '—';
  const diasRestantes = subscription?.dias_restantes ?? subscription?.days_left ?? 0;
  const cycleProgress = subscription?.progreso_ciclo ?? subscription?.cycle_progress ?? 0;
  const montoPlan = subscription?.precio ?? subscription?.price ?? '$0';

  // ── Derived usage ──────────────────────────────────────────────────────────
  const usagePac = usage?.pacientes ?? { used: 0, max: 50 };
  const usageDietas = usage?.dietas ?? { used: 0, max: 100 };
  const usageNotas = usage?.notas ?? { used: 0, max: 200 };

  // ── Update Profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    const { error } = await configApi.updatePerfil(token, empresaId, profileForm);
    setProfileLoading(false);
    if (!error) {
      showToast('Perfil actualizado correctamente.');
      setEditingProfile(false);
    } else {
      showToast('No se pudo actualizar el perfil.', 'error');
    }
  };

  // ── Change Password ────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.nuevo !== passwordForm.confirmar) {
      showToast('Las contraseñas nuevas no coinciden.', 'error');
      return;
    }
    setPwdLoading(true);
    const { error } = await configApi.updatePerfil(token, empresaId, {
      password_actual: passwordForm.current,
      password_nuevo: passwordForm.nuevo,
    });
    setPwdLoading(false);
    if (!error) {
      showToast('Contraseña actualizada correctamente.');
      setChangingPassword(false);
      setPasswordForm({ current: '', nuevo: '', confirmar: '' });
    } else {
      showToast('No se pudo cambiar la contraseña. Verifica la contraseña actual.', 'error');
    }
  };

  // ── Cancel subscription ────────────────────────────────────────────────────
  const handleCancel = async () => {
    setCancelLoading(true);
    const { error } = await suscripcionApi.cancel(token, empresaId);
    setCancelLoading(false);
    setCancelModal(false);
    if (!error) {
      showToast('Suscripción cancelada. Tendrás acceso hasta el fin del ciclo.');
      setSubscription(prev => prev ? { ...prev, estado: 'cancelado' } : prev);
    } else {
      showToast('No se pudo cancelar la suscripción. Intenta de nuevo.', 'error');
    }
  };

  // ── Usage bar helper ───────────────────────────────────────────────────────
  const UsageBar = ({ label, used, max, color }) => {
    const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
    const warn = pct >= 80;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>
          <span className={`font-bold ${warn ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>
            {used} / {max || '∞'}
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full progress-animated transition-all duration-700 ${warn ? 'bg-amber-400' : color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto pb-10 space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración de Cuenta</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">Gestiona tu perfil, suscripción y métodos de pago.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Profile card */}
          <div className="bg-white dark:bg-[#0a1128] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center interactive-card glow-on-hover">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-500/20">
                {(profileForm.nombre[0] || 'U').toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-400 transition-all shadow-sm">
                <Camera size={13} />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {profileForm.nombre} {profileForm.apellido}
            </h2>
            <p className="text-xs text-sky-500 font-bold mb-1">{profileForm.especialidad}</p>
            <p className="text-xs text-slate-400">{profileForm.email}</p>

            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-500 transition-all"
            >
              <Edit3 size={13} /> {editingProfile ? 'Cancelar edición' : 'Editar perfil'}
            </button>
          </div>

          {/* Info fields */}
          <Section icon={User} title="Datos Personales">
            {!editingProfile ? (
              <div className="space-y-0 -my-3">
                <FieldRow label="Nombre" value={`${profileForm.nombre} ${profileForm.apellido}`} icon={User} />
                <FieldRow label="Correo Electrónico" value={profileForm.email} icon={Mail} />
                <FieldRow label="Teléfono" value={profileForm.telefono || 'No registrado'} icon={Phone} />
                <FieldRow label="Especialidad" value={profileForm.especialidad} icon={Star} />
                <FieldRow label="Rol" value="Administrador" icon={Shield} />
                <FieldRow label="Clínica" value={user?.empresaConfig?.nombre || '—'} icon={Building2} />
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'nombre', label: 'Nombre', type: 'text' },
                  { key: 'apellido', label: 'Apellido', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'telefono', label: 'Teléfono', type: 'tel' },
                  { key: 'especialidad', label: 'Especialidad', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={profileForm[f.key]}
                      onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all btn-lift disabled:opacity-70 mt-2"
                >
                  {profileLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {profileLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </Section>

          {/* Security */}
          <Section icon={Lock} title="Seguridad" iconCls="text-violet-500">
            {!changingPassword ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">Contraseña configurada</span>
                </div>
                <button
                  onClick={() => setChangingPassword(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-500 transition-all"
                >
                  <Lock size={13} /> Cambiar Contraseña
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                {[
                  { key: 'current', label: 'Contraseña actual' },
                  { key: 'nuevo', label: 'Nueva contraseña' },
                  { key: 'confirmar', label: 'Confirmar nueva' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{f.label}</label>
                    <div className="relative">
                      <input
                        type={showPwd[f.key] ? 'text' : 'password'}
                        value={passwordForm[f.key]}
                        onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                        required
                      />
                      <button type="button" onClick={() => setShowPwd(p => ({ ...p, [f.key]: !p[f.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPwd[f.key] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setChangingPassword(false)}
                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={pwdLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-xs font-bold transition-all btn-lift disabled:opacity-70">
                    {pwdLoading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                    {pwdLoading ? 'Guardando...' : 'Actualizar'}
                  </button>
                </div>
              </form>
            )}
          </Section>
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* ─── SUBSCRIPTION CARD ─────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0a1128] to-slate-900 text-white rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-slate-800 interactive-card">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/3 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Plan Actual</p>
                  {subLoading ? (
                    <div className="space-y-2">
                      <Sk h="h-6" w="w-40" />
                      <Sk h="h-4" w="w-28" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        {planNombre}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${planEstado === 'activo' || planEstado === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : planEstado === 'cancelado' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {planEstado}
                        </span>
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">{montoPlan} · Próxima factura: {proximaFecha}</p>
                    </>
                  )}
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Zap size={22} className="text-amber-400" />
                </div>
              </div>

              {/* Cycle progress bar */}
              {!subLoading && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2 font-medium text-slate-400">
                    <span>Progreso del ciclo de facturación</span>
                    <span className="text-sky-400 font-bold">{diasRestantes} días restantes</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400 progress-animated"
                      style={{ width: `${cycleProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Usage mini summary */}
              {!subLoading && usage && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Pacientes', used: usagePac.used, max: usagePac.max },
                    { label: 'Dietas', used: usageDietas.used, max: usageDietas.max },
                    { label: 'Notas', used: usageNotas.used, max: usageNotas.max },
                  ].map(u => (
                    <div key={u.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-bold mb-1">{u.label}</p>
                      <p className="text-lg font-bold text-white">{u.used}<span className="text-xs text-slate-500 font-normal">/{u.max || '∞'}</span></p>
                    </div>
                  ))}
                </div>
              )}

              {subLoading && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => onViewChange?.('suscripcion')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-bold transition-all btn-lift"
                >
                  <Zap size={15} /> Gestionar Plan
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all">
                  <ExternalLink size={15} /> Facturas
                </button>
              </div>
            </div>
          </div>

          {/* ─── PAYMENT METHOD ─────────────────────────────────────────── */}
          <Section icon={CreditCard} title="Método de Pago" iconCls="text-emerald-500">
            {subLoading ? (
              <div className="space-y-3">
                <Sk h="h-36" rounded="rounded-2xl" />
                <Sk h="h-10" />
              </div>
            ) : paymentMethod ? (
              <div className="space-y-4">
                <CreditCardDisplay card={paymentMethod} />
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-500 transition-all btn-lift">
                    <RefreshCw size={13} /> Actualizar tarjeta
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-red-400 hover:text-red-500 transition-all">
                    <Trash2 size={13} /> Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <CreditCard size={28} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm text-slate-500 mb-3">No hay método de pago registrado.</p>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all btn-lift mx-auto">
                  <Plus size={14} /> Agregar Tarjeta
                </button>
                <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <Shield size={11} className="text-emerald-500" />
                  Pagos procesados de forma segura vía Stripe · PCI DSS
                </p>
              </div>
            )}
          </Section>

          {/* ─── BILLING HISTORY ────────────────────────────────────────── */}
          <Section icon={Clock} title="Historial de Pagos" iconCls="text-amber-500">
            {subLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Sk key={i} h="h-12" />)}
              </div>
            ) : billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                  <Clock size={22} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm text-slate-400">No hay facturas registradas aún.</p>
                <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">
                  Aparecerán aquí cuando se realicen cobros.
                </p>
              </div>
            ) : (
              <div className="-my-2">
                {billingHistory.map((inv, i) => (
                  <BillingRow key={inv.id || i} invoice={inv} />
                ))}
              </div>
            )}
          </Section>

          {/* ─── DANGER ZONE ────────────────────────────────────────────── */}
          <div className="bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
            <h3 className="font-bold text-red-700 dark:text-red-400 text-sm mb-1 flex items-center gap-2">
              <AlertTriangle size={16} /> Zona de Peligro
            </h3>
            <p className="text-xs text-red-600/80 dark:text-red-400/70 mb-4 leading-relaxed">
              Cancelar tu suscripción desactivará el acceso a funciones premium al finalizar el ciclo de facturación actual. Tus datos se conservarán 90 días.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCancelModal(true)}
                disabled={planEstado === 'cancelado'}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={13} /> Cancelar Suscripción
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:text-red-500 hover:border-red-300 transition-all">
                <Trash2 size={13} /> Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CANCEL CONFIRMATION MODAL ──────────────────────────────────── */}
      {cancelModal && (
        <div className="modal-backdrop-enter fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modal-enter bg-white dark:bg-[#0a1128] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">¿Cancelar suscripción?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Esta acción no se puede deshacer fácilmente.</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                {[
                  'Perderás acceso a la IA de generación de dietas y rutinas.',
                  'Los miembros adicionales del equipo serán desactivados.',
                  'Tus datos se conservarán durante 90 días.',
                  'Podrás reactivar tu plan en cualquier momento.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${i < 2 ? 'bg-red-100 dark:bg-red-950/40 text-red-500' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500'}`}>
                      {i < 2 ? <X size={9} strokeWidth={3} /> : <Check size={9} strokeWidth={3} />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                Mantendrás acceso completo hasta el <strong className="text-slate-600 dark:text-slate-200">{proximaFecha}</strong>.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCancelModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Conservar Plan
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all btn-lift disabled:opacity-70"
                >
                  {cancelLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                  {cancelLoading ? 'Cancelando...' : 'Sí, cancelar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;