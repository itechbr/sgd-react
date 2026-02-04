"use client";

import Toggle from "./toggle";
import { type Settings, DEFAULT_SETTINGS } from "../../services/settingsService";
// Certifique-se de importar o FormSelect corretamente
import { FormSelect } from "@/app/components/ui/FormSelect"; 

type NotificationsModalProps = {
  open: boolean;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onClose: () => void;
};

export default function NotificationsModal({
  open,
  settings,
  setSettings,
  onClose,
}: NotificationsModalProps) {
  if (!open) return null;

  // CORREÇÃO DO ERRO: Garante que settings nunca seja nulo na renderização
  const safeSettings = settings || DEFAULT_SETTINGS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl w-full max-w-lg p-6 text-[#E0E0E0] shadow-xl">

        <h2 className="text-xl font-semibold text-[#E6C850] mb-6 border-b border-[#333] pb-4">
          Notificações e Lembretes
        </h2>

        <div className="space-y-6">
          <Toggle
            label="Receber notificações por e-mail"
            checked={safeSettings.email}
            onChange={(v) =>
              setSettings({ ...safeSettings, email: v })
            }
          />

          <Toggle
            label="Receber notificações no sistema"
            checked={safeSettings.system}
            onChange={(v) =>
              setSettings({ ...safeSettings, system: v })
            }
          />

          <div className="pt-2">
            <FormSelect
              label="Lembrete de Prazos (Antecedência)"
              name="deadlineReminder"
              value={safeSettings.deadlineReminder || "3"}
              onChange={(e) =>
                setSettings({
                  ...safeSettings,
                  deadlineReminder: e.target.value,
                })
              }
            >
              <option value="1">1 dia antes</option>
              <option value="3">3 dias antes</option>
              <option value="7">7 dias antes</option>
              <option value="14">14 dias antes</option>
            </FormSelect>
            <p className="text-xs text-[#666] mt-1 ml-1">
              Define quando o sistema deve enviar alertas automáticos sobre defesas.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#333]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-[#333] text-[#E0E0E0] hover:bg-[#333] transition"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}