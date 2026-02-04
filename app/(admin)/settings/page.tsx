"use client";

import { useEffect, useState } from "react";
import { Bell, Shield, Save, RefreshCw } from "lucide-react"; // Adicione ícones se tiver lucide-react
import PermissionsModal from "../../components/settings/permissionModal";
import NotificationsModal from "../../components/settings/notificationModal";
import { useNotification } from "@/app/providers"; // Seu hook de notificação global

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

function SettingsCard({
  title,
  description,
  icon: Icon,
  onConfigure,
}: {
  title: string;
  description: string;
  icon: any;
  onConfigure: () => void;
}) {
  return (
    <div className="bg-[#181818] p-6 rounded-xl border border-[#333333] hover:border-[#555] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#252525] rounded-lg text-[#C0A040] group-hover:bg-[#C0A040] group-hover:text-black transition-colors">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-[#E0E0E0] font-semibold text-lg">{title}</h3>
          <p className="text-sm text-[#AAAAAA] mt-1">{description}</p>
        </div>
      </div>

      <button
        onClick={onConfigure}
        className="bg-[#333] text-white border border-[#444] px-4 py-2 rounded font-medium text-sm hover:bg-[#C0A040] hover:text-black hover:border-[#C0A040] transition w-full sm:w-auto"
      >
        Configurar
      </button>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [permissions, setPermissions] = useState<Permissions>(DEFAULT_PERMISSIONS);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  useEffect(() => {
    try {
      const s = loadSettings();
      const p = loadPermissions();
      setSettings(s || DEFAULT_SETTINGS);
      setPermissions(p || DEFAULT_PERMISSIONS);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  function salvarConfiguracoes() {
    setLoading(true);
    setTimeout(() => {
      saveSettings(settings);     
      notify("Configurações salvas com sucesso!", "success");
      setLoading(false);
    }, 600);
  }

  function restaurarPadrao() {
    if (confirm("Tem certeza? Isso redefinirá todas as configurações locais.")) {
      const defaults = resetSettings();
      setSettings(defaults);
      notify("Configurações restauradas para o padrão.", "info");
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 md:p-8 flex justify-center text-[#E0E0E0]">
      <div className="w-full max-w-4xl space-y-6">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#E6C850]">Configurações do Sistema</h2>
          <p className="text-[#888] mt-1">Gerencie preferências globais, notificações e permissões de acesso.</p>
        </div>

        <div className="bg-[#1F1F1F] p-6 md:p-8 rounded-xl border border-[#333333] shadow-xl">
          <div className="space-y-6">
            <SettingsCard
              title="Notificações e Lembretes"
              description="Configure prazos de alerta e canais de notificação."
              icon={Bell}
              onConfigure={() => setNotificationsOpen(true)}
            />

            <SettingsCard
              title="Permissões de Usuário"
              description="Defina o que alunos e orientadores podem fazer no sistema."
              icon={Shield}
              onConfigure={() => setPermissionsOpen(true)}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-6 border-t border-[#333]">
            <button
              onClick={restaurarPadrao}
              disabled={loading}
              className="px-5 py-2.5 rounded border border-[#333] text-[#AAAAAA] hover:text-white hover:bg-[#333] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} />
              Restaurar
            </button>

            <button
              onClick={salvarConfiguracoes}
              disabled={loading}
              className="px-6 py-2.5 rounded bg-[#C0A040] text-black font-bold hover:bg-[#E6C850] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
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