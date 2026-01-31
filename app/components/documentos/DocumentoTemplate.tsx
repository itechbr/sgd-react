import React from 'react';

// Interfaces para tipagem dos dados
interface MembroBanca {
  nome: string;
  tipo: string; // Interno ou Externo
  cpf: string;
  email?: string;
  telefone?: string;
  participacao: string;
}

interface DocumentoData {
  candidato: {
    nome: string;
    matricula: string;
    email: string;
    telefone: string;
    linhaPesquisa?: string;
    titulo: string;
    produtoEducacional?: string;
    resumo: string;
    palavrasChaves: string;
  };
  banca: MembroBanca[];
  defesa: {
    data: string;
    hora: string;
    local: string;
    observacoes?: string;
  };
  notas?: {
    apresentacao: string;
    arguicao: string;
    texto: string;
    media: string;
    avaliacao: string;
  };
}

export default function DocumentoTemplate({ id, data }: { id: string, data: DocumentoData }) {
  // Estilos inline baseados no seu style.css para garantir a fidelidade no PDF
  const styles = {
    page: {
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      margin: '0 auto',
      backgroundColor: 'white',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '11px',
      lineHeight: '1.3',
      color: 'black'
    },
    header: {
      textAlign: 'center' as const,
      fontWeight: 'bold',
      marginBottom: '20px',
      textTransform: 'uppercase' as const,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: '15px',
      tableLayout: 'fixed' as const,
    },
    td: {
      border: '1px solid black',
      padding: '5px',
      verticalAlign: 'top',
      wordWrap: 'break-word' as const,
    },
    label: {
      fontSize: '9px',
      fontWeight: 'bold',
      display: 'block',
      color: '#333'
    },
    content: {
      fontSize: '11px',
      display: 'block',
      minHeight: '14px'
    },
    sectionTitle: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      padding: '5px'
    }
  };

  // Helper para formatar data (YYYY-MM-DD -> DD/MM/YYYY)
  const formatData = (dateStr: string) => {
    if (!dateStr) return '___/___/____';
    const [ano, mes, dia] = dateStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div id={id} style={styles.page}>
      
      {/* CABEÇALHO */}
      <header style={styles.header}>
        <p>INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DA PARAÍBA</p>
        <p>CAMPUS JOÃO PESSOA</p>
        <p>DEPARTAMENTO DE ENSINO SUPERIOR</p>
        <p>PROGRAMA DE PÓS-GRADUAÇÃO EM TECNOLOGIA DA INFORMAÇÃO - PPGTI/JP</p>
        
        <h2 style={{ marginTop: '20px', textDecoration: 'underline', fontSize: '14px' }}>DEFESA DE DISSERTAÇÃO</h2>
        <h3 style={{ marginTop: '5px', fontSize: '12px' }}>DISSERTAÇÃO</h3>
      </header>

      {/* DADOS DO CANDIDATO */}
      <table style={styles.table}>
        <tbody>
          <tr>
            <td colSpan={4} style={{ ...styles.td, ...styles.sectionTitle }}>DADOS DO CANDIDATO</td>
          </tr>
          <tr>
            <td colSpan={3} style={styles.td}>
              <span style={styles.label}>NOME COMPLETO</span>
              <span style={styles.content}>{data.candidato.nome}</span>
            </td>
            <td style={styles.td}>
              <span style={styles.label}>MATRÍCULA</span>
              <span style={styles.content}>{data.candidato.matricula}</span>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={styles.td}>
              <span style={styles.label}>E-MAIL</span>
              <span style={styles.content}>{data.candidato.email}</span>
            </td>
            <td colSpan={2} style={styles.td}>
              <span style={styles.label}>TELEFONE</span>
              <span style={styles.content}>{data.candidato.telefone}</span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={styles.td}>
              <span style={styles.label}>TÍTULO DA DISSERTAÇÃO</span>
              <span style={styles.content}>{data.candidato.titulo}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* BANCA EXAMINADORA */}
      <table style={styles.table}>
        <tbody>
          <tr>
            <td colSpan={4} style={{ ...styles.td, ...styles.sectionTitle }}>BANCA EXAMINADORA</td>
          </tr>
          {/* Cabeçalho da Tabela da Banca */}
          <tr style={{ backgroundColor: '#f9f9f9', fontSize: '10px' }}>
            <td style={{ ...styles.td, width: '40%' }}><strong>NOME</strong></td>
            <td style={{ ...styles.td, width: '20%' }}><strong>TIPO</strong></td>
            <td style={{ ...styles.td, width: '20%' }}><strong>MATRÍCULA/CPF</strong></td>
            <td style={{ ...styles.td, width: '20%' }}><strong>PARTICIPAÇÃO</strong></td>
          </tr>
          
          {/* Mapeamento dos Membros */}
          {data.banca.map((membro, index) => (
            <tr key={index}>
              <td style={styles.td}>
                <span style={styles.content}>
                   {index === 0 ? "(Orientador) " : ""}{membro.nome}
                </span>
              </td>
              <td style={styles.td}><span style={styles.content}>{membro.tipo}</span></td>
              <td style={styles.td}><span style={styles.content}>{membro.cpf}</span></td>
              <td style={styles.td}><span style={styles.content}>{membro.participacao}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DADOS DA DEFESA */}
      <table style={styles.table}>
        <tbody>
          <tr>
            <td colSpan={4} style={{ ...styles.td, ...styles.sectionTitle }}>DADOS DA DEFESA</td>
          </tr>
          <tr>
            <td style={styles.td}>
              <span style={styles.label}>DATA</span>
              <span style={styles.content}>{formatData(data.defesa.data)}</span>
            </td>
            <td style={styles.td}>
              <span style={styles.label}>HORÁRIO</span>
              <span style={styles.content}>{data.defesa.hora}</span>
            </td>
            <td colSpan={2} style={styles.td}>
              <span style={styles.label}>LOCAL / LINK</span>
              <span style={styles.content}>{data.defesa.local}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* NOTAS (Opcional - só aparece se tiver média) */}
      {data.notas?.media && (
        <table style={styles.table}>
           <tbody>
            <tr>
              <td colSpan={5} style={{ ...styles.td, ...styles.sectionTitle }}>AVALIAÇÃO FINAL</td>
            </tr>
            <tr>
              <td style={styles.td}><span style={styles.label}>APRESENTAÇÃO</span>{data.notas.apresentacao}</td>
              <td style={styles.td}><span style={styles.label}>ARGUIÇÃO</span>{data.notas.arguicao}</td>
              <td style={styles.td}><span style={styles.label}>TEXTO</span>{data.notas.texto}</td>
              <td style={styles.td}><span style={styles.label}>MÉDIA</span>{data.notas.media}</td>
              <td style={styles.td}><span style={styles.label}>RESULTADO</span>{data.notas.avaliacao}</td>
            </tr>
           </tbody>
        </table>
      )}

      {/* RESUMO E PALAVRAS CHAVE */}
      <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
        <span style={styles.label}>RESUMO DO TRABALHO</span>
        <p style={{ ...styles.content, textAlign: 'justify', marginTop: '5px' }}>{data.candidato.resumo}</p>
      </div>

      <div style={{ marginBottom: '30px', border: '1px solid black', padding: '10px' }}>
        <span style={styles.label}>PALAVRAS-CHAVES</span>
        <p style={{ ...styles.content, marginTop: '5px' }}>{data.candidato.palavrasChaves}</p>
      </div>

      {/* ASSINATURAS */}
      <div style={{ marginTop: '40px' }}>
        <p style={{ marginBottom: '40px' }}>João Pessoa, {formatData(data.defesa.data)}.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', textAlign: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ borderTop: '1px solid black', margin: '0 20px', marginBottom: '5px' }}></div>
            <p style={{ fontSize: '10px' }}>Assinatura do Candidato</p>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ borderTop: '1px solid black', margin: '0 20px', marginBottom: '5px' }}></div>
            <p style={{ fontSize: '10px' }}>Assinatura do Orientador</p>
          </div>
        </div>
      </div>

    </div>
  );
}