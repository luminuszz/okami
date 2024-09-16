import { AppModule } from '@app/app.module';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { faker } from '@faker-js/faker';
import * as fastifyCookie from '@fastify/cookie';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { EnvService } from '@infra/env/env.service';
import { MessageService } from '@infra/messaging/messaging-service';
import { JwtService } from '@nestjs/jwt';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { fakerMessageEmit } from '@test/mocks/mocks';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { SearchTokenHttp } from '@infra/http/models/search-token.model';
import { User, UserRole } from '@domain/auth/enterprise/entities/User';
import { parseDomainUserToPrismaUser } from '@infra/database/prisma/prisma-mapper';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { map } from 'lodash';
import { TagHttpType } from '@infra/http/models/tag.model';

describe('E2E tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let adminUser: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
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
      .overrideProvider(MessageService)
      .useValue(fakerMessageEmit)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.register(fastifyCookie as any);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    adminUser = User.create({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      role: UserRole.ADMIN,
      passwordHash: faker.internet.password(),
    });

    await prisma.user.create({
      data: parseDomainUserToPrismaUser(adminUser),
    });
  });

  const generateValidTokenCookie = (user?: User) => ({
    '@okami-web:token': app.get(JwtService).sign({
      id: user?.id ?? faker.string.uuid(),
      email: user?.email ?? faker.internet.email(),
      name: user?.name ?? faker.internet.displayName(),
    } satisfies UserTokenDto),
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

  describe('SearchTokenController ', () => {
    it('POST /search-token', async () => {
      const data = {
        token: faker.lorem.word(),
        type: faker.helpers.arrayElement(Object.values(SearchTokenType)),
      };

      const results = await app.inject({
        url: '/search-token',
        method: 'POST',
        body: data,
        cookies: {
          ...generateValidTokenCookie(adminUser),
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

    it('POST /search-token/batch', async () => {
      const data = {
        tokens: Array.from({ length: 5 }, () => ({
          token: faker.lorem.word(),
          type: faker.helpers.arrayElement(Object.values(SearchTokenType)),
        })),
      };

      const results = await app.inject({
        url: '/search-token/batch',
        method: 'POST',
        body: data,
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(201);

      const searchToken = await prisma.searchToken.findMany();

      expect(searchToken.length).toBeGreaterThan(1);
    });

    it('GET /search-token', async () => {
      await prisma.searchToken.create({
        data: {
          token: 'token',
          type: SearchTokenType.ANIME,
          createdAt: new Date(),
          id: new UniqueEntityID().toValue(),
        },
      });

      const results = await app.inject({
        url: '/search-token',
        method: 'GET',
        query: {
          type: 'ANIME',
        },
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);

      expect(results.json<SearchTokenHttp[]>().every((token) => token.type === SearchTokenType.ANIME)).toBeTruthy();
    });

    it('DELETE /search-token', async () => {
      const { id: tokenId } = await prisma.searchToken.create({
        data: {
          token: faker.string.sample(),
          type: SearchTokenType.ANIME,
          createdAt: new Date(),
          id: new UniqueEntityID().toValue(),
        },
        select: {
          id: true,
        },
      });

      const results = await app.inject({
        url: `/search-token/${tokenId}`,
        method: 'DELETE',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);

      const searchToken = await prisma.searchToken.findUnique({
        where: {
          id: tokenId,
        },
      });

      expect(searchToken).toBeNull();
    });
  });

  describe('AuthGuard', () => {
    let adminUser: User;

    beforeAll(async () => {
      adminUser = User.create({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        role: UserRole.ADMIN,
        passwordHash: faker.internet.password(),
      });

      await prisma.user.create({
        data: parseDomainUserToPrismaUser(adminUser),
      });
    });

    it('should be able to access a protected route', async () => {
      const results = await app.inject({
        url: '/search-token',
        method: 'GET',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);
    });

    it('should not be able to access a protected route', async () => {
      const user = User.create({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        role: UserRole.USER,
        passwordHash: faker.internet.password(),
      });

      await prisma.user.create({
        data: parseDomainUserToPrismaUser(user),
      });

      const results = await app.inject({
        url: '/search-token',
        method: 'GET',
        cookies: {
          ...generateValidTokenCookie(user),
        },
      });

      expect(results.statusCode).toBe(403);
    });

    it('should  be able to access a protected route with access-token', async () => {
      const tokenResponse = await app.get(CreateApiAccessTokenUseCase).execute({
        user_id: adminUser.id,
      });

      if (tokenResponse.isLeft()) {
        throw tokenResponse.value;
      }

      const { accessToken } = tokenResponse.value;

      const results = await app.inject({
        url: '/search-token',
        method: 'GET',
        headers: {
          ['accesstoken']: accessToken.token,
        },
      });

      expect(results.statusCode).toBe(200);
    });
  });

  describe('TagController', () => {
    it('/tags DELETE', async () => {
      const tag = Tag.create({
        name: faker.company.name(),
        color: faker.internet.color(),
        slug: new Slug(faker.lorem.slug()),
        createdAt: new Date(),
      });

      await app.get(TagRepository).create(tag);

      const results = await app.inject({
        url: `/tags/${tag.id}`,
        method: 'DELETE',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);

      const searchToken = await prisma.searchToken.findUnique({
        where: {
          id: tag.id,
        },
      });

      expect(searchToken).toBeNull();
    });

    it('/tags/filter, GET', async () => {
      const tagName = 'garças da vida';

      const tag = Tag.create({
        name: tagName,
        color: faker.internet.color(),
        slug: new Slug(tagName),
        createdAt: new Date(),
      });

      await app.get(TagRepository).create(tag);

      const results = await app.inject({
        url: `/tags/filter`,
        query: {
          search: 'gar',
        },
        method: 'GET',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);
      expect(map(results.json<TagHttpType[]>(), 'name').includes(tagName)).toBeTruthy();
    });
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.accessToken.deleteMany(),
      prisma.user.deleteMany(),
      prisma.work.deleteMany(),
      prisma.accessToken.deleteMany(),
      prisma.tag.deleteMany(),
      prisma.searchToken.deleteMany(),
    ]);

    await prisma.$disconnect();
    await app.close();
  });
});
