"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-cyan-400 font-bold text-xl hover:text-cyan-300 transition-colors">
            wickd.ninja
          </Link>

          <div className="flex space-x-8">
            {[
              ["Home", "/"],
              ["Resume", "/resume"],
              ["Blog", "/blog"],
              ["Projects", "/projects"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([title, url]) => (
              <Link
                key={title}
                href={url}
                className={`text-gray-300 hover:text-cyan-400 transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === url ? "text-cyan-400" : ""
                }`}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

