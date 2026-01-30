type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SuccessModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="card-std w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-sgd-border">
          <h3 className="text-lg font-semibold text-sgd-gold">
            Formulário Enviado
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-6 text-sm">
          Os dados do formulário foram validados com sucesso.
        </div>

        <div className="p-4 border-t border-sgd-border flex justify-end">
          <button onClick={onClose} className="btn-primary px-6 py-2 text-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
