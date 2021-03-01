#!/usr/bin/env node

const core = require("@actions/core");
const { Octokit } = require("@octokit/core");

const GetPullRequestId = async (octokit, owner, repoName, pullNumber) => {
  const query = `query FindPullRequestId($owner: String!, $repoName: String!, $pullNumber: Int!) {
        repository(owner: $owner, name: $repoName) {
          pullRequest(number: $pullNumber) {
            id
          }
        }
      }
    `;
  const result = await octokit.graphql(query, { owner, repoName, pullNumber });
  return result.repository.pullRequest.id;
};

const enableAutoMerge = async (octokit, pullRequestId, mergeMethod) => {
  const mutation = `
        mutation EnableAutoMerge($pullRequestId: ID!, $mergeMethod: PullRequestMergeMethod!) {
            enablePullRequestAutoMerge(input: {
                pullRequestId: $pullRequestId,
                mergeMethod: $mergeMethod
            }) {
                pullRequest {
                    id
                    state
                }
            }
        }
    `;
  const result = await octokit.graphql(mutation, { pullRequestId, mergeMethod });
  core.info(
    `successfully enabled auto merge on pull request. pull request id: ${ result.enablePullRequestAutoMerge.pullRequest.id }. state: ${ result.enablePullRequestAutoMerge.pullRequest.state }`
  );
};

async function main(octokit) {
  try {
    const owner = core.getInput("owner");
    const repoName = core.getInput("repo");
    const pullNumber = +core.getInput("pull-number");
    const pullRequestId = await GetPullRequestId(
      octokit,
      owner,
      repoName,
      pullNumber
    );
    const mergeMethod = core.getInput("merge-method");
    core.info(
      `pull request id is ${pullRequestId}. will send enablePullRequestAutoMerge on it`
    );
    await enableAutoMerge(octokit, pullRequestId, mergeMethod);
  } catch (err) {
    core.setFailed(err.message);
  }
}

main(
  new Octokit({
    auth: core.getInput("token"),
  })
);
