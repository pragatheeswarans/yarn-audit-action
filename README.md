# Yarn Audit Action

To run [yarn audit](https://classic.yarnpkg.com/en/docs/cli/audit/) command to find out security vulnerabilities (high as of now) and create a Github Issue so that the developers can pick it up and work on it.

```yaml
#.github/workflows/yarn-audit-action.yaml
name: Yarn-Audit
on:
  push:
    branches: [ master ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Yarn Audit
      uses: pragatheeswarans/yarn-audit-action@v1.0.0
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        assignee: 'ASSIGNEE NAME'
        label: 'LABEL'
        title: 'ISSUE TITLE'
        description: 'ISSUE DESCRIPION'
        paths: |
          .
          folder-1
```

## How it works

When the action is executed, it runs `yarn audit` command in all the paths that is mentioned in the input. The exit codes of the commands are compared and if it is greater than `7` (only high severity as of now), the action will try to fetch the open issues in the repo with the label (mandatory) provided in the input. The label is mandatory to prevent from creating duplicate issues. If there are no open issues with the given label in `open` state, the action will try to create a Github Issue with the details provided in the input.

## Inputs

| Input | Required | Example | Default |
| ----- | -------- | ------- | ------- |
| token | true | ${{ secrets.GITHUB_TOKEN }} | ~ |
| label | true | 'audit issues' | 'audit-issues' |
| assignee | false | 'pragatheeswarans' | ~ |
| title | false | 'Yarn Audit Security Issue' | 'Yarn Audit Security Issue' |
| description| false | 'High severity issues are identified in the repo' | 'There are some high priority issues with your packages. Please check them.' |
| paths | false | (Explained below) | (Explained below) |

## Paths

Note that the paths should be a denoted as a multi-line string using `|` and the locations should be added as plain text as mentioned here.

```yaml
paths: |
  directory-1
  directory-2
  directory-3
```