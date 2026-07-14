const axios = require('axios');

class GithubApiClient {
  constructor(token) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async get(path) {
    const result = await this.client.get(path);
    return result.data;
  }

  async getPaginated(path) {
    const pages = [];
    let nextPath = path;

    while (nextPath) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.client.get(nextPath);
      pages.push(result.data);

      const linkHeader = result.headers.link;
      if (linkHeader) {
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        nextPath = nextMatch ? nextMatch[1] : null;
      } else {
        nextPath = null;
      }
    }

    return pages;
  }
}

module.exports = GithubApiClient;
