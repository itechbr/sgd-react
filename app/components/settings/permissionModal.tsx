"use client";

import Toggle from "../../components/settings/toggle";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl w-full max-w-lg p-6 text-[#E0E0E0] shadow-xl">

        <h2 className="text-xl font-semibold text-[#E6C850] mb-4">
          Permissões do Sistema
        </h2>

        <div className="space-y-4">
          <Toggle
            label="Aluno pode enviar prorrogação"
            checked={permissions.alunoEnviarProrrogacao}
            onChange={(v) =>
              setPermissions({
                ...permissions,
                alunoEnviarProrrogacao: v,
              })
            }
          />

          <Toggle
            label="Aluno pode agendar defesa"
            checked={permissions.alunoAgendarDefesa}
            onChange={(v) =>
              setPermissions({
                ...permissions,
                alunoAgendarDefesa: v,
              })
            }
          />

          <Toggle
            label="Orientador pode criar banca"
            checked={permissions.orientadorCriarBanca}
            onChange={(v) =>
              setPermissions({
                ...permissions,
                orientadorCriarBanca: v,
              })
            }
          />

          <Toggle
            label="Orientador pode editar notas"
            checked={permissions.orientadorEditarNotas}
            onChange={(v) =>
              setPermissions({
                ...permissions,
                orientadorEditarNotas: v,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#333] text-white hover:bg-[#444] transition"
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
