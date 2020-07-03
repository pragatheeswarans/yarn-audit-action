const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function run() {
  try {
    const paths = core.getInput('paths');
    const auditLocations = paths.split(/\r?\n/).filter(path => path.trim());
    core.info(`Running audit for the paths ${auditLocations}`);
    const exitCodes = await Promise.all(
      auditLocations.map((location) => {
        const options = {
          silent: true,
          ignoreReturnCode: true,
          cwd: location
        };
        return exec.exec('yarn', ['audit'], options);
      })
    );
    const highSeverityExitCodes = exitCodes.filter(exitCode => exitCode > 7);
    if (highSeverityExitCodes.length) {
      const assignee = core.getInput('assignee');
      const label = core.getInput('label');
      const issueTitle = core.getInput('title');
      const issueDescription = core.getInput('description');
      const octokit = github.getOctokit(core.getInput('token'));
      const { context } = github;

      const issues = await octokit.issues.listForRepo({
        ...context.repo,
        labels: label,
        state: 'open'
      });

      if (!(issues.data && issues.data.length)) {
        const newIssue = await octokit.issues.create({
          ...context.repo,
          title: issueTitle,
          body: issueDescription,
          labels: [label || ''],
          assignee: assignee || ''
        });
        core.info('High severity issues are found and a Github issue is created.');
      } else {
        core.info('An open issue already exists. Not creating a new issue');
      }
    } else {
      core.info('No high severity issues found in your packages.');
    }
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();