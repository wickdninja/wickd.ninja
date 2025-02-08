import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newcard";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import { BackNav } from "@/components/BackNav";

export default function GettingStartedWithLocalStackPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <BackNav />
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Getting Started with LocalStack
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  LocalStack
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  AWS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Docker
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-cyan-400"
                >
                  Node.js
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-20</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to LocalStack</h2>
              <p>
                LocalStack is a cloud service emulator that runs in a single
                container on your local machine. It provides an easy-to-use
                test/mocking framework for developing cloud applications. In
                this post, we'll explore how to set up LocalStack and use it
                with various AWS services like S3 and SQS, integrating it with
                Node.js applications.
              </p>

              <h2>Setting Up LocalStack with Docker Compose</h2>
              <p>
                Let's start by setting up LocalStack using Docker Compose.
                Create a file named <code>docker-compose.yml</code> in your
                project root:
              </p>

              <CodeBlock language="yaml">
                {`version: '3.8'
services:
  localstack:
    container_name: "localstack_main"
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # external services port range
    environment:
      - DEBUG=
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "./volume:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
`}
              </CodeBlock>

              <p>
                To start LocalStack, run the following command in your terminal:
              </p>

              <CodeBlock language="bash">{`docker-compose up -d`}</CodeBlock>

              <h2>Setting Up a Node.js Project</h2>
              <p>
                Now, let's set up a Node.js project to interact with LocalStack.
                First, initialize a new Node.js project and install the required
                dependencies:
              </p>

              <CodeBlock language="bash">
                {`npm init -y
npm install aws-sdk dotenv`}
              </CodeBlock>

              <p>
                Create a <code>.env</code> file in your project root with the
                following content:
              </p>

              <CodeBlock language="plaintext">
                {`AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566`}
              </CodeBlock>

              <h2>Interacting with S3</h2>
              <p>
                Let's create a script to interact with S3 using LocalStack.
                Create a file named <code>s3-example.js</code>:
              </p>

              <CodeBlock language="javascript">
                {`require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SDK to use LocalStack
const s3 = new AWS.S3({
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
});

async function s3Example() {
  const bucketName = 'my-test-bucket';
  const fileName = 'test-file.txt';
  const fileContent = 'Hello, LocalStack!';

  try {
    // Create a bucket
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(\`Bucket created: \${bucketName}\`);

    // Upload a file
    await s3.putObject({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    }).promise();
    console.log(\`File uploaded: \${fileName}\`);

    // List objects in the bucket
    const listResult = await s3.listObjects({ Bucket: bucketName }).promise();
    console.log('Objects in bucket:', listResult.Contents);

    // Get the uploaded file
    const getResult = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
    console.log('File content:', getResult.Body.toString());

  } catch (error) {
    console.error('Error:', error);
  }
}

s3Example();
`}
              </CodeBlock>

              <p>Run the script with:</p>

              <CodeBlock language="bash">{`node s3-example.js`}</CodeBlock>

              <h2>Interacting with SQS</h2>
              <p>
                Now, let's create a script to interact with SQS. Create a file
                named <code>sqs-example.js</code>:
              </p>

              <CodeBlock language="javascript">
                {`require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SDK to use LocalStack
const sqs = new AWS.SQS({
  endpoint: process.env.AWS_ENDPOINT,
});

async function sqsExample() {
  const queueName = 'my-test-queue';

  try {
    // Create a queue
    const createQueueResult = await sqs.createQueue({ QueueName: queueName }).promise();
    const queueUrl = createQueueResult.QueueUrl;
    console.log(\`Queue created: \${queueUrl}\`);

    // Send a message
    const sendResult = await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: 'Hello, LocalStack SQS!',
    }).promise();
    console.log(\`Message sent: \${sendResult.MessageId}\`);

    // Receive messages
    const receiveResult = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
    }).promise();

    if (receiveResult.Messages && receiveResult.Messages.length > 0) {
      console.log('Received message:', receiveResult.Messages[0].Body);

      // Delete the message
      await sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveResult.Messages[0].ReceiptHandle,
      }).promise();
      console.log('Message deleted');
    } else {
      console.log('No messages received');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

sqsExample();
`}
              </CodeBlock>

              <p>Run the script with:</p>

              <CodeBlock language="bash">{`node sqs-example.js`}</CodeBlock>

              <h2>Creating a Docker Image for Your Node.js Application</h2>
              <p>
                To containerize your Node.js application, create a{" "}
                <code>Dockerfile</code> in your project root:
              </p>

              <CodeBlock language="dockerfile">
                {`FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "s3-example.js"]
`}
              </CodeBlock>

              <p>Build and run your Docker image:</p>

              <CodeBlock language="bash">
                {`docker build -t my-localstack-app .
docker run --network host -e AWS_ENDPOINT=http://localhost:4566 my-localstack-app`}
              </CodeBlock>

              <h2>Updating Docker Compose for Your Application</h2>
              <p>
                Let's update the <code>docker-compose.yml</code> file to include
                your Node.js application:
              </p>

              <CodeBlock language="yaml">
                {`version: '3.8'
services:
  localstack:
    container_name: "localstack_main"
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"
      - "127.0.0.1:4510-4559:4510-4559"
    environment:
      - DEBUG=
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "./volume:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"

  app:
    build: .
    environment:
      - AWS_ENDPOINT=http://localstack:4566
    depends_on:
      - localstack
`}
              </CodeBlock>

              <p>
                Now you can start both LocalStack and your application with:
              </p>

              <CodeBlock language="bash">{`docker-compose up --build`}</CodeBlock>

              <h2>Conclusion</h2>
              <p>
                In this guide, we've explored how to set up LocalStack using
                Docker Compose and how to interact with emulated AWS services
                like S3 and SQS using Node.js. We've also seen how to
                containerize a Node.js application and run it alongside
                LocalStack.
              </p>
              <p>
                LocalStack is an invaluable tool for local development and
                testing of AWS-based applications. It allows developers to work
                offline, speeds up the development process, and reduces costs
                associated with using actual AWS services during development and
                testing phases.
              </p>
              <p>
                As you continue to work with LocalStack, you can explore more
                AWS services it supports, such as DynamoDB, Lambda, API Gateway,
                and many others. Happy local cloud development!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
