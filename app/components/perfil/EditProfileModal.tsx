"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profileService";
import { Profile } from "@/app/type/perfil";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdated: React.Dispatch<React.SetStateAction<Profile | null>>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(profile.full_name);
    setRole(profile.role);
    setPhone(profile.phone);
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        full_name: fullName,
        role,
        phone,
      });

      onProfileUpdated((prev) =>
        prev
          ? {
              ...prev,
              full_name: fullName,
              role,
              phone,
            }
          : prev
      );

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-[#1F1F1F] p-6 border border-[#333333]">
        <h2 className="mb-4 text-xl font-semibold text-[#E6C850]">
          Editar perfil
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Nome completo</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-[#333333] bg-transparent px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Cargo</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-[#333333] bg-transparent px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Telefone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-[#333333] bg-transparent px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border border-[#333333] px-4 py-2 rounded-md"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#E6C850] px-4 py-2 rounded-md text-black disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
