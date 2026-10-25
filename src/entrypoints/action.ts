/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as fs from "node:fs";

import * as core from "@actions/core";
import * as github from "@actions/github";

import { formatText, Finding } from "../finding";
import { commentBody, COMMENT_MARKER, EventInfo, targetFor } from "../github";
import { toSarif } from "../sarif";
import { scan } from "../scanner";

async function upsertComment(token: string, findings: Finding[]): Promise<void> {
  const pr = github.context.payload.pull_request;
  if (!pr) return;
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: pr.number,
    per_page: 100,
  });
  const existing = comments.find(c => c.body?.includes(COMMENT_MARKER));
  if (!existing && findings.length === 0) return;
  const body = commentBody(findings);
  if (existing) {
    if (existing.body !== body) await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: pr.number, body });
  }
}

async function main(): Promise<void> {
  const target = targetFor({
    eventName: github.context.eventName,
    payload: github.context.payload as unknown as EventInfo["payload"],
  });
  core.info(`secret-me: ${github.context.eventName} -> ${target.kind === "range" ? target.range : target.kind}`);

  const findings = await scan(target, { config: core.getInput("config") || undefined, assumePushed: true });
  core.setOutput("count", findings.length);
  core.setOutput("findings", JSON.stringify(findings));

  const sarifFile = core.getInput("sarif-file");
  if (sarifFile) {
    fs.writeFileSync(sarifFile, JSON.stringify(toSarif(findings), null, 2));
    core.setOutput("sarif-file", sarifFile);
  }

  for (const f of findings) {
    core.error(`${f.description} (${f.rule}): ${f.redacted}; ${f.note ?? ""}`, {
      file: f.file,
      startLine: f.line > 0 ? f.line : undefined,
      title: "secret-me",
    });
  }
  process.stdout.write(formatText(findings));

  const token = core.getInput("token");
  if (core.getBooleanInput("comment") && token && github.context.payload.pull_request) {
    try {
      await upsertComment(token, findings);
    } catch (error) {
      // A pull request from a fork gets a read-only token: the annotations and the failed check still say it.
      core.warning(`secret-me: could not post the pull request comment: ${(error as Error).message}`);
    }
  }

  if (findings.length > 0 && core.getBooleanInput("fail-on-findings")) {
    core.setFailed(`secret-me: ${findings.length} secret(s) found; rotate them, then clean the history`);
  }
}

main().catch((error: Error) => core.setFailed(`secret-me: ${error.message}`));
