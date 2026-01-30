import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

// Define como cada coluna deve se comportar
export interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode) // Pode ser o nome do campo ou uma função
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  isLoading?: boolean
}

export function DataTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  isLoading 
}: DataTableProps<T>) {

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-[#AAAAAA] bg-[#121212] rounded-lg border border-[#333333]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-1/3 bg-[#333333] rounded mb-3"></div>
            <div className="h-4 w-1/4 bg-[#333333] rounded"></div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-[#AAAAAA] bg-[#121212] rounded-lg border border-[#333333]">
        Nenhum registro encontrado.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#333333] shadow-lg">
      <table className="w-full text-left text-sm text-[#E0E0E0]">
        <thead className="bg-[#000000] text-[#C0A040] uppercase tracking-wider font-bold">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-4 border-b border-[#333333] ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
            {/* Coluna de Ações (só aparece se tiver onEdit ou onDelete) */}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 border-b border-[#333333] text-right">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333333] bg-[#121212]">
          {data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex} className="hover:bg-[#1F1F1F] transition-colors duration-150 group">
              
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)
                  }
                </td>
              ))}

              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(item)}
                        className="text-[#AAAAAA] hover:text-[#C0A040] transition-colors p-1"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(item)}
                        className="text-[#AAAAAA] hover:text-red-400 transition-colors p-1"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}