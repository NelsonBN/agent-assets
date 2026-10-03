# Agent Assets

AI Agent Development Assets



## Skills


### Enabling Skills in your tool

#### VS Code
1. Install the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension;
2. Enable the [chat.useAgentSkills](vscode://settings/chat.useAgentSkills) setting and set it to `true`.


### Guidelines and Best Practices
* [Agent Skills Guidelines and Best Practices](https://agentskills.io)
  * [Claude Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)


### Repo Skills
Here are some of the skills created by me, or inspired by other communities' skills, and adapted by me for my needs and use cases.

#### .NET Skills
* [.NET Project Manager](./.agents/skills/dotnet/dotnet-project-manager/SKILL.md) - A skill to manage .NET project files and solution structure, including creating, updating, and organizing projects and references;
* [NuGet Manager](./.agents/skills/dotnet/dotnet-nuget-manager/SKILL.md) - A skill to correctly manage NuGet packages in a .NET project, including the correct way an agent should add, update, or remove a NuGet package;
* [NuGet Vulnerabilities Manager](./.agents/skills/dotnet/dotnet-vulnerabilities-manager/SKILL.md) - A skill to detect and fix NuGet security vulnerabilities in .NET projects. Covers direct and transitive CVE/GHSA remediation via dotnet CLI, standardized security-fix traceability comments in project files, external advisory lookup (GitHub Dependabot, GitHub Advisory Database, NuGet advisories), and automatic cleanup of stale transitive overrides;
* [dotnet-code-health](./.agents/skills/dotnet/dotnet-code-health/SKILL.md) ([README](./.agents/skills/dotnet/dotnet-code-health/README.md)) - Scans and fixes .NET build, analyzer, and style findings, then reports what changed.

#### NPM Skills
* [NPM Vulnerabilities Manager](./.agents/skills/npm/npm-vulnerabilities-manager/SKILL.md) - A skill to detect and fix NPM security vulnerabilities in JavaScript/TypeScript projects. Covers direct and transitive CVE/GHSA remediation via npm/yarn/pnpm CLI, standardized security-fix traceability annotations in security-overrides.json, external advisory lookup (GitHub Dependabot, GitHub Advisory Database, npm advisories), and automatic cleanup of stale transitive overrides.

#### Git Skills
* [Git Commit](./.agents/skills/git-commit/SKILL.md) - A skill to create high-quality git commits that follow Conventional Commits and semantic-release best practices. Inspects the working tree, splits changes into logical commits, stages precisely, and writes well-formed conventional commit messages (type(scope): subject, body, footers).


### Other skills (Famous and Relevant)
Other famous and relevant skills that I find useful:

#### Agents
* [Skill Creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) - A skill to help create, improve, test and benchmark skills


### Other Repositories
* [.NET Skills (Official .NET Repo)](https://github.com/dotnet/skills)
* [Awesome GitHub Copilot (Official GitHub Repo)](https://github.com/github/awesome-copilot)
