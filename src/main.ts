import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://okami-front-end-61mg.vercel.app/',
      'http://localhost:3000',
    ],
    allowedHeaders: '*',
  });
  await app.listen(3000);
}
bootstrap();
