const core = require('@actions/core')
const { listFilenames } = require('./list_filenames')

async function main() {
  try {
    const inputs = {
      callback: core.getInput('callback'),
      repository: core.getInput('repository'),
      ref: core.getInput('ref'),
      prNumber: core.getInput('pr_number'),
      token: core.getInput('token')
    }

    const filenamesList = await listFilenames(inputs)
    const callbackFn = new Function('filenamesList', inputs.callback)
    const result = callbackFn(filenamesList)

    core.setOutput('callback_return', result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
