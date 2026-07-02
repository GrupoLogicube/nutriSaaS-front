import React, { useState, useEffect, useRef } from 'react';
import {
  Users, TrendingUp, Activity, Calendar, Clock,
  ArrowRight, Video, MapPin, PlusCircle, CheckCircle,
  XCircle, AlertCircle, X, MoreHorizontal, ExternalLink,
  Utensils, BarChart2, ChevronRight, Zap, BookOpen,
  PlayCircle, Star, RefreshCw
} from 'lucide-react';

// ─── Mini Sparkline Chart ────────────────────────────────────────────────────
const WeeklyChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * (W - 20) + 10,
      y: H - 20 - ((d.value / max) * (H - 30)),
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(14,165,233,0.3)');
    grad.addColorStop(1, 'rgba(14,165,233,0)');

    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - 20);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - 20);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, [data, max]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} width={600} height={140} className="w-full h-auto" />
      <div className="flex justify-between px-2 mt-1">
        {days.map((d, i) => (
          <span key={i} className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{d}</span>
        ))}
      </div>
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="interactive-card glow-on-hover bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl p-5 flex items-start gap-4 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent || 'bg-sky-50 dark:bg-sky-950/40 text-sky-500'}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide truncate">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5 leading-none">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  </div>
);

// ─── Quick Action Card ───────────────────────────────────────────────────────
const QuickActionCard = ({ icon: Icon, title, desc, onClick, accentClass }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-0.5 transition-all duration-200 group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentClass}`}>
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-slate-700 dark:text-white text-sm group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{title}</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{desc}</p>
    </div>
    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
  </button>
);

// ─── Appointment Item ────────────────────────────────────────────────────────
const AppointmentItem = ({ appointment, onClick }) => {
  const { time, patient, type, status } = appointment;
  const statusConfig = {
    'Pendiente': { cls: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800', icon: AlertCircle },
    'Finalizada': { cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
    'Cancelada': { cls: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: XCircle },
  };
  const sc = statusConfig[status] || statusConfig['Pendiente'];
  const StatusIcon = sc.icon;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
    >
      <div className="flex flex-col items-center min-w-[52px]">
        <span className={`text-sm font-bold ${status === 'Cancelada' ? 'text-slate-300 line-through' : 'text-slate-700 dark:text-white'}`}>{time}</span>
        <span className="text-[9px] text-slate-400 uppercase font-semibold">Hoy</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold truncate transition-colors ${status === 'Cancelada' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 group-hover:text-sky-500'}`}>
          {patient}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold border ${type === 'Online' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800'}`}>
            {type === 'Online' ? <Video size={9} /> : <MapPin size={9} />}{type}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${sc.cls}`}>
            <StatusIcon size={9} />{status}
          </span>
        </div>
      </div>
      <ArrowRight size={15} className="text-slate-300 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const ResumenView = ({ user, onViewChange, onGoToPatient }) => {
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPatients: 0, plansGenerated: 0, recentActivity: 0, plansThisMonth: 0, upcoming: 0 });

  const [weeklyData, setWeeklyData] = useState([
    { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 },
    { value: 0 }, { value: 0 }, { value: 0 }
  ]);

  useEffect(() => {
    if (user?.token) fetchDashboardData();
    else setLoading(false);
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'X-Empresa-ID': user.empresaConfig?.id,
        'Accept': 'application/json',
      };

      // Citas
      const citasRes = await fetch('http://127.0.0.1:8000/api/tenant/citas', { headers });
      if (citasRes.ok) {
        const citasData = await citasRes.json();
        const todayStr = new Date().toISOString().split('T')[0];
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const todayCitas = citasData
          .filter(c => c.fecha_hora_inicio.startsWith(todayStr))
          .map(ev => {
            const statusMap = { pendiente: 'Pendiente', finalizada: 'Finalizada', cancelada: 'Cancelada' };
            return {
              id: ev.id,
              time: new Date(ev.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              patient: ev.paciente_nombre,
              type: ev.tipo,
              status: statusMap[ev.estado] || 'Pendiente',
            };
          });
        setAppointments(todayCitas);

        const monthCitas = citasData.filter(c => {
          const d = new Date(c.fecha_hora_inicio);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        const upcoming = citasData.filter(c => new Date(c.fecha_hora_inicio) > now).length;

        setStats(prev => ({ ...prev, plansThisMonth: monthCitas, upcoming }));

        // Calcular datos semanales (Lunes a Domingo)
        const currentDay = now.getDay();
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMonday);
        monday.setHours(0,0,0,0);
        
        const weekCounts = [0,0,0,0,0,0,0];
        citasData.forEach(c => {
          const d = new Date(c.fecha_hora_inicio);
          if (d >= monday) {
             const diffDays = Math.floor((d - monday) / 86400000);
             if (diffDays >= 0 && diffDays < 7) {
                weekCounts[diffDays]++;
             }
          }
        });
        setWeeklyData(weekCounts.map(count => ({ value: count })));
      }

      // Pacientes
      const pacRes = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', { headers });
      if (pacRes.ok) {
        const pacData = await pacRes.json();
        const sorted = pacData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const now = new Date();
        const recent5 = sorted.slice(0, 5).map(p => {
          const diffDays = Math.floor((now - new Date(p.created_at)) / 86400000);
          return {
            id: p.id,
            name: `${p.nombre} ${p.apellidos}`,
            date: diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Ayer' : `Hace ${diffDays} días`,
            status: 'Activo',
          };
        });
        setRecentPatients(recent5);

        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthPatients = pacData.filter(p => new Date(p.created_at).getMonth() === lastMonth).length;

        setStats(prev => ({
          ...prev,
          totalPatients: pacData.length,
          recentActivity: sorted.filter(p => {
            const d = new Date(p.created_at);
            return (now - d) / 86400000 <= 30;
          }).length,
          plansGenerated: pacData.length,
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (patientName) => {
    if (onGoToPatient) onGoToPatient({ nombre_completo: patientName, id: Date.now() });
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedAppt) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tenant/citas/${selectedAppt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-Empresa-ID': user.empresaConfig?.id,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus.toLowerCase() }),
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { ...a, status: newStatus } : a));
        setSelectedAppt(null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const userName = user?.nombre ? `${user.nombre}` : 'Doctor';
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Panel de Control</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ¡Bienvenido! Aquí está lo que está pasando en tu práctica.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange && onViewChange('dietas')}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <Zap size={14} /> Avanzado
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Pacientes"
          value={loading ? '—' : stats.totalPatients}
          sub="Pacientes en tu cuidado"
          accent="bg-sky-50 dark:bg-sky-950/40 text-sky-500"
        />
        <StatCard
          icon={Utensils}
          label="Dietas Generadas"
          value={loading ? '—' : stats.plansGenerated}
          sub="Total de planes creados"
          accent="bg-violet-50 dark:bg-violet-950/40 text-violet-500"
        />
        <StatCard
          icon={Activity}
          label="Actividad Reciente"
          value={loading ? '—' : stats.recentActivity}
          sub="Acciones en los últimos 30 días"
          accent="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500"
        />
        <StatCard
          icon={BarChart2}
          label="Planes este Mes"
          value={loading ? '—' : stats.plansThisMonth}
          sub="Generados este mes"
          accent="bg-amber-50 dark:bg-amber-950/40 text-amber-500"
        />
        <StatCard
          icon={Calendar}
          label="Próximas Citas"
          value={loading ? '—' : stats.upcoming}
          sub="Citas programadas"
          accent="bg-rose-50 dark:bg-rose-950/40 text-rose-500"
        />
      </div>

      {/* ── MID ROW: Weekly Chart + Practice Overview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Weekly Activity */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <TrendingUp size={17} className="text-sky-500" /> Actividad Semanal
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Planes y pacientes añadidos en los últimos 7 días
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 transition-all"
              title="Actualizar"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="mt-4">
            <WeeklyChart data={weeklyData} />
          </div>
        </div>

        {/* Practice Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
              <Star size={17} className="text-sky-500" /> Resumen de Práctica
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Métricas clave de un vistazo</p>
          </div>
          <div className="flex-1 space-y-0 divide-y divide-slate-100 dark:divide-slate-800/60">
            {[
              { label: 'Planes Este Mes', value: loading ? '—' : stats.plansThisMonth, unit: '' },
              { label: 'Actividad Mensual', value: loading ? '—' : `${stats.recentActivity}`, unit: 'acciones' },
              { label: 'Agenda Próxima', value: loading ? '—' : `${stats.upcoming}`, unit: 'programadas' },
              { label: 'Planes por Paciente', value: loading ? '—' : stats.totalPatients > 0 ? (stats.plansGenerated / stats.totalPatients).toFixed(1) : '0.0', unit: '' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="flex items-center justify-between py-3.5">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-bold text-slate-700 dark:text-white">
                  {value}{unit && <span className="text-xs text-slate-400 font-normal ml-1">{unit}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          icon={Users}
          title="Gestionar Pacientes"
          desc="Ver, añadir y editar registros de pacientes"
          onClick={() => onViewChange && onViewChange('pacientes')}
          accentClass="bg-sky-50 dark:bg-sky-950/40 text-sky-500"
        />
        <QuickActionCard
          icon={Utensils}
          title="Generar Plan de Dieta"
          desc="Crear planes de comidas personalizados con IA"
          onClick={() => onViewChange && onViewChange('dietas')}
          accentClass="bg-violet-50 dark:bg-violet-950/40 text-violet-500"
        />
        <QuickActionCard
          icon={BarChart2}
          title="Ver Analíticas"
          desc="Seguimiento de progreso y métricas de práctica"
          onClick={() => onViewChange && onViewChange('analytics')}
          accentClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500"
        />
      </div>

      {/* ── BOTTOM ROW: Recent Activity + Upcoming Appointments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
                <Activity size={15} className="text-sky-500" /> Actividad Reciente
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Tus últimas acciones y actualizaciones</p>
            </div>
            <button
              onClick={() => onViewChange && onViewChange('pacientes')}
              className="text-[11px] font-bold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:underline"
            >
              Ver todo
            </button>
          </div>

          <div className="min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
              </div>
            ) : recentPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
                <BookOpen size={32} className="text-slate-200 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No se encontró actividad reciente.</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                  Comienza por{' '}
                  <button onClick={() => onViewChange && onViewChange('pacientes')} className="text-sky-500 hover:underline font-semibold">añadir un paciente</button>
                  {' '}o{' '}
                  <button onClick={() => onViewChange && onViewChange('dietas')} className="text-sky-500 hover:underline font-semibold">generando una dieta</button>.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProfileClick(p.name)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50 shrink-0 group-hover:scale-105 transition-transform">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-500 transition-colors truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.date} · Paciente activo</p>
                    </div>
                    <MoreHorizontal size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-sky-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800/70 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
                <Calendar size={15} className="text-sky-500" /> Próximas Citas
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Tus próximas citas programadas</p>
            </div>
            <button
              onClick={() => onViewChange && onViewChange('agenda')}
              className="text-[11px] font-bold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:underline"
            >
              Ver Calendario
            </button>
          </div>

          <div className="min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
                <Calendar size={32} className="text-slate-200 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No hay citas próximas.</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                  <button onClick={() => onViewChange && onViewChange('agenda')} className="text-sky-500 hover:underline font-semibold">Programa tu primera cita aquí</button>.
                </p>
              </div>
            ) : (
              appointments.map(app => (
                <AppointmentItem
                  key={app.id}
                  appointment={app}
                  onClick={() => setSelectedAppt(app)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0a1128] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Gestionar Cita</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Paciente:</span>
                  <button
                    onClick={() => { handleProfileClick(selectedAppt.patient); setSelectedAppt(null); }}
                    className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:underline bg-sky-50 dark:bg-sky-950/30 px-2 py-0.5 rounded text-sm"
                  >
                    {selectedAppt.patient} <ExternalLink size={11} />
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-[11px] uppercase font-bold text-slate-400 mb-1">Cambiar estado a:</p>
              {[
                { status: 'Finalizada', label: 'Marcar como Finalizada', sub: 'El paciente asistió.', Icon: CheckCircle, cls: 'hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-800', iconCls: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600', textCls: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400' },
                { status: 'Cancelada', label: 'Cancelar Cita', sub: 'No asistió.', Icon: XCircle, cls: 'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-800', iconCls: 'bg-red-100 dark:bg-red-900/40 text-red-600', textCls: 'group-hover:text-red-700 dark:group-hover:text-red-400' },
                { status: 'Pendiente', label: 'Marcar como Pendiente', sub: 'Restaurar estado.', Icon: Clock, cls: 'hover:bg-sky-50 hover:border-sky-200 dark:hover:bg-sky-950/20 dark:hover:border-sky-800', iconCls: 'bg-sky-100 dark:bg-sky-950/40 text-sky-600', textCls: 'group-hover:text-sky-700 dark:group-hover:text-sky-400' },
              ].map(({ status, label, sub, Icon, cls, iconCls, textCls }) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 group transition-all ${cls}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${iconCls}`}><Icon size={17} /></div>
                  <div className="text-left">
                    <p className={`font-bold text-slate-700 dark:text-slate-200 transition-colors ${textCls}`}>{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
              <button onClick={() => setSelectedAppt(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenView;