import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await app.register(helmet);

  app.enableCors({
    origin: [
      'https://okami.daviribeiro.com',
      'http://localhost:3008',
      'http://localhost:5000',
      'http://69.55.54.168',
      'http://45.79.222.162',
    ],
    allowedHeaders: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    exposedHeaders: '*',
  });

  await app.listen(process.env.PORT, process.env.ADDRESS, (_, address) => console.log(address));
})();
