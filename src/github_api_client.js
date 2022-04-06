const axios = require('axios')

class GithubApiClient {
  constructor(token) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  async get(path) {
    const result = await this.client.get(path)
    return result.data
  }
}

module.exports = GithubApiClient
