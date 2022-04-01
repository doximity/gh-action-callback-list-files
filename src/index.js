const core = require('@actions/core')
const github = require('@actions/github')
const { listRefFiles } = require('./list_ref_files')

async function main() {
  try {
    const inputs = {
      callback: core.getInput('callback'),
      repository: core.getInput('repository'),
      ref: core.getInput('ref'),
      pr_number: core.getInput('pr_number'),
      token: core.getInput('token')
    }

    const filesList = await listRefFiles(inputs)

    const callbackFn = new Function('filesList', inputs.callback)
    const result = callbackFn(filesList)

    core.setOutput('callback_return', result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
