import { AppModule } from '@app/app.module';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { CreateApiAccessTokenUseCase } from '@domain/auth/application/useCases/create-api-access-token-use-case';
import { User, UserRole } from '@domain/auth/enterprise/entities/User';
import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { WorkRepository } from '@domain/work/application/repositories/work-repository';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { Work } from '@domain/work/enterprise/entities/work';
import { faker } from '@faker-js/faker';
import * as fastifyCookie from '@fastify/cookie';
import { FastifyCookieOptions } from '@fastify/cookie';
import { OKAMI_COOKIE_NAME } from '@infra/crqs/auth/auth.guard';
import { UserTokenDto } from '@infra/crqs/auth/dto/user-token.dto';
import { parseDomainUserToPrismaUser } from '@infra/database/prisma/prisma-mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { EnvService } from '@infra/env/env.service';
import { SearchTokenHttp } from '@infra/http/models/search-token.model';
import { TagHttpType } from '@infra/http/models/tag.model';
import { JwtService } from '@nestjs/jwt';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { createWorkPropsFactory } from '@test/mocks/mocks';
import { map } from 'lodash';
import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { CalendarModel } from '@infra/http/models/calendar.model';

describe('E2E tests', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let adminUser: User;
  let commonUser: User;

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
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.register(
      fastifyCookie as any,
      {
        parseOptions: {
          httpOnly: true,
        },
      } as FastifyCookieOptions,
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    adminUser = User.create({
      name: faker.internet.username(),
      email: faker.internet.email(),
      role: UserRole.ADMIN,
      passwordHash: faker.internet.password(),
    });

    commonUser = User.create({
      name: faker.internet.username(),
      email: faker.internet.email(),
      role: UserRole.ADMIN,
      passwordHash: faker.internet.password(),
    });

    await prisma.user.createMany({
      data: [parseDomainUserToPrismaUser(adminUser), parseDomainUserToPrismaUser(commonUser)],
    });
  });

  const generateValidTokenCookie = (user?: User) => ({
    [OKAMI_COOKIE_NAME]: app.get(JwtService).sign({
      id: user?.id ?? faker.string.uuid(),
      email: user?.email ?? faker.internet.email(),
      name: user?.name ?? faker.internet.username(),
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
      expect(results.cookies[0].name).toBe(OKAMI_COOKIE_NAME);
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
          [OKAMI_COOKIE_NAME]: app
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
        name: faker.internet.username(),
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
        name: faker.internet.username(),
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

  describe('WorkController', () => {
    it('/PATCH /work/:id/toggle-favorite', async () => {
      const work = Work.create(
        createWorkPropsFactory({
          userId: adminUser.id,
        }),
      );

      await app.get(WorkRepository).create(work);

      const results = await app.inject({
        url: `/work/${work.id}/toggle-favorite`,
        method: 'PATCH',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(201);

      const workUpdated = await prisma.work.findUnique({
        where: {
          id: work.id,
        },
      });

      expect(workUpdated?.isFavorite).toBeTruthy();
    });

    it('/GET /work/favorites', async () => {
      const work = Work.create(
        createWorkPropsFactory({
          userId: adminUser.id,
        }),
      );

      await app.get(WorkRepository).create(work);

      const results = await app.inject({
        url: `/work/favorites`,
        method: 'GET',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
      });

      expect(results.statusCode).toBe(200);
      expect(results.json().length).toBe(1);
    });

    it('GET /work/upload/get-upload-url', async () => {
      const work = Work.create(
        createWorkPropsFactory({
          userId: adminUser.id,
        }),
      );

      await app.get(WorkRepository).create(work);

      const results = await app.inject({
        url: '/work/upload/get-upload-url',
        method: 'POST',
        cookies: {
          ...generateValidTokenCookie(adminUser),
        },
        body: {
          workId: work.id,
          fileName: faker.system.fileName(),
          fileType: faker.system.mimeType(),
        },
      });

      expect(results.statusCode).toBe(200);
      expect(results.json()).toHaveProperty('url');
    });
  });

  describe('CalendarController', () => {
    it('POST /calendar', async () => {
      const results = await app.inject({
        url: '/calendar',
        method: 'POST',
        cookies: {
          ...generateValidTokenCookie(commonUser),
        },
        body: {
          title: faker.lorem.words(),
          description: faker.lorem.words(),
        },
      });

      expect(results.statusCode).toBe(201);

      const calendar = await app.get(CalendarRepository).findByCalendarByUserId(commonUser.id);

      expect(calendar).toBeDefined();
      expect(calendar?.userId).toBe(commonUser.id);
    });

    it(`POST /calendar/{calendarId}/row`, async () => {
      const work = Work.create(createWorkPropsFactory({ userId: commonUser.id, name: 'arifureta' }));

      await app.get(WorkRepository).create(work);

      const results = await app.inject({
        url: '/calendar/row',
        method: 'POST',
        cookies: {
          ...generateValidTokenCookie(commonUser),
        },
        body: {
          workId: work.id,
          dayOfWeek: 2,
        },
      });

      expect(results.statusCode).toBe(201);

      const calendar = await app.get(CalendarRepository).findByCalendarByUserId(commonUser.id);

      expect(calendar).toBeDefined();
      expect(calendar.rows.length).toBe(1);
    });

    it('GET /calendar', async () => {
      const results = await app.inject({
        url: '/calendar',
        method: 'GET',
        cookies: {
          ...generateValidTokenCookie(commonUser),
        },
      });

      expect(results.statusCode).toBe(200);

      const data = results.json<CalendarModel>();

      expect(data).toBeDefined();
      expect(data.createdAt).toBeDefined();
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].Work.name).toBe('arifureta');
    });
  });

  afterAll(async () => {
    console.log('Cleaning up database');

    await prisma.$transaction([
      prisma.work.deleteMany(),
      prisma.accessToken.deleteMany(),
      prisma.user.deleteMany(),
      prisma.tag.deleteMany(),
      prisma.searchToken.deleteMany(),
      prisma.calendar.deleteMany(),
      prisma.calendarRow.deleteMany(),
    ]);

    console.log('Disconnecting from database');

    await prisma.$disconnect();

    console.log('Closing app');

    await app.close();
  });
});
