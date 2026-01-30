"use client";

import { useState } from "react";
import BancaMember from "./BancaMember";
import SuccessModal from "./SuccessModal";
import { FormInput } from "@/app/components/ui/FormInput";

export default function DocumentosForm() {
  const [membros, setMembros] = useState<number[]>([0]);
  const [modalAberto, setModalAberto] = useState(false);

  function adicionarMembro() {
    setMembros((prev) => [...prev, prev.length]);
  }

  function removerMembro(index: number) {
    setMembros((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("Formulário válido, enviando...");
    setModalAberto(true);

    setMembros([0]);
    e.currentTarget.reset();
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto px-4 py-10"
      >
        {/* ===== TÍTULO ===== */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-sgd-gold mb-2">
            Formulário de Agendamento de Defesa
          </h2>
          <p className="text-sgd-muted text-sm">
            Programa de Pós-Graduação em Tecnologia da Informação - PPgTI/JP
          </p>
        </div>

        {/* ===== DADOS DO CANDIDATO ===== */}
        <section className="card-std p-6 mb-8">
          <h3 className="text-xl font-semibold text-sgd-gold mb-4">
            Dados do Candidato
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput name="nome" label="Nome Completo" required />
            <FormInput name="matricula" label="Matrícula" required />
            <FormInput name="email" label="E-mail" type="email" required />
            <FormInput name="telefone" label="Telefone" />
            <FormInput
              name="linhaPesquisa"
              label="Linha de Pesquisa"
              className="md:col-span-2"
            />
            <FormInput
              name="titulo"
              label="Título do Trabalho"
              className="md:col-span-2"
              required
            />
          </div>

          <textarea
            name="resumo"
            placeholder="Resumo do Trabalho"
            className="input-std md:col-span-2 h-28 mt-4"
          />
        </section>

        {/* ===== BANCA ===== */}
        <section className="card-std p-6 mb-8">
          <h3 className="text-xl font-semibold text-sgd-gold mb-4">
            Dados da Banca Examinadora
          </h3>

          <div className="space-y-6">
            {membros.map((_, index) => (
              <BancaMember
                key={index}
                index={index}
                onRemove={() => removerMembro(index)}
              />
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={adicionarMembro}
              className="btn-primary px-6 py-2"
            >
              + Adicionar Membro da Banca
            </button>
          </div>
        </section>

        {/* ===== DEFESA ===== */}
        <section className="card-std p-6 mb-8">
          <h3 className="text-xl font-semibold text-sgd-gold mb-4">
            Informações sobre a Defesa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput name="data" type="date" label="Data" required />
            <FormInput name="hora" type="time" label="Hora" required />
            <FormInput name="local" label="Local / Link" required />
          </div>
        </section>

        {/* ===== NOTAS ===== */}
        <section className="card-std p-6 mb-8">
          <h3 className="text-xl font-semibold text-sgd-gold mb-4">
            Notas e Avaliação
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormInput name="texto" label="Texto" />
            <FormInput name="apresentacao" label="Apresentação" />
            <FormInput name="arguicao" label="Arguição" />
            <FormInput name="media" label="Média Final" />
            <FormInput name="avaliacao" label="Avaliação" />
          </div>
        </section>

        {/* ===== OBSERVAÇÕES ===== */}
        <section className="card-std p-6 mb-8">
          <h3 className="text-xl font-semibold text-sgd-gold mb-4">
            Observações
          </h3>

          <textarea
            name="observacoes"
            placeholder="Observações adicionais..."
            className="input-std w-full h-28"
          />
        </section>

        <div className="text-center">
          <button type="submit" className="btn-primary px-8 py-3">
            Gerar Documento
          </button>
        </div>
      </form>

      <SuccessModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
}
