import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Loader2, Info, HeartPulse, Activity, 
  Thermometer, Utensils
} from 'lucide-react';

// --- COMPONENTES UI INTERNOS ---
const InputGroup = ({ label, name, value, onChange, type = "text", placeholder, options, required }) => (
  <div className="flex flex-col w-full">
    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block p-3 outline-none transition-all appearance-none"
          required={required}
        >
          <option value="" disabled className="text-slate-400">Seleccionar...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-white dark:bg-slate-900">{opt.label || opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-transparent border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block outline-none transition-all placeholder:text-slate-400 p-3
            ${(type === 'date' || type === 'time') ? 'dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert' : ''}
          `}
        />
      )}
    </div>
  </div>
);

const TextAreaGroup = ({ label, name, value, onChange, rows = 3, placeholder, required }) => (
    <div className="flex flex-col w-full">
      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 block p-3 outline-none transition-all resize-none placeholder:text-slate-400"
      />
    </div>
);

// --- COMPONENTE PRINCIPAL ---
const NuevoPacienteView = ({ user, onViewChange }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_completo: '', fecha_nacimiento: '', sexo_biologico: '', region_alimentos: 'Latin America (Generic)',
    preferencia_cocina: '', email: '', telefono: '',
    condiciones_medicas: '', alergias: '', objetivos_salud: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // As in the previous modal, post to the backend
    try {
        const res = await fetch('http://127.0.0.1:8000/api/tenant/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`,
                'X-Empresa-ID': user.empresaConfig.id
            },
            body: JSON.stringify({
                ...formData,
                // Split nombre and apellido if the backend still expects them
                nombre: formData.nombre_completo.split(' ')[0] || '',
                apellido: formData.nombre_completo.split(' ').slice(1).join(' ') || ''
            })
        });

        const data = await res.json();

        if (res.ok) {
            onViewChange('pacientes'); // Return to list
        } else {
            alert('Error: ' + (data.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
    } finally {
        setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Info Básica' },
    { id: 'clinical', label: 'Clínica' },
    { id: 'anthropometric', label: 'Antropométrica' },
    { id: 'biochemical', label: 'Bioquímica' },
    { id: 'dietary', label: 'Dietética' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 pb-20 relative">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={() => onViewChange('pacientes')}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
                <ArrowLeft size={16} /> Volver a Pacientes
            </button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Añadir Nuevo Paciente</h1>
        </div>

        {/* TABS (Segmented Control style) */}
        <div className="bg-slate-100 dark:bg-[#111e38] p-1.5 rounded-xl flex overflow-x-auto mb-8 border border-slate-200 dark:border-slate-800">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all whitespace-nowrap text-center ${
                        activeTab === tab.id 
                            ? 'bg-white dark:bg-[#1a2b4c] text-sky-600 dark:text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-[#1a2b4c]/50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* FORM CONTENT */}
        <form id="new-patient-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar px-2">
            
            {activeTab === 'basic' && (
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} required />
                        <InputGroup label="Fecha de Nacimiento" type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Sexo" name="sexo_biologico" value={formData.sexo_biologico} onChange={handleChange} options={['Masculino', 'Femenino', 'Otro']} required />
                        <InputGroup label="Región de Alimentos" name="region_alimentos" value={formData.region_alimentos} onChange={handleChange} options={['Latinoamérica (Genérico)', 'EE. UU.', 'Europa']} />
                    </div>

                    <div className="w-full">
                        <InputGroup label="Preferencia de Cocina" name="preferencia_cocina" value={formData.preferencia_cocina} onChange={handleChange} placeholder="Ej., Mediterránea, Asiática, Americana" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleChange} required />
                        <InputGroup label="Teléfono" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>

                    <div className="space-y-6 pt-4">
                        <TextAreaGroup label="Condiciones Médicas" name="condiciones_medicas" value={formData.condiciones_medicas} onChange={handleChange} rows={4} />
                        <TextAreaGroup label="Alergias y Restricciones" name="alergias" value={formData.alergias} onChange={handleChange} rows={4} />
                        <TextAreaGroup label="Objetivos de Salud" name="objetivos_salud" value={formData.objetivos_salud} onChange={handleChange} rows={4} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 mb-20">
                        <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                        Modo de edición — los cambios se mantienen en memoria
                    </div>
                </div>
            )}

            {activeTab !== 'basic' && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-in fade-in duration-300">
                    <Info size={48} className="mb-4 opacity-50 text-sky-500" />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">Sección en Desarrollo</h3>
                    <p className="text-sm text-center max-w-md">
                        Esta pestaña ({tabs.find(t => t.id === activeTab)?.label}) estará disponible próximamente para guardar datos clínicos adicionales.
                    </p>
                </div>
            )}
        </form>

        {/* FLOATING SAVE BUTTON */}
        <div className="fixed bottom-8 right-8 z-50">
            <button 
                type="submit"
                form="new-patient-form"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-sky-500/30 hover:-translate-y-1 btn-lift disabled:opacity-70"
            >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {!loading && <Save size={16} />}
                Guardar Paciente
            </button>
        </div>
    </div>
  );
};

export default NuevoPacienteView;