import type { FastifyCookieOptions } from '@fastify/cookie';
import * as fastifyCookie from '@fastify/cookie';
import * as helmet from '@fastify/helmet';
import * as fmp from '@fastify/multipart';
import { EnvService } from '@infra/env/env.service';
import { parseMultipartFormData } from '@infra/utils/parseMultipartFormData';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RawServerDefault } from 'fastify';
import { writeFileSync } from 'node:fs';
import { AppModule } from './app.module';

let app: NestFastifyApplication<RawServerDefault>;

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

    adapter.register(fmp as any, { attachFieldsToBody: 'keyValues', fields: 10, onFile: parseMultipartFormData }),
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
    origin: ['http://localhost:5173', 'https://okami.daviribeiro.com'],
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

  app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { rawBody: true });

  const envService = app.get(EnvService);

  app.useGlobalPipes(new ValidationPipe({ transformOptions: { enableImplicitConversion: true } }));

  const config = new DocumentBuilder()
    .setTitle('Okami API')
    .setDescription('The Okami rest api')
    .setVersion('1.0')
    .addTag('okami')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document));

  if (envService.get('NODE_ENV') === 'development') {
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(envService.get('PORT'), envService.get('ADDRESS'), (error, address) =>
    console.log(address, { error }),
  );
})();
