/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "@dev-build-deploy/sarif-it";

import { Finding } from "./finding";
import { VERSION } from "./version";

/** The findings as a SARIF 2.1.0 log (for GitHub code scanning). Values stay redacted. */
export function toSarif(findings: Finding[]): object {
  const tool = new sarif.Tool("secret-me")
    .organization("dev-build-deploy")
    .version(VERSION)
    .informationUri("https://github.com/dev-build-deploy/secret-me#readme");
  const seen = new Set<string>();
  for (const f of findings) {
    if (seen.has(f.rule)) continue;
    seen.add(f.rule);
    tool.addRule(new sarif.Rule(f.rule).name(f.rule).shortDescription(f.description));
  }

  const run = new sarif.Run(tool);
  for (const f of findings) {
    const rotate = f.note ? `; ${f.note}` : "";
    run.addResult(
      new sarif.Result(`${f.description}: ${f.redacted}${rotate}`, { level: "error", ruleId: f.rule }).addLocation({
        physicalLocation: {
          artifactLocation: { uri: f.file },
          region: { startLine: Math.max(f.line, 1) },
        },
      })
    );
  }
  return new sarif.Log().addRun(run).properties();
}
