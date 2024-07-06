import { Test } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { faker } from '@faker-js/faker';
import { MessageService } from '@infra/messaging/messaging-service';
import { fakerMessageEmit } from '@test/mocks/mocks';
import * as fastifyCookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { EnvService } from '@infra/env/env.service';

describe('E2E tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MessageService)
      .useValue(fakerMessageEmit)
      .overrideProvider(PrismaService)
      .useFactory({
        inject: [EnvService],
        factory: (env: EnvService) => {
          prisma = new PrismaClient({ datasourceUrl: env.get('DATABASE_TEST_URL') });

          return prisma;
        },
      })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.register(fastifyCookie as any);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /auth/register', async () => {
    const userEmail = faker.internet.email();

    const results = await app.inject({
      url: '/auth/register',
      method: 'POST',
      body: {
        name: faker.internet.displayName(),
        email: userEmail,
        password: faker.internet.password(),
      },
    });

    expect(results.statusCode).toBe(201);

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    expect(user).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
});
