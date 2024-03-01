import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessageService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}
  async onModuleDestroy() {
    await this.client.close();
  }

  async onModuleInit() {
    await this.client.connect();
  }

  send(pattern: string, data: any) {
    return this.client.send(pattern, data);
  }

  emit(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }
}
