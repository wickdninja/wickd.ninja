"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const NinjaMaster = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll()
  const [isJumping, setIsJumping] = useState(false)

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], ["0%", "-20%", "-40%", "-60%", "-80%", "-100%"])

  useEffect(() => {
    const jumpInterval = setInterval(() => {
      setIsJumping(true)
      setTimeout(() => setIsJumping(false), 500)
    }, 3000)

    return () => clearInterval(jumpInterval)
  }, [])

  const ninjaVariants = {
    idle: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    jump: {
      y: -50,
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div ref={ref} style={{ x, y }} className="fixed z-50 w-32 h-32">
      <motion.svg viewBox="0 0 100 100" variants={ninjaVariants} animate={isJumping ? "jump" : "idle"}>
        {/* Ninja body */}
        <motion.path
          d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
          fill="#2D3748"
        />
        {/* Ninja mask */}
        <motion.path d="M35 45H65M35 55H65" stroke="#4FD1C5" strokeWidth="3" strokeLinecap="round" />
        {/* Ninja eyes */}
        <motion.circle cx="40" cy="50" r="2" fill="#4FD1C5" />
        <motion.circle cx="60" cy="50" r="2" fill="#4FD1C5" />
        {/* Ninja sword */}
        <motion.path
          d="M70 70L90 50L95 55L75 75Z"
          fill="#E2E8F0"
          animate={{
            rotate: [0, 45, 0],
            transition: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
        {/* Ninja scarf */}
        <motion.path
          d="M30 60C30 60 40 70 50 70C60 70 70 60 70 60"
          stroke="#4FD1C5"
          strokeWidth="3"
          fill="none"
          animate={{
            d: [
              "M30 60C30 60 40 70 50 70C60 70 70 60 70 60",
              "M30 60C30 60 40 65 50 65C60 65 70 60 70 60",
              "M30 60C30 60 40 70 50 70C60 70 70 60 70 60",
            ],
            transition: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
      </motion.svg>
    </motion.div>
  )
}

export default NinjaMaster

