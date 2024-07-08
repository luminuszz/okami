import { SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { faker } from '@faker-js/faker';
import { InMemorySearchTokenRepository } from '@test/mocks/in-memory-search-token-repository';
import { CreateManySearchTokens } from './create-many-search-tokens';

describe('CreateManySearchTokens', () => {
  let stu: CreateManySearchTokens;

  let searchTokenRepository: InMemorySearchTokenRepository;

  beforeEach(() => {
    searchTokenRepository = new InMemorySearchTokenRepository();
    stu = new CreateManySearchTokens(searchTokenRepository);
  });

  it('should be able to create  many search token', async () => {
    const data = Array.from({ length: 10 }).map(() => {
      return {
        token: faker.internet.domainWord(),
        type: faker.helpers.arrayElement([SearchTokenType.ANIME, SearchTokenType.MANGA]),
      };
    });

    const results = await stu.execute({ tokens: data });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      const { searchTokens } = results.value;

      expect(searchTokens).toHaveLength(10);
      expect(searchTokenRepository.searchTokens).toHaveLength(10);
    }
  });
});
