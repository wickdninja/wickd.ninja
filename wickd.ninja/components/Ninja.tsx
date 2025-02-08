"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Ninja() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll()
  const [currentBuilding, setCurrentBuilding] = useState(0)

  // Create multiple transform values for different movements
  const x = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 300, 100, 400, 200, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -100, -200, -300, -400, -500])
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 360, 720, 1080, 1440, 1800])

  // Update current building based on scroll position
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setCurrentBuilding(Math.floor(latest * 5))
    })
  }, [scrollYProgress])

  return (
    <motion.div
      ref={ref}
      className="fixed left-1/2 top-1/2 z-50"
      style={{
        x,
        y,
        rotate,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" className="fill-cyan-400">
          {/* Ninja body */}
          <circle cx="50" cy="50" r="40" className="fill-gray-800" />
          {/* Ninja scarf */}
          <path d="M30 50 H70 L80 60 H20 L30 50" className="fill-cyan-400" />
          {/* Ninja eyes */}
          <circle cx="40" cy="45" r="5" className="fill-cyan-400" />
          <circle cx="60" cy="45" r="5" className="fill-cyan-400" />
          {/* Ninja sword */}
          <motion.path
            d="M70 70 L90 50 L95 55 L75 75 Z"
            className="fill-gray-300"
            animate={{
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

