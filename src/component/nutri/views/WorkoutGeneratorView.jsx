import React, { useState, useEffect } from 'react';
import {
  Dumbbell, Zap, ChevronRight, Plus, X, Sparkles,
  Clock, RotateCcw, TrendingUp, Target, Flame,
  CheckCircle, ChevronDown, ChevronUp, Play, Download,
  User, Calendar, RefreshCw, Copy, WifiOff,
  Brain, Activity, Send, Save
} from 'lucide-react';

import { rutinasApi, pacientesApi } from '../../../services/api';

// ─── Data ─────────────────────────────────────────────────────────────────────
const GOALS = [
  { id: 'perder_peso', label: 'Perder Peso', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' },
  { id: 'ganar_musculo', label: 'Ganar Músculo', icon: Dumbbell, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800' },
  { id: 'resistencia', label: 'Resistencia', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' },
  { id: 'flexibilidad', label: 'Flexibilidad', icon: RotateCcw, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
  { id: 'tonificacion', label: 'Tonificación', icon: Target, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800' },
];

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];
const DAYS_OPTIONS = [3, 4, 5, 6];
const EQUIPMENT = ['Sin equipamiento', 'Mancuernas', 'Barras y discos', 'Máquinas de gimnasio', 'Bandas elásticas', 'Kettlebells'];

// NOTE: SAMPLE_WORKOUT removed — real data comes from API (rutinasApi.generate)
const EMPTY_WORKOUT_PLACEHOLDER = {
  name: 'Rutina de Tonificación – 4 días',
  goal: 'Tonificación',
  level: 'Intermedio',
  days: [
    {
      day: 'Lunes', focus: 'Pecho y Tríceps',
      exercises: [
        { name: 'Press de banca', sets: '4', reps: '10-12', rest: '90s', notes: 'Mantener escápulas retraídas' },
        { name: 'Aperturas con mancuernas', sets: '3', reps: '12-15', rest: '60s', notes: 'Movimiento controlado' },
        { name: 'Fondos en paralelas', sets: '3', reps: '8-10', rest: '90s', notes: 'Inclinación leve hacia adelante' },
        { name: 'Extensiones de tríceps', sets: '3', reps: '12', rest: '60s', notes: 'Codos fijos' },
      ]
    },
    {
      day: 'Martes', focus: 'Espalda y Bíceps',
      exercises: [
        { name: 'Dominadas asistidas', sets: '4', reps: '8', rest: '90s', notes: 'Rango completo de movimiento' },
        { name: 'Remo con barra', sets: '4', reps: '10', rest: '90s', notes: 'Pecho apoyado en banco' },
        { name: 'Curl de bíceps', sets: '3', reps: '12', rest: '60s', notes: 'Movimiento supinado' },
        { name: 'Martillo con mancuernas', sets: '3', reps: '12', rest: '60s', notes: 'Neutral grip' },
      ]
    },
    {
      day: 'Jueves', focus: 'Piernas y Glúteos',
      exercises: [
        { name: 'Sentadilla con barra', sets: '4', reps: '8-10', rest: '120s', notes: 'Profundidad paralela' },
        { name: 'Prensa de piernas', sets: '3', reps: '12', rest: '90s', notes: 'No bloquear rodillas' },
        { name: 'Zancadas caminando', sets: '3', reps: '12/pierna', rest: '60s', notes: 'Paso amplio' },
        { name: 'Peso muerto rumano', sets: '3', reps: '10', rest: '90s', notes: 'Barra cerca del cuerpo' },
      ]
    },
    {
      day: 'Viernes', focus: 'Hombros y Core',
      exercises: [
        { name: 'Press militar', sets: '4', reps: '10', rest: '90s', notes: 'Sin arquear la espalda' },
        { name: 'Elevaciones laterales', sets: '3', reps: '15', rest: '60s', notes: 'Codos ligeramente flexionados' },
        { name: 'Plancha frontal', sets: '4', reps: '45s', rest: '30s', notes: 'Cuerpo rígido' },
        { name: 'Crunch de bicicleta', sets: '3', reps: '20', rest: '30s', notes: 'Rotación controlada' },
      ]
    },
  ]
};

// ─── Exercise Row ──────────────────────────────────────────────────────────────
const ExerciseRow = ({ ex, index }) => (
  <div className="grid grid-cols-12 gap-3 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 items-center group">
    <div className="col-span-1">
      <span className="w-6 h-6 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-500 text-[11px] font-bold flex items-center justify-center border border-sky-200 dark:border-sky-800">
        {index + 1}
      </span>
    </div>
    <div className="col-span-5">
      <p className="text-sm font-bold text-slate-700 dark:text-white">{ex.name}</p>
      {ex.notes && <p className="text-[10px] text-slate-400 mt-0.5">{ex.notes}</p>}
    </div>
    <div className="col-span-2 text-center">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ex.sets}</span>
      <p className="text-[9px] text-slate-400 uppercase">Series</p>
    </div>
    <div className="col-span-2 text-center">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ex.reps}</span>
      <p className="text-[9px] text-slate-400 uppercase">Reps</p>
    </div>
    <div className="col-span-2 text-center">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ex.rest}</span>
      <p className="text-[9px] text-slate-400 uppercase">Descanso</p>
    </div>
  </div>
);

// ─── Day Block ─────────────────────────────────────────────────────────────────
const DayBlock = ({ day }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center border border-sky-200 dark:border-sky-800">
            <Dumbbell size={15} className="text-sky-500" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-700 dark:text-white text-sm">{day.day}</p>
            <p className="text-[11px] text-slate-400">{day.focus} · {day.exercises.length} ejercicios</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="grid grid-cols-12 gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/60 mb-1">
            <div className="col-span-1" />
            <div className="col-span-5 text-[9px] font-bold text-slate-400 uppercase">Ejercicio</div>
            <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase text-center">Series</div>
            <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase text-center">Reps</div>
            <div className="col-span-2 text-[9px] font-bold text-slate-400 uppercase text-center">Descanso</div>
          </div>
          {day.exercises.map((ex, i) => <ExerciseRow key={i} ex={ex} index={i} />)}
        </div>
      )}
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const WorkoutGeneratorView = ({ user }) => {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [mode, setMode] = useState('smart'); // 'lite' | 'smart' | 'advanced'
  const [clinicalAnalysis, setClinicalAnalysis] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState('comprehensive'); // 'basic' | 'comprehensive' | 'detailed'
  const [config, setConfig] = useState({
    patient: '',
    goal: '',
    level: 'Intermedio',
    days: 4,
    equipment: 'Mancuernas',
    restrictions: '',
  });
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const token = user?.token;
  const empresaId = user?.empresaConfig?.id;

  // Load patients list
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const { data } = await pacientesApi.getAll(token, empresaId);
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setPatients(list);
    };
    load();
  }, [user]);

  const canGenerate = config.goal && config.level && config.days;

  const handleGenerate = async () => {
    setGenerating(true);
    setApiError(null);

    const payload = {
      paciente_id: config.patient || null,
      objetivo: config.goal,
      nivel: config.level,
      dias_semana: config.days,
      equipamiento: config.equipment,
      restricciones: config.restrictions,
    };

    const { data, error } = await rutinasApi.generate(token, empresaId, payload);

    if (error || !data) {
      // API not available yet — show informative state
      setApiError('El generador de rutinas con IA aún no está disponible. La rutina se generará cuando el backend esté conectado.');
      setGenerating(false);
      return;
    }

    const rutina = data?.data ?? data;
    setResult(rutina);
    setStep(2);
    setGenerating(false);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setApiError(null);
    setConfig(c => ({ ...c, goal: '' }));
    setStep(1);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Dumbbell size={22} className="text-sky-500" /> Generador de Rutinas
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Crea rutinas de ejercicio personalizadas con IA para tus pacientes.</p>
        </div>
        {step === 2 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            <RefreshCw size={14} /> Nueva Rutina
          </button>
        )}
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">

            {/* API Error Banner */}
            {apiError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                <WifiOff size={16} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Patient */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">
                Paciente (Opcional)
              </label>
              {patients.length > 0 ? (
                <select
                  value={config.patient}
                  onChange={e => setConfig(c => ({ ...c, patient: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
                >
                  <option value="">Sin paciente específico</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre_completo || `${p.nombre || ''} ${p.apellidos || ''}`.trim()}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={config.patient}
                    onChange={e => setConfig(c => ({ ...c, patient: e.target.value }))}
                    placeholder="Nombre del paciente (sin datos de API)..."
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* MODO DE GENERACIÓN (Lite, Smart, Advanced) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide flex items-center gap-2">
                <Brain size={14} className="text-sky-500" /> Modo de IA
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  onClick={() => setMode('lite')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center ${mode === 'lite' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'}`}
                >
                  <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'lite' ? 'bg-sky-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                  <span className="font-bold text-sm block">Light</span>
                  <span className="text-[10px] opacity-75">Rápido / Directo</span>
                </div>
                <div 
                  onClick={() => setMode('smart')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center ${mode === 'smart' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'}`}
                >
                  <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'smart' ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                  <span className="font-bold text-sm block">Smart</span>
                  <span className="text-[10px] opacity-75">Balanceado</span>
                </div>
                <div 
                  onClick={() => setMode('advanced')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center ${mode === 'advanced' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'}`}
                >
                  <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'advanced' ? 'bg-purple-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                  <span className="font-bold text-sm block">Avanzado</span>
                  <span className="text-[10px] opacity-75">Clínico Completo</span>
                </div>
              </div>
            </div>

            {/* CONMUTADOR CLÍNICO */}
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="text-sky-500" size={18} />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Modo de Análisis Clínico</p>
                    <p className="text-[11px] text-slate-400">Activa anamnesis estructurada y diagnósticos clínicos (PES).</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={clinicalAnalysis} onChange={(e) => setClinicalAnalysis(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>
              {clinicalAnalysis && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Profundidad del Análisis</label>
                  <select value={analysisDepth} onChange={(e) => setAnalysisDepth(e.target.value)} className="w-full bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
                    <option value="basic">Análisis Conciso (Enfoque General)</option>
                    <option value="comprehensive">Análisis Completo (Progresiones y Volumen)</option>
                    <option value="detailed">Análisis Detallado (Anatomía, Progresión, Prevención)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">
                Objetivo Principal *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setConfig(c => ({ ...c, goal: g.id }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${config.goal === g.id
                      ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/30'
                      : `${g.bg} ${g.color} hover:opacity-80`
                      }`}
                  >
                    <g.icon size={15} /> {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level + Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">Nivel *</label>
                <div className="flex gap-2 flex-wrap">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      onClick={() => setConfig(c => ({ ...c, level: l }))}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${config.level === l
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300'
                        }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">Días/Semana *</label>
                <div className="flex gap-2">
                  {DAYS_OPTIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig(c => ({ ...c, days: d }))}
                      className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${config.days === d
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300'
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">Equipamiento Disponible</label>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT.map(eq => (
                  <button
                    key={eq}
                    onClick={() => setConfig(c => ({ ...c, equipment: eq }))}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${config.equipment === eq
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300'
                      }`}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wide">Restricciones o Notas</label>
              <textarea
                value={config.restrictions}
                onChange={e => setConfig(c => ({ ...c, restrictions: e.target.value }))}
                rows={3}
                placeholder="Ej: Lesión en rodilla derecha, evitar sentadillas profundas..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 dark:text-white resize-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || generating}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-sky-500/30 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Generando rutina...</>
              ) : (
                <><Sparkles size={16} /> Generar Rutina con IA</>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white">
              <Zap size={20} className="mb-2" />
              <h3 className="font-bold text-sm mb-1">IA Especializada</h3>
              <p className="text-xs text-sky-100 leading-relaxed">
                Nuestro modelo de IA está entrenado con miles de rutinas de nutricionistas deportivos para crear planes óptimos.
              </p>
            </div>
            <div className="bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500" /> Lo que incluye
              </h3>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                {['Planificación semanal completa', 'Series, reps y tiempos de descanso', 'Notas de técnica por ejercicio', 'Progresión semana a semana', 'Alternativas para lesiones'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-sky-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Results
        <div className="space-y-4">
          {/* Result header */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="text-sky-100 text-xs font-bold uppercase mb-1">Rutina Generada</p>
              <h2 className="text-xl font-bold">{result?.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{result?.level}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{result?.days?.length} días/semana</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{result?.goal}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all">
                <RotateCcw size={13} /> Regenerar Plan
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all">
                <Download size={13} /> Exportar PDF
              </button>
              <button onClick={() => alert('¡Rutina enviada al paciente exitosamente!')} className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all">
                <Send size={13} /> Enviar al Paciente
              </button>
              <button onClick={() => alert('¡Rutina guardada exitosamente!')} className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-sky-600 rounded-xl text-xs font-bold transition-all shadow-sm">
                <Save size={13} /> Guardar Cambios
              </button>
            </div>
          </div>

          {result?.days.map((day, i) => <DayBlock key={i} day={day} />)}
        </div>
      )}
    </div>
  );
};

export default WorkoutGeneratorView;
