import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(helmet);

  app.enableCors({
    origin: [
      'https://okami.daviribeiro.com',
      'http://localhost:3008',
      'http://localhost:5000',
      'http://69.55.54.168',
    ],
    allowedHeaders: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: '*',
  });

  await app.listen(3000);
}
bootstrap();
