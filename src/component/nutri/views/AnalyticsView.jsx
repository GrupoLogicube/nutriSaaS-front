import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart2, TrendingUp, Users, Calendar, Utensils,
  ArrowUpRight, ArrowDownRight, Activity, Star,
  ChevronDown, Download, RefreshCw, WifiOff
} from 'lucide-react';
import { analyticsApi, pacientesApi, citasApi, dietasApi } from '../../../services/api';

// ─── Bar Chart Canvas ─────────────────────────────────────────────────────────
const BarChartCanvas = ({ data, color = '#0ea5e9' }) => {
  const canvasRef = useRef(null);
  const max = Math.max(...data.map(d => d.value), 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width; const H = canvas.height;
    const pad = { top: 20, bottom: 30, left: 10, right: 10 };
    const cW = W - pad.left - pad.right; const cH = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);
    const barW = (cW / data.length) * 0.55;
    const gap = (cW / data.length) * 0.45;
    data.forEach((d, i) => {
      const x = pad.left + i * (barW + gap) + gap / 2;
      const barH = (d.value / max) * cH;
      const y = pad.top + cH - barH;
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, color); grad.addColorStop(1, color + '60');
      ctx.beginPath(); ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fillStyle = grad; ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, H - 8);
      if (d.value > 0) {
        ctx.fillStyle = '#64748b'; ctx.font = 'bold 10px sans-serif';
        ctx.fillText(d.value, x + barW / 2, y - 5);
      }
    });
  }, [data, max, color]);

  return <canvas ref={canvasRef} width={500} height={160} className="w-full h-auto" />;
};

// ─── Line Chart Canvas ────────────────────────────────────────────────────────
const LineChartCanvas = ({ data, color = '#8b5cf6' }) => {
  const canvasRef = useRef(null);
  const max = Math.max(...data.map(d => d.value), 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width; const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pts = data.map((d, i) => ({
      x: 15 + (i / (data.length - 1)) * (W - 30),
      y: 15 + (1 - d.value / max) * (H - 40),
    }));
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '40'); grad.addColorStop(1, color + '00');
    ctx.beginPath(); ctx.moveTo(pts[0].x, H - 25);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - 25); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(data[i].label, p.x, H - 8);
    });
  }, [data, max, color]);

  return <canvas ref={canvasRef} width={500} height={160} className="w-full h-auto" />;
};

// ─── Metric Card ──────────────────────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, change, positive, accentCls, loading }) => (
  <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentCls}`}><Icon size={18} /></div>
      {!loading && change !== undefined && (
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 text-red-500'}`}>
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-800 dark:text-white">{loading ? '—' : value}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 uppercase font-semibold tracking-wide">{label}</p>
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-xs font-bold text-slate-700 dark:text-white">
          {value} <span className="text-slate-400 font-normal">/ {max}</span>
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const RANGES = [
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'quarter', label: 'Últimos 3 meses' },
  { key: 'year', label: 'Este año' },
];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

