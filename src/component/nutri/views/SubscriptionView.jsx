import React, { useState, useEffect } from 'react';
import {
  CreditCard, Check, Zap, Crown, Shield, Star,
  ChevronRight, Clock, TrendingUp,
  Users, Utensils, Dumbbell, FileText, BarChart2,
  Sparkles, X, ExternalLink, RefreshCw, WifiOff
} from 'lucide-react';
import { suscripcionApi } from '../../../services/api';

// ─── Plans definition (static — comes from backend in production) ─────────────
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 29, annual: 23 },
    color: 'border-slate-200 dark:border-slate-700',
    headerCls: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
    iconCls: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    btnCls: 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white',
    badge: null,
    features: ['1 nutricionista', 'Hasta 50 pacientes', 'Generador de dietas (IA básica)', 'Agenda de citas', 'Notas clínicas', 'Soporte por email'],
    disabled: ['Rutinas de ejercicio', 'Analíticas avanzadas', 'Equipo de trabajo', 'API acceso'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 79, annual: 63 },
    color: 'border-sky-400 dark:border-sky-500',
    headerCls: 'from-sky-500 to-blue-600',
    iconCls: 'bg-white/20 text-white',
    btnCls: 'bg-white text-sky-600 hover:bg-sky-50',
    badge: 'Más popular',
    features: ['Hasta 5 nutricionistas', 'Pacientes ilimitados', 'Generador de dietas (IA avanzada)', 'Generador de rutinas', 'Agenda y recordatorios', 'Notas clínicas avanzadas', 'Analíticas del negocio', 'Gestión de equipo', 'Soporte prioritario'],
    disabled: ['API acceso', 'White-label personalizado'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 199, annual: 159 },
    color: 'border-violet-400 dark:border-violet-500',
    headerCls: 'from-violet-600 to-purple-700',
    iconCls: 'bg-white/20 text-white',
    btnCls: 'bg-white text-violet-600 hover:bg-violet-50',
    badge: null,
    features: ['Nutricionistas ilimitados', 'Pacientes ilimitados', 'Toda la IA sin límites', 'Analíticas avanzadas + BI', 'API acceso completo', 'White-label personalizado', 'Manager dedicado', 'SLA 99.9%'],
    disabled: [],
  },
];

// ─── Feature Item ─────────────────────────────────────────────────────────────
const FeatureItem = ({ text, enabled = true }) => (
  <div className="flex items-start gap-2.5 py-1.5">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${enabled ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
      {enabled ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={2.5} />}
    </div>
    <span className={`text-xs leading-relaxed ${enabled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600 line-through'}`}>{text}</span>
  </div>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, billing, isCurrent, onUpgrade, upgrading }) => {
  const price = billing === 'annual' ? plan.price.annual : plan.price.monthly;
  const isColored = plan.id === 'pro' || plan.id === 'enterprise';

  return (
    <div className={`relative bg-white dark:bg-[#0a1128] rounded-2xl border-2 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${isCurrent ? 'ring-2 ring-sky-400' : ''} ${plan.color}`}>
      {plan.badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-amber-400 text-amber-900 rounded-full">
            <Star size={9} className="fill-amber-900" /> {plan.badge}
          </span>
        </div>
      )}
      {isCurrent && (
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-500 text-white rounded-full">Plan actual</span>
        </div>
      )}
      <div className={`p-6 bg-gradient-to-br ${plan.headerCls} ${isCurrent || plan.badge ? 'pt-12' : ''}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${plan.iconCls}`}>
          {plan.id === 'starter' ? <Shield size={20} /> : plan.id === 'pro' ? <Zap size={20} /> : <Crown size={20} />}
        </div>
        <h3 className={`font-bold text-lg ${isColored ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{plan.name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className={`text-3xl font-bold ${isColored ? 'text-white' : 'text-slate-800 dark:text-white'}`}>${price}</span>
          <span className={`text-sm ${isColored ? 'text-white/70' : 'text-slate-400'}`}>/mes</span>
        </div>
        {billing === 'annual' && (
          <p className={`text-[11px] mt-1 ${isColored ? 'text-white/60' : 'text-slate-400'}`}>
            Facturado anualmente · Ahorras ${(plan.price.monthly - plan.price.annual) * 12}/año
          </p>
        )}
      </div>
      <div className="p-5 flex-1">
        {plan.features.map(f => <FeatureItem key={f} text={f} />)}
        {plan.disabled.map(f => <FeatureItem key={f} text={f} enabled={false} />)}
      </div>
      <div className="p-5 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => !isCurrent && onUpgrade(plan.id)}
          disabled={isCurrent || upgrading}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : plan.btnCls + ' hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70'}`}
        >
          {upgrading === plan.id
            ? <div className="w-4 h-4 rounded-full border-2 border-current/40 border-t-current animate-spin" />
            : isCurrent ? 'Plan Actual' : plan.id === 'enterprise' ? 'Contactar Ventas' : 'Actualizar Plan'
          }
          {!isCurrent && upgrading !== plan.id && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
};

// ─── Usage Bar ────────────────────────────────────────────────────────────────
const UsageBar = ({ label, used, max, icon: Icon, color }) => {
  const isUnlimited = max === null || max === 0;
  const pct = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
  const isNearLimit = !isUnlimited && pct >= 80;
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}><Icon size={15} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
          <span className={`text-xs font-bold ${isNearLimit ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>
            {used} / {isUnlimited ? '∞' : max}
          </span>
        </div>
        {!isUnlimited && (
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${isNearLimit ? 'bg-amber-400' : 'bg-sky-400'}`} style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const SubscriptionView = ({ user }) => {
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);
  const [error, setError] = useState(null);

  // Current subscription data from API
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  const fetchSubscription = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const [{ data: subData, error: subErr }, { data: usageData }] = await Promise.all([
      suscripcionApi.get(token, empresaId),
      suscripcionApi.getUsage(token, empresaId),
    ]);

    if (subErr) setError(subErr);
    else setSubscription(subData?.data ?? subData);

    if (usageData) setUsage(usageData?.data ?? usageData);

    setLoading(false);
  };

  useEffect(() => { fetchSubscription(); }, [user]);

  const handleUpgrade = async (planId) => {
    if (!window.confirm(`¿Cambiar al plan ${planId}?`)) return;
    setUpgrading(planId);
    const { data, error: err } = await suscripcionApi.changePlan(token, empresaId, { plan: planId, billing });
    if (!err && data) {
      setSubscription(data?.data ?? data);
    }
    setUpgrading(null);
  };

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) return;
    await suscripcionApi.cancel(token, empresaId);
    await fetchSubscription();
  };

  // Determine current plan
  const currentPlanId = subscription?.plan_id ?? subscription?.plan ?? 'starter';
  const planName = subscription?.plan_nombre ?? subscription?.plan_name ?? 'Starter';
  const planPrice = subscription?.precio ?? subscription?.price ?? '$0/mes';
  const nextBilling = subscription?.proxima_factura ?? subscription?.next_billing ?? '—';
  const daysLeft = subscription?.dias_restantes ?? subscription?.days_left ?? 0;
  const cycleProgress = subscription?.progreso_ciclo ?? subscription?.cycle_progress ?? 0;

  // Usage values (zeros if no data)
  const usagePacientes = usage?.pacientes ?? { used: 0, max: 50 };
  const usageDietas = usage?.dietas ?? { used: 0, max: 100 };
  const usageNotas = usage?.notas ?? { used: 0, max: 200 };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Suscripción</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Gestiona tu plan y facturación.</p>
        </div>
        <button onClick={fetchSubscription} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 transition-all">
          <RefreshCw size={15} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          <WifiOff size={16} className="shrink-0" />
          <span>No se pudo cargar la suscripción. Mostrando vista previa de planes disponibles.</span>
          <button onClick={fetchSubscription} className="ml-auto text-xs font-bold underline shrink-0">Reintentar</button>
        </div>
      )}

      {/* Current plan banner */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-sky-100 text-xs font-semibold uppercase tracking-wide mb-0.5">Plan Actual</p>
            <h2 className="text-xl font-bold">{loading ? '...' : planName}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={10} /> {loading ? 'Cargando...' : `Próxima factura: ${nextBilling}`}
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{loading ? '...' : planPrice}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all">
            <CreditCard size={14} /> Métodos de pago
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-sky-50 text-sky-600 rounded-xl text-sm font-bold transition-all">
            <ExternalLink size={14} /> Facturación
          </button>
        </div>
      </div>

      {/* Billing cycle progress */}
      {!loading && subscription && (
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between text-xs mb-2 font-medium text-slate-500 dark:text-slate-400">
            <span>Progreso del ciclo de facturación</span>
            <span>{daysLeft} días restantes</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${cycleProgress}%` }} />
          </div>
        </div>
      )}

      {/* Usage */}
      <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
            <TrendingUp size={15} className="text-sky-500" /> Uso del Plan Actual
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Período actual</p>
        </div>
        {loading ? (
          <div className="py-10 flex justify-center"><div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" /></div>
        ) : (
          <div className="px-5 py-2">
            <UsageBar label="Pacientes" used={usagePacientes.used} max={usagePacientes.max} icon={Users} color="bg-sky-50 dark:bg-sky-950/30 text-sky-500" />
            <UsageBar label="Dietas Generadas" used={usageDietas.used} max={usageDietas.max} icon={Utensils} color="bg-violet-50 dark:bg-violet-950/30 text-violet-500" />
            <UsageBar label="Notas Clínicas" used={usageNotas.used} max={usageNotas.max} icon={FileText} color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500" />
          </div>
        )}
      </div>

      {/* Plans */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Planes Disponibles</h2>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {[['monthly', 'Mensual'], ['annual', 'Anual']].map(([b, label]) => (
              <button key={b} onClick={() => setBilling(b)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${billing === b ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                {label}{b === 'annual' && <span className="ml-1 text-[9px] text-emerald-500 font-bold">-20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              isCurrent={plan.id === currentPlanId}
              onUpgrade={handleUpgrade}
              upgrading={upgrading}
            />
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
        <h3 className="font-bold text-red-700 dark:text-red-400 text-sm mb-2">Zona de Peligro — Cancelar Suscripción</h3>
        <p className="text-xs text-red-600/80 dark:text-red-400/70 mb-4">
          Al cancelar, perderás acceso a las funciones premium al final del ciclo de facturación actual.
        </p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
        >
          Cancelar Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionView;
