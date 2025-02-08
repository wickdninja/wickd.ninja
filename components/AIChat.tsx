import type React from "react"
import { useState } from "react"

interface AIChatProps {
  apiKey: string
}

const AIChat: React.FC<AIChatProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResponse("Thinking...")

    try {
      const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 100,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.choices[0].text)
    } catch (error) {
      console.error("Error:", error)
      setResponse(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div>
      <h1>AI Chat</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt here..." />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  )
}

export default AIChat

