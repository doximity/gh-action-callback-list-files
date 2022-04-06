# Run callback on list of filenames

Github action for running a callback after pulling the list of filenames belonging to either a Git REF (SHA1, tag or
branch) or a pull request number.

# Usage
```yaml
- uses: doximity/gh-action-callback-list-files@v0.0.1
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
    # Default: return filenamesList
    callback: ''
```
# Scenarios
- [List all filenames for a pull request](#List-all-filenames-for-a-pull-request)
- [List all filenames for master HEAD](#List-all-filenames-for-master-head)
- [Use action's output from another step in a
  workflow](#use-actions-output-from-another-step-in-a-workflow)

## List all filenames for a pull request

```yaml
- uses: doximity/gh-action-callback-list-files@v0.0.1
  with:
    repository: owner/repo
    pr_number: 250
```

## List all filenames for master HEAD

```yaml
- uses: doximity/gh-action-callback-list-files@v0.0.1
  with:
    repository: owner/repo
    ref: master
```

## Use action's output from another step in a workflow

```yaml
- uses: doximity/gh-action-callback-list-files@v0.0.1
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
Contributing information available in [CONTRIBUTING](./CONTRIBUTING.md)

# License
The gem is available as open source under the terms of the [Apache 2.0 License](./LICENSE).
