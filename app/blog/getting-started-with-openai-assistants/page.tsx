"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CodeBlock from "@/components/CodeBlock"

export default function OpenAIAssistantsPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">Getting Started with OpenAI Assistants</CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  OpenAI
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Assistants API
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  AI
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-01-15</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to OpenAI Assistants</h2>
              <p>
                OpenAI's Assistants API provides a powerful way to create AI-powered applications with built-in
                capabilities like Code Interpreter, Retrieval, and Function calling. In this tutorial, we'll explore how
                to create and use Assistants, manage conversation threads, and handle responses effectively.
              </p>

              <h2>Step 1: Setting up the Environment</h2>
              <p>First, let's install the OpenAI Node.js package:</p>
              <CodeBlock language="bash">{`npm install openai`}</CodeBlock>

              <h2>Step 2: Creating an Assistant</h2>
              <p>Let's create a simple assistant that can help with programming tasks:</p>
              <CodeBlock language="typescript">
                {`import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function createAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Code Helper",
      instructions: "You are a programming assistant. Help users write and debug code.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview"
    })

    console.log('Assistant created:', assistant.id)
    return assistant
  } catch (error) {
    console.error('Error creating assistant:', error)
    throw error
  }
}`}
              </CodeBlock>
              <p>
                This code creates an Assistant with the Code Interpreter tool enabled, allowing it to write, analyze,
                and debug code.
              </p>

              <h2>Step 3: Creating a Thread</h2>
              <p>Threads maintain conversation state. Let's create a thread and add a message:</p>
              <CodeBlock language="typescript">
                {`async function startConversation(question: string) {
  try {
    // Create a new thread
    const thread = await openai.beta.threads.create()
    
    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question
    })

    return thread
  } catch (error) {
    console.error('Error starting conversation:', error)
    throw error
  }
}`}
              </CodeBlock>

              <h2>Step 4: Running the Assistant</h2>
              <p>Now let's run the assistant on our thread and get its response:</p>
              <CodeBlock language="typescript">
                {`async function getAssistantResponse(threadId: string, assistantId: string) {
  try {
    // Create a run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    })

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(threadId)
    
    // Return the latest assistant message
    const lastMessage = messages.data
      .filter(message => message.role === "assistant")
      .pop()

    return lastMessage?.content[0]?.text?.value || "No response received"
  } catch (error) {
    console.error('Error getting assistant response:', error)
    throw error
  }
}`}
              </CodeBlock>

              <h2>Step 5: Putting It All Together</h2>
              <p>Let's create a complete example that uses all these pieces:</p>
              <CodeBlock language="typescript">
                {`import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function main() {
  try {
    // Create an assistant
    const assistant = await openai.beta.assistants.create({
      name: "Code Helper",
      instructions: "You are a programming assistant. Help users write and debug code.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview"
    })

    // Start a conversation
    const thread = await openai.beta.threads.create()

    // Add a user message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Can you help me write a function to calculate fibonacci numbers?"
    })

    // Get the assistant's response
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    })

    // Wait for the response
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data
      .filter(message => message.role === "assistant")
      .pop()

    console.log('Assistant response:', lastMessage?.content[0]?.text?.value)

    // Clean up
    await openai.beta.assistants.del(assistant.id)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()`}
              </CodeBlock>

              <h2>Step 6: Creating a Next.js API Route</h2>
              <p>Let's create an API route to handle assistant interactions:</p>
              <CodeBlock language="typescript">
                {`// app/api/assistant/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    // Create an assistant (or use a stored assistant ID)
    const assistant = await openai.beta.assistants.create({
      name: "Code Helper",
      instructions: "You are a programming assistant. Help users write and debug code.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview"
    })

    // Create a thread and add the user's question
    const thread = await openai.beta.threads.create()
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    })

    // Wait for the response
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data
      .filter(message => message.role === "assistant")
      .pop()

    // Clean up
    await openai.beta.assistants.del(assistant.id)

    return NextResponse.json({
      response: lastMessage?.content[0]?.text?.value || "No response received"
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get assistant response' },
      { status: 500 }
    )
  }
}`}
              </CodeBlock>

              <h2>Step 7: Creating a React Component</h2>
              <p>Finally, let's create a React component to interact with our assistant:</p>
              <CodeBlock language="typescript">
                {`'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function AssistantChat() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Failed to get response from assistant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me about programming..."
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Getting Response...' : 'Ask Assistant'}
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

              <h2>Conclusion</h2>
              <p>
                You've now learned how to use OpenAI's Assistants API to create AI-powered applications. The API
                provides a robust way to maintain conversation state through threads and leverage powerful tools like
                the Code Interpreter. Remember to handle your assistant and thread lifecycle appropriately, and consider
                implementing proper error handling and retry logic in production applications.
              </p>

              <p>Key takeaways:</p>
              <ul>
                <li>Assistants can be created with specific instructions and tools</li>
                <li>Threads maintain conversation state and history</li>
                <li>Runs execute the assistant's response generation</li>
                <li>The Code Interpreter tool allows assistants to write and execute code</li>
                <li>Always clean up resources by deleting assistants when they're no longer needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

