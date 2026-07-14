const BaseStrategy = require('./base');

class PullRequestStrategy extends BaseStrategy {
  filterPayload(pages) {
    return pages.flat().map((item) => item.filename);
  }

  async fetchPayload() {
    return this.httpClient.getPaginated(`/repos/${this.repository}/pulls/${this.prNumber}/files?per_page=100`);
  }
}

module.exports = PullRequestStrategy;
