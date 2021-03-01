# enable-pr-automerge-action
## What does this action do?
Enable auto-merge on a pull request in any repo from any CI

## Inputs
### `token`
Github token to perform the action with.
### `owner`
Organization/user which owns the repo.

### `repo`
repo name.
### `pull-number`
Pull request number.

### `merge-method` (optional)
One of "SQUASH", "MERGE" or "REBASE". Default is "SQUASH".
## Example Usage

```yaml
  - name: Enable automerge on a repository
    uses: aspecto-io/enable-pr-automerge-action@master
    with:
        token: ${{ secrets.MY_GITHUB_TOKEN }}
        owner: 'my-org'
        repo: 'my-repo'
        pull-number: '102'
        merge-method: 'SQUASH'
```