"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import { BackNav } from "@/components/BackNav";

export default function VercelAISDKPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Building AI-Powered Apps with Vercel AI SDK
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Vercel
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  AI SDK
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  v0
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-01-01</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to v0 and the Vercel AI SDK</h2>
              <p>
                v0 is an AI coding assistant created by Vercel that leverages
                the power of the AI SDK to provide intelligent code generation
                and assistance. In this tutorial, we'll explore how to build
                AI-powered applications using the AI SDK, with a particular
                focus on implementing v0-like functionality [^1].
              </p>

              <h2>Step 1: Setting up the Environment</h2>
              <p>First, let's install the necessary packages:</p>
              <CodeBlock language="bash">{`npm install ai @ai-sdk/openai`}</CodeBlock>
              <p>
                The AI SDK provides a standardized way to work with different AI
                models, making it easier to integrate AI capabilities into your
                applications [^2].
              </p>

              <h2>Step 2: Creating an AI Text Generation Component</h2>
              <p>
                Let's create a component that generates text using the AI SDK,
                similar to how v0 processes prompts:
              </p>
              <CodeBlock language="typescript">
                {`// app/api/generate/route.ts
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt,
      system: \`You are v0, an AI coding assistant created by Vercel.
              You help users write high-quality code using modern best practices.
              You specialize in React, Next.js App Router, and modern web development.\`,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}`}
              </CodeBlock>

              <h2>Step 3: Implementing a Chat Interface</h2>
              <p>
                Now, let's create a chat interface component that interacts with
                our AI:
              </p>
              <CodeBlock language="typescript">
                {`// components/AIChat.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function AIChat() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setResponse(data.text)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Failed to generate response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me about coding..."
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Response'}
        </Button>
      </form>

      {response && (
        <Card className="p-4">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </Card>
      )}
    </div>
  )
}`}
              </CodeBlock>

              <h2>Step 4: Implementing Streaming Responses</h2>
              <p>
                To create a more interactive experience like v0, let's implement
                streaming responses [^1]:
              </p>
              <CodeBlock language="typescript">
                {`// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    const stream = streamText({
      model: openai('gpt-4o'),
      prompt,
      system: \`You are v0, an AI coding assistant created by Vercel.
              You help users write high-quality code using modern best practices.
              You specialize in React, Next.js App Router, and modern web development.\`,
      onChunk: (chunk) => {
        if (chunk.type === 'text-delta') {
          // Stream the chunk to the client
        }
      },
    })

    return new Response(stream)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}`}
              </CodeBlock>

              <h2>Step 5: Creating a Streaming Chat Component</h2>
              <p>
                Let's update our chat component to handle streaming responses:
              </p>
              <CodeBlock language="typescript">
                {`// components/StreamingAIChat.tsx
'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function StreamingAIChat() {
  const [prompt, setPrompt] = useState('')

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/chat',
    onFinish: () => {
      setPrompt('')
    },
  })

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            handleInputChange(e)
          }}
          placeholder="Ask me about coding..."
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Response'}
        </Button>
      </form>

      {completion && (
        <Card className="p-4">
          <pre className="whitespace-pre-wrap">{completion}</pre>
        </Card>
      )}
    </div>
  )
}`}
              </CodeBlock>

              <h2>Step 6: Implementing Code Block Support</h2>
              <p>
                To handle code blocks like v0 does, let's create a
                markdown-enabled response component:
              </p>
              <CodeBlock language="typescript">
                {`// components/MarkdownResponse.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownResponseProps {
  content: string
}

export function MarkdownResponse({ content }: MarkdownResponseProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-4 overflow-hidden">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\\n$/, '')

            if (!inline && match) {
              return (
                <div className="relative group">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(code)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Card>
  )
}`}
              </CodeBlock>

              <h2>Step 7: Putting It All Together</h2>
              <p>
                Finally, let's create a complete page that uses all our
                components:
              </p>
              <CodeBlock language="typescript">
                {`// app/page.tsx
import { StreamingAIChat } from '@/components/StreamingAIChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-400">
              AI Code Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreamingAIChat />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}`}
              </CodeBlock>

              <h2>Using the AI SDK's Language Model Middleware</h2>
              <p>
                The AI SDK also provides experimental language model middleware
                for enhancing model behavior [^2]. Here's how you can use it:
              </p>
              <CodeBlock language="typescript">
                {`import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai'
import { openai } from '@ai-sdk/openai'

const wrappedModel = wrapLanguageModel({
  model: openai('gpt-4o'),
  middleware: {
    wrapGenerate: async ({ doGenerate, params }) => {
      console.log('Generating with params:', params)
      const result = await doGenerate()
      console.log('Generated text:', result.text)
      return result
    },
    wrapStream: async ({ doStream, params }) => {
      console.log('Streaming with params:', params)
      return doStream()
    },
  },
})`}
              </CodeBlock>

              <h2>Conclusion</h2>
              <p>
                You've now learned how to use the Vercel AI SDK to build
                AI-powered applications similar to v0. The SDK provides a
                powerful foundation for creating intelligent coding assistants
                with features like:
              </p>
              <ul>
                <li>Text generation with proper prompting</li>
                <li>Streaming responses for better interactivity</li>
                <li>Code block support with syntax highlighting</li>
                <li>Middleware for enhanced model behavior</li>
              </ul>
              <p>
                Remember to handle errors appropriately and consider
                implementing retry logic for production applications. The AI SDK
                makes it easy to create sophisticated AI features while
                maintaining a clean and maintainable codebase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
