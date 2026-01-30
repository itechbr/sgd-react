"use client";

import { useState } from "react";

type Props = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onClose: () => void;
  onSave: (user: any) => void;
};

export default function EditProfileModal({ user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...user, name, email });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1F1F1F] p-8 rounded-xl w-full max-w-lg relative">

        <button onClick={onClose} className="absolute top-4 right-4">✕</button>

        <h2 className="text-xl text-[#E6C850] mb-4">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[#2A2A2A] rounded"
          />

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#2A2A2A] rounded"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="bg-[#C0A040] px-4 py-2 rounded">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
