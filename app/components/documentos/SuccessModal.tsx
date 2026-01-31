"use client";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1F1F1F] border border-sgd-border max-w-md w-full p-8 text-center relative rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Ícone de Sucesso */}
        <div className="mx-auto w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-6 border border-green-800/50">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Documento Gerado!</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Os dados foram processados com sucesso. O download do arquivo PDF iniciará automaticamente em instantes.
        </p>

        <button 
          onClick={onClose}
          className="w-full bg-sgd-gold hover:bg-[#b09030] text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-900/20"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}