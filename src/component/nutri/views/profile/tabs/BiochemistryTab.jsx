import React from 'react';
import { Droplet, Activity, Heart, TestTube } from 'lucide-react';
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const BiochemistryTab = ({ patient, setPatient, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TARJETA 1: Perfil Lipídico y Glucémico */}
        <Card title="Perfil Lipídico y Glucémico" icon={Droplet}>
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Glucosa en Ayunas" type="number" name="glucosa" value={patient.glucosa} onChange={onChange} suffix="mg/dL" />
                    <InputGroup label="Hemoglobina Glucosilada (HbA1c)" type="number" name="hemoglobina" value={patient.hemoglobina} onChange={onChange} suffix="%" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <InputGroup label="Colesterol Total" type="number" name="colesterol" value={patient.colesterol} onChange={onChange} suffix="mg/dL" />
                    <InputGroup label="Triglicéridos" type="number" name="trigliceridos" value={patient.trigliceridos} onChange={onChange} suffix="mg/dL" />
                </div>
            </div>
        </Card>

        {/* TARJETA 2: Función Renal y Presión */}
        <Card title="Función Renal y Signos Vitales" icon={Activity}>
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Creatinina" type="number" step="0.1" name="creatinina" value={patient.creatinina} onChange={onChange} suffix="mg/dL" />
                    <InputGroup label="Presión Arterial" name="presionArterial" value={patient.presionArterial} onChange={onChange} placeholder="Ej. 120/80" suffix="mmHg" />
                </div>
            </div>
        </Card>
      </div>

    </div>
  );
};

export default BiochemistryTab;
