import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Maximize2, Minimize2, Send, Sparkles } from 'lucide-react';

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! Soy tu asistente MTEX. ¿En qué puedo ayudarte hoy en tu práctica clínica?", sender: "ai" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Agregar mensaje del usuario
        const newUserMsg = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");

        // Simular respuesta de la IA
        setTimeout(() => {
            const aiResponse = { 
                id: Date.now() + 1, 
                text: "Entiendo. Por el momento soy un componente visual de demostración, pero pronto podré procesar tus consultas reales sobre pacientes y citas.", 
                sender: "ai" 
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    // Si está cerrado, mostrar solo el botón de chat (burbuja flotante)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-sky-500/30 hover:scale-110 transition-transform z-50 animate-bounce"
            >
                <Bot size={28} />
            </button>
        );
    }

    // Configuración de tamaños según estado maximizado o no
    const widgetClasses = isMaximized
        ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh]"
        : "fixed bottom-6 right-6 w-80 md:w-96 h-[500px]";

    return (
        <div className={`${widgetClasses} bg-white dark:bg-[#0a1120] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-50 transition-all duration-300`}>
            {/* Header del Chat */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                        <Sparkles size={20} className="text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="font-bold leading-none">MTEX Assistant</h3>
                        <span className="text-[10px] text-sky-100 uppercase tracking-wider">NutriSaaS AI</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMaximized(!isMaximized)} className="hover:bg-white/20 p-1 rounded transition-colors">
                        {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-[#020813] space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-sky-500 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Formulario de Input */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#0a1120] border-t border-slate-200 dark:border-slate-800 shrink-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pregúntale a la IA..."
                        className="w-full bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-transparent dark:border-slate-800 text-sm transition-shadow"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim()}
                        className="absolute right-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-400 text-white p-2 rounded-full transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-600">La IA puede cometer errores. Considera verificar la información.</span>
                </div>
            </form>
        </div>
    );
}
