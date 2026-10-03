# dotnet-code-health

A skill that finds and fixes .NET build errors, warnings, analyzer findings and style suggestions, then prints a report of what changed.

## Purpose

`dotnet build` does not show everything. Many analyzer (`CA*`) and style (`IDE*`, `.editorconfig`) findings are info-level and stay hidden. This skill scans for all of them, fixes them in a fixed order, and proves the result with a report. It needs no human input, so it can run in a pipeline.

## Capabilities

- Scans the whole solution or only the code you changed.
- Fixes by severity: errors first, then warnings, then infos. Inside each severity, the most critical category goes first (see [severity-order.md](references/severity-order.md)).
- Narrows the work with a scope: changed lines (default), `all`, `error`, `warning`, `info`, or one diagnostic code such as `CA2263`.
- Gives the same results on Windows, Linux and macOS.
- Returns an exit code: `0` nothing left in scope, `1` findings remain, `2` tooling or usage error.
- Writes a report: counts by severity, fixed issues, remaining issues, files changed, tests added, decisions needed.

## What it does

1. Builds the solution and runs `dotnet format` in verify mode to collect every finding.
2. Fixes the findings in order, by hand or with `dotnet format` when a mechanical fix exists.
3. Adds a small test first when a fix could change behaviour and no test covers it.
4. Re-scans until nothing is left in scope.

It never hides a finding. It does not edit `.editorconfig`, and it does not use `#pragma warning disable`, `[SuppressMessage]` or `<NoWarn>`. A finding that can only be cleared that way is left in place and listed in the report. It never commits or pushes.

## How it works

All scanning and reporting is done by one script, [scripts/analyze.ps1](scripts/analyze.ps1). It runs the same commands every time and sorts the results the same way, so two runs on the same code give the same list.

It writes to `artifacts/code-health/`:

| File | Content |
|------|---------|
| `findings.tsv` | Findings in scope, de-duplicated and sorted |
| `findings-all.tsv` | Every finding, regardless of scope |
| `baseline.tsv` | Snapshot of the first run, used by the report |
| `build.log`, `format.log` | Raw tool output |
| `report.md` | The final report |

## Dependencies

- A git repository (used to find the changed code).
- The .NET SDK on `PATH`. A `global.json` is optional: if the repo has one, the installed SDK must match it; if not, the newest installed SDK is used.
- PowerShell to run the script: `pwsh` 7+ on any OS, or Windows PowerShell 5.1 on Windows.
- No other skill and no other tool.

Add `artifacts/` to `.gitignore`. The script warns if it is not ignored and never edits `.gitignore` itself.

Without PowerShell, [SKILL.md](SKILL.md#fallback-without-powershell) describes the same sequence with plain commands.

## How to use it

Ask the agent in plain words ("fix the warnings", "validate the build"), or use the command:

```text
/dotnet-code-health            # only the code changed against the default branch
/dotnet-code-health all        # the whole solution
/dotnet-code-health error      # errors only
/dotnet-code-health warning    # warnings only
/dotnet-code-health info       # infos only
/dotnet-code-health CA2263     # one diagnostic code
```

To run the script yourself, from the repository root:

```bash
pwsh -NoProfile -File .claude/skills/dotnet-code-health/scripts/analyze.ps1 -Scope all -Reset
pwsh -NoProfile -File .claude/skills/dotnet-code-health/scripts/analyze.ps1 -Scope all
pwsh -NoProfile -File .claude/skills/dotnet-code-health/scripts/analyze.ps1 -Report -Decisions "item 1" "item 2"
```

- `-Reset` starts a new baseline. Use it only on the first run.
- `-Base <branch>` overrides the detected default branch for the `changed` scope.
- `-Decisions` is optional text for the "Decisions needed" section of the report.

The script only scans and reports. Fixing the code is the agent's job.
