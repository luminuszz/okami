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
import fasitfyCors, { FastifyCorsOptions } from '@fastify/cors';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe());

  await Promise.all([
    app.register(helmet as any, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
    app.register(fmp as any),
    app.register(
      fastifyCookie as any,
      {
        parseOptions: {
          httpOnly: true,
        },
      } as FastifyCookieOptions,
    ),
    app.register(
      fasitfyCors as any,
      {
        allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type'],
        methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
        credentials: true,
        origin: [
          'https://okami.daviribeiro.com',
          'http://localhost:3008',
          'http://localhost:5000',
          'http://69.55.54.168',
          'http://45.79.222.162',
          'http://localhost:5173',
        ],
      } as FastifyCorsOptions,
    ),
  ]);

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
