"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import { BackNav } from "@/components/BackNav";

export type BlogPost = {
  title: string;
  date: string;
  tags: string[];
  content: string;
};
export type BlogPosts = Record<string, BlogPost>;

const blogPosts: BlogPosts = {
  "getting-started-with-openai-chat-completions": {
    title: "Getting Started with OpenAI Chat Completions",
    date: "2025-01-15",
    tags: ["OpenAI", "AI SDK", "Chat"],
    content: `
      <p>In this tutorial, we'll explore how to implement chat completions using OpenAI and the AI SDK. Chat completions are a powerful way to generate human-like responses in conversational applications.</p>

      <h2>Setting up the AI SDK</h2>
      <p>First, let's install the necessary packages:</p>

      <pre><code class="language-bash">npm install ai @ai-sdk/openai</code></pre>

      <h2>Implementing Chat Completions</h2>
      <p>Here's a basic example of how to use chat completions with the AI SDK:</p>

      <pre><code class="language-typescript">
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function chatCompletion() {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is the capital of France?" }
    ]
  })

  console.log(text)
}

chatCompletion()
      </code></pre>

      <p>This code snippet demonstrates how to generate a response using the OpenAI GPT-4 model. The AI SDK simplifies the process of interacting with OpenAI's API, making it easier to integrate AI capabilities into your applications.</p>

      <h2>Handling Streaming Responses</h2>
      <p>For a more interactive experience, you can use streaming responses:</p>

      <pre><code class="language-typescript">
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

async function streamingChatCompletion() {
  const stream = streamText({
    model: openai("gpt-4o"),
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Tell me a short story about a ninja." }
    ],
    onChunk: (chunk) => {
      if (chunk.type === 'text-delta') {
        process.stdout.write(chunk.text)
      }
    }
  })

  await stream.text
}

streamingChatCompletion()
      </code></pre>

      <p>This approach allows you to receive and process the response in real-time, which is particularly useful for chat interfaces or when you want to display the AI's response as it's being generated.</p>

      <h2>Conclusion</h2>
      <p>The AI SDK provides a straightforward way to implement chat completions using OpenAI's powerful language models. By leveraging these tools, you can create more interactive and intelligent applications with ease.</p>
    `,
  },
  "getting-started-with-openai-assistants": {
    title: "Getting Started with OpenAI Assistants",
    date: "2025-02-15",
    tags: ["OpenAI", "AI SDK", "Assistants"],
    content: `
      <p>OpenAI Assistants provide a powerful way to create AI-powered agents that can perform complex tasks. In this tutorial, we'll explore how to get started with OpenAI Assistants using the AI SDK.</p>

      <h2>Setting up the Environment</h2>
      <p>First, ensure you have the AI SDK installed:</p>

      <pre><code class="language-bash">npm install ai @ai-sdk/openai</code></pre>

      <h2>Creating an Assistant</h2>
      <p>Here's how you can create and use an OpenAI Assistant:</p>

      <pre><code class="language-typescript">
import { useAssistant } from "ai/react"
import { openai } from "@ai-sdk/openai"

function AssistantComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useAssistant({
    api: openai(),
    model: "gpt-4o",
    initialMessages: [
      {
        role: "system",
        content: "You are a helpful assistant specializing in web development."
      }
    ]
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Ask about web development..."
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
      </code></pre>

      <p>This example demonstrates how to create a simple chat interface with an AI assistant specialized in web development.</p>

      <h2>Customizing Assistant Behavior</h2>
      <p>You can customize the assistant's behavior by modifying the system message or adding specific instructions:</p>

      <pre><code class="language-typescript">
const { messages, input, handleInputChange, handleSubmit } = useAssistant({
  api: openai(),
  model: "gpt-4o",
  initialMessages: [
    {
      role: "system",
      content: "You are a helpful assistant specializing in web development. Always provide code examples when explaining concepts."
    }
  ]
})
      </code></pre>

      <h2>Handling Assistant Responses</h2>
      <p>The AI SDK provides hooks to handle assistant responses efficiently:</p>

      <pre><code class="language-typescript">
import { useAssistant } from "ai/react"
import { openai } from "@ai-sdk/openai"

function AssistantComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAssistant({
    api: openai(),
    model: "gpt-4o",
    initialMessages: [
      {
        role: "system",
        content: "You are a helpful assistant specializing in web development."
      }
    ]
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Ask about web development..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
      </code></pre>

      <p>This example shows how to handle loading states and disable inputs while the assistant is processing a request.</p>

      <h2>Conclusion</h2>
      <p>OpenAI Assistants, combined with the AI SDK, provide a powerful toolset for creating intelligent, conversational interfaces in your applications. By customizing the assistant's behavior and efficiently handling responses, you can create engaging AI-powered experiences for your users.</p>
    `,
  },
  "building-ai-powered-apps-with-vercel-ai-sdk": {
    title: "Building AI-Powered Apps with Vercel AI SDK",
    date: "2025-02-01",
    tags: ["Vercel", "AI SDK", "Development"],
    content: `
      <p>The Vercel AI SDK offers a comprehensive toolkit for building AI-powered applications. In this tutorial, we'll explore how to leverage the SDK to create intelligent and responsive apps.</p>

      <h2>Getting Started with Vercel AI SDK</h2>
      <p>First, let's install the necessary packages:</p>

      <pre><code class="language-bash">npm install ai @ai-sdk/openai</code></pre>

      <h2>Creating a Simple AI-Powered Component</h2>
      <p>Here's an example of how to create a component that generates text based on user input:</p>

      <pre><code class="language-typescript">
import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { openai } from '@ai-sdk/openai'

export function AITextGenerator() {
  const [prompt, setPrompt] = useState('')
  const { complete, completion, isLoading } = useCompletion({
    api: openai(),
    model: 'gpt-4o',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    complete(prompt)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {completion && (
        <div>
          <h3>Generated Text:</h3>
          <p>{completion}</p>
        </div>
      )}
    </div>
  )
}
      </code></pre>

      <p>This component uses the <code>useCompletion</code> hook from the AI SDK to generate text based on user input.</p>

      <h2>Implementing Streaming Responses</h2>
      <p>For a more interactive experience, you can implement streaming responses:</p>

      <pre><code class="language-typescript">
import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { openai } from '@ai-sdk/openai'

export function StreamingAITextGenerator() {
  const [prompt, setPrompt] = useState('')
  const { complete, completion, isLoading } = useCompletion({
    api: openai(),
    model: 'gpt-4o',
    stream: true,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    complete(prompt)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      <div>
        <h3>Generated Text:</h3>
        <p>{completion}</p>
      </div>
    </div>
  )
}
      </code></pre>

      <p>This example demonstrates how to use the <code>stream: true</code> option to receive real-time updates as the AI generates text.</p>

      <h2>Error Handling and Retry Logic</h2>
      <p>It's important to implement proper error handling and retry logic in AI-powered applications:</p>

      <pre><code class="language-typescript">
import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { openai } from '@ai-sdk/openai'

export function AITextGeneratorWithErrorHandling() {
  const [prompt, setPrompt] = useState('')
  const { complete, completion, isLoading, error } = useCompletion({
    api: openai(),
    model: 'gpt-4o',
    onError: (error) => {
      console.error('AI completion error:', error)
    },
    retryCount: 3,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    complete(prompt)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p className="error">Error: {error.message}</p>}
      {completion && (
        <div>
          <h3>Generated Text:</h3>
          <p>{completion}</p>
        </div>
      )}
    </div>
  )
}
      </code></pre>

      <p>This example includes error handling and automatic retry logic to improve the reliability of your AI-powered application.</p>

      <h2>Conclusion</h2>
      <p>The Vercel AI SDK provides powerful tools for building AI-powered applications with ease. By leveraging features like streaming responses and implementing proper error handling, you can create robust and engaging AI experiences for your users.</p>
    `,
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-3xl text-cyan-400">
                {post.title}
              </CardTitle>
              <div className="flex justify-between items-center mt-4">
                <div className="space-x-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-700 text-cyan-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{post.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
