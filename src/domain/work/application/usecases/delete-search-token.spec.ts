import { DeleteSearchToken } from '@domain/work/application/usecases/delete-search-token';
import { InMemorySearchTokenRepository } from '@test/mocks/in-memory-search-token-repository';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { faker } from '@faker-js/faker';

describe('DeleteSearchToken', () => {
  let stu: DeleteSearchToken;
  let searchTokenRepository: InMemorySearchTokenRepository;

  beforeEach(() => {
    searchTokenRepository = new InMemorySearchTokenRepository();
    stu = new DeleteSearchToken(searchTokenRepository);
  });

  it('should be able to delete a search token', async () => {
    const searchToken = SearchToken.create({
      type: faker.helpers.arrayElement(Object.values(SearchTokenType)),
      createdAt: new Date(),
      token: faker.string.sample(),
    });

    await searchTokenRepository.create(searchToken);

    const results = await stu.execute({ searchTokenId: searchToken.id });

    expect(results.isRight()).toBeTruthy();

    if (results.isRight()) {
      expect(searchTokenRepository.searchTokens).toHaveLength(0);
    }
  });

  it('should not be able to delete a search token if search token not exists', async () => {
    const searchToken = SearchToken.create({
      type: faker.helpers.arrayElement(Object.values(SearchTokenType)),
      createdAt: new Date(),
      token: faker.string.sample(),
    });

    await searchTokenRepository.create(searchToken);

    const results = await stu.execute({ searchTokenId: 'FAKE ID' });

    expect(results.isLeft()).toBeTruthy();

    expect(searchTokenRepository.searchTokens).toHaveLength(1);
  });
});
