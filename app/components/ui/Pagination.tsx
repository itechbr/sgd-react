'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, totalItems, onPageChange }: PaginationProps) {
  // Se não houver páginas suficientes, não mostra nada (igual ao original)
  if (totalPages <= 1) return null

  // Lógica original para calcular o intervalo de páginas visíveis
  const pageStart = Math.max(1, currentPage - 2)
  const pageEnd = Math.min(totalPages, currentPage + 2)

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`
        px-3 py-1 rounded border text-sm transition
        ${currentPage === page
          ? 'bg-[#C0A040] text-black border-[#C0A040] font-bold' // Ativo
          : 'border-[#333333] text-[#E0E0E0] hover:bg-[#333333] hover:text-[#C0A040]' // Inativo
        }
      `}
    >
      {page}
    </button>
  )

  return (
    <div className="flex items-center justify-center md:justify-end mt-6">
      {/* Texto de Resumo (Igual ao original) */}
      <span className="text-xs text-[#AAAAAA] mr-4">
        Pág. {currentPage} de {totalPages} ({totalItems} total)
      </span>

      <div className="flex space-x-2">
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-3 py-1 rounded border border-[#333333] text-sm transition
            ${currentPage === 1
              ? 'text-[#AAAAAA] opacity-50 cursor-not-allowed'
              : 'text-[#E0E0E0] hover:bg-[#333333] hover:text-[#C0A040]'
            }
          `}
        >
          Anterior
        </button>

        {/* Primeira Página + Ellipsis se necessário */}
        {pageStart > 1 && (
          <>
            {renderPageButton(1)}
            {pageStart > 2 && <span className="px-3 py-1 text-[#AAAAAA]">...</span>}
          </>
        )}

        {/* Páginas Centrais */}
        {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i).map(renderPageButton)}

        {/* Última Página + Ellipsis se necessário */}
        {pageEnd < totalPages && (
          <>
            {pageEnd < totalPages - 1 && <span className="px-3 py-1 text-[#AAAAAA]">...</span>}
            {renderPageButton(totalPages)}
          </>
        )}

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-3 py-1 rounded border border-[#333333] text-sm transition
            ${currentPage === totalPages
              ? 'text-[#AAAAAA] opacity-50 cursor-not-allowed'
              : 'text-[#E0E0E0] hover:bg-[#333333] hover:text-[#C0A040]'
            }
          `}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}