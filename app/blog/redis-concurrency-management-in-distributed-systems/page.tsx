import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import { BackNav } from "@/components/BackNav";

export default function RedisConcurrencyManagementPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Redis Concurrency Management in Distributed Systems
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Redis
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Distributed Systems
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Concurrency
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-08</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction</h2>
              <p>
                In distributed systems, managing concurrency is crucial for
                maintaining data integrity and preventing race conditions.
                Redis, a versatile in-memory data structure store, offers
                powerful features that can be leveraged for concurrency control.
                In this post, we'll explore how to use Redis as a lock/mutex in
                distributed systems, particularly in the context of message
                processing with SQS and workers.
              </p>

              <h2>Using Redis as a Lock/Mutex</h2>
              <p>
                One of the primary use cases for Redis in distributed systems is
                implementing distributed locks. This is particularly useful when
                you have multiple workers processing messages from a queue like
                SQS, and you need to ensure that only one worker processes a
                particular task at a time.
              </p>

              <h3>Implementing a Distributed Lock with Redis</h3>
              <p>
                Let's create a Redis-based lock mechanism that we can integrate
                into our message processing workflow:
              </p>

              <CodeBlock language="typescript">
                {`import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

class RedisLock {
  private redis: Redis;
  private lockKey: string;
  private lockValue: string;
  private ttl: number;

  constructor(redisClient: Redis, lockKey: string, ttl: number = 30000) {
    this.redis = redisClient;
    this.lockKey = lockKey;
    this.lockValue = uuidv4();
    this.ttl = ttl;
  }

  async acquire(): Promise<boolean> {
    const result = await this.redis.set(this.lockKey, this.lockValue, 'PX', this.ttl, 'NX');
    return result === 'OK';
  }

  async release(): Promise<void> {
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    await this.redis.eval(script, 1, this.lockKey, this.lockValue);
  }
}

export default RedisLock;`}
              </CodeBlock>

              <p>
                This <code>RedisLock</code> class provides a simple interface
                for acquiring and releasing distributed locks using Redis. The{" "}
                <code>acquire</code> method attempts to set a key in Redis with
                a unique value and a TTL. If successful, the lock is acquired.
                The <code>release</code> method uses a Lua script to ensure that
                only the lock owner can release it.
              </p>

              <h3>Integrating Redis Lock with Message Processing</h3>
              <p>
                Now, let's modify the base handler you provided to incorporate
                the Redis lock:
              </p>

              <CodeBlock language="typescript">
                {`import { Message } from 'aws-sdk/clients/sqs';
import { AxiosError } from 'axios';
import { serializeError } from 'serialize-error';
import { Logger } from 'winston';
import { normalizeRawMessageDelivery } from './utils';
import Redis from 'ioredis';
import RedisLock from './RedisLock';

export const EMPTY_MESSAGE_WARNING = 'message body is empty; skipping';
export const PROCESSING_ERROR = 'processing_error';
export const LOCK_ACQUISITION_FAILED = 'failed to acquire lock; skipping message';

export abstract class BaseHandler<T> {
  protected redis: Redis;

  constructor(protected logger: Logger, redisUrl: string) {
    super();
    this.redis = new Redis(redisUrl);
  }

  abstract hydrate(input: AWS.SQS.Message): T | null;
  abstract handle(input: T): Promise<void>;

  async _onMessage(message: Message): Promise<void> {
    const logger = this.logger.child({ method: this._onMessage.name, messageId: message?.MessageId });

    const input = this.hydrate(message);
    if (!input) {
      logger.warn(EMPTY_MESSAGE_WARNING, { message });
      return;
    }

    const lockKey = \`lock:\${message.MessageId}\`;
    const lock = new RedisLock(this.redis, lockKey);

    try {
      const acquired = await lock.acquire();
      if (!acquired) {
        logger.warn(LOCK_ACQUISITION_FAILED, { messageId: message.MessageId });
        return;
      }

      logger.info('handling message', { input });
      const result = await this.handle(input);
      logger.info('message handled', { result });
    } catch (error) {
      logger.error('failed to handle message', { cause: serializeError(error) });
      throw error;
    } finally {
      await lock.release();
    }
  }

  async _onError(err: Error | AxiosError, message: AWS.SQS.Message) {
    const logger = this.logger.child({ method: this._onError.name });
    try {
      const input = this.hydrate(message);
      const companyId = input && typeof input === 'object' && 'companyId' in input ? input.companyId : undefined;
      logger.error(\`\${PROCESSING_ERROR}\`, {
        sns: message,
        input,
        companyId,
        cause: serializeError(err),
      });
    } catch (error) {
      logger.error('failed to handle error', { cause: serializeError(error) });
      throw error;
    }
  }
}
`}
              </CodeBlock>

              <p>
                In this updated version, we've integrated the Redis lock into
                the <code>_onMessage</code> method. Before processing a message,
                we attempt to acquire a lock using the message ID as the lock
                key. If the lock is acquired successfully, we proceed with
                message handling. After processing (or in case of an error), we
                ensure the lock is released in the <code>finally</code> block.
              </p>

              <h2>Other Common Redis Patterns in Distributed Systems</h2>
              <p>
                Redis is a versatile tool in distributed systems. Here are some
                other common patterns:
              </p>

              <h3>1. Caching</h3>
              <p>
                Redis is often used as a caching layer to reduce database load
                and improve response times:
              </p>

              <CodeBlock language="typescript">
                {`import Redis from 'ioredis';

class CacheService {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl || 3600);
  }
}
`}
              </CodeBlock>

              <h3>2. Rate Limiting</h3>
              <p>
                Redis can be used to implement rate limiting in distributed
                systems:
              </p>

              <CodeBlock language="typescript">
                {`import Redis from 'ioredis';

class RateLimiter {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async isRateLimited(key: string, limit: number, window: number): Promise<boolean> {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    return current > limit;
  }
}
`}
              </CodeBlock>

              <h3>3. Pub/Sub Messaging</h3>
              <p>
                Redis pub/sub feature can be used for real-time messaging
                between different parts of a distributed system:
              </p>

              <CodeBlock language="typescript">
                {`import Redis from 'ioredis';

class PubSubService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(redisUrl: string) {
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.publisher.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void): void {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }
}
`}
              </CodeBlock>

              <h3>4. Distributed Counters</h3>
              <p>
                Redis can efficiently manage counters across a distributed
                system:
              </p>

              <CodeBlock language="typescript">
                {`import Redis from 'ioredis';

class DistributedCounter {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    return this.redis.incrby(key, amount);
  }

  async get(key: string): Promise<number> {
    const value = await this.redis.get(key);
    return value ? parseInt(value, 10) : 0;
  }
}
`}
              </CodeBlock>

              <h2>Conclusion</h2>
              <p>
                Redis is a powerful tool for managing concurrency and
                implementing various patterns in distributed systems. By using
                Redis as a lock mechanism, we can ensure that our message
                processing system handles tasks efficiently and without
                conflicts. Additionally, Redis's versatility allows it to serve
                multiple purposes in a distributed architecture, from caching
                and rate limiting to real-time messaging and distributed
                counting.
              </p>
              <p>
                When implementing these patterns, always consider the potential
                failure modes and ensure proper error handling and recovery
                mechanisms are in place. Redis's speed and reliability make it
                an excellent choice for these critical distributed system
                components, but like any technology, it should be used
                thoughtfully and with appropriate safeguards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
