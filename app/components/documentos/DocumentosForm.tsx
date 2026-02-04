"use client";

import { useState } from "react";
import { useNotification } from "@/app/providers"; 
import BancaMember from "./BancaMember";
import SuccessModal from "./SuccessModal";
import DocumentoTemplate from "./DocumentoTemplate"; 
// IMPORTANTE: Importamos as validações centralizadas aqui
import { FormInput, INPUT_VALIDATIONS } from "@/app/components/ui/FormInput";
import { ArrowRight, ArrowLeft, FileText, CheckCircle, ClipboardCheck, Calendar, Download } from "lucide-react";

// Definição das Abas
type Tab = "candidato" | "banca" | "notas" | "defesa";

export default function DocumentosForm() {
  const { notify } = useNotification(); 
  const [activeTab, setActiveTab] = useState<Tab>("candidato");
  const [membros, setMembros] = useState<number[]>([0]); 
  const [modalAberto, setModalAberto] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [pdfData, setPdfData] = useState<any>(null);

  function adicionarMembro() {
    setMembros((prev) => [...prev, prev.length]);
  }

  function removerMembro(index: number) {
    setMembros((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // --- 1. VALIDAÇÃO DO CANDIDATO (Usando INPUT_VALIDATIONS) ---
    if (!INPUT_VALIDATIONS.email.regex.test(rawData.email as string)) {
        notify("Candidato: O e-mail informado é inválido.", "error");
        setActiveTab("candidato");
        return;
    }

    // Matrícula deve ser numérica
    if (!INPUT_VALIDATIONS.numeric.regex.test(rawData.matricula as string)) {
        notify("Candidato: A matrícula deve conter apenas números.", "error");
        setActiveTab("candidato");
        return;
    }

    // Telefone (se informado) deve seguir o padrão (XX) XXXXX-XXXX
    if (rawData.telefone && !INPUT_VALIDATIONS.phone.regex.test(rawData.telefone as string)) {
        notify("Candidato: O telefone é inválido.", "error");
        setActiveTab("candidato");
        return;
    }

    // --- 2. VALIDAÇÃO DA BANCA ---
    for (const idx of membros) {
        const nome = rawData[`membro_${idx}_nome`];
        const cpf = rawData[`membro_${idx}_cpf`] as string; // Isso virá limpo ou formatado dependendo da máscara
        const email = rawData[`membro_${idx}_email`] as string;

        if (nome) {
             // Validamos se é numérico (pois definimos mask="numeric" no BancaMember para aceitar Matrícula ou CPF puro)
             if (cpf && !INPUT_VALIDATIONS.numeric.regex.test(cpf.replace(/\D/g, ''))) {
                notify(`Membro ${idx + 1} (${nome}): Matrícula/CPF inválido.`, "error");
                setActiveTab("banca");
                return;
            }
            if (email && !INPUT_VALIDATIONS.email.regex.test(email)) {
                notify(`Membro ${idx + 1} (${nome}): E-mail inválido.`, "error");
                setActiveTab("banca");
                return;
            }
        }
    }

    setIsGenerating(true);
    notify("Iniciando geração do documento...", "info");

    const structuredData = {
      candidato: {
        nome: rawData.nome,
        matricula: rawData.matricula,
        email: rawData.email,
        telefone: rawData.telefone,
        titulo: rawData.titulo,
        resumo: rawData.resumo,
        palavrasChaves: rawData.palavrasChaves,
        linhaPesquisa: rawData.linhaPesquisa
      },
      banca: membros.map(idx => ({
        nome: rawData[`membro_${idx}_nome`],
        tipo: rawData[`membro_${idx}_tipo`],
        cpf: rawData[`membro_${idx}_cpf`],
        participacao: rawData[`membro_${idx}_participacao`],
        email: rawData[`membro_${idx}_email`]
      })),
      defesa: {
        data: rawData.data,
        hora: rawData.hora,
        local: rawData.local,
        observacoes: rawData.observacoes
      },
      notas: {
        apresentacao: rawData.apresentacao,
        arguicao: rawData.arguicao,
        texto: rawData.texto,
        media: rawData.media,
        avaliacao: rawData.avaliacao
      }
    };

    setPdfData(structuredData);

    setTimeout(() => {
        gerarPDF();
    }, 500); 
  }

  const gerarPDF = async () => {
    if (typeof window !== "undefined") {
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = document.getElementById("template-pdf-print");
        
        if (!element) {
            notify("Erro: Template não encontrado.", "error");
            setIsGenerating(false);
            return;
        }

        const opt = {
          margin: 0,
          filename: `defesa_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        await html2pdf().set(opt).from(element).save();
        
        setModalAberto(true); 
        notify("PDF gerado com sucesso!", "success");

      } catch (err) {
        console.error("Erro ao gerar PDF", err);
        notify("Falha ao gerar o arquivo PDF.", "error");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const TabButton = ({ id, label, current, icon: Icon }: { id: Tab; label: string; current: Tab; icon: any }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 outline-none whitespace-nowrap ${
        current === id
          ? "border-[#C0A040] text-[#C0A040] bg-[#2A2A2A]"
          : "border-transparent text-[#AAAAAA] hover:text-[#E0E0E0] hover:bg-[#252525]"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <>
      <div className="w-full max-w-5xl mx-auto py-6">
        
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
            {pdfData && <DocumentoTemplate id="template-pdf-print" data={pdfData} />}
        </div>

        <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] shadow-2xl overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-[#333333] bg-[#1A1A1A]">
            <h1 className="text-xl font-bold text-[#C0A040] flex items-center gap-2">
              <FileText className="text-[#C0A040]" />
              Emissão de Documentos
            </h1>
            <p className="text-sm text-[#AAAAAA] mt-1">
              Gerador oficial de atas e agendamentos de defesa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            
            <div className="flex overflow-x-auto border-b border-[#333333] bg-[#151515] scrollbar-hide">
              <TabButton id="candidato" label="1. Dados do Candidato" current={activeTab} icon={FileText} />
              <TabButton id="banca" label="2. Banca Examinadora" current={activeTab} icon={CheckCircle} />
              <TabButton id="notas" label="3. Avaliação (Opcional)" current={activeTab} icon={ClipboardCheck} />
              <TabButton id="defesa" label="4. Dados da Defesa" current={activeTab} icon={Calendar} />
            </div>

            <div className="p-8 min-h-[400px]">
              
              {/* ABA 1: CANDIDATO */}
              <div className={activeTab === "candidato" ? "block animate-in fade-in slide-in-from-left-2 duration-300 space-y-6" : "hidden"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormInput name="nome" label="Nome Completo" required placeholder="Ex: João da Silva" />
                    
                    {/* Validação Numérica Centralizada */}
                    <FormInput 
                        name="matricula" 
                        label="Matrícula" 
                        required 
                        placeholder="Ex: 2021100..."
                        mask="numeric"
                    />
                    
                    {/* Validação de Email Centralizada */}
                    <FormInput 
                        name="email" 
                        label="E-mail Institucional" 
                        type="email" 
                        required 
                        validation={INPUT_VALIDATIONS.email}
                    />
                    
                    {/* Máscara de Telefone Centralizada */}
                    <FormInput 
                        name="telefone" 
                        label="Telefone" 
                        placeholder="(83) 99999-9999" 
                        mask="phone"
                    />
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                       <FormInput name="linhaPesquisa" label="Linha de Pesquisa" placeholder="Se houver" />
                       <FormInput name="produtoEducacional" label="Produto Educacional" placeholder="Se houver" />
                    </div>

                    <FormInput name="titulo" label="Título da Dissertação" className="md:col-span-2" required />
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-[#E0E0E0]">Resumo do Trabalho</label>
                      <textarea
                        name="resumo"
                        className="w-full bg-[#121212] border border-[#333333] rounded-lg p-3 text-[#E0E0E0] placeholder-[#666666] focus:border-[#C0A040] focus:ring-1 focus:ring-[#C0A040] outline-none h-32 resize-none transition-all"
                        placeholder="Cole o resumo aqui..."
                      />
                    </div>
                    
                    <FormInput name="palavrasChaves" label="Palavras-Chaves" className="md:col-span-2" placeholder="Ex: IA; Saúde; Python." />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-[#333333] mt-4">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("banca")} 
                      className="bg-[#C0A040] hover:bg-[#E6C850] text-black px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-900/10"
                    >
                      Próximo <ArrowRight size={18} />
                    </button>
                  </div>
              </div>

              {/* ABA 2: BANCA */}
              <div className={activeTab === "banca" ? "block animate-in fade-in slide-in-from-right-2 duration-300 space-y-6" : "hidden"}>
                  <div className="flex justify-between items-center pb-4 border-b border-[#333333]">
                    <h3 className="text-lg font-medium text-[#C0A040]">Membros da Comissão</h3>
                    <button 
                      type="button" 
                      onClick={adicionarMembro} 
                      className="text-sm text-[#C0A040] hover:text-[#E6C850] transition-colors flex items-center gap-1 font-bold bg-[#C0A040]/10 px-3 py-1.5 rounded-md border border-[#C0A040]/20"
                    >
                      + Adicionar Membro
                    </button>
                  </div>

                  <div className="space-y-4">
                    {membros.map((_, index) => (
                      <BancaMember 
                          key={index} 
                          index={index} 
                          isOrientador={index === 0}
                          onRemove={() => removerMembro(index)} 
                      />
                    ))}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-[#333333] mt-6">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("candidato")} 
                      className="border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Voltar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("notas")} 
                      className="bg-[#C0A040] hover:bg-[#E6C850] text-black px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-900/10"
                    >
                      Próximo <ArrowRight size={18} />
                    </button>
                  </div>
              </div>

              {/* ABA 3: NOTAS */}
              <div className={activeTab === "notas" ? "block animate-in fade-in slide-in-from-right-2 duration-300 space-y-6" : "hidden"}>
                  <div className="bg-[#C0A040]/10 border border-[#C0A040]/30 p-4 rounded-lg mb-6">
                    <p className="text-sm text-[#C0A040] flex items-center gap-2">
                      ⚠️ Preencha estes campos apenas se a defesa já ocorreu e você possui a ata final.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormInput name="apresentacao" label="Nota: Apresentação" type="number" step="0.1" />
                    <FormInput name="arguicao" label="Nota: Arguição" type="number" step="0.1" />
                    <FormInput name="texto" label="Nota: Texto Escrito" type="number" step="0.1" />
                    
                    <div className="md:col-span-3 border-t border-[#333333] my-2"></div>
                    
                    <FormInput name="media" label="Média Final" />
                    <FormInput name="avaliacao" label="Resultado" placeholder="Ex: Aprovado" className="md:col-span-2" />
                  </div>

                  <div className="flex justify-between pt-6 border-t border-[#333333] mt-6">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("banca")} 
                      className="border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Voltar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("defesa")} 
                      className="bg-[#C0A040] hover:bg-[#E6C850] text-black px-8 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-900/10"
                    >
                      Próximo <ArrowRight size={18} />
                    </button>
                  </div>
              </div>

              {/* ABA 4: DEFESA */}
              <div className={activeTab === "defesa" ? "block animate-in fade-in slide-in-from-right-2 duration-300 space-y-6" : "hidden"}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormInput name="data" type="date" label="Data da Defesa" required />
                    <FormInput name="hora" type="time" label="Horário" required />
                    <FormInput name="local" label="Local / Link" placeholder="Ex: Google Meet" required />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium text-[#E0E0E0]">Observações Adicionais</label>
                     <textarea
                      name="observacoes"
                      className="w-full bg-[#121212] border border-[#333333] rounded-lg p-3 text-[#E0E0E0] placeholder-[#666666] focus:border-[#C0A040] focus:ring-1 focus:ring-[#C0A040] outline-none h-24 resize-none transition-all"
                      placeholder="Informações extras para a secretaria..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#333333] mt-6">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab("notas")} 
                      className="border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Voltar
                    </button>
                    
                    <button 
                        type="submit" 
                        disabled={isGenerating}
                        className="bg-[#C0A040] hover:bg-[#E6C850] disabled:bg-[#555] disabled:cursor-not-allowed text-black px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-900/10"
                    >
                      {isGenerating ? (
                        <>Gerando PDF...</>
                      ) : (
                        <>
                           <Download size={18} />
                           Confirmar e Baixar PDF
                        </>
                      )}
                    </button>
                  </div>
              </div>

            </div>
          </form>
        </div>

        <SuccessModal open={modalAberto} onClose={() => setModalAberto(false)} />
      </div>
    </>
  );
}