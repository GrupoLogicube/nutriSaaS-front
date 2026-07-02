import React from 'react';
import {
    LayoutDashboard, Users, Calendar, Utensils,
    LogOut, FileText, Dumbbell, UsersRound,
    BarChart2, CreditCard, Settings
} from 'lucide-react';

const NutriSidebar = ({
    isOpen,
    user,
    activeView,
    setActiveView,
    onLogout
}) => {
    return (
        <aside className={`
            flex flex-col transition-all duration-300 border-r z-20
            bg-white dark:bg-[#0a1128] 
            border-slate-200 dark:border-slate-800/60
            ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'}
        `}>
            {/* LOGO */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold brand-font shadow-md">N</div>
                <span className="font-bold text-lg tracking-wide text-slate-800 dark:text-white brand-font font-semibold">
                    Nutri<span className="text-sky-500">SaaS</span>
                </span>
            </div>

            {/* PERFIL */}
            <div 
                onClick={() => setActiveView('settings')} 
                className="p-6 border-b border-slate-200 dark:border-slate-800 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                title="Ver Configuración de Cuenta"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white shadow-inner border border-slate-300 dark:border-slate-700 group-hover:border-sky-500 transition-colors">
                        {user.nombre ? user.nombre[0] : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-slate-700 dark:text-white font-semibold truncate block group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                            {user.nombre} {user.apellido}
                        </p>
                        <p className="text-xs text-sky-500 font-bold truncate group-hover:text-sky-600 dark:group-hover:text-sky-300">
                            Ver mi cuenta
                        </p>
                    </div>
                </div>
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">

                {/* CONSULTORIO */}
                <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Consultorio</div>

                <NavButton
                    active={activeView === 'dashboard'} 
                    onClick={() => setActiveView('dashboard')} 
                    icon={LayoutDashboard}
                    label="Panel de Control"
                />
                <NavButton
                    active={activeView === 'pacientes'}
                    onClick={() => setActiveView('pacientes')}
                    icon={Users}
                    label="Pacientes"
                />
                <NavButton
                    active={activeView === 'notas'}
                    onClick={() => setActiveView('notas')}
                    icon={FileText}
                    label="Notas"
                    badge="Beta"
                />
                <NavButton
                    active={activeView === 'agenda'}
                    onClick={() => setActiveView('agenda')}
                    icon={Calendar}
                    label="Citas"
                />

                {/* IA & HERRAMIENTAS */}
                <div className="px-3 pt-4 pb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Herramientas IA</div>

                <NavButton
                    active={activeView === 'dietas'}
                    onClick={() => setActiveView('dietas')}
                    icon={Utensils}
                    label="Generador de Dietas"
                />
                <NavButton
                    active={activeView === 'rutinas'}
                    onClick={() => setActiveView('rutinas')}
                    icon={Dumbbell}
                    label="Generador de Rutinas"
                />

                {/* GESTIÓN */}
                <div className="px-3 pt-4 pb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gestión</div>

                <NavButton
                    active={activeView === 'equipo'}
                    onClick={() => setActiveView('equipo')}
                    icon={UsersRound}
                    label="Equipo"
                />
                <NavButton
                    active={activeView === 'analytics'}
                    onClick={() => setActiveView('analytics')}
                    icon={BarChart2}
                    label="Analíticas"
                />
                <NavButton
                    active={activeView === 'suscripcion'}
                    onClick={() => setActiveView('suscripcion')}
                    icon={CreditCard}
                    label="Suscripción"
                />
                <NavButton
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                    icon={Settings}
                    label="Configuración"
                />
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-xs font-bold uppercase">
                    <LogOut size={14} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

// Subcomponente interno
const NavButton = ({ active, onClick, icon: Icon, label, badge }) => (
    <button onClick={onClick} className={`sidebar-item-enter nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border border-transparent
        ${active 
            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-500/20 shadow-[0_4px_12px_rgba(14,165,233,0.06)] font-bold' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
        }`}>
        <Icon size={18} />
        <span className="flex-1 text-left text-sm">{label}</span>
        {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-500 text-white rounded-full uppercase tracking-wide">
                {badge}
            </span>
        )}
    </button>
);

export default NutriSidebar;