"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState } from "react"

interface TechBuildingProps {
  company: string
  role: string
  period: string
  description: string
  skills: string[]
  index: number
}

const TechBuilding = ({ company, role, period, description, skills, index }: TechBuildingProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { scrollYProgress } = useScroll()

  const buildingHeight = useTransform(scrollYProgress, [index * 0.2, (index + 1) * 0.2], ["0%", "100%"])

  return (
    <motion.div className="relative w-full h-[600px] perspective-1000" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-gray-800 rounded-t-lg cursor-pointer overflow-hidden"
        style={{ height: buildingHeight, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 3D effect for the building */}
        <motion.div
          className="absolute inset-0 bg-gray-700"
          style={{
            transform: "translateZ(-50px)",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)",
          }}
        />

        {/* Windows pattern */}
        <div className="grid grid-cols-5 gap-2 p-4 h-full">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-cyan-400/20 rounded-sm"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                boxShadow: [
                  "0 0 5px rgba(79,209,197,0.2)",
                  "0 0 20px rgba(79,209,197,0.6)",
                  "0 0 5px rgba(79,209,197,0.2)",
                ],
              }}
              transition={{
                duration: 4,
                delay: i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </div>

        {/* Company info card */}
        <motion.div
          className="absolute inset-x-4 bottom-4 bg-gray-900/90 backdrop-blur p-6 rounded-lg border border-cyan-500/20"
          animate={{
            height: isExpanded ? "80%" : "100px",
          }}
        >
          <h3 className="text-2xl font-bold text-cyan-400">{company}</h3>
          <p className="text-xl text-gray-300">{role}</p>
          <p className="text-sm text-gray-400">{period}</p>

          <motion.div
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? "auto" : 0,
            }}
            className="mt-4 overflow-hidden"
          >
            <p className="text-gray-300 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-cyan-500/10 rounded-full text-sm text-cyan-400">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default TechBuilding

