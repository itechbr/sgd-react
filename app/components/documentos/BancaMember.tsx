"use client";

import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect"; // <--- Importando o componente existente

interface BancaMemberProps {
  index: number;
  isOrientador?: boolean;
  onRemove?: () => void;
}

export default function BancaMember({ index, isOrientador = false, onRemove }: BancaMemberProps) {
  return (
    <div className={`p-4 rounded-xl border ${isOrientador ? 'bg-[#252010] border-sgd-gold/30' : 'bg-[#151515] border-sgd-border'} transition-all`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`text-sm font-bold uppercase tracking-wider ${isOrientador ? 'text-sgd-gold' : 'text-gray-500'}`}>
          {isOrientador ? "Presidente / Orientador" : `Examinador ${index}`}
        </h4>
        
        {!isOrientador && onRemove && (
          <button 
            type="button" 
            onClick={onRemove} 
            className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 bg-red-900/10 px-2 py-1 rounded transition-colors"
          >
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Nome ocupa 2 colunas */}
        <div className="lg:col-span-2">
            <FormInput name={`membro_${index}_nome`} label="Nome Completo" placeholder="Nome do Professor" required />
        </div>
        
        <FormInput name={`membro_${index}_cpf`} label="Matrícula / CPF" placeholder="Apenas números" required />
        
        {/* Substituindo Select Nativo por FormSelect */}
        <FormSelect 
            name={`membro_${index}_tipo`} 
            label="Tipo de Membro"
        >
            <option value="interno">Interno (IFPB)</option>
            <option value="externo">Externo</option>
        </FormSelect>

        <div className="lg:col-span-2">
            <FormInput name={`membro_${index}_email`} label="E-mail" type="email" />
        </div>

        <FormInput name={`membro_${index}_telefone`} label="Telefone" />
        
        {/* Substituindo Select Nativo por FormSelect */}
        <FormSelect 
            name={`membro_${index}_participacao`} 
            label="Participação"
        >
            <option value="virtual">Virtual / Remota</option>
            <option value="presencial">Presencial</option>
        </FormSelect>

      </div>
    </div>
  );
}