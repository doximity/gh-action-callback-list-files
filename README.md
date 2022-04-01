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
    # It receives only one parameter, listFilenames, an array of filename strings
    # which you can reference from your function's body.
    #
    # The return of your function is set as the `callback_return` output of this
    # action, allowing you to reference that return value from other steps in your workflow.
    # Default: return listFilenames
    callback: ''
```

## Contributing
Contributing information available in [CONTRIBUTING](./CONTRIBUTING.md)

## License
The gem is available as open source under the terms of the [Apache 2.0 License](./LICENSE).
