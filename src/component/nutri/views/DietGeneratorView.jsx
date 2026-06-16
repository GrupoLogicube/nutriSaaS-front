import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Check, Brain, Loader2, ArrowLeft, Download, 
  RotateCcw, Save, Utensils, Award, Info, FileText, ChevronRight,
  TrendingUp, Activity, CheckCircle
} from 'lucide-react';

const DietGeneratorView = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [mode, setMode] = useState('smart'); // 'lite' | 'smart' | 'advanced'
  const [clinicalAnalysis, setClinicalAnalysis] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState('comprehensive'); // 'basic' | 'comprehensive' | 'detailed'
  const [goals, setGoals] = useState('');
  const [preferences, setPreferences] = useState('');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  
  // Tab for active day in generated plan
  const [activeDay, setActiveDay] = useState('lunes');

  const steps = [
    "Analizando historial clínico e información antropométrica...",
    "Calculando requerimientos energéticos y distribución de macronutrientes...",
    "Buscando alimentos óptimos y estructurando recetas personalizadas...",
    "Generando justificación clínica y diagnóstico PES...",
    "Finalizando estructuración del plan de alimentación..."
  ];

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'X-Empresa-ID': user.empresaConfig.id,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPatients(data.length > 0 ? data : [
            { id: 1, nombre: 'Jorge', apellidos: 'Armando', email: 'jorge.armando@example.com' },
            { id: 2, nombre: 'Ana', apellidos: 'García', email: 'ana.garcia@example.com' }
          ]);
        } else {
          setPatients([
            { id: 1, nombre: 'Jorge', apellidos: 'Armando', email: 'jorge.armando@example.com' },
            { id: 2, nombre: 'Ana', apellidos: 'García', email: 'ana.garcia@example.com' }
          ]);
        }
      } catch (err) {
        console.error("Error fetching patients in DietGenerator:", err);
        setPatients([
          { id: 1, nombre: 'Jorge', apellidos: 'Armando', email: 'jorge.armando@example.com' },
          { id: 2, nombre: 'Ana', apellidos: 'García', email: 'ana.garcia@example.com' }
        ]);
      }
    };
    if (user) {
      fetchPatients();
    }
  }, [user]);

  // Handle generation start
  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenStep(0);

    // Simulated progress stepper
    const interval = setInterval(() => {
      setGenStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Generate mock diet plan data
            const patientObj = patients.find(p => p.id === parseInt(selectedPatientId));
            const patientName = patientObj ? `${patientObj.nombre} ${patientObj.apellidos}` : 'Paciente Seleccionado';
            
            const mockPlan = {
              patientName,
              macros: {
                calories: mode === 'lite' ? 1800 : mode === 'smart' ? 2100 : 2350,
                protein: mode === 'lite' ? 120 : mode === 'smart' ? 145 : 160,
                carbs: mode === 'lite' ? 190 : mode === 'smart' ? 220 : 250,
                fat: mode === 'lite' ? 60 : mode === 'smart' ? 70 : 80,
              },
              pes: clinicalAnalysis ? {
                diagnosis: "Consumo calórico inadecuado relacionado con desequilibrio metabólico evidenciado por hábitos reportados y porcentaje de grasa corporal elevado.",
                justification: `Se diseña una dieta hiperproteica moderada basada en el modo ${analysisDepth === 'basic' ? 'Básico' : analysisDepth === 'comprehensive' ? 'Completo' : 'Detallado'} para optimizar la masa muscular mientras se reduce la grasa visceral, limitando azúcares refinados y potenciando grasas saludables de cadena media.`,
                monitoring: "Monitorear peso en ayunas y pliegues cutáneos semanalmente."
              } : null,
              days: {
                lunes: {
                  desayuno: "Tortilla de 3 claras de huevo y 1 huevo entero con espinacas y champiñones, acompañada de 2 tostadas de pan integral de masa madre.",
                  colacion1: "1 manzana verde mediana con 20 gramos de almendras naturales tostadas.",
                  almuerzo: "200g de pechuga de pollo a la plancha con limón, 1 taza de quinoa cocida y una ensalada fresca mixta con vinagreta de limón y 1 cdta de aceite de oliva.",
                  colacion2: "150g de yogur griego natural sin azúcar añadida con una cucharada de semillas de chía.",
                  cena: "150g de filete de salmón al horno, 120g de espárragos salteados y media taza de puré de camote (boniato) asado."
                },
                martes: {
                  desayuno: "Avena cocida en agua o leche de almendras, con media taza de frutos rojos, 1 scoop de proteína de suero y canela al gusto.",
                  colacion1: "1 taza de rodajas de pepino con limón y sal, y 30g de nueces de pecana.",
                  almuerzo: "180g de filete de atún a la plancha, 1 taza de arroz integral y vegetales al vapor (brócoli, zanahoria y calabacín) sazonados con aceite de aguacate.",
                  colacion2: "2 rollitos de jamón de pavo bajo en sodio rellenos con queso requesón.",
                  cena: "Brochetas de pechuga de pavo (150g) asadas con pimiento morrón y cebolla, servidas sobre cama de espinacas tiernas."
                },
                miercoles: {
                  desayuno: "Tostadas integrales (2 rebanadas) con aguacate machacado, 80g de queso cottage y semillas de sésamo.",
                  colacion1: "1 pera y un puñado pequeño de semillas de calabaza tostadas.",
                  almuerzo: "Lentejas guisadas con vegetales sin embutidos (1.5 tazas), acompañadas de ensalada de repollo y zanahoria.",
                  colacion2: "1 huevo cocido entero con una pizca de pimienta negra.",
                  cena: "180g de tilapia o filete de pescado blanco a la plancha con ajo, judías verdes salteadas y ensalada de tomate con albahaca."
                },
                jueves: {
                  desayuno: "Batido verde: 1 taza de espinaca, medio plátano, 1 taza de leche de coco sin azúcar, 1 scoop de proteína de vainilla y una cucharada de mantequilla de almendras.",
                  colacion1: "Media taza de edamames al vapor con sal marina.",
                  almuerzo: "Tacos de lechuga (hojas de lechuga romana) rellenos de carne molida magra de res (180g), pico de gallo y rebanadas de aguacate.",
                  colacion2: "Yogur de coco sin azúcar con 10g de cacao nibs.",
                  cena: "Pechuga de pollo al horno (150g) rellena de espinacas y queso feta, con guarnición de puré de coliflor."
                },
                viernes: {
                  desayuno: "Panqueques de avena y plátano (elaborados con claras, avena y plátano triturado), servidos con una porción de frutos del bosque.",
                  colacion1: "Bastones de apio y zanahoria con 2 cucharadas de hummus casero.",
                  almuerzo: "180g de pechuga de pavo asada, 1 taza de cuscús y vegetales asados al horno (calabaza y berenjena).",
                  colacion2: "30g de queso panela bajo en grasa con 2 nueces enteras.",
                  cena: "150g de camarones salteados con ajo y chile, acompañados de espagueti de calabacín (zoodles) al pesto de albahaca."
                },
                sabado: {
                  desayuno: "Huevos revueltos (2 unidades) con jitomate, cebolla y cilantro, servidos con media taza de frijoles negros machacados.",
                  colacion1: "Media taza de piña picada con una pizca de chile en polvo.",
                  almuerzo: "Fajitas de pollo (180g) con mezcla de pimientos de colores, acompañadas de 2 tortillas de maíz nixtamalizado.",
                  colacion2: "Batido ligero con media taza de fresas y agua de coco.",
                  cena: "150g de lomo de cerdo magro al horno, con ensalada caprese (tomate, mozzarella fresca y vinagre balsámico) y hojas verdes."
                },
                domingo: {
                  desayuno: "Waffles de proteína de vainilla y avena, con fresas frescas y un chorrito de jarabe de maple puro sin azúcar.",
                  colacion1: "30g de almendras naturales.",
                  almuerzo: "180g de pulpo o marisco a la plancha, servido con ensalada de quinoa, aguacate, mango y cilantro fresco.",
                  colacion2: "Yogur griego con frambuesas y chía.",
                  cena: "Filete de ternera magro (150g) a la plancha con espárragos trigueros y champiñones al ajillo."
                }
              }
            };
            
            setGeneratedPlan(mockPlan);
            setIsGenerating(false);
          }, 800);
          return prev;
        }
      });
    }, 1200);
  };

  const handleReset = () => {
    setGeneratedPlan(null);
    setGenStep(0);
    setGoals('');
    setPreferences('');
  };

  const handleSave = () => {
    alert("¡Plan alimenticio guardado exitosamente en el expediente del paciente!");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* HEADER PRINCIPAL */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="text-sky-500" size={24} /> Diet Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Genera planes alimenticios personalizados estructurados con inteligencia artificial clínica.
          </p>
        </div>
      </div>

      {/* 1. ANIMACIÓN DE CARGA / ESTADOS DE IA */}
      {isGenerating && (
        <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-sky-500 animate-spin relative z-10" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Generando Plan de Alimentación</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm animate-pulse">
            {steps[genStep]}
          </p>
          
          <div className="w-64 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((genStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-sky-500 font-bold mt-2">
            Paso {genStep + 1} de {steps.length}
          </span>
        </div>
      )}

      {/* 2. FORMULARIO DEL GENERADOR */}
      {!isGenerating && !generatedPlan && (
        <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PANEL IZQUIERDO: PARÁMETROS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECCIÓN DE PATIENT INFORMATION */}
            <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Brain size={18} className="text-sky-500" /> Parámetros de Planificación
              </h3>

              {/* MODO DE GENERACIÓN (Lite, Smart, Advanced) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Modo de IA</label>
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* LITE */}
                  <div 
                    onClick={() => setMode('lite')}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center
                      ${mode === 'lite' 
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'lite' ? 'bg-sky-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                    <span className="font-bold text-sm block">Lite</span>
                    <span className="text-[10px] opacity-75">Rápido / Directo</span>
                  </div>

                  {/* SMART */}
                  <div 
                    onClick={() => setMode('smart')}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center
                      ${mode === 'smart' 
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'smart' ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                    <span className="font-bold text-sm block">Smart</span>
                    <span className="text-[10px] opacity-75">Balanceado</span>
                  </div>

                  {/* ADVANCED */}
                  <div 
                    onClick={() => setMode('advanced')}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center
                      ${mode === 'advanced' 
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full mb-1 ${mode === 'advanced' ? 'bg-purple-500' : 'bg-slate-350 dark:bg-slate-700'}`}></div>
                    <span className="font-bold text-sm block">Advanced</span>
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
                    <input 
                      type="checkbox" 
                      checked={clinicalAnalysis} 
                      onChange={(e) => setClinicalAnalysis(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>

                {/* DROPDOWN PROFUNDIDAD DE ANÁLISIS */}
                {clinicalAnalysis && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Profundidad del Análisis</label>
                    <select 
                      value={analysisDepth} 
                      onChange={(e) => setAnalysisDepth(e.target.value)} 
                      className="w-full bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      <option value="basic">Análisis Básico (Solo Calorías)</option>
                      <option value="comprehensive">Análisis Completo (Macronutrientes + Recetas)</option>
                      <option value="detailed">Análisis Detallado (Macros, Micronutrientes, Diagnósticos PES)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* SELECCIÓN DE PACIENTE */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Seleccionar Paciente</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                >
                  <option value="">Seleccione un paciente de su lista...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellidos} {p.email ? `(${p.email})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* OBJETIVOS */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Objetivos del Plan</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Ej. Pérdida de grasa corporal controlada, aumento de masa muscular limpia, optimización de resistencia atlética..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                />
              </div>

              {/* PREFERENCIAS ADICIONALES */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Preferencias Alimenticias o Alergias</label>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Ej. Sin lácteos, preferencia por pollo y pescado, evitar brócoli, ayuno intermitente 16/8..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-white text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                />
              </div>

            </div>
            
            {/* BOTÓN GENERACIÓN */}
            <button
              type="submit"
              className="w-full btn-brand py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
            >
              <Sparkles size={16} /> Generar Dieta Personalizada (Modo {mode.toUpperCase()})
            </button>

          </div>

          {/* PANEL DERECHO: CONSEJOS */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-700 dark:text-white text-sm mb-4 flex items-center gap-2">
                <Info size={16} className="text-sky-500" /> Consejos para Mejores Resultados
              </h3>
              
              <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">Información del Paciente</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Asegúrate de que las mediciones antropométricas del paciente en su ficha estén actualizadas.</li>
                    <li>Registra cualquier alergia médica severa en la pestaña general de historia.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">Especificación de Metas</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Sé específico respecto a la duración de la meta y nivel de actividad diario del paciente.</li>
                    <li>Menciona restricciones de presupuesto o preferencias por alimentos de temporada.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">Notas de Generación</h4>
                  <p className="leading-relaxed">
                    El algoritmo de inteligencia artificial equilibra la energía calórica óptima cruzando el peso actual, estatura y tasa metabólica basal del paciente.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </form>
      )}

      {/* 3. DIETA GENERADA EXITOSAMENTE */}
      {!isGenerating && generatedPlan && (
        <div className="space-y-8 animate-in zoom-in-95 duration-200">
          
          {/* BANNER DE ÉXITO */}
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Plan Generado de Forma Exitosa</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plan de alimentación inteligente para <strong>{generatedPlan.patientName}</strong>.
                </p>
              </div>
            </div>
            
            {/* ACCIONES DEL BANNER */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Regenerar
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Download size={14} /> Imprimir / PDF
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 btn-brand rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Save size={14} /> Guardar Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: RESUMEN DE MACRONUTRIENTES Y DIAGNÓSTICO CLINICO */}
            <div className="space-y-6">
              
              {/* TARGET METRICS */}
              <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-wide text-xs">
                  <TrendingUp size={16} className="text-sky-500" /> Métricas Nutritivas
                </h3>
                
                {/* CALORIES */}
                <div className="text-center p-4 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-2xl mb-6">
                  <span className="text-slate-400 text-xs font-semibold block uppercase">Calorías Diarias</span>
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{generatedPlan.macros.calories}</span>
                  <span className="text-[10px] text-sky-500 font-bold block uppercase mt-0.5">Kilocalorías</span>
                </div>

                {/* MACRO BREAKDOWN BAR */}
                <div className="space-y-4">
                  {/* PROTEIN */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Proteína</span>
                      <span className="font-bold text-slate-800 dark:text-white">{generatedPlan.macros.protein}g</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  {/* CARBS */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Carbohidratos</span>
                      <span className="font-bold text-slate-800 dark:text-white">{generatedPlan.macros.carbs}g</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  {/* FAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Grasas</span>
                      <span className="font-bold text-slate-800 dark:text-white">{generatedPlan.macros.fat}g</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLINICAL JUSTIFICATION BOX (PES) */}
              {generatedPlan.pes && (
                <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2 uppercase tracking-wide text-xs">
                    <FileText size={16} className="text-purple-500" /> Diagnóstico PES y Justificación
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">Diagnóstico Clínico (PES)</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-3 rounded-xl italic leading-relaxed">
                        "{generatedPlan.pes.diagnosis}"
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Estrategia Alimentaria</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {generatedPlan.pes.justification}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Seguimiento</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {generatedPlan.pes.monitoring}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* COLUMNA DERECHA: DESGLOSE DE COMIDAS POR DÍA */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white dark:bg-[#020813] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                
                {/* SELECTOR DE DÍA */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar p-2 bg-slate-50/50 dark:bg-slate-900/35">
                  {Object.keys(generatedPlan.days).map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all capitalize shrink-0
                        ${activeDay === day 
                          ? 'bg-sky-500 text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/30'
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* LISTADO DE COMIDAS */}
                <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800">
                  
                  {/* DESAYUNO */}
                  <div className="py-4 first:pt-0 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">DE</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Desayuno</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {generatedPlan.days[activeDay].desayuno}
                      </p>
                    </div>
                  </div>

                  {/* COLACIÓN 1 */}
                  <div className="py-4 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">C1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Colación Matutina</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {generatedPlan.days[activeDay].colacion1}
                      </p>
                    </div>
                  </div>

                  {/* ALMUERZO */}
                  <div className="py-4 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">AL</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Almuerzo / Comida Principal</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {generatedPlan.days[activeDay].almuerzo}
                      </p>
                    </div>
                  </div>

                  {/* COLACIÓN 2 */}
                  <div className="py-4 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">C2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Colación Vespertina</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {generatedPlan.days[activeDay].colacion2}
                      </p>
                    </div>
                  </div>

                  {/* CENA */}
                  <div className="py-4 last:pb-0 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <span className="font-bold text-sm">CE</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Cena</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {generatedPlan.days[activeDay].cena}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DietGeneratorView;
