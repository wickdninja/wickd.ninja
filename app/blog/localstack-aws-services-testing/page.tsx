import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CodeBlock from "@/components/CodeBlock"

const LOCALSTACK_DOCKER_NAME = "localstack_main" // Declare the variable

export default function LocalStackAWSServicesTestingPost() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800/50 backdrop-blur border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400">
              Building and Testing AWS Applications with LocalStack
            </CardTitle>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  LocalStack
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  AWS
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Testing
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-cyan-400">
                  Node.js
                </Badge>
              </div>
              <span className="text-gray-400 text-sm">2025-02-20</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h2>Introduction to LocalStack and Our Sample Application</h2>
              <p>
                LocalStack is a cloud service emulator that runs in a single container on your local machine. It allows
                you to develop and test your AWS applications offline. In this tutorial, we'll build a sample
                application that uses various AWS services and test it using LocalStack.
              </p>
              <p>Our sample application will process MP3 files using the following workflow:</p>

              <CodeBlock language="mermaid">
                {`graph TD
    A[S3 Bucket: MP3 Upload] -->|EventBridge| B[Lambda: Process MP3]
    B -->|Publish| C[SNS Topic]
    C -->|Subscribe| D[SQS Queue]
    D -->|Consume| E[Node.js Worker: Transcribe]
    E -->|Upload| F[S3 Bucket: Transcriptions]
    F -->|EventBridge| G[Lambda: Sentiment Analysis]
    G -->|Store Results| H[PostgreSQL]`}
              </CodeBlock>

              <h2>Setting Up LocalStack</h2>
              <p>
                First, let's set up LocalStack using Docker. Create a <code>docker-compose.yml</code> file:
              </p>

              <CodeBlock language="yaml">
                {
                  `version: '3.8'
services:
  localstack:
    container_name: "${LOCALSTACK_DOCKER_NAME}"  # Fixed the variable usage
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # external services port range
    environment:
      - DEBUG=\${DEBUG-}                  # Escaped the variable properly
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: sentimentdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"`
                }
              </CodeBlock>

              <p>Start LocalStack and PostgreSQL:</p>

              <CodeBlock language="bash">{`docker-compose up -d`}</CodeBlock>

              <h2>Setting Up AWS Services with LocalStack</h2>
              <p>
                Let's set up our AWS services using the AWS CLI with LocalStack. First, set the AWS endpoint to
                LocalStack:
              </p>

              <CodeBlock language="bash">{`export AWS_ENDPOINT_URL=http://localhost:4566`}</CodeBlock>

              <p>Create S3 buckets:</p>

              <CodeBlock language="bash">
                {`aws --endpoint-url=$AWS_ENDPOINT_URL s3 mb s3://mp3-bucket
aws --endpoint-url=$AWS_ENDPOINT_URL s3 mb s3://transcription-bucket`}
              </CodeBlock>

              <p>Create SNS topic and SQS queue:</p>

              <CodeBlock language="bash">
                {`aws --endpoint-url=$AWS_ENDPOINT_URL sns create-topic --name mp3-topic
aws --endpoint-url=$AWS_ENDPOINT_URL sqs create-queue --queue-name transcription-queue`}
              </CodeBlock>

              <p>Subscribe SQS to SNS:</p>

              <CodeBlock language="bash">
                {`aws --endpoint-url=$AWS_ENDPOINT_URL sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:000000000000:mp3-topic \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:us-east-1:000000000000:transcription-queue`}
              </CodeBlock>

              <h2>Implementing Lambda Functions</h2>
              <p>Let's create two Lambda functions: one for processing MP3 files and another for sentiment analysis.</p>

              <p>
                MP3 Processing Lambda (<code>process-mp3.js</code>):
              </p>

              <CodeBlock language="javascript">
                {`const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1'
});

exports.handler = async (event) => {
  const record = event.Records[0];
  const s3Uri = \`s3://\${record.s3.bucket.name}/\${record.s3.object.key}\`;

  await sns.publish({
    TopicArn: 'arn:aws:sns:us-east-1:000000000000:mp3-topic',
    Message: JSON.stringify({ s3Uri }),
  }).promise();

  return { statusCode: 200, body: 'MP3 processed' };
};`}
              </CodeBlock>

              <p>
                Sentiment Analysis Lambda (<code>sentiment-analysis.js</code>):
              </p>

              <CodeBlock language="javascript">
                {`const { Client } = require('pg');

exports.handler = async (event) => {
  const record = event.Records[0];
  const s3Uri = \`s3://\${record.s3.bucket.name}/\${record.s3.object.key}\`;

  // Simulate sentiment analysis
  const sentiment = Math.random() > 0.5 ? 'positive' : 'negative';

  const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'sentimentdb',
  });

  await client.connect();
  await client.query(
    'INSERT INTO sentiments(s3_uri, sentiment) VALUES($1, $2)',
    [s3Uri, sentiment]
  );
  await client.end();

  return { statusCode: 200, body: 'Sentiment analyzed' };
};`}
              </CodeBlock>

              <p>Create and deploy the Lambda functions:</p>

              <CodeBlock language="bash">
                {`zip process-mp3.zip process-mp3.js
zip sentiment-analysis.zip sentiment-analysis.js

aws --endpoint-url=$AWS_ENDPOINT_URL lambda create-function \
    --function-name process-mp3 \
    --runtime nodejs14.x \
    --handler process-mp3.handler \
    --zip-file fileb://process-mp3.zip \
    --role arn:aws:iam::000000000000:role/lambda-role

aws --endpoint-url=$AWS_ENDPOINT_URL lambda create-function \
    --function-name sentiment-analysis \
    --runtime nodejs14.x \
    --handler sentiment-analysis.handler \
    --zip-file fileb://sentiment-analysis.zip \
    --role arn:aws:iam::000000000000:role/lambda-role`}
              </CodeBlock>

              <h2>Setting Up EventBridge Rules</h2>
              <p>Create EventBridge rules to trigger Lambda functions:</p>

              <CodeBlock language="bash">
                {`aws --endpoint-url=$AWS_ENDPOINT_URL events put-rule \
    --name mp3-upload-rule \
    --event-pattern '{"source":["aws.s3"],"detail-type":["Object Created"],"detail":{"bucket":{"name":["mp3-bucket"]}}}'  # Fixed the missing closing brace

aws --endpoint-url=$AWS_ENDPOINT_URL events put-rule \
    --name transcription-upload-rule \
    --event-pattern '{"source":["aws.s3"],"detail-type":["Object Created"],"detail":{"bucket":{"name":["transcription-bucket"]}}}'

aws --endpoint-url=$AWS_ENDPOINT_URL events put-targets \
    --rule mp3-upload-rule \
    --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:000000000000:function:process-mp3"

aws --endpoint-url=$AWS_ENDPOINT_URL events put-targets \
    --rule transcription-upload-rule \
    --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:000000000000:function:sentiment-analysis"`}
              </CodeBlock>

              <h2>Implementing the Node.js Worker</h2>
              <p>Create a Node.js worker to consume messages from SQS and simulate transcription:</p>

              <CodeBlock language="javascript">
                {`const AWS = require('aws-sdk');
const fs = require('fs');

const sqs = new AWS.SQS({ endpoint: 'http://localhost:4566', region: 'us-east-1' });
const s3 = new AWS.S3({ endpoint: 'http://localhost:4566', region: 'us-east-1' });

const queueUrl = 'http://localhost:4566/000000000000/transcription-queue';

async function processMessage(message) {
  const { s3Uri } = JSON.parse(message.Body);
  console.log(\`Processing: \${s3Uri}\`);

  // Simulate transcription
  const transcription = 'This is a simulated transcription.';

  const parts = s3Uri.split('/');
  const fileName = parts[parts.length - 1].replace('.mp3', '.txt');

  await s3.putObject({
    Bucket: 'transcription-bucket',
    Key: fileName,
    Body: transcription,
  }).promise();

  await sqs.deleteMessage({
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle,
  }).promise();
}

async function pollQueue() {
  while (true) {
    const { Messages } = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    }).promise();

    if (Messages) {
      await Promise.all(Messages.map(processMessage));
    }
  }
}

pollQueue().catch(console.error);`}
              </CodeBlock>

              <h2>Testing the Application</h2>
              <p>Now that we have set up all components, let's test our application:</p>

              <CodeBlock language="bash">
                {`# Upload an MP3 file
aws --endpoint-url=$AWS_ENDPOINT_URL s3 cp test.mp3 s3://mp3-bucket/

# Check SQS for messages
aws --endpoint-url=$AWS_ENDPOINT_URL sqs receive-message --queue-url http://localhost:4566/000000000000/transcription-queue

# Check transcription bucket
aws --endpoint-url=$AWS_ENDPOINT_URL s3 ls s3://transcription-bucket/

# Check PostgreSQL for sentiment analysis results
docker exec -it postgres psql -U user -d sentimentdb -c "SELECT * FROM sentiments;"`}
              </CodeBlock>

              <h2>Conclusion</h2>
              <p>
                In this tutorial, we've built and tested a complex AWS application using LocalStack. This approach
                allows you to develop and test AWS applications locally, saving time and resources. Remember to adapt
                your code when moving to a production AWS environment, as some configurations may differ.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

