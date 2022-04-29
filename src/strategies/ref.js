const BaseStrategy = require('./base');

class RefStrategy extends BaseStrategy {
  filterPayload(payload) {
    return payload.files.map((fileMetadata) => fileMetadata.filename);
  }

  async fetchPayload() {
    return this.httpClient.get(`/repos/${this.repository}/commits/${this.ref}?per_page=100`);
  }
}

module.exports = RefStrategy;
