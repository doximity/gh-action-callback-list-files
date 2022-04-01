const axios = require('axios')

class baseStrategy {
  constructor({ repository, ref, pr_number, token }) {
    this.repository = repository
    this.ref = ref
    this.pr_number = pr_number
    this.token = token
  }

  async filenames() {
    const payload = await this.fetchPayload()
    return this.filterPayload(payload)
  }

  filterPayload() {
    throw new Error("Implement me!")
  }

  async fetchPayload() {
    throw new Error("Implement me!")
  }
}

class pullRequestStrategy extends baseStrategy {
  filterPayload(payload) {
    return payload.map((item) => {
      return item["filename"]
    })
  }

  async fetchPayload() {
    const httpClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {'Authorization': `Bearer ${this.token}`}
    })
    const response = await httpClient.get(`/repos/${this.repository}/pulls/${this.pr_number}/files?per_page=100`)
    return response.data
  }
}

class refStrategy extends baseStrategy {
  filterPayload(payload) {
    return payload["files"].map((fileMetadata) => {
      return fileMetadata["filename"]
    })
  }

  async fetchPayload() {
    const httpClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {'Authorization': `Bearer ${this.token}`}
    })
    const response = await httpClient.get(`/repos/${this.repository}/commits/${this.ref}?per_page=100`)
    return response.data
  }
}

function validateInputs(inputs) {
  if (inputs.ref && inputs.pr_number) {
    throw new Error("The options ref and pr_number are mutually exclusive — pick one!")
  }

  if ((inputs.ref === undefined) && (inputs.pr_number === undefined)) {
    throw new Error("You have to specify either ref or pr_number for this action to work")
  }
}

async function listFilenames(inputs) {
  validateInputs(inputs)

  if (inputs.pr_number) {
    return await new pullRequestStrategy(inputs).filenames()
  } else {
    return await new refStrategy(inputs).filenames()
  }
}

module.exports = {
  listFilenames
}
