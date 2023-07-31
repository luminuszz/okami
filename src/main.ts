import 'newrelic';

import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fmp from 'fastify-multipart';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe());

  await Promise.all([app.register(helmet), app.register(fmp)]);

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
