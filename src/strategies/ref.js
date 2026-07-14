const BaseStrategy = require('./base');

class RefStrategy extends BaseStrategy {
  filterPayload(pages) {
    const files = pages.flatMap((page) => page.files);
    return files.map((fileMetadata) => fileMetadata.filename);
  }

  async fetchPayload() {
    return this.httpClient.getPaginated(`/repos/${this.repository}/commits/${this.ref}?per_page=100`);
  }
}

module.exports = RefStrategy;
