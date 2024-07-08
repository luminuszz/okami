import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';

describe('SearchTokenEntity', () => {
  it('should be able to create new SearchToken', () => {
    const searchToken = SearchToken.create({
      token: 'Chapter tal',
      type: SearchTokenType.ANIME,
    });

    expect(searchToken).toBeDefined();
    expect(searchToken.token).toBe('Chapter tal');
    expect(searchToken.type).toBe(SearchTokenType.ANIME);
  });
});
