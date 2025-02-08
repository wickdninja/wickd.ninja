"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const CodingTerminal = () => {
  const [text, setText] = useState("")
  const fullText = `
const ninja = {
  name: 'Nate Ross',
  alias: 'wickdninja',
  skills: ['React', 'Node.js', 'AWS', 'AI', 'Kubernetes'],
  mission: 'To code with stealth and precision'
};

console.log('Initializing ninja mode...');
ninja.skills.forEach(skill => {
  console.log(\`Sharpening \${skill} skills\`);
});
console.log('Ninja mode activated!');
`.trim()

  useEffect(() => {
    let i = 0
    const typing = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(typing)
    }, 50)

    return () => clearInterval(typing)
  }, [])

  return (
    <motion.div
      className="bg-gray-900 p-4 rounded-lg border border-cyan-500/20 font-mono text-sm overflow-hidden"
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex space-x-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <pre className="text-gray-300">
        <code>{text}</code>
      </pre>
    </motion.div>
  )
}

export default CodingTerminal

