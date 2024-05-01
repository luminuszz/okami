import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class MessageService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientKafka,
  ) {}
  async onModuleDestroy() {
    await this.client.close();
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('create-web-push-subscription');
    this.client.subscribeToResponseOf('send-web-push-public-key');
    this.client.subscribeToResponseOf('register-telegram-chat');
    this.client.subscribeToResponseOf('create-mobile-push-subscription');
    this.client.subscribeToResponseOf('get-recent-notifications');
    this.client.subscribeToResponseOf('get-subscriber');

    //  await this.client.connect();
  }

  send(pattern: string, data: any) {
    return this.client.send(pattern, data);
  }

  emit(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }
}
