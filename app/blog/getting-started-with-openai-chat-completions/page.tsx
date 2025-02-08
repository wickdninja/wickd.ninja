import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import { BackNav } from "@/components/BackNav";

export default function ChatCompletionsPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Getting Started with OpenAI Chat Completions
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  OpenAI
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
                  Chat
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-01</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to OpenAI Chat Completions</h2>
              <p>
                OpenAI Chat Completions are a powerful tool for generating
                human-like responses in conversational applications. In this
                tutorial, we'll walk through the process of implementing chat
                completions using OpenAI and the AI SDK, perfect for beginners
                looking to dive into AI-powered conversations.
              </p>

              <h2>Step 1: Setting up the Environment</h2>
              <p>
                First, let's set up our project and install the necessary
                packages:
              </p>
              <CodeBlock language="bash">
                {`npm init -y
npm install ai @ai-sdk/openai`}
              </CodeBlock>
              <p>
                This creates a new Node.js project and installs the AI SDK along
                with the OpenAI integration.
              </p>

              <h2>Step 2: Configuring the OpenAI API</h2>
              <p>
                Before we start coding, you need to set up your OpenAI API key.
                Create a <code>.env</code> file in your project root and add
                your API key:
              </p>
              <CodeBlock language="plaintext">{`OPENAI_API_KEY=your_api_key_here`}</CodeBlock>
              <p>
                Make sure to replace <code>your_api_key_here</code> with your
                actual OpenAI API key.
              </p>

              <h2>Step 3: Implementing Basic Chat Completions</h2>
              <p>
                Now, let's create a simple script to generate a chat completion:
              </p>
              <CodeBlock language="typescript">
                {`import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import dotenv from "dotenv"

dotenv.config()

async function chatCompletion() {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" }
      ]
    })

    console.log("AI response:", text)
  } catch (error) {
    console.error("Error:", error)
  }
}

chatCompletion()`}
              </CodeBlock>
              <p>This script does the following:</p>
              <ol>
                <li>
                  Imports the necessary functions from the AI SDK and OpenAI
                  integration.
                </li>
                <li>
                  Loads the environment variables (including our API key).
                </li>
                <li>
                  Defines an async function <code>chatCompletion</code>.
                </li>
                <li>
                  Uses <code>generateText</code> to create a chat completion
                  with a system message and a user query.
                </li>
                <li>Logs the AI's response or any errors that occur.</li>
              </ol>

              <h2>Step 4: Running the Script</h2>
              <p>
                Save the above code in a file named <code>chat.js</code> and run
                it using Node.js:
              </p>
              <CodeBlock language="bash">{`node chat.js`}</CodeBlock>
              <p>
                You should see the AI's response to the question "What is the
                capital of France?"
              </p>

              <h2>Step 5: Implementing Streaming Responses</h2>
              <p>
                For a more interactive experience, let's modify our script to
                use streaming responses:
              </p>
              <CodeBlock language="typescript">
                {`import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import dotenv from "dotenv"

dotenv.config()

async function streamingChatCompletion() {
  try {
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
    console.log("\\nStreaming completed.")
  } catch (error) {
    console.error("Error:", error)
  }
}

streamingChatCompletion()`}
              </CodeBlock>
              <p>
                This script uses the <code>streamText</code> function to receive
                the AI's response in chunks, writing each chunk to the console
                as it arrives. This approach is particularly useful for creating
                more responsive chat interfaces.
              </p>

              <h2>Step 6: Handling Multiple Turns in a Conversation</h2>
              <p>
                Let's create a more complex example that simulates a multi-turn
                conversation:
              </p>
              <CodeBlock language="typescript">
                {`import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import dotenv from "dotenv"

dotenv.config()

async function conversationSimulation() {
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hi, I'm planning a trip to Paris." },
  ]

  try {
    for (let i = 0; i < 3; i++) {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages: messages
      })

      console.log("AI:", text)
      messages.push({ role: "assistant", content: text })

      // Simulate user response
      const userResponses = [
        "What are some must-visit attractions?",
        "How many days should I plan for my trip?",
        "Thank you for your help!"
      ]
      console.log("User:", userResponses[i])
      messages.push({ role: "user", content: userResponses[i] })
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

conversationSimulation()`}
              </CodeBlock>
              <p>
                This script simulates a conversation with multiple turns,
                demonstrating how to maintain context throughout a chat session.
              </p>

              <h2>Conclusion</h2>
              <p>
                You've now learned the basics of implementing chat completions
                using OpenAI and the AI SDK. From here, you can expand on these
                concepts to create more complex conversational AI applications,
                integrate them into web interfaces, or use them for various
                natural language processing tasks.
              </p>
              <p>
                Remember to always handle errors gracefully, respect API rate
                limits, and consider the ethical implications of AI-generated
                content in your applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
