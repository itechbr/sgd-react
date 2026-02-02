"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import ActivityHistory from "../../components/perfil/ActivityHistory";
import EditProfileModal from "../../components/perfil/EditProfileModal";

export type Profile = {
  name_full: string;
  role: string;
  phone: string;
  email: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <p className="text-center text-[#888]">Carregando perfil...</p>;
  }

  if (!profile) {
    return <p className="text-center text-red-400">Perfil não encontrado</p>;
  }

  return (
    <section className="p-8 max-w-4xl mx-auto space-y-10">
      {/* Card do Perfil */}
      <div className="bg-[#1F1F1F] p-8 rounded-xl border border-[#333333]">
        <h2 className="text-2xl font-semibold text-[#E6C850]">
          {profile.name_full}
        </h2>

        <p className="text-[#AAAAAA]">{profile.role}</p>
        <p className="text-sm text-[#C0A040] mt-1">{profile.email}</p>

        <p className="mt-4 text-sm">
          <strong>Telefone:</strong> {profile.phone}
        </p>

        <div className="mt-6 text-right">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-[#E6C850] px-4 py-2 text-sm font-medium text-black"
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onProfileUpdated={setProfile}
      />

      {/* Histórico */}
      <ActivityHistory />
    </section>
  );
}
