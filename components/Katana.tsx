"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

const Katana = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 200

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
    }

    const particles: Particle[] = []

    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          color: `hsla(${Math.random() * 60 + 180}, 100%, 70%, ${Math.random()})`,
        })
      }
    }

    let progress = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life *= 0.95

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        if (p.life < 0.01) particles.splice(i, 1)
      }

      if (progress < 1) {
        progress += 0.02
        createParticles(400 + progress * 200, 100)
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="relative w-full h-20 mt-4">
      <canvas ref={canvasRef} className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
      <motion.svg
        width="400"
        height="80"
        viewBox="0 0 400 80"
        className="absolute top-0 left-1/2 -translate-x-1/2"
        initial="hidden"
        animate="visible"
      >
        {/* Handle wrapping */}
        <motion.path
          d="M160 38 L180 38 L180 42 L160 42 Z"
          fill="#2D3748"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />

        {/* Handle */}
        <motion.path
          d="M180 36 L220 36 L220 44 L180 44 Z"
          fill="#4FD1C5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />

        {/* Guard */}
        <motion.path
          d="M220 30 L230 36 L230 44 L220 50 L210 44 L210 36 Z"
          fill="#4FD1C5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        />

        {/* Blade */}
        <motion.path
          d="M230 38 L380 38 L385 40 L380 42 L230 42 Z"
          fill="#E2E8F0"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
        />

        {/* Blade shine */}
        <motion.path
          d="M230 40 L380 40"
          stroke="rgba(79, 209, 197, 0.8)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            delay: 1.9,
            duration: 1,
            opacity: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
          }}
        />

        {/* Slice effect */}
        <motion.path
          d="M230 30 L390 30 L400 40 L390 50 L230 50"
          stroke="rgba(79, 209, 197, 0.4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ delay: 1.4, duration: 0.5 }}
        />
      </motion.svg>
    </div>
  )
}

export default Katana

