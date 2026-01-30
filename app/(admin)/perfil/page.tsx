"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ActivityHistory from "../../components/perfil/ActivityHistory";
import EditProfileModal from "../../components/perfil/EditProfileModal";

export default function PerfilPage() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  const [user, setUser] = useState({
    name: "Diogo Aguiar",
    role: "Administrador do Sistema",
    email: "diogo.aguiar@ifpb.edu.br",
  });

  function handleSave(updatedUser: typeof user) {
    setUser(updatedUser);
  }

  return (
    <main className="p-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">

        {/* CARD DE PERFIL */}
        <div className="bg-[#1F1F1F] p-8 rounded-xl border border-[#333333] relative">

          {/* BOTÃO HOME */}
          <button
            onClick={() => router.push("/dashboard")}
            className="absolute top-6 right-6 text-[#C0A040] hover:text-[#E6C850]"
            title="Voltar ao Dashboard"
          >
            🏠
          </button>

          <h2 className="text-2xl font-semibold text-[#E6C850]">
            {user.name}
          </h2>

          <p className="text-[#AAAAAA]">{user.role}</p>
          <p className="text-[#C0A040] text-sm mt-2">{user.email}</p>

          <div className="mt-6 text-right">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#C0A040] text-black px-5 py-2 rounded font-semibold text-sm hover:bg-[#E6C850]"
            >
              Editar Perfil
            </button>
          </div>
        </div>

        {/* HISTÓRICO DE ATIVIDADES */}
        <ActivityHistory />

      </div>

      {openModal && (
        <EditProfileModal
          user={user}
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
