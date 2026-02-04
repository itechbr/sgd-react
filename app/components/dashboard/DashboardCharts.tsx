'use client'

import { useEffect, useRef } from 'react'

// --- GRÁFICO 1: DEFESAS MENSAIS (BARRAS) ---
interface DefesasChartProps {
  data: number[]
  labels: string[]
}

export function DefesasChart({ data, labels }: DefesasChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajusta tamanho ao container pai
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight
        draw()
      }
    }

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const padding = 40
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // Limpa
      ctx.clearRect(0, 0, width, height)

      // Configs
      const maxValue = Math.max(...data, 10) 
      const barWidth = chartWidth / (data.length * 2)
      
      // Eixos e Grades
      ctx.strokeStyle = '#333333'
      ctx.fillStyle = '#AAAAAA'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.lineWidth = 1

      // Linhas Horizontais (Grid Y)
      const ticks = 5
      for (let i = 0; i <= ticks; i++) {
        const value = Math.round((maxValue / ticks) * i)
        const y = height - padding - (value / maxValue) * chartHeight
        
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
        
        // Texto do eixo Y
        ctx.fillText(value.toString(), padding - 10, y + 4)
      }

      // Barras e Labels X
      ctx.textAlign = 'center'
      data.forEach((value, i) => {
        const x = padding + i * (chartWidth / data.length) + (chartWidth / data.length) / 2
        
        // Label X (Mês)
        ctx.fillStyle = '#AAAAAA'
        ctx.fillText(labels[i], x, height - padding + 20)

        // Barra
        const barHeight = (value / maxValue) * chartHeight
        const y = height - padding - barHeight
        
        ctx.fillStyle = '#C0A040' 
        // Centraliza a barra no ponto X
        ctx.fillRect(x - barWidth/2, y, barWidth, barHeight)
      })
    }

    // Inicializa e adiciona listener de resize
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [data, labels])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
// --- GRÁFICO 2: STATUS ALUNOS (DONUT) ---
interface StatusChartProps {
  data: number[]
  labels: string[]
  colors: string[]
}

export function StatusChart({ data, labels, colors }: StatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight
        draw()
      }
    }

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 10
      const cutoutRadius = radius * 0.7 

      ctx.clearRect(0, 0, width, height)

      const total = data.reduce((acc, val) => acc + val, 0)
      let startAngle = -0.5 * Math.PI 

      data.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI
        const endAngle = startAngle + sliceAngle

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        
        ctx.fillStyle = colors[i]
        ctx.fill()

        startAngle = endAngle
      })
      // Círculo central (para fazer virar Donut)
      ctx.beginPath()
      ctx.arc(centerX, centerY, cutoutRadius, 0, 2 * Math.PI)
      ctx.fillStyle = '#1F1F1F' 
      ctx.fill()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [data, colors])

  return <canvas ref={canvasRef} className="w-full h-full" />
}