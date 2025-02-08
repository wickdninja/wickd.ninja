"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import NinjaMaster from "@/components/NinjaMaster";
import ParticleField from "@/components/ParticleField";
import FloatingSkills from "@/components/FloatingSkills";
import Biography from "@/components/Biography";
import Image from "next/image";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="relative min-h-screen bg-gray-900 overflow-hidden">
      <Navbar />
      {/* Parallax background */}
      <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        <ParticleField />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-2 glow">
            <span className="text-gray-300">wickd</span>
            <span className="text-cyan-400">ninja</span>
          </h1>
          <div className="relative -mt-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/katana-h6RLbD4MyHExwxISwEEGw4ljRh484W.png"
              alt="Katana"
              width={800}
              height={100}
              className="mx-auto"
              priority
            />
          </div>
          <div className="font-mono text-gray-300 p-4 rounded-lg inline-block mt-4">
            <p>Nate Ross / wickdninja</p>
            <p className="text-cyan-400">Staff Engineer @ Bambee</p>
          </div>
        </motion.div>
      </div>

      {/* Biography section */}
      <Biography />

      {/* Floating skills with enhanced animations */}
      <FloatingSkills />

      {/* Animated ninja */}
      <NinjaMaster />
    </main>
  );
}
