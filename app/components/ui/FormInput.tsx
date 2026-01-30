import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode // Novo
  endIcon?: React.ReactNode   // Novo
}

export function FormInput({ 
  label, 
  error, 
  helperText,
  startIcon,
  endIcon,
  className = '', 
  id,
  ...props 
}: FormInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`

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
        {/* Ícone Inicial */}
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#AAAAAA]">
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`
            w-full bg-[#1F1F1F] border rounded-lg text-[#E0E0E0] placeholder-[#555555]
            focus:outline-none focus:ring-1 focus:ring-[#C0A040] focus:border-[#C0A040] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${startIcon ? 'pl-10' : 'px-4'} 
            ${endIcon ? 'pr-10' : 'px-4'}
            py-2.5
            ${error 
              ? 'border-red-500/80 focus:ring-red-500 focus:border-red-500' 
              : 'border-[#333333] hover:border-[#555555]'
            }
            ${className}
          `}
          {...props}
        />

        {/* Ícone Final (ex: Olho de senha) */}
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
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