import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { InputGroup } from './FormComponents';

const FoodExchangeModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [region, setRegion] = useState('smae_mexico');
    const [portions, setPortions] = useState(initialData || {
        verduras: { desayuno: '', comida: '', cena: '', colaciones: '' },
        frutas: { desayuno: '', comida: '', cena: '', colaciones: '' },
        cereales: { desayuno: '', comida: '', cena: '', colaciones: '' },
        leguminosas: { desayuno: '', comida: '', cena: '', colaciones: '' },
        aoa: { desayuno: '', comida: '', cena: '', colaciones: '' },
        leche: { desayuno: '', comida: '', cena: '', colaciones: '' },
        aceites: { desayuno: '', comida: '', cena: '', colaciones: '' },
        azucares: { desayuno: '', comida: '', cena: '', colaciones: '' },
    });

    if (!isOpen) return null;

    const handlePortionChange = (group, meal, value) => {
        setPortions(prev => ({
            ...prev,
            [group]: { ...prev[group], [meal]: value }
        }));
    };

    const handleSave = () => {
        if (onSave) onSave({ region, portions });
        onClose();
    };

    const groups = [
        { id: 'verduras', label: 'Verduras' },
        { id: 'frutas', label: 'Frutas' },
        { id: 'cereales', label: 'Cereales (s/g)' },
        { id: 'leguminosas', label: 'Leguminosas' },
        { id: 'aoa', label: 'Alim. Origen Animal' },
        { id: 'leche', label: 'Leche' },
        { id: 'aceites', label: 'Aceites/Grasas' },
        { id: 'azucares', label: 'Azúcares' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        Tabla de Intercambio de Alimentos
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div className="bg-sky-50 dark:bg-sky-900/10 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30 flex gap-4">
                        <AlertCircle className="text-sky-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-sky-700 dark:text-sky-300 font-bold">Selecciona la base de datos regional</p>
                            <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                                Esto ajustará los promedios de calorías y macronutrientes por equivalente/porción.
                            </p>
                        </div>
                    </div>

                    <InputGroup 
                        label="Región / Base de datos" 
                        name="region" 
                        value={region} 
                        onChange={(e) => setRegion(e.target.value)} 
                        options={[
                            {value: 'smae_mexico', label: 'SMAE (México)'},
                            {value: 'taco', label: 'TACO (Brasil)'},
                            {value: 'usda', label: 'USDA (EEUU)'},
                            {value: 'latam', label: 'Tabla Genérica (Latinoamérica)'}
                        ]} 
                    />

                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 rounded-t-lg">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Grupo de Alimento</th>
                                    <th className="px-4 py-3">Desayuno</th>
                                    <th className="px-4 py-3">Comida</th>
                                    <th className="px-4 py-3">Cena</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Colaciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {groups.map(group => (
                                    <tr key={group.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300">{group.label}</td>
                                        {['desayuno', 'comida', 'cena', 'colaciones'].map(meal => (
                                            <td key={meal} className="px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    min="0" step="0.5"
                                                    value={portions[group.id][meal]} 
                                                    onChange={(e) => handlePortionChange(group.id, meal, e.target.value)}
                                                    className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm p-1 focus:ring-1 focus:ring-sky-500 outline-none text-center"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md transition-all"
                    >
                        <Save size={18} /> Guardar Distribución
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FoodExchangeModal;
