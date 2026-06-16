import React from 'react';
import { 
  LayoutDashboard, Building2, Stethoscope, Utensils, 
  ArrowLeft, LogOut, Globe 
} from 'lucide-react';

const Sidebar = ({ 
    isOpen, 
    user, 
    selectedEmpresa, 
    activeView, 
    setActiveView, 
    goBackToGlobal, 
    goBackToEmpresas, // Recibimos la función
    onLogout 
}) => {
  return (
    <aside className={`bg-[#0a1128] text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800/60 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        {/* LOGO */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/60 bg-[#0a1128] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold brand-font shadow-md">N</div>
          <span className="font-bold text-lg tracking-wide text-white brand-font font-semibold">Nutri<span className="text-sky-400">SaaS</span></span>
        </div>
        
        {/* PERFIL */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-inner border border-slate-700">
              {user.nombre ? user.nombre[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold truncate block">{user.nombre}</p>
              <p className="text-xs text-sky-400 font-bold truncate">Super Admin</p>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {selectedEmpresa ? (
            // --- MENÚ DE TENANT (EMPRESA SELECCIONADA) ---
            <>
              {/* ZONA DE NAVEGACIÓN SUPERIOR */}
              <div className="px-3 py-2 mb-6 space-y-3">
                
                {/* 1. Botón Principal: Volver a la lista de empresas */}
                <button 
                    onClick={goBackToEmpresas} 
                    className="flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider transition-colors w-full group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                  Volver a Empresas
                </button>

                {/* 2. Botón Secundario: Volver al Dashboard Global */}
                <button 
                    onClick={goBackToGlobal} 
                    className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-wider transition-colors w-full"
                >
                  <Globe size={12} /> 
                  Ir al Global
                </button>

                {/* Separador y Título de la Empresa */}
                <div className="pt-3 mt-1 border-t border-slate-800/60">
                    <p className="text-[10px] text-slate-500 mb-1 uppercase">Gestionando:</p>
                    <p className="text-white font-bold truncate text-base">{selectedEmpresa.nombre}</p>
                </div>
              </div>

              {/* MENÚ OPERATIVO */}
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Gestión Clínica</div>
              
              <NavButton 
                active={activeView === 'nutricionistas'} 
                onClick={() => setActiveView('nutricionistas')} 
                icon={Stethoscope} 
                label="Nutricionistas" 
              />
              <NavButton 
                active={activeView === 'menus'} 
                onClick={() => setActiveView('menus')} 
                icon={Utensils} 
                label="Menús y Dietas" 
              />
            </>
          ) : (
            // --- MENÚ GLOBAL (SUPER ADMIN) ---
            <>
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Administración</div>
              <NavButton 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')} 
                icon={LayoutDashboard} 
                label="Resumen" 
              />
              <NavButton 
                active={activeView === 'empresas'} 
                onClick={() => setActiveView('empresas')} 
                icon={Building2} 
                label="Empresas" 
              />
            </>
          )}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800/60">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-bold uppercase">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>
  );
};

// Subcomponente interno para botones limpios
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.05)] font-bold' : 'text-slate-400 border border-transparent hover:bg-slate-800/40 hover:text-white'}`}>
        <Icon size={20} /> <span>{label}</span>
    </button>
);

export default Sidebar;