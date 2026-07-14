const GithubApiClient = require('../../src/github_api_client');

jest.mock('axios', () => ({
  create: jest.fn(() => {
    const mockAxios = jest.fn();
    mockAxios.get = jest.fn();
    return { get: mockAxios.get };
  }),
}));

describe('GithubApiClient', () => {
  let client;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GithubApiClient('fake-token');
  });

  describe('get', () => {
    test('returns response data', async () => {
      client.client.get.mockResolvedValue({ data: { foo: 'bar' } });
      const result = await client.get('/some/path');
      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('getPaginated', () => {
    test('returns all pages when Link header has next', async () => {
      client.client.get
        .mockResolvedValueOnce({
          data: [{ filename: 'a.js' }],
          headers: { link: '<https://api.github.com/page2>; rel="next"' },
        })
        .mockResolvedValueOnce({
          data: [{ filename: 'b.js' }],
          headers: { link: '<https://api.github.com/page3>; rel="next"' },
        })
        .mockResolvedValueOnce({
          data: [{ filename: 'c.js' }],
          headers: {},
        });

      const result = await client.getPaginated('/repos/doximity/doximity/commits/abc?per_page=100');
      expect(result).toEqual([
        [{ filename: 'a.js' }],
        [{ filename: 'b.js' }],
        [{ filename: 'c.js' }],
      ]);
      expect(client.client.get).toHaveBeenCalledTimes(3);
    });

    test('returns single page when no Link header', async () => {
      client.client.get.mockResolvedValue({
        data: { files: [{ filename: 'a.js' }] },
        headers: {},
      });

      const result = await client.getPaginated('/repos/doximity/doximity/commits/abc?per_page=100');
      expect(result).toEqual([{ files: [{ filename: 'a.js' }] }]);
      expect(client.client.get).toHaveBeenCalledTimes(1);
    });

    test('returns single page when Link header has no next', async () => {
      client.client.get.mockResolvedValue({
        data: [{ filename: 'a.js' }],
        headers: { link: '<https://api.github.com/page1>; rel="prev"' },
      });

      const result = await client.getPaginated('/some/path');
      expect(result).toEqual([[{ filename: 'a.js' }]]);
      expect(client.client.get).toHaveBeenCalledTimes(1);
    });
  });
});
