const GithubApiClient = require('../github_api_client');

class BaseStrategy {
  constructor({
    repository, ref, prNumber, token,
  }) {
    this.httpClient = new GithubApiClient(token);
    this.repository = repository;
    this.ref = ref;
    this.prNumber = prNumber;
    this.token = token;
  }

  async filenames() {
    const payload = await this.fetchPayload();
    return this.filterPayload(payload);
  }

  filterPayload() {
    throw new Error('Implement me!');
  }

  async fetchPayload() {
    throw new Error('Implement me!');
  }
}

module.exports = BaseStrategy;
