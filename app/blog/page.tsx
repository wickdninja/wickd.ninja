import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const blogPosts = [
  {
    slug: "getting-started-with-localstack",
    title: "Getting Started with LocalStack",
    excerpt:
      "Learn how to set up and use LocalStack for local AWS service emulation, with examples using S3, SQS, Node.js, Docker, and Docker Compose.",
    date: "2025-02-20",
    tags: ["LocalStack", "AWS", "Docker", "Node.js"],
  },
  {
    slug: "event-sourcing-with-sns-sqs",
    title: "Event Sourcing with SNS/SQS in Domain-Driven Design",
    excerpt:
      "Learn how to implement event sourcing using Amazon SNS and SQS in Node.js and NestJS applications for building scalable, event-driven systems.",
    date: "2025-02-15",
    tags: ["Event Sourcing", "SNS", "SQS", "Node.js", "NestJS"],
  },
  {
    slug: "new-blog-post",
    title: "New Blog Post Title",
    excerpt: "This is the excerpt for the new blog post.",
    date: "2025-03-15",
    tags: ["New", "Blog", "Post"],
  },
  {
    slug: "resilient-distributed-systems-with-policy-patterns",
    title: "Resilient Distributed Systems with Policy Patterns",
    excerpt:
      "Learn how to implement resiliency patterns in distributed systems using Polly for C# and equivalent patterns in TypeScript.",
    date: "2025-02-10",
    tags: ["Distributed Systems", "Resiliency", "Polly", "TypeScript"],
  },
  {
    slug: "getting-started-with-openai-chat-completions",
    title: "Getting Started with OpenAI Chat Completions",
    excerpt: "Learn how to implement chat completions using OpenAI and the AI SDK.",
    date: "2025-02-01",
    tags: ["OpenAI", "AI SDK", "Chat"],
  },
  {
    slug: "getting-started-with-openai-assistants",
    title: "Getting Started with OpenAI Assistants",
    excerpt: "Explore the power of OpenAI Assistants and how to integrate them into your applications.",
    date: "2025-01-15",
    tags: ["OpenAI", "AI SDK", "Assistants"],
  },
  {
    slug: "building-ai-powered-apps-with-vercel-ai-sdk",
    title: "Building AI-Powered Apps with Vercel AI SDK",
    excerpt: "Discover how to leverage the Vercel AI SDK to create powerful AI-driven applications.",
    date: "2025-01-01",
    tags: ["Vercel", "AI SDK", "Development"],
  },
  {
    slug: "redis-concurrency-management-in-distributed-systems",
    title: "Redis Concurrency Management in Distributed Systems",
    excerpt:
      "Learn how to use Redis as a lock/mutex for managing concurrency in distributed systems, with examples of SQS and worker implementations.",
    date: "2025-02-08",
    tags: ["Redis", "Distributed Systems", "Concurrency"],
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">Blog</h1>
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-700 text-cyan-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

