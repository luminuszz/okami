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
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';

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
          const databaseTestUrl = env.get('DATABASE_TEST_URL');

          if (!databaseTestUrl.includes('testing')) {
            throw new Error('You must use a test database');
          }

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

  const generateValidTokenCookie = () => ({
    '@okami-web:token': app.get(JwtService).sign({ id: faker.string.uuid() }),
  });

  describe('AuthController', () => {
    const userEmail = faker.internet.email();
    const userPassword = faker.internet.password();

    it('POST /auth/register', async () => {
      const results = await app.inject({
        url: '/auth/register',
        method: 'POST',
        body: {
          name: faker.internet.displayName(),
          email: userEmail,
          password: userPassword,
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

    it('POST /auth/login', async () => {
      const results = await app.inject({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: userEmail,
          password: userPassword,
        },
      });

      expect(results.statusCode).toBe(201);
      expect(results.cookies.length).toBe(1);
      expect(results.cookies[0].name).toBe('@okami-web:token');
      expect(results.cookies[0].httpOnly).toBe(true);
      expect(results.cookies[0].path).toBe('/');

      expect(app.get(JwtService).verify(results.cookies[0].value)).toBeDefined();
    });

    it('POST /auth/logout', async () => {
      const user = await prisma.user.findFirst();

      const results = await app.inject({
        url: '/auth/logout',
        method: 'POST',
        cookies: {
          '@okami-web:token': app
            .get(JwtService)
            .sign({ id: user.id, email: user.email, name: user.name } satisfies UserTokenDto),
        },
      });

      expect(results.statusCode).toBe(201);

      expect(results.cookies[0].value).toBeFalsy();
    });
  });

  describe('WorkControler ', () => {
    it('POST /work/search-token', async () => {
      const data = {
        token: faker.lorem.word(),
        type: faker.helpers.arrayElement(Object.values(SearchTokenType)),
      };

      const results = await app.inject({
        url: '/work/search-token',
        method: 'POST',
        body: data,
        cookies: {
          ...generateValidTokenCookie(),
        },
      });

      expect(results.statusCode).toBe(201);

      const searchToken = await prisma.searchToken.findFirst({
        where: {
          token: data.token,
        },
      });

      expect(searchToken).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();

    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.work.deleteMany(),
      prisma.accessToken.deleteMany(),
      prisma.tag.deleteMany(),
      prisma.searchToken.deleteMany(),
    ]);

    await prisma.$disconnect();
  });
});