// ─── Main ──────────────────────────────────────────────────────────────────────
const AnalyticsView = ({ user }) => {
  const [range, setRange] = useState('month');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aggregated metrics
  const [metrics, setMetrics] = useState({
    totalPacientes: 0,
    planesGenerados: 0,
    citasRealizadas: 0,
    tasaRetencion: 0,
  });

  // Chart data (zeros by default)
  const [monthlyData, setMonthlyData] = useState(
    MONTHS.map((label, i) => ({ label, value: 0 }))
  );
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map(label => ({ label, value: 0 }))
  );
  const [topPatients, setTopPatients] = useState([]);
  const [moduleUsage, setModuleUsage] = useState({
    pacientes: 0, dietas: 0, citas: 0, rutinas: 0, notas: 0,
  });

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  const fetchAnalytics = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    // Try dedicated analytics endpoint first
    const { data: analyticsData, error: analyticsErr } = await analyticsApi.getSummary(token, empresaId, range);

    if (!analyticsErr && analyticsData) {
      // Populated from API
      const d = analyticsData?.data ?? analyticsData;
      setMetrics({
        totalPacientes: d.totalPacientes ?? 0,
        planesGenerados: d.planesGenerados ?? 0,
        citasRealizadas: d.citasRealizadas ?? 0,
        tasaRetencion: d.tasaRetencion ?? 0,
      });
      if (d.pacientesPorMes) setMonthlyData(d.pacientesPorMes);
      if (d.actividadSemanal) setWeeklyData(d.actividadSemanal);
      if (d.topPacientes) setTopPatients(d.topPacientes);
    } else {
      // Fallback: aggregate from individual endpoints
      setError('Calculando desde datos individuales...');

      const [{ data: pacData }, { data: citasData }, { data: dietasData }] = await Promise.all([
        pacientesApi.getAll(token, empresaId),
        citasApi.getAll(token, empresaId),
        dietasApi.getAll(token, empresaId),
      ]);

      const pacientes = Array.isArray(pacData) ? pacData : (pacData?.data ?? []);
      const citas = Array.isArray(citasData) ? citasData : (citasData?.data ?? []);
      const dietas = Array.isArray(dietasData) ? dietasData : (dietasData?.data ?? []);

      setMetrics({
        totalPacientes: pacientes.length,
        planesGenerados: dietas.length,
        citasRealizadas: citas.filter(c => c.estado === 'finalizada').length,
        tasaRetencion: pacientes.length > 0 ? Math.round((dietas.length / pacientes.length) * 100) : 0,
      });

      // Monthly patients chart
      const now = new Date();
      const monthCounts = MONTHS.map((label, mi) => {
        const count = pacientes.filter(p => {
          const d = new Date(p.created_at);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === mi;
        }).length;
        return { label, value: count };
      });
      setMonthlyData(monthCounts);

      // Weekly activity from citas
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const daysCounts = DAYS.map((label, di) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + di);
        const dayStr = day.toISOString().split('T')[0];
        const count = citas.filter(c => (c.fecha_hora_inicio || '').startsWith(dayStr)).length;
        return { label, value: count };
      });
      setWeeklyData(daysCounts);

      // Top patients by plans
      const patientPlanCount = {};
      dietas.forEach(d => {
        const id = d.paciente_id;
        if (id) patientPlanCount[id] = (patientPlanCount[id] || 0) + 1;
      });
      const top = pacientes
        .map(p => ({ ...p, planCount: patientPlanCount[p.id] || 0 }))
        .sort((a, b) => b.planCount - a.planCount)
        .slice(0, 5);
      setTopPatients(top);

      setModuleUsage({
        pacientes: pacientes.length,
        dietas: dietas.length,
        citas: citas.length,
        rutinas: 0,
        notas: 0,
      });

      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => { fetchAnalytics(); }, [range, user]);

  const currentRange = RANGES.find(r => r.key === range)?.label || 'Este mes';

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analíticas</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Seguimiento de progreso y métricas de tu práctica.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 transition-all">
            <RefreshCw size={15} />
          </button>
          <div className="relative">
            <button
              onClick={() => setRangeOpen(!rangeOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              {currentRange} <ChevronDown size={14} className={`transition-transform ${rangeOpen ? 'rotate-180' : ''}`} />
            </button>
            {rangeOpen && (
              <div className="absolute right-0 top-12 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-10 w-48 py-1 animate-in fade-in zoom-in-95 duration-150">
                {RANGES.map(r => (
                  <button key={r.key} onClick={() => { setRange(r.key); setRangeOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${r.key === range ? 'text-sky-500 font-bold bg-sky-50 dark:bg-sky-950/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-sky-500/30">
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Pacientes" value={metrics.totalPacientes} accentCls="bg-sky-50 dark:bg-sky-950/40 text-sky-500" loading={loading} />
        <MetricCard icon={Utensils} label="Planes Generados" value={metrics.planesGenerados} accentCls="bg-violet-50 dark:bg-violet-950/40 text-violet-500" loading={loading} />
        <MetricCard icon={Calendar} label="Citas Realizadas" value={metrics.citasRealizadas} accentCls="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500" loading={loading} />
        <MetricCard icon={Star} label="Retención (%)" value={`${metrics.tasaRetencion}%`} accentCls="bg-amber-50 dark:bg-amber-950/40 text-amber-500" loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
                <Users size={15} className="text-sky-500" /> Pacientes por Mes
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Nuevos registros — {new Date().getFullYear()}</p>
            </div>
          </div>
          {loading
            ? <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" /></div>
            : <BarChartCanvas data={monthlyData} color="#0ea5e9" />
          }
        </div>
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
                <Activity size={15} className="text-violet-500" /> Citas por Día (Semana Actual)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Actividad semanal</p>
            </div>
          </div>
          {loading
            ? <div className="h-40 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /></div>
            : <LineChartCanvas data={weeklyData} color="#8b5cf6" />
          }
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top patients */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-700 dark:text-white text-sm flex items-center gap-2">
              <Star size={15} className="text-amber-500 fill-amber-400" /> Pacientes con más Planes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  {['Paciente', 'Planes', 'Adherencia'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="py-8 text-center"><div className="w-5 h-5 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto" /></td></tr>
                ) : topPatients.length === 0 ? (
                  <tr><td colSpan={3} className="py-10 text-center text-sm text-slate-400">No hay datos suficientes aún.</td></tr>
                ) : topPatients.map((p, i) => {
                  const name = p.nombre_completo || `${p.nombre || ''} ${p.apellidos || ''}`.trim() || 'Paciente';
                  const plans = p.planCount || 0;
                  const pct = Math.min(plans * 10, 100);
                  return (
                    <tr key={p.id || i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center text-[11px] font-bold text-sky-500">{name[0]?.toUpperCase()}</div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-white truncate max-w-[150px]">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 font-semibold">{plans}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                            <div className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-400' : pct >= 40 ? 'bg-amber-400' : 'bg-sky-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module distribution */}
        <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-slate-700 dark:text-white text-sm mb-4 flex items-center gap-2">
            <BarChart2 size={15} className="text-sky-500" /> Uso de Módulos
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              <ProgressBar label="Pacientes" value={moduleUsage.pacientes} max={Math.max(moduleUsage.pacientes, 50)} color="bg-sky-400" />
              <ProgressBar label="Dietas Generadas" value={moduleUsage.dietas} max={Math.max(moduleUsage.dietas, 100)} color="bg-violet-400" />
              <ProgressBar label="Citas Agendadas" value={moduleUsage.citas} max={Math.max(moduleUsage.citas, 80)} color="bg-emerald-400" />
              <ProgressBar label="Rutinas" value={moduleUsage.rutinas} max={Math.max(moduleUsage.rutinas, 40)} color="bg-amber-400" />
              <ProgressBar label="Notas Clínicas" value={moduleUsage.notas} max={Math.max(moduleUsage.notas, 60)} color="bg-rose-400" />
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-400 text-center">
              Los datos se actualizan en tiempo real desde la API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
