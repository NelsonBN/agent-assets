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
* [NuGet Manager](./.agents/skills/dotnet/dotnet-nuget-manager/SKILL.md) - A skill to correctly manage NuGet packages in a .NET project, including the correct way an agent should add, update, or remove a NuGet package. Skill based on [this one](skills/nuget-manager/SKILL.md) and modified by me;
* [NuGet Vulnerabilities Manager](./.agents/skills/dotnet/dotnet-vulnerabilities-manager/SKILL.md) - A skill to detect and fix NuGet security vulnerabilities in .NET projects. Covers direct and transitive CVE/GHSA remediation via dotnet CLI, standardized security-fix traceability comments in project files, external advisory lookup (GitHub Dependabot, GitHub Advisory Database, NuGet advisories), and automatic cleanup of stale transitive overrides.


### Other skills (Famous and Relevant)
Other famous and relevant skills that I find useful:

#### Agents
* [Skill Creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) - A skill to help create, improve, test and benchmark skills


### Other Repositories
* [.NET Skills (Official .NET Repo)](https://github.com/dotnet/skills)
* [Awesome GitHub Copilot (Official GitHub Repo)](https://github.com/github/awesome-copilot)
