"use client";

import Toggle from "./toggle"; // Verifique se o caminho está correto
import {
  type Permissions,
  savePermissions,
} from "../../services/permissionsService";

type PermissionsModalProps = {
  open: boolean;
  permissions: Permissions;
  setPermissions: (p: Permissions) => void;
  onClose: () => void;
};

export default function PermissionsModal({
  open,
  permissions,
  setPermissions,
  onClose,
}: PermissionsModalProps) {
  if (!open) return null;

  function salvar() {
    savePermissions(permissions);
    onClose();
  }

  // Proteção contra undefined (Fallback)
  const safePerms = permissions || {
    alunoEnviarProrrogacao: false,
    alunoAgendarDefesa: false,
    orientadorCriarBanca: false,
    orientadorEditarNotas: false,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl w-full max-w-lg p-6 text-[#E0E0E0] shadow-xl">

        <h2 className="text-xl font-semibold text-[#E6C850] mb-4">
          Permissões do Sistema
        </h2>

        <div className="space-y-4">
          <Toggle
            label="Aluno pode enviar prorrogação"
            checked={safePerms.alunoEnviarProrrogacao}
            onChange={(v) =>
              setPermissions({ ...safePerms, alunoEnviarProrrogacao: v })
            }
          />

          <Toggle
            label="Aluno pode agendar defesa"
            checked={safePerms.alunoAgendarDefesa}
            onChange={(v) =>
              setPermissions({ ...safePerms, alunoAgendarDefesa: v })
            }
          />

          <Toggle
            label="Orientador pode criar banca"
            checked={safePerms.orientadorCriarBanca}
            onChange={(v) =>
              setPermissions({ ...safePerms, orientadorCriarBanca: v })
            }
          />

          <Toggle
            label="Orientador pode editar notas"
            checked={safePerms.orientadorEditarNotas}
            onChange={(v) =>
              setPermissions({ ...safePerms, orientadorEditarNotas: v })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-[#333] text-[#E0E0E0] hover:bg-[#333] transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            className="px-4 py-2 rounded bg-[#C0A040] text-black font-semibold hover:bg-[#E6C850] transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}