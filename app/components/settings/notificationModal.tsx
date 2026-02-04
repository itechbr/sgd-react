"use client";

import Toggle from "../../components/settings/toggle";
import { type Settings } from "../../services/settingsService";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl w-full max-w-lg p-6 text-[#E0E0E0] shadow-xl">

        <h2 className="text-xl font-semibold text-[#E6C850] mb-4">
          Notificações e Lembretes
        </h2>

        <div className="space-y-4">
          <Toggle
            label="Receber notificações por e-mail"
            checked={settings.email}
            onChange={(v) =>
              setSettings({ ...settings, email: v })
            }
          />

          <Toggle
            label="Receber notificações no sistema"
            checked={settings.system}
            onChange={(v) =>
              setSettings({ ...settings, system: v })
            }
          />

          <div>
            <label className="block text-sm text-[#AAAAAA] mb-2">
              Avisar antes do prazo
            </label>
            <select
              value={settings.deadlineReminder}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  deadlineReminder: e.target.value,
                })
              }
              className="w-full bg-[#2A2A2A] text-white p-3 border border-[#444] rounded focus:border-[#C0A040]"
            >
              <option value="1">1 dia antes</option>
              <option value="3">3 dias antes</option>
              <option value="7">7 dias antes</option>
              <option value="14">14 dias antes</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#333] hover:bg-[#444] transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
