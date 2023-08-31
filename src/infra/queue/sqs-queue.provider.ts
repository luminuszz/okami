import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { CreateQueueCommand, ListQueuesCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsQueueProvider implements QueueProvider, OnModuleDestroy {
  private consumers = new Map<string, Consumer>();
  private logger = new Logger(SqsQueueProvider.name);

  private readonly sqs: SQSClient;

  constructor(private readonly config: ConfigService) {
    this.sqs = new SQSClient({
      region: this.config.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('AWS_SECRET_KEY_ACCESS'),
      },
    });
  }

  async publish<Payload = any>(name: string, payload: Payload): Promise<void> {
    const endpoint = await this.createQueueIfNotExists(name);

    await this.sqs.send(new SendMessageCommand({ QueueUrl: endpoint, MessageBody: JSON.stringify(payload) }));
  }

  async subscribe<Payload = any>(name: string, callback: (payload: Payload) => Promise<void> | void): Promise<void> {
    try {
      const endpoint = await this.createQueueIfNotExists(name);

      let consumer: Consumer = this.consumers.get(endpoint);

      if (!consumer) {
        consumer = Consumer.create({
          queueUrl: endpoint,
          sqs: this.sqs,
          handleMessage: async (message) => {
            const payload = JSON.parse(message.Body);
            await callback(payload);
          },
        });

        this.consumers.set(endpoint, consumer);
      }

      if (!consumer.isRunning) {
        consumer.start();
        consumer.on('error', (err) => this.logger.error(err));
        consumer.on('processing_error', (err) => this.logger.error(err));
        consumer.on('message_received', (message) => this.logger.log(`Message received: ${JSON.parse(message.Body)}`));
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async createQueueIfNotExists(name: string): Promise<string> {
    let queueUrl: string;

    const currentQueues = await this.sqs.send(new ListQueuesCommand({ QueueNamePrefix: name }));

    if (!currentQueues?.QueueUrls?.length) {
      const results = await this.sqs.send(new CreateQueueCommand({ QueueName: name }));

      queueUrl = results.QueueUrl;
    } else {
      queueUrl = currentQueues.QueueUrls[0];
    }

    return queueUrl;
  }

  async onModuleDestroy() {
    this.consumers.forEach((consumer) => {
      consumer.removeAllListeners();
      consumer.stop();
    });
  }
}
