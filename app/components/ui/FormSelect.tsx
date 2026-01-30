import React from 'react'

export interface SelectOption {
  value: string | number
  label: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  helperText?: string
}

export function FormSelect({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  children, // Permite passar opções manualmente como children se preferir
  ...props
}: FormSelectProps) {
  // Gera ID único se não fornecido
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="w-full mb-4">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-[#AAAAAA] mb-1.5"
      >
        {label}
        {props.required && <span className="text-[#C0A040] ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full px-4 py-2.5 bg-[#1F1F1F] border rounded-lg text-[#E0E0E0] appearance-none
            focus:outline-none focus:ring-1 focus:ring-[#C0A040] focus:border-[#C0A040] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500'
              : 'border-[#333333] hover:border-[#555555]'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="text-[#555555]">
            Selecione uma opção
          </option>
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          
          {/* Caso queira passar <option> manualmente como children */}
          {children}
        </select>

        {/* Ícone da seta (Chevron Down) customizado para manter o tema */}
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#AAAAAA]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-400 font-medium">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-xs text-[#666666]">
          {helperText}
        </p>
      )}
    </div>
  )
}