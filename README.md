# Run callback on list of filenames

Github action for running a callback after pulling the list of filenames belonging to either a Git REF (SHA1, tag or
branch) or a pull request number.

# Usage
```yaml
- uses: doximity/gh-action-callback-list-files@v1.0.0
  with:
    # Repository name with owner. For example, doximity/rake-ui
    # Default: ${{ github.repository }}
    repository: ''

    # If using a PAT make sure to give it the "repo" scope.
    # If using GITHUB_TOKEN make sure it's given the following permissions:
    # contents: read
    # pull-requests: read
    #
    # See https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token
    #
    # Default: ${{ github.token }}
    token: ''

    # The pull request number to pull the list of filenames from.
    # When using this option you must not specify `ref`.
    # NOTE: includes a maximum of 100 files.
    pr_number: ''

    # The branch, tag or SHA1 to pull the list of filenames from.
    # When using this option you must not specify `pr_number`.
    # NOTE: includes a maximum of 100 files.
    ref: ''

    # The function that will be passed a list of filenames and executed afterwards.
    #
    # It receives only one parameter, filenamesList, an array of filename strings
    # which you can reference from your function's body.
    #
    # The return of your function is set as the `callback_return` output of this
    # action, allowing you to reference that return value from other steps in your workflow.
    #
    # SECURITY WARNING: make sure you only reference trusted inputs from within the callback
    # below. Because the code is `eval`'d this can pose a code injection risk if misused.
    # Read more:
    # https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections
    #
    # Default: return filenamesList
    callback: ''
```
# Scenarios
- [List all filenames for a pull request](#List-all-filenames-for-a-pull-request)
- [List all filenames for master HEAD](#List-all-filenames-for-master-head)
- [Use action's output from another step in a workflow](#Use-actions-output-from-another-step-in-a-workflow)

## List all filenames for a pull request

```yaml
- uses: doximity/gh-action-callback-list-files@v1.0.0
  with:
    repository: owner/repo
    pr_number: 250
```

## List all filenames for master HEAD

```yaml
- uses: doximity/gh-action-callback-list-files@v1.0.0
  with:
    repository: owner/repo
    ref: master
```

## Use action's output from another step in a workflow

```yaml
- uses: doximity/gh-action-callback-list-files@v1.0.0
  id: check-for-graphql-changes
  with:
    repository: owner/repo
    pr_number: 200
    callback: |
      return filenamesList.some((elem) => { return elem.match(/graphql/) })
- name: Run this step only if GraphQL changes are detected
  if: ${{ steps.check-for-graphql-changes.outputs.callback_return == 'true' }}
  run: |
    echo "This PR includes GraphQL changes"
```

# Contributing

1. Fork it and `git clone` it into your environment
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Run `npm install` to install dependencies
4. Make your changes
5. Ensure `npm run test` and `npm run lint` look good
6. Run `npm run dist` and commit the artifact
7. Create a Pull Request
8. Sign the CLA if you haven't yet. See [CONTRIBUTING](./CONTRIBUTING.md)

# Test automation

The behavior for this GH action is verified by two layers of testing:
- Unit: `npm run test` can be run locally and is also run on every push
to a branch. Unit test coverage is a bit limited at the moment so contributions to
improve it are more than welcome!
- E2E: The actual action runs on every push to a branch which works as an E2E smoke test.
See [this workflow file](./.github/workflows/test_action.yml) for details.

# License
The gem is available as open source under the terms of the [Apache 2.0 License](./LICENSE).
