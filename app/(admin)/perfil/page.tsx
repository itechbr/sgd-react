"use client";

import { useEffect, useState } from "react";
import { getProfile, getActivityHistory } from "../../services/profileService";
import EditProfileModal from "../../components/perfil/EditProfileModal";
import ActivityHistory from "../../components/perfil/ActivityHistory";
import { Profile } from "@/app/type/perfil";
import { Activity } from "@/app/type/activity";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        
        const historyData = await getActivityHistory();
        setActivities(historyData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p className="text-center text-[#888] mt-10">Carregando...</p>;
  if (!profile) return <p className="text-center text-red-400 mt-10">Perfil não encontrado</p>;

  // Gerar URL do Avatar igual ao vanilla JS
  const avatarUrl = `https://ui-avatars.com/api/?name=${profile.full_name.replace(' ', '+')}&background=C0A040&color=1F1F1F&bold=true`;

  return (
    <section className="p-8 flex justify-center items-start w-full">
      <div className="bg-[#1F1F1F] p-8 rounded-xl shadow-lg w-full max-w-3xl border border-[#333333] mt-4 relative">
        
        {/* Cabeçalho do Perfil */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <img 
            src={avatarUrl} 
            alt="Foto de Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#C0A040]"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-[#E6C850]">{profile.full_name}</h2>
            <p className="text-[#AAAAAA]">{profile.role || "Sem cargo definido"}</p>
            <p className="text-[#C0A040] mt-2 text-sm">{profile.email}</p>
          </div>
        </div>

        <hr className="border-[#333333] my-6" />

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-[#E6C850] font-semibold mb-2">Informações Gerais</h3>
            <ul className="text-sm text-[#CCCCCC] space-y-2">
              <li><span className="font-semibold text-[#E0E0E0]">Cargo:</span> {profile.role || "-"}</li>
              <li><span className="font-semibold text-[#E0E0E0]">Departamento:</span> {profile.department || "-"}</li>
              <li><span className="font-semibold text-[#E0E0E0]">Registro:</span> {profile.registration_id || "-"}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#E6C850] font-semibold mb-2">Contato</h3>
            <ul className="text-sm text-[#CCCCCC] space-y-2">
              <li><span className="font-semibold text-[#E0E0E0]">E-mail:</span> {profile.email}</li>
              <li><span className="font-semibold text-[#E0E0E0]">Telefone:</span> {profile.phone || "-"}</li>
              <li><span className="font-semibold text-[#E0E0E0]">Campus:</span> {profile.campus || "-"}</li>
            </ul>
          </div>
        </div>

        {/* Histórico */}
        <div className="mt-8">
          <h3 className="text-[#E6C850] font-semibold mb-3">Histórico de Atividades</h3>
           {/* Passamos as atividades carregadas para o componente */}
           <ActivityHistory activities={activities} loading={false} />
        </div>

        {/* Botão de Edição */}
        <div className="mt-10 text-right">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C0A040] text-black px-5 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onProfileUpdated={setProfile}
      />
    </section>
  );
}