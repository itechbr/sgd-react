import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";

type Props = {
  index: number;
  onRemove: () => void;
};

export default function BancaMember({ index, onRemove }: Props) {
  return (
    <div className="border border-sgd-border p-4 rounded-lg bg-sgd-bg/30">
      <h4 className="text-sgd-gold font-medium mb-3">
        {index === 0
          ? "Orientador (Membro Interno)"
          : "Membro da Banca (Interno/Externo)"}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name={`membros[${index}].nome`}
          label="Nome Completo"
          required={index === 0}
        />

        <FormInput
          name={`membros[${index}].documento`}
          label="Matrícula ou CPF"
          required={index === 0}
        />

        <FormInput
          name={`membros[${index}].email`}
          label="E-mail"
          type="email"
        />

        <FormInput
          name={`membros[${index}].telefone`}
          label="Telefone"
        />

        <FormInput
          name={`membros[${index}].titulacao`}
          label="Titulação / Instituição"
          className="md:col-span-2"
        />

        <FormSelect
          name={`membros[${index}].participacao`}
          label="Participação"
          className="md:col-span-2"
          options={[
            { value: "Presencial", label: "Presencial" },
            { value: "Virtual", label: "Virtual" },
          ]}
        />
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 text-xs hover:underline mt-2"
        >
          Remover Membro
        </button>
      )}
    </div>
  );
}
