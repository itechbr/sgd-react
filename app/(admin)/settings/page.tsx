"use client";

import { useEffect, useState } from "react";
import PermissionsModal from "../../components/settings/permissionModal";
import NotificationsModal from "../../components/settings/notificationModal";

import {
  loadSettings,
  saveSettings,
  resetSettings,
  DEFAULT_SETTINGS,
  type Settings,
} from "../../services/settingsService";

import {
  loadPermissions,
  DEFAULT_PERMISSIONS,
  type Permissions,
} from "../../services/permissionsService";

function Section({
  title,
  description,
  onConfigure,
}: {
  title: string;
  description: string;
  onConfigure: () => void;
}) {
  return (
    <div className="bg-[#181818] p-5 rounded-xl border border-[#333333] flex justify-between items-center">
      <div>
        <h3 className="text-[#E6C850] font-semibold text-lg">
          {title}
        </h3>
        <p className="text-sm text-[#AAAAAA]">
          {description}
        </p>
      </div>

      <button
        onClick={onConfigure}
        className="bg-[#C0A040] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition"
      >
        Configurar
      </button>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] =
    useState<Settings>(DEFAULT_SETTINGS);

  const [permissions, setPermissions] =
    useState<Permissions>(DEFAULT_PERMISSIONS);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [permissionsOpen, setPermissionsOpen] =
    useState(false);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setPermissions(loadPermissions());
  }, []);

  function salvarConfiguracoes() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function restaurarPadrao() {
    setSettings(resetSettings());
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8 flex justify-center text-[#E0E0E0]">
      <div className="bg-[#1F1F1F] p-8 rounded-xl w-full max-w-4xl border border-[#333333]">

        <h2 className="text-2xl font-semibold text-[#E6C850] mb-6">
          Configurações Gerais
        </h2>

        <div className="space-y-6">
          <Section
            title="Notificações e Lembretes"
            description="Gerencie avisos e prazos do sistema"
            onConfigure={() => setNotificationsOpen(true)}
          />

          <Section
            title="Permissões de Usuário"
            description="Controle ações de alunos e orientadores"
            onConfigure={() => setPermissionsOpen(true)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          {saved && (
            <span className="text-sm text-green-500 self-center">
              Configurações salvas ✔
            </span>
          )}

          <button
            onClick={restaurarPadrao}
            className="px-5 py-2 rounded bg-[#333] hover:bg-[#444]"
          >
            Restaurar
          </button>

          <button
            onClick={salvarConfiguracoes}
            className="px-5 py-2 rounded bg-[#C0A040] text-black font-semibold hover:bg-[#E6C850]"
          >
            Salvar
          </button>
        </div>
      </div>

      <NotificationsModal
        open={notificationsOpen}
        settings={settings}
        setSettings={setSettings}
        onClose={() => setNotificationsOpen(false)}
      />

      <PermissionsModal
        open={permissionsOpen}
        permissions={permissions}
        setPermissions={setPermissions}
        onClose={() => setPermissionsOpen(false)}
      />
    </div>
  );
}
