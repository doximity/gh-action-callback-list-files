const PullRequestStrategy = require('./strategies/pull_request')
const RefStrategy = require('./strategies/ref')

function validateInputs(inputs) {
  if (inputs.ref && inputs.prNumber) {
    throw new Error("The options ref and pr_number are mutually exclusive — pick one!")
  }

  if ((inputs.ref === undefined) && (inputs.prNumber === undefined)) {
    throw new Error("You have to specify either ref or pr_number for this action to work")
  }
}

async function listFilenames(inputs) {
  validateInputs(inputs)

  let strategy
  if (inputs.prNumber) {
    strategy = new PullRequestStrategy(inputs)
  } else {
    strategy = new RefStrategy(inputs)
  }

  return await strategy.filenames()
}

module.exports = {
  listFilenames
}
