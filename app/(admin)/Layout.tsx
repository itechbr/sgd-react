import React from 'react'
import { DashboardShell } from '@/app/components/layout/DashboardShell'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}