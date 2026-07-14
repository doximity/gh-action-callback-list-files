const RefStrategy = require('../../src/strategies/ref');
const GithubApiClient = require('../../src/github_api_client');

jest.mock('../../src/github_api_client');

describe('RefStrategy', () => {
  const inputs = {
    repository: 'doximity/doximity',
    ref: 'abc123',
    token: 'fake-token',
  };

  test('returns filenames from a single page', async () => {
    const mockClient = {
      getPaginated: jest.fn().mockResolvedValue([
        { files: [{ filename: 'file1.js' }, { filename: 'file2.js' }] },
      ]),
    };
    GithubApiClient.mockImplementation(() => mockClient);

    const strategy = new RefStrategy(inputs);
    const result = await strategy.filenames();

    expect(result).toEqual(['file1.js', 'file2.js']);
    expect(mockClient.getPaginated).toHaveBeenCalledWith(
      '/repos/doximity/doximity/commits/abc123?per_page=100',
    );
  });

  test('merges filenames across multiple pages', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({ filename: `file${i}.js` }));
    const page2 = [
      { filename: 'file100.js' },
      { filename: 'file101.js' },
      { filename: 'config/graphql/federation_subgraph_schema.gql' },
    ];

    const mockClient = {
      getPaginated: jest.fn().mockResolvedValue([
        { files: page1 },
        { files: page2 },
      ]),
    };
    GithubApiClient.mockImplementation(() => mockClient);

    const strategy = new RefStrategy(inputs);
    const result = await strategy.filenames();

    expect(result).toHaveLength(103);
    expect(result).toContain('config/graphql/federation_subgraph_schema.gql');
    expect(result).toContain('file0.js');
    expect(result).toContain('file101.js');
  });
});
