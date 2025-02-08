import React from "react";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Type assertion workaround
const SyntaxHighlighter = Prism as unknown as React.FC<SyntaxHighlighterProps>;

interface CodeBlockProps {
  language: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: "0.375rem",
        padding: "1rem",
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        margin: 0,
      }}
      PreTag="div"
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
