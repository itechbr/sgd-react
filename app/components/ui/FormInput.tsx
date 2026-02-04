'use client'

import React, { useState } from 'react'

export type MaskType = 'numeric' | 'cpf' | 'phone' | 'cep'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  mask?: MaskType
  validation?: {
    regex: RegExp | string
    message: string
  }
}

// 1. Exportando as validações para uso externo (Single Source of Truth)
// Adicionei 'email' aqui para podermos usar no DocumentosForm sem repetir regex lá
export const INPUT_VALIDATIONS = {
  numeric: { regex: /^\d+$/, message: 'Apenas números são permitidos' },
  // Aceita CPF com ou sem formatação
  cpf: { regex: /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/, message: 'CPF inválido' },
  phone: { regex: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, message: 'Telefone inválido' },
  cep: { regex: /^\d{5}-?\d{3}$/, message: 'CEP incompleto' },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' } 
}

// Utilitários de Máscara (Formatação Visual)
const MASKS = {
  numeric: (v: string) => v.replace(/\D/g, ''),
  cpf: (v: string) => {
    return v
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // Limita tamanho visual
  },
  phone: (v: string) => {
    return v
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')
      .slice(0, 15)
  },
  cep: (v: string) => {
    return v
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }
}

export function FormInput({ 
  label, 
  error: propError, 
  helperText,
  startIcon,
  endIcon,
  className = '', 
  id,
  mask,
  validation,
  onBlur,
  onChange,
  onInput,
  ...props 
}: FormInputProps) {
  const [localError, setLocalError] = useState('')
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`

  // Manipulador de Input (Aplica Máscara)
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (mask) {
      const value = e.currentTarget.value
      e.currentTarget.value = MASKS[mask](value)
    }
    if (onInput) onInput(e)
  }

  // Manipulador de Blur (Valida)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 1. Usa a validação customizada se existir (prioridade alta)
    if (validation && value) {
      const pattern = typeof validation.regex === 'string' 
        ? new RegExp(validation.regex) 
        : validation.regex

      if (!pattern.test(value)) {
        setLocalError(validation.message)
      } else {
        setLocalError('')
      }
    } 
    // 2. Se não tiver customizada, usa a validação padrão da máscara
    else if (mask && value && INPUT_VALIDATIONS[mask]) {
      if (!INPUT_VALIDATIONS[mask].regex.test(value)) {
         setLocalError(INPUT_VALIDATIONS[mask].message)
      } else {
         setLocalError('')
      }
    }

    if (onBlur) onBlur(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localError) setLocalError('')
    if (onChange) onChange(e)
  }

  const finalError = propError || localError

  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-[#AAAAAA] mb-1.5"
      >
        {label}
        {props.required && <span className="text-[#C0A040] ml-1">*</span>}
      </label>
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#AAAAAA]">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          onBlur={handleBlur}
          onChange={handleChange}
          onInput={handleInput}
          className={`
            w-full bg-[#1F1F1F] border rounded-lg text-[#E0E0E0] placeholder-[#555555]
            focus:outline-none focus:ring-1 focus:ring-[#C0A040] focus:border-[#C0A040] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${startIcon ? 'pl-10' : 'px-4'} 
            ${endIcon ? 'pr-10' : 'px-4'}
            py-2.5
            ${finalError 
              ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500' 
              : 'border-[#333333] hover:border-[#555555]'
            }
            ${className}
          `}
          {...props}
        />

        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>

      {finalError && (
        <p className="mt-1 text-xs text-red-400 font-medium animate-in slide-in-from-top-1 fade-in duration-200">
          {finalError}
        </p>
      )}
      
      {!finalError && helperText && (
        <p className="mt-1 text-xs text-[#666666]">
          {helperText}
        </p>
      )}
    </div>
  )
}