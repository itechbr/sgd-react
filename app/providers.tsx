'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface NotificationContextType {
  notify: (message: string, type: 'success' | 'error' | 'info') => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um Providers')
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications((prev) => [...prev, { id, message, type }])
    
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Container de Toasts Globais */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`
              pointer-events-auto px-6 py-3 rounded shadow-xl text-white font-medium
              flex items-center gap-2 min-w-[300px]
              animate-in slide-in-from-right fade-in duration-300
              ${n.type === 'success' ? 'bg-green-600/90 border border-green-500' : ''}
              ${n.type === 'error' ? 'bg-red-600/90 border border-red-500' : ''}
              ${n.type === 'info' ? 'bg-blue-600/90 border border-blue-500' : ''}
            `}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}