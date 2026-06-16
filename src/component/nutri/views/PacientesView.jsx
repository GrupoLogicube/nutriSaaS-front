import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, MoreVertical, Filter } from 'lucide-react';
import PerfilPaciente from './PerfilPaciente'; 

const PacientesView = ({ user, onViewChange }) => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 2. ESTADO PARA NAVEGACIÓN ---
    const [selectedPatient, setSelectedPatient] = useState(null);

    // --- 3. PACIENTE ESTÁTICO DE EJEMPLO ---
    // Este objeto tiene la estructura necesaria para que PerfilPaciente no falle
    const pacienteEjemplo = {
        id: 'static-1',
        nombre: 'Juan Pérez', // Para el perfil
        cedula: '1712345678',
        sexo: 'hombre', // Minúsculas para coincidir con selects
        edad: 30,
        peso: 85,
        altura: 178,
        ocupacion: 'Arquitecto',
        tipoConsulta: 'presencial',
        // Datos dummy para gráficos
        patronIngesta: { 
            desayuno: { hora: '08:00', detalle: 'Huevos y café' }, 
            colacion1: { hora: '11:00', detalle: 'Manzana' },
            almuerzo: { hora: '14:00', detalle: 'Pollo y arroz' },
            colacion2: { hora: '17:00', detalle: 'Yogurt' },
            cena: { hora: '20:00', detalle: 'Ensalada' },
            extra: { hora: '', detalle: '' }
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchPacientes();
        }
    }, [user]);

    const fetchPacientes = async () => {
      setLoading(true);
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
              setPacientes(Array.isArray(data) ? data : []);
          }
      } catch (err) {
          console.error("Error fetching patients:", err);
      } finally {
          setLoading(false);
      }
  };

  const handleSavePaciente = (newPatient) => {
      setPacientes([newPatient, ...pacientes]);
  };

  // Solo datos reales de la API
  const filteredPacientes = pacientes.filter(p =>
      p.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cedula?.includes(searchTerm)
  );

    // --- 5. RENDERIZADO CONDICIONAL DE VISTAS ---
    
    // VISTA A: SI HAY UN PACIENTE SELECCIONADO, MOSTRAMOS SU PERFIL
    if (selectedPatient) {
        return (
            <PerfilPaciente 
                patientData={selectedPatient} 
                onBack={() => setSelectedPatient(null)} // Callback para volver
            />
        );
    }

    // VISTA B: SI NO, MOSTRAMOS LA LISTA (El código original mejorado)
    return (
        <div className="bg-white dark:bg-[#020813] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white brand-font flex items-center gap-2">
                        <Users className="text-sky-600" size={24} /> Mis Pacientes
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Gestión de expedientes clínicos electrónicos</p>
                </div>
                <button
                    onClick={() => onViewChange('nuevo_paciente')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition-all btn-lift"
                >
                    <Plus size={18} /> Nuevo Paciente
                </button>
            </div>

            {/* Barra de Herramientas */}
            <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-sky-500 dark:text-white dark:placeholder-slate-400 transition-all text-sm"
                    />
                </div>
                <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-sky-600 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                    </div>
                ) : filteredPacientes.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Users size={32} />
                        </div>
                        <p className="text-slate-500 font-medium mb-1">
                            {searchTerm ? 'No se encontraron pacientes.' : 'No tienes pacientes registrados aún.'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-3 text-sm font-bold text-sky-500 hover:underline"
                            >
                                + Agregar primer paciente
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredPacientes.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setSelectedPatient(p)}
                                className="flex items-center justify-between p-4 bg-white dark:bg-[#0a1128] border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-500/50 hover:shadow-md rounded-2xl transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {(p.nombre_completo || p.nombre || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 dark:text-white group-hover:text-sky-600 transition-colors">
                                            {p.nombre_completo}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                            {p.cedula && <span>C.I. {p.cedula}</span>}
                                            {p.sexo_biologico && (
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${p.sexo_biologico.toLowerCase() === 'mujer' ? 'bg-pink-50 text-pink-500 dark:bg-pink-900/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20'}`}>
                                                    {p.sexo_biologico}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="block text-xs font-bold text-slate-500">Última consulta</span>
                                        <span className="text-xs text-slate-400">--/--/----</span>
                                    </div>
                                    <button className="text-slate-300 hover:text-sky-600 p-2 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default PacientesView;