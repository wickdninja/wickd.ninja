import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import { BackNav } from "@/components/BackNav";

export default function EventSourcingWithSNSSQSPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Event Sourcing with SNS/SQS in Domain-Driven Design
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Event Sourcing
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  SNS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  SQS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Node.js
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  NestJS
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-15</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to Event Sourcing with SNS/SQS</h2>
              <p>
                Event Sourcing is a powerful pattern in domain-driven design
                that involves capturing all changes to an application's state as
                a sequence of events. When combined with Amazon SNS (Simple
                Notification Service) and SQS (Simple Queue Service), it enables
                building scalable, loosely coupled, and event-driven
                architectures. In this post, we'll explore how to implement
                event sourcing using SNS/SQS in Node.js and NestJS applications.
              </p>

              <h2>Setting Up the Infrastructure</h2>
              <p>
                Before we dive into the code, let's set up our AWS
                infrastructure using the AWS CDK (Cloud Development Kit) with
                TypeScript. We'll create an SNS topic and an SQS queue, then
                subscribe the queue to the topic.
              </p>

              <CodeBlock language="typescript">
                {`import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';

export class EventSourcingInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an SNS topic
    const topic = new sns.Topic(this, 'EventSourceTopic', {
      topicName: 'event-source-topic',
    });

    // Create an SQS queue
    const queue = new sqs.Queue(this, 'EventSourceQueue', {
      queueName: 'event-source-queue',
    });

    // Subscribe the SQS queue to the SNS topic
    topic.addSubscription(new subscriptions.SqsSubscription(queue));
  }
}

const app = new cdk.App();
new EventSourcingInfraStack(app, 'EventSourcingInfraStack');
app.synth();`}
              </CodeBlock>

              <p>
                This CDK script creates an SNS topic and an SQS queue, then
                subscribes the queue to the topic. This setup allows events
                published to the topic to be automatically sent to the queue for
                processing.
              </p>

              <h2>Implementing Event Sourcing in Node.js</h2>
              <p>
                Let's implement a simple event sourcing system using Node.js and
                the AWS SDK. We'll use the `aws-sdk` package to interact with
                SNS and SQS.
              </p>

              <h3>Publishing Events</h3>
              <CodeBlock language="typescript">
                {`import { SNS } from 'aws-sdk';

const sns = new SNS();

async function publishEvent(event: any) {
  const params = {
    Message: JSON.stringify(event),
    TopicArn: 'arn:aws:sns:us-east-1:123456789012:event-source-topic',
  };

  try {
    const result = await sns.publish(params).promise();
    console.log(\`Event published: \${result.MessageId}\`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}

// Usage
const event = {
  type: 'UserCreated',
  data: {
    userId: '123',
    email: 'user@example.com',
  },
  timestamp: new Date().toISOString(),
};

publishEvent(event);`}
              </CodeBlock>

              <h3>Consuming Events</h3>
              <CodeBlock language="typescript">
                {`import { SQS } from 'aws-sdk';

const sqs = new SQS();

async function processEvents() {
  const params = {
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/event-source-queue',
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
  };

  while (true) {
    try {
      const result = await sqs.receiveMessage(params).promise();
      if (result.Messages) {
        for (const message of result.Messages) {
          const event = JSON.parse(message.Body!);
          await handleEvent(event);
          await sqs.deleteMessage({
            QueueUrl: params.QueueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          }).promise();
        }
      }
    } catch (error) {
      console.error('Error processing events:', error);
    }
  }
}

async function handleEvent(event: any) {
  switch (event.type) {
    case 'UserCreated':
      console.log(\`User created: \${event.data.userId}\`);
      // Perform actions based on the event
      break;
    // Handle other event types
    default:
      console.log(\`Unknown event type: \${event.type}\`);
  }
}

processEvents();`}
              </CodeBlock>

              <h2>Implementing Event Sourcing in NestJS</h2>
              <p>
                Now, let's see how we can implement the same event sourcing
                pattern in a NestJS application. We'll use the
                `@nestjs/microservices` package to integrate with SNS and SQS.
              </p>

              <h3>Publishing Events</h3>
              <CodeBlock language="typescript">
                {`import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';

@Injectable()
export class EventPublisher {
  private sns: SNS;

  constructor() {
    this.sns = new SNS();
  }

  async publishEvent(event: any) {
    const params = {
      Message: JSON.stringify(event),
      TopicArn: 'arn:aws:sns:us-east-1:123456789012:event-source-topic',
    };

    try {
      const result = await this.sns.publish(params).promise();
      console.log(\`Event published: \${result.MessageId}\`);
    } catch (error) {
      console.error('Error publishing event:', error);
    }
  }
}

// Usage in a service
@Injectable()
export class UserService {
  constructor(private eventPublisher: EventPublisher) {}

  async createUser(email: string) {
    // Create user logic...

    const event = {
      type: 'UserCreated',
      data: {
        userId: '123',
        email,
      },
      timestamp: new Date().toISOString(),
    };

    await this.eventPublisher.publishEvent(event);
  }
}`}
              </CodeBlock>

              <h3>Consuming Events</h3>
              <CodeBlock language="typescript">
                {`import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventConsumer {
  @MessagePattern('UserCreated')
  async handleUserCreated(@Payload() data: any) {
    console.log(\`User created: \${data.userId}\`);
    // Perform actions based on the event
  }

  // Add more methods for other event types
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.SQS,
      options: {
        region: 'us-east-1',
        queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/event-source-queue',
      },
    },
  );
  await app.listen();
}
bootstrap();`}
              </CodeBlock>

              <h2>Best Practices and Considerations</h2>
              <ul>
                <li>
                  <strong>Idempotency:</strong> Ensure your event handlers are
                  idempotent to handle potential duplicate events.
                </li>
                <li>
                  <strong>Error Handling:</strong> Implement proper error
                  handling and dead-letter queues for events that fail to
                  process.
                </li>
                <li>
                  <strong>Versioning:</strong> Consider versioning your events
                  to allow for future changes in event structure.
                </li>
                <li>
                  <strong>Scaling:</strong> Use SQS's long polling and batch
                  processing capabilities for efficient event consumption.
                </li>
                <li>
                  <strong>Monitoring:</strong> Set up proper monitoring and
                  alerting for your SNS topics and SQS queues.
                </li>
              </ul>

              <h2>Conclusion</h2>
              <p>
                Event sourcing with SNS/SQS provides a powerful foundation for
                building scalable, event-driven systems in domain-driven design.
                By leveraging these AWS services, you can create loosely
                coupled, resilient applications that can easily evolve over
                time. Whether you're using plain Node.js or a framework like
                NestJS, the principles remain the same, allowing you to choose
                the best tools for your specific needs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
