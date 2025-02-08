import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CodeBlock from "@/components/CodeBlock"

export default function ResilientDistributedSystemsPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">Resilient Distributed Systems with Policy Patterns</CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Distributed Systems
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Resiliency
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Polly
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  TypeScript
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-10</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to Resiliency in Distributed Systems</h2>
              <p>
                In distributed systems, failures are inevitable. Network issues, service outages, and unexpected errors
                can occur at any time. To build robust and reliable systems, we need to implement resiliency patterns.
                One powerful approach is to use policy-based programming, which allows us to define and apply consistent
                error-handling and retry logic across our applications.
              </p>
              <p>
                In this post, we'll explore how to implement resiliency patterns using Polly for C# and demonstrate
                equivalent patterns in TypeScript.
              </p>

              <h2>Polly: Resilience and Transient-Fault-Handling for .NET</h2>
              <p>
                Polly is a .NET library that provides a fluent API for defining various resilience and
                transient-fault-handling policies. Let's look at some common patterns and how to implement them using
                Polly.
              </p>

              <h3>1. Retry Policy</h3>
              <p>
                A retry policy allows you to automatically retry an operation that has failed, based on certain
                conditions.
              </p>
              <CodeBlock language="csharp">
                {`using Polly;

var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .WaitAndRetryAsync(3, retryAttempt => 
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

await retryPolicy.ExecuteAsync(async () =>
{
    // Your HTTP request logic here
    await httpClient.GetAsync("https://api.example.com");
});`}
              </CodeBlock>

              <h3>2. Circuit Breaker</h3>
              <p>
                A circuit breaker prevents a program from repeatedly trying to execute an operation that's likely to
                fail, allowing it to continue without waiting for the fault to be fixed or wasting CPU cycles.
              </p>
              <CodeBlock language="csharp">
                {`var circuitBreakerPolicy = Policy
    .Handle<HttpRequestException>()
    .CircuitBreakerAsync(
        exceptionsAllowedBeforeBreaking: 2,
        durationOfBreak: TimeSpan.FromMinutes(1)
    );

await circuitBreakerPolicy.ExecuteAsync(async () =>
{
    // Your HTTP request logic here
    await httpClient.GetAsync("https://api.example.com");
});`}
              </CodeBlock>

              <h3>3. Timeout</h3>
              <p>A timeout policy ensures that an operation doesn't take longer than a specified duration.</p>
              <CodeBlock language="csharp">
                {`var timeoutPolicy = Policy.TimeoutAsync(30);

await timeoutPolicy.ExecuteAsync(async () =>
{
    // Your long-running operation here
    await LongRunningTaskAsync();
});`}
              </CodeBlock>

              <h3>4. Bulkhead Isolation</h3>
              <p>Bulkhead isolation limits the number of concurrent executions of a particular operation.</p>
              <CodeBlock language="csharp">
                {`var bulkheadPolicy = Policy.BulkheadAsync(10, 100);

await bulkheadPolicy.ExecuteAsync(async () =>
{
    // Your operation here
    await SomeOperationAsync();
});`}
              </CodeBlock>

              <h2>Implementing Resilience Patterns in TypeScript</h2>
              <p>
                While there isn't a direct equivalent to Polly in the TypeScript ecosystem, we can implement similar
                patterns using existing libraries or by creating our own utility functions. Let's look at how we can
                implement these patterns in TypeScript.
              </p>

              <h3>1. Retry Pattern</h3>
              <p>We can implement a retry pattern using a simple recursive function:</p>
              <CodeBlock language="typescript">
                {`async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  delay: number
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (maxRetries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, maxRetries - 1, delay * 2);
  }
}

// Usage
await retryOperation(
  () => fetch('https://api.example.com'),
  3,
  1000
);`}
              </CodeBlock>

              <h3>2. Circuit Breaker Pattern</h3>
              <p>Here's a basic implementation of a circuit breaker in TypeScript:</p>
              <CodeBlock language="typescript">
                {`class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number,
    private timeout: number
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker(3, 60000);
try {
  const result = await breaker.execute(() => fetch('https://api.example.com'));
} catch (error) {
  console.error('Operation failed:', error);
}`}
              </CodeBlock>

              <h3>3. Timeout Pattern</h3>
              <p>We can implement a timeout pattern using Promise.race():</p>
              <CodeBlock language="typescript">
                {`function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
  );
  return Promise.race([operation(), timeoutPromise]);
}

// Usage
try {
  const result = await withTimeout(
    () => fetch('https://api.example.com'),
    5000
  );
} catch (error) {
  console.error('Operation failed:', error);
}`}
              </CodeBlock>

              <h3>4. Bulkhead Pattern</h3>
              <p>Here's a simple implementation of the bulkhead pattern:</p>
              <CodeBlock language="typescript">
                {`class Bulkhead {
  private executing = 0;
  private queue: (() => void)[] = [];

  constructor(private maxConcurrent: number) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.executing >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.executing++;
    try {
      return await operation();
    } finally {
      this.executing--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }
}

// Usage
const bulkhead = new Bulkhead(10);
const results = await Promise.all(
  Array(20).fill(0).map(() =>
    bulkhead.execute(() => fetch('https://api.example.com'))
  )
);`}
              </CodeBlock>

              <h2>Conclusion</h2>
              <p>
                Implementing resiliency patterns is crucial for building robust distributed systems. While Polly
                provides a comprehensive and easy-to-use solution for .NET applications, we can implement similar
                patterns in TypeScript using custom implementations or existing libraries.
              </p>
              <p>
                By applying these patterns consistently across your distributed system, you can significantly improve
                its reliability and fault tolerance. Remember that the specific implementation may vary based on your
                exact requirements and the libraries available in your ecosystem.
              </p>
              <p>
                As you design and build distributed systems, consider how these resiliency patterns can be applied to
                your specific use cases to create more robust and reliable applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

