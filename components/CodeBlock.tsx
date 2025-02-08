import type React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  language: string
  children: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: "0.375rem",
        padding: "1rem",
        backgroundColor: "rgba(30, 41, 59, 0.8)", // Slightly transparent dark background
      }}
    >
      {children}
    </SyntaxHighlighter>
  )
}

export default CodeBlock

