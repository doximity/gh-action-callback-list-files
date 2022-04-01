const axios = require('axios')

async function fetchData({ repository, ref, token }) {
  const httpClient = axios.create({
    baseURL: 'https://api.github.com',
    headers: {'Authorization': `Bearer ${token}`}
  })
  const response = await httpClient.get(`/repos/${repository}/commits/${ref}`)

  return response.data
}

async function filterPayload(payload) {
  return payload["files"].map((fileMetadata) => {
    return fileMetadata["filename"]
  })
}

async function listRefFiles(inputs = {}) {
  const payload = await fetchData(inputs)
  const filesList = filterPayload(payload)

  return filesList
}

module.exports = {
  listRefFiles
}
