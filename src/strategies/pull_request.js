const BaseStrategy = require('./base');

class PullRequestStrategy extends BaseStrategy {
  filterPayload(payload) {
    return payload.map((item) => item.filename);
  }

  async fetchPayload() {
    return this.httpClient.get(`/repos/${this.repository}/pulls/${this.prNumber}/files?per_page=100`);
  }
}

module.exports = PullRequestStrategy;
