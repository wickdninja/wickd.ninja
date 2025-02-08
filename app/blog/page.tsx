"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import { BackNav } from "@/components/BackNav";

const blogPosts = [
  {
    slug: "getting-started-with-localstack",
    title: "Getting Started with LocalStack",
    excerpt:
      "Learn how to set up and use LocalStack for local AWS development and testing.",
    date: "2023-07-25",
    tags: ["LocalStack", "AWS", "Development"],
  },
  {
    slug: "event-sourcing-with-sns-sqs",
    title: "Event Sourcing with SNS and SQS",
    excerpt:
      "Learn how to implement event sourcing using SNS and SQS in a distributed system.",
    date: "2024-01-22",
    tags: ["Event Sourcing", "SNS", "SQS", "Distributed Systems"],
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
    slug: "redis-concurrency-management-in-distributed-systems",
    title: "Redis Concurrency Management in Distributed Systems",
    excerpt:
      "Learn how to use Redis as a lock/mutex for managing concurrency in distributed systems, with examples of SQS and worker implementations.",
    date: "2025-02-08",
    tags: ["Redis", "Distributed Systems", "Concurrency"],
  },
  {
    slug: "getting-started-with-openai-chat-completions",
    title: "Getting Started with OpenAI Chat Completions",
    excerpt:
      "Learn how to implement chat completions using OpenAI and the AI SDK.",
    date: "2025-02-01",
    tags: ["OpenAI", "AI SDK", "Chat"],
  },
  {
    slug: "getting-started-with-openai-assistants",
    title: "Getting Started with OpenAI Assistants",
    excerpt:
      "Explore the power of OpenAI Assistants and how to integrate them into your applications.",
    date: "2025-01-15",
    tags: ["OpenAI", "AI SDK", "Assistants"],
  },
  {
    slug: "building-ai-powered-apps-with-vercel-ai-sdk",
    title: "Building AI-Powered Apps with Vercel AI SDK",
    excerpt:
      "Discover how to leverage the Vercel AI SDK to create powerful AI-driven applications.",
    date: "2025-01-01",
    tags: ["Vercel", "AI SDK", "Development"],
  },
];

// Group blog posts by year
function groupPostsByYear(posts: typeof blogPosts) {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof blogPosts>);
}

export default function BlogPage() {
  // Sort posts from newest to oldest
  const sortedPosts = blogPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Group posts by year (after sorting)
  const postsByYear = groupPostsByYear(sortedPosts);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8 transition-opacity hover:opacity-80">
          Blog Posts
        </h1>

        {/* Loop through each year, descending */}
        {Object.keys(postsByYear)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map((year) => {
            const yearPosts = postsByYear[parseInt(year)];
            return (
              <div key={year}>
                {/* Year Divider */}
                <div className="my-8 flex items-center text-sm sm:text-base">
                  <div className="flex-grow border-t border-cyan-800" />
                  <span className="mx-3 text-cyan-400 font-semibold">
                    {year}
                  </span>
                  <div className="flex-grow border-t border-cyan-800" />
                </div>

                {/* Year’s Posts */}
                <div className="space-y-6">
                  {yearPosts.map((post) => (
                    <div
                      key={post.slug}
                      className="transform transition-all duration-200 hover:-translate-y-1"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20 hover:bg-gray-800/70 transition-colors rounded-md shadow-md hover:shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-2xl text-cyan-400">
                              {post.title}
                            </CardTitle>
                            <div className="flex justify-between items-center mt-2">
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
                              <span className="text-gray-400 text-sm">
                                {post.date}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300">{post.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
