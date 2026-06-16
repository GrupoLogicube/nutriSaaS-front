import React, { useState, useEffect, useRef } from 'react';

import NutriSidebar from './layout/NutriSidebar';
import Header from '../admin/layout/Header';
import PacientesView from './views/PacientesView';
import ResumenView from './views/ResumenView';
import AgendaView from './views/AgendaView';
import PerfilPaciente from './views/PerfilPaciente';
import SettingsView from './views/SettingsView';
import DietGeneratorView from './views/DietGeneratorView';
import NotesView from './views/NotesView';
import WorkoutGeneratorView from './views/WorkoutGeneratorView';
import TeamView from './views/TeamView';
import AnalyticsView from './views/AnalyticsView';
import SubscriptionView from './views/SubscriptionView';
import NuevoPacienteView from '../Pacientes/NuevoPacienteView';

// ─── Animated Page Wrapper ────────────────────────────────────────────────────
// Uses a key trick: when activeView changes, the component unmounts/remounts
// triggering the CSS entry animation.
const AnimatedPage = ({ viewKey, children }) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Force re-trigger animation on key change
        el.classList.remove('page-enter');
        void el.offsetWidth; // reflow
        el.classList.add('page-enter');
    }, [viewKey]);

    return (
        <div ref={ref} className="page-enter h-full">
            {children}
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const NutriDashboard = ({ user, onLogout, isDark, toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Track previous view to decide transition direction (future use)
    const prevViewRef = useRef('dashboard');

    const handleViewChange = (view) => {
        prevViewRef.current = activeView;
        setActiveView(view);
    };

    const handleGoToPatient = (patientData) => {
        setSelectedPatient(patientData);
        handleViewChange('paciente_detail');
    };

    // Glow effect on cards (mouse tracking)
    useEffect(() => {
        const handleMouseMove = (e) => {
            const cards = document.querySelectorAll('.glow-on-hover');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        };
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (!user) return null;

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <ResumenView
                        user={user}
                        onViewChange={handleViewChange}
                        onGoToPatient={handleGoToPatient}
                    />
                );
            case 'pacientes':
                return <PacientesView user={user} onViewChange={handleViewChange} />;
            case 'nuevo_paciente':
                return <NuevoPacienteView user={user} onViewChange={handleViewChange} />;
            case 'paciente_detail':
                return (
                    <PerfilPaciente
                        patientData={selectedPatient}
                        onBack={() => handleViewChange('dashboard')}
                    />
                );
            case 'notas':
                return <NotesView user={user} />;
            case 'agenda':
                return <AgendaView user={user} />;
            case 'dietas':
                return <DietGeneratorView user={user} />;
            case 'rutinas':
                return <WorkoutGeneratorView user={user} />;
            case 'equipo':
                return <TeamView user={user} />;
            case 'analytics':
                return <AnalyticsView user={user} />;
            case 'suscripcion':
                return <SubscriptionView user={user} onViewChange={handleViewChange} />;
            case 'settings':
                return <SettingsView user={user} onViewChange={handleViewChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-sky-50/30 dark:bg-[#020813] font-sans text-sm transition-colors duration-300 overflow-hidden">

            {/* Sidebar */}
            <NutriSidebar
                isOpen={sidebarOpen}
                user={user}
                activeView={activeView}
                setActiveView={handleViewChange}
                onLogout={onLogout}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    selectedEmpresa={user.empresaConfig}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />

                <main className="flex-1 overflow-y-auto bg-sky-50/30 dark:bg-[#020813] p-6 transition-colors duration-300 custom-scrollbar">
                    <div className="container mx-auto max-w-7xl">
                        <AnimatedPage viewKey={activeView}>
                            {renderView()}
                        </AnimatedPage>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NutriDashboard;