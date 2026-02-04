"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profileService";
import { Profile } from "@/app/type/perfil";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";

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
    registration_id: ""
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
      registration_id: profile.registration_id || ""
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

        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <FormInput
              name="full_name"
              label="Nome Completo"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Nome Completo"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                name="role"
                label="Cargo"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
                <option value="secretario">Secretário</option>
                <option value="coordenador">Coordenador</option>
              </FormSelect>

              <FormInput
                name="department"
                label="Departamento"
                value={formData.department}
                onChange={handleChange}
                placeholder="Ex: COINF"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Telefone com Máscara e Validação Automática */}
              <FormInput
                name="phone"
                label="Telefone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                mask="phone"
              />

              {/* Matrícula bloqueando letras (Apenas números) */}
              <FormInput
                name="registration_id"
                label="Matrícula / Registro"
                value={formData.registration_id}
                onChange={handleChange}
                placeholder="Ex: 20211340"
                mask="numeric"
              />
            </div>

            <FormInput
              name="campus"
              label="Campus"
              value={formData.campus}
              onChange={handleChange}
              placeholder="Ex: João Pessoa"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
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