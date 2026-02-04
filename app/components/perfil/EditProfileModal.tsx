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
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    phone: "",
    campus: "",
    department: "",
    registration_id: "" // Novo campo no estado
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData({
      full_name: profile.full_name || "",
      role: profile.role || "aluno",
      phone: profile.phone || "",
      campus: profile.campus || "",
      department: profile.department || "",
      registration_id: profile.registration_id || "" // Carrega o valor atual
    });
    setErrorMessage("");
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);
      await updateProfile(formData);

      onProfileUpdated((prev) => prev ? { ...prev, ...formData } : prev);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setErrorMessage("Erro ao salvar. Verifique se os dados são válidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl bg-[#1F1F1F] p-8 border border-[#333333] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#AAAAAA] hover:text-[#C0A040]">✕</button>

        <h2 className="mb-6 text-xl font-semibold text-[#E6C850]">Editar Perfil</h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#888] ml-1">Nome Completo</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Nome Completo"
              className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#888] ml-1">Cargo</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none appearance-none"
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="secretario">Secretário</option>
                <option value="coordenador">Coordenador</option>
                {/* <option value="admin">Administrador</option> */}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#888] ml-1">Departamento</label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Ex: COINF"
                className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="space-y-1">
                <label className="text-xs text-[#888] ml-1">Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      phone: onlyNumbers,
                    }));
                    setErrorMessage("");
                  }}
                  placeholder="Digite seu telefone"
                  maxLength={15}
                  className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none"
                />
              </div>
            </div>

            {/* NOVO CAMPO ADICIONADO AQUI */}
            <div className="space-y-1">
              <label className="text-xs text-[#888] ml-1">Matrícula / Registro</label>
              <input
                name="registration_id"
                value={formData.registration_id}
                onChange={handleChange}
                placeholder="Ex: 20211340"
                className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#888] ml-1">Campus</label>
            <input
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              placeholder="Ex: João Pessoa"
              className="w-full px-3 py-2 rounded bg-[#2A2A2A] text-white border border-[#444] focus:border-[#C0A040] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-[#333] text-white hover:bg-[#444] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded bg-[#C0A040] text-black font-semibold hover:bg-[#E6C850] transition-colors disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}