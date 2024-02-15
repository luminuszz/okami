import 'newrelic';

import * as helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as fmp from '@fastify/multipart';
import * as fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import type { FastifyCookieOptions } from '@fastify/cookie';

(async () => {
  const adapter = new FastifyAdapter();

  await Promise.all([
    adapter.register(helmet as any, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
    adapter.register(fmp as any),
    adapter.register(
      fastifyCookie as any,
      {
        parseOptions: {
          httpOnly: true,
        },
      } as FastifyCookieOptions,
    ),
  ]);
  adapter.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'PATCH'],
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Okami API')
    .setDescription('The Okami rest api')
    .setVersion('1.0')
    .addTag('okami')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document));

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT, process.env.ADDRESS, (error, address) => console.log(address, { error }));
})();
