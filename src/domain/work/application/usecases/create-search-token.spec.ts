import { CreateSearchToken } from '@domain/work/application/usecases/create-search-token';
import { InMemorySearchTokenRepository } from '@test/mocks/in-memory-search-token-repository';
import { faker } from '@faker-js/faker';
import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';

describe('CreateSearchToken', () => {
  let stu: CreateSearchToken;

  let searchTokenRepository: InMemorySearchTokenRepository;

  beforeEach(() => {
    searchTokenRepository = new InMemorySearchTokenRepository();
    stu = new CreateSearchToken(searchTokenRepository);
  });

  it('should create a search token', async () => {
    const results = await stu.execute({
      token: faker.internet.domainWord(),
      type: faker.helpers.arrayElement([SearchTokenType.ANIME, SearchTokenType.MANGA]),
    });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      const {
        value: { searchToken },
      } = results;

      expect(searchToken.id).toBeDefined();
      expect(searchToken.token).toEqual(searchToken.token);
      expect(searchToken.type).toEqual(searchToken.type);
    }
  });
});
