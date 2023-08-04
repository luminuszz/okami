import { QueueProvider } from '@domain/work/application/contracts/queueProvider';
import { Injectable } from '@nestjs/common';
import * as Queue from 'bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullQueueProvider implements QueueProvider {
  private cacheQueues: Map<string, Queue.Queue>;

  constructor(private readonly config: ConfigService) {
    this.cacheQueues = new Map();
  }

  private createBullQueue(name: string) {
    let queueOrNull = this.cacheQueues.get(name);

    if (!queueOrNull) {
      queueOrNull = new Queue(name, {
        redis: {
          host: this.config.get<string>('REDIS_HOST'),
          port: this.config.get<number>('REDIS_PORT'),
          password: this.config.get<string>('REDIS_PASSWORD'),
          connectTimeout: 30000,
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      });

      this.cacheQueues.set(name, queueOrNull);
    }

    return queueOrNull;
  }

  public async publish<Payload = any>(name: string, payload: Payload): Promise<void> {
    const queue = this.createBullQueue(name);

    await queue.add(payload);
  }

  public async subscribe<Payload = any>(name: string, callback: (payload: Payload) => Promise<any>): Promise<void> {
    const queue = this.createBullQueue(name);

    await queue.process((job, done) => {
      callback(job.data || null)
        .then((data) => done(data))
        .catch((e) => {
          throw new Error(e);
        });
    });
  }
}
