import React, { useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle2, BrainCircuit, Activity, Shield, Moon, Sun, ArrowRight, Play, Check } from 'lucide-react';
import logoNutri from '../../assets/logonutriaserio.png';

export default function LandingPage({ onLoginClick, isDark, toggleTheme }) {
    
    // Configuración de animaciones al hacer scroll (Efecto Reveal)
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animamos solo una vez
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen font-sans bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden selection:bg-sky-500/30">
            
            {/* ESTILOS INTERNOS PARA ANIMACIONES PREMIUM */}
            <style>{`
                /* REVEAL ANIMATIONS */
                .reveal { opacity: 0; transform: translateY(50px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-right { opacity: 0; transform: translateX(50px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
                
                .active { opacity: 1 !important; transform: translate(0) scale(1) !important; }

                /* DELAYS */
                .delay-100 { transition-delay: 100ms; }
                .delay-200 { transition-delay: 200ms; }
                .delay-300 { transition-delay: 300ms; }

                /* FLOATING EFECTOS */
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }

                /* MESH BACKGROUNDS */
                .mesh-bg {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%);
                    z-index: 0;
                    pointer-events: none;
                }
                
                /* GLOW BORDERS */
                .glow-border {
                    position: relative;
                }
                .glow-border::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: inherit;
                    background: linear-gradient(120deg, rgba(14, 165, 233, 0.5), transparent, rgba(16, 185, 129, 0.5));
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                .glow-border:hover::before {
                    opacity: 1;
                }
            `}</style>

            <div className="mesh-bg"></div>

            {/* NAV BAR FLOTANTE (ESTILO MEETHEALTH) */}
            <header className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1200px] z-50 rounded-full bg-white/70 dark:bg-[#0a1128]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <div className="px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
                        <img src={logoNutri} alt="Logo" className="h-8 w-auto object-contain group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
                            Nutri<span className="text-sky-500">SaaS</span>
                        </span>
                    </div>
                    
                    {/* Links Centrados */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-300">
                        <a href="#producto" className="hover:text-sky-500 transition-colors">Producto</a>
                        <a href="#soluciones" className="hover:text-sky-500 transition-colors">Soluciones</a>
                        <a href="#precios" className="hover:text-sky-500 transition-colors">Precios</a>
                    </nav>

                    {/* Controles y CTA */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="hidden sm:block text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-sky-500/20 flex items-center gap-2"
                        >
                            Empezar <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-40 md:pt-48 pb-10 px-6 relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center">
                
                <div className="reveal">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 hover:border-sky-500/50 cursor-pointer transition-colors shadow-sm">
                        <span className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">NUEVO</span>
                        Descubre nuestra IA Nutricional
                        <ArrowRight size={14} className="ml-1 text-sky-500" />
                    </div>
                </div>
                
                <h1 className="reveal delay-100 text-6xl md:text-[5.5rem] font-extrabold mb-6 leading-[1.05] tracking-tight text-slate-900 dark:text-white max-w-4xl drop-shadow-sm">
                    Revoluciona tu <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400">clínica nutricional.</span>
                </h1>
                
                <p className="reveal delay-200 text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
                    Software moderno que automatiza el cálculo de dietas, organiza tu agenda y enamora a tus pacientes. Diseñado para que fluya.
                </p>
                
                <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-20">
                    <button 
                        onClick={onLoginClick} 
                        className="h-14 px-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:scale-105 transition-all whitespace-nowrap shadow-xl shadow-sky-500/20 flex items-center gap-2 group"
                    >
                        Probar gratis ahora <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        className="h-14 px-8 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-sky-500 dark:hover:border-sky-400 transition-all shadow-sm flex items-center gap-2 group"
                    >
                        <Play size={18} className="text-sky-500 fill-sky-500/20 group-hover:fill-sky-500 transition-colors" /> Ver demo
                    </button>
                </div>

                {/* MOCKUP INTERACTIVO Y ANIMADO */}
                <div className="reveal-scale delay-200 w-full max-w-5xl rounded-[2rem] border border-slate-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden bg-white dark:bg-[#050B14] relative animate-float-slow">
                    
                    {/* Fake Browser Toolbar */}
                    <div className="h-14 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-[#0a1128]/80 backdrop-blur-md flex items-center px-6 gap-2">
                        <div className="flex gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-red-400/90 shadow-sm shadow-red-400/20"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90 shadow-sm shadow-amber-400/20"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-sm shadow-emerald-400/20"></div>
                        </div>
                        <div className="mx-auto bg-white dark:bg-[#020813] border border-slate-200 dark:border-white/5 h-8 w-1/3 rounded-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium font-mono">
                            nutrisaas.app/dashboard
                        </div>
                    </div>
                    
                    {/* Mockup UI Inner */}
                    <div className="flex h-[400px] md:h-[600px] bg-white dark:bg-[#050B14] p-2">
                        
                        {/* Sidebar Fake */}
                        <div className="w-64 h-full bg-slate-50 dark:bg-[#0a1128]/50 rounded-2xl border border-slate-100 dark:border-white/5 p-4 hidden md:flex flex-col gap-6">
                            <div className="flex items-center gap-3 px-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-sky-500"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                            </div>
                            <div className="space-y-3">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`h-10 rounded-xl px-4 flex items-center gap-3 ${i===1 ? 'bg-white dark:bg-[#050B14] border border-slate-200 dark:border-slate-800 shadow-sm' : ''}`}>
                                        <div className={`w-5 h-5 rounded-md ${i===1 ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Fake */}
                        <div className="flex-1 h-full p-4 md:p-8 flex flex-col gap-8 overflow-hidden relative">
                            {/* Gradients decorativos en el fondo del dashboard */}
                            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-sky-500/10 dark:bg-sky-500/20 blur-3xl rounded-full pointer-events-none"></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-2"></div>
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-64"></div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-6">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-32 bg-white dark:bg-[#0a1128] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50"></div>
                                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 bg-white dark:bg-[#0a1128] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden p-6">
                                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-8"></div>
                                <div className="flex items-end gap-4 h-32 mt-auto absolute bottom-6 left-6 right-6">
                                    {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-500/20 to-sky-400/80" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGOS CONFIANZA */}
            <section className="py-12 bg-transparent relative z-10">
                <div className="max-w-[1200px] mx-auto px-6 text-center reveal">
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest">Equipos de nutricionistas que confían en nosotros</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 dark:opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-2xl font-bold font-serif">Klinic.</div>
                        <div className="text-2xl font-black tracking-tighter">NutriCorp</div>
                        <div className="text-2xl font-semibold italic">WellHealth</div>
                        <div className="text-2xl font-light">BioMed</div>
                    </div>
                </div>
            </section>

            {/* SECCIONES ZIG-ZAG INTERACTIVAS */}
            <section id="producto" className="py-32 px-6 max-w-[1200px] mx-auto space-y-40 relative z-10">
                
                {/* Bloque 1 */}
                <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 order-2 md:order-1 reveal-left">
                        <div className="w-full h-[450px] rounded-[2.5rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#0a1128] dark:to-[#050B14] border border-slate-200 dark:border-white/5 shadow-2xl relative flex items-center justify-center p-8 glow-border overflow-hidden">
                            {/* Deco UI Element */}
                            <div className="absolute top-10 left-10 w-24 h-24 bg-sky-500/20 blur-2xl rounded-full"></div>
                            <div className="w-full h-full bg-white dark:bg-[#020813] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4 animate-float-slow">
                                <div className="flex items-center gap-4 mb-4">
                                    <BrainCircuit className="text-sky-500 w-8 h-8" />
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                                </div>
                                <div className="h-12 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-500/20 w-full"></div>
                                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 w-full"></div>
                                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 w-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2 reveal-right">
                        <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 shadow-inner border border-sky-200 dark:border-sky-500/20">
                            <BrainCircuit size={28} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">Crea dietas perfectas en un abrir y cerrar de ojos.</h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                            Nuestra Inteligencia Artificial procesa el expediente de tu paciente y genera una dieta semanal completa, respetando alergias y objetivos calóricos.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-slate-800 dark:text-slate-300 font-medium"><Check className="text-sky-500 w-6 h-6" /> Bases de datos USDA actualizadas</li>
                            <li className="flex items-center gap-4 text-slate-800 dark:text-slate-300 font-medium"><Check className="text-sky-500 w-6 h-6" /> Equivalencias y sustitutos automáticos</li>
                        </ul>
                    </div>
                </div>

                {/* Bloque 2 */}
                <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 reveal-left">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner border border-emerald-200 dark:border-emerald-500/20">
                            <Activity size={28} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">Seguimiento que motiva a tus pacientes.</h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                            Lleva el control de medidas corporales, peso y grasa corporal con gráficos interactivos hermosos que tus pacientes amarán ver.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-slate-800 dark:text-slate-300 font-medium"><Check className="text-emerald-500 w-6 h-6" /> Portal para el paciente 24/7</li>
                            <li className="flex items-center gap-4 text-slate-800 dark:text-slate-300 font-medium"><Check className="text-emerald-500 w-6 h-6" /> Recordatorios automáticos por mail</li>
                        </ul>
                    </div>
                    <div className="flex-1 reveal-right">
                        <div className="w-full h-[450px] rounded-[2.5rem] bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-[#0a1128] dark:to-[#050B14] border border-slate-200 dark:border-white/5 shadow-2xl relative flex items-center justify-center p-8 glow-border overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full"></div>
                            <div className="w-full h-full bg-white dark:bg-[#020813] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden animate-float-slow" style={{animationDelay: '-3s'}}>
                                <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 px-6 h-3/4">
                                    {[30, 45, 60, 50, 75, 90, 100].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-500/10 to-emerald-400" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRECIOS */}
            <section id="precios" className="py-32 px-6 max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20 reveal">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">Empieza gratis. Mejora cuando quieras.</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Sin tarjetas de crédito. Sin contratos.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Básico */}
                    <div className="reveal-scale p-10 rounded-[2.5rem] bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-xl flex flex-col hover:border-slate-300 dark:hover:border-slate-600 transition-colors glow-border">
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Starter</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Ideal para probar la plataforma.</p>
                        <div className="mb-10">
                            <span className="text-6xl font-black text-slate-900 dark:text-white">$0</span><span className="text-slate-500">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-slate-400 dark:text-slate-500" /> Hasta 10 pacientes</li>
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-slate-400 dark:text-slate-500" /> Historias clínicas</li>
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-slate-400 dark:text-slate-500" /> Agenda básica</li>
                        </ul>
                        <button className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold transition-colors">
                            Crear cuenta gratuita
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="reveal-scale delay-200 p-10 rounded-[2.5rem] bg-white dark:bg-[#0a1128] border-2 border-sky-500 shadow-2xl shadow-sky-500/20 flex flex-col relative transform md:-translate-y-4 glow-border">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
                            Lo más popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Profesional</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Todo lo que necesitas para tu clínica.</p>
                        <div className="mb-10">
                            <span className="text-6xl font-black text-slate-900 dark:text-white">$29</span><span className="text-slate-500 dark:text-slate-400">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-sky-500" /> Pacientes ilimitados</li>
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-sky-500" /> Dietas con Inteligencia Artificial</li>
                            <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300"><CheckCircle2 className="text-sky-500" /> Portal para pacientes</li>
                        </ul>
                        <button className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-colors shadow-lg shadow-sky-500/20">
                            Comenzar prueba de 14 días
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Final Giant */}
            <section className="py-24 px-6 relative z-10 max-w-[1200px] mx-auto reveal-scale">
                <div className="w-full rounded-[3rem] bg-gradient-to-r from-sky-500 to-blue-600 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-sky-500/20">
                    <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 relative z-10 leading-tight">Empieza a optimizar <br />tu tiempo hoy mismo.</h2>
                    <p className="text-sky-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto relative z-10 font-medium">
                        Configura tu consultorio en menos de 2 minutos.
                    </p>
                    <button onClick={onLoginClick} className="relative z-10 bg-white text-blue-600 px-10 py-5 rounded-full font-extrabold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                        Comenzar ahora gratis <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer Limpio */}
            <footer className="py-16 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto border-t border-slate-200 dark:border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <img src={logoNutri} alt="NutriSaaS Logo" className="h-8 w-auto grayscale opacity-60" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Nutri<span className="text-slate-400">SaaS</span>
                        </span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} NutriSaaS. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
