"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profileService";
import { Profile } from "@/app/(admin)/perfil/page";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdated: React.Dispatch<
    React.SetStateAction<Profile | null>
  >;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [nameFull, setNameFull] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setNameFull(profile.name_full);
      setPhone(profile.phone);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        name_full: nameFull,
        phone,
      });

      // ✅ atualização correta do estado no pai
      onProfileUpdated((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          name_full: nameFull,
          phone,
        };
      });

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
          <label className="mb-1 block text-sm">Nome completo</label>
          <input
            type="text"
            value={nameFull}
            onChange={(e) => setNameFull(e.target.value)}
            className="w-full rounded-md border border-[#333333] bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm">Telefone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-[#333333] bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-[#333333] px-4 py-2 text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-md bg-[#E6C850] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
