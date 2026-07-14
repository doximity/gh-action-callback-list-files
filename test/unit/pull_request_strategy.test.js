const PullRequestStrategy = require('../../src/strategies/pull_request');
const GithubApiClient = require('../../src/github_api_client');

jest.mock('../../src/github_api_client');

describe('PullRequestStrategy', () => {
  const inputs = {
    repository: 'doximity/doximity',
    prNumber: '123',
    token: 'fake-token',
  };

  test('returns filenames from a single page', async () => {
    const mockClient = {
      getPaginated: jest.fn().mockResolvedValue([
        [{ filename: 'file1.js' }, { filename: 'file2.js' }],
      ]),
    };
    GithubApiClient.mockImplementation(() => mockClient);

    const strategy = new PullRequestStrategy(inputs);
    const result = await strategy.filenames();

    expect(result).toEqual(['file1.js', 'file2.js']);
    expect(mockClient.getPaginated).toHaveBeenCalledWith(
      '/repos/doximity/doximity/pulls/123/files?per_page=100',
    );
  });

  test('merges filenames across multiple pages', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({ filename: `file${i}.js` }));
    const page2 = [{ filename: 'file100.js' }, { filename: 'file101.js' }];

    const mockClient = {
      getPaginated: jest.fn().mockResolvedValue([page1, page2]),
    };
    GithubApiClient.mockImplementation(() => mockClient);

    const strategy = new PullRequestStrategy(inputs);
    const result = await strategy.filenames();

    expect(result).toHaveLength(102);
    expect(result).toContain('file0.js');
    expect(result).toContain('file101.js');
  });
});
