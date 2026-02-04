// Definições de Tipos Globais do Projeto

// Tipo para Professor (Baseado na tabela 'professores' que criaremos no Supabase)
export interface IProfessor {
  id: number // ou string, dependendo do Supabase (geralmente int8 ou uuid)
  nome: string
  email: string
  lattes?: string
  instituicao: string
  titulacao: 'Graduação' | 'Especialização' | 'Mestrado' | 'Doutorado' | 'Pós-Doutorado'
  tipo: 'Permanente' | 'Colaborador' | 'Visitante'
  areas?: string // Lista de áreas separadas por vírgula
  ativo: boolean
  created_at?: string
}

// Tipo para Aluno (Para a próxima fase)
export interface IAluno {
  id: number
  nome: string
  matricula: string
  email: string
  curso: 'Mestrado' | 'Doutorado' | 'Especialização'
  ingresso: number
  orientador_id?: number // Relacionamento com Professor
  status: 'Ativo' | 'Qualificado' | 'Defendido' | 'Trancado' | 'Desligado'
  ativo: boolean
}

// Tipo para Defesa (Dados aninhados ou tabela separada)
export interface IDefesa {
  id: number
  aluno_id: number
  titulo: string
  data: string
  horario: string
  local: string
  resumo?: string
  banca?: string[] // Array de nomes ou IDs
  status: 'Agendada' | 'Realizada' | 'Cancelada'
}

// Tipo para Agendamento
export interface IAgendamento {
  id: number
  aluno: string
  titulo: string
  data: string
  hora: string
}

export interface ISolicitacao {
  id: number
  aluno_nome: string
  matricula: string
  email?: string
  curso: string
  orientador?: string
  tipo: 'Qualificação' | 'Defesa'
  status: 'Aguardando' | 'Aprovada' | 'Rejeitada'
  data_solicitacao: string // Data que aparece na tabela
  
  // Detalhes específicos (podem vir nulos se não houver defesa agendada)
  detalhes_titulo?: string
  detalhes_data?: string
  detalhes_horario?: string
  detalhes_local?: string
  detalhes_banca?: string[] // Array de strings com nomes
}