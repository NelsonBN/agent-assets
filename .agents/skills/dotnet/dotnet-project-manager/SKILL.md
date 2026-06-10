---
name: dotnet-project-manager
description: Full management of .NET solutions and projects via the CLI, create single-project or multi-project solutions, add/remove projects from .slnx/.sln, add/remove project references, and normalize assembly name, namespace, and folder structure. WHEN, create dotnet project, new solution, add project to solution, remove project from solution, add project reference, remove project reference, normalize project, rename assembly, fix namespace, dotnet sln, dotnet new, multi-project solution, single-project solution, project structure, layered architecture, class library, webapi, worker service
---

# .NET Project Manager

## Overview

Manages .NET solutions and projects end-to-end using the `dotnet` CLI. Covers creation of single-project or multi-project solutions, solution membership, cross-project references, and project normalization. CLI-first — manual file editing is restricted to metadata normalization only.

## Prerequisites

- .NET SDK installed; `dotnet` available on `PATH`.

## Scope

- Create single-project and multi-project solutions (`.slnx`/`.sln`).
- Add and remove projects from solutions.
- Add and remove project references between projects.
- Normalize: assembly name, root namespace, and folder layout.

## Out of Scope

- CI/CD pipeline setup.
- Deployment automation.

## Core Rules

- **NEVER** create `.csproj`, `.sln`, or `.slnx` files manually. **ALWAYS** use `dotnet` CLI.
- **NEVER** edit `.slnx`/`.sln` to add or remove projects. **ALWAYS** use `dotnet sln add/remove`.
- **NEVER** edit `.csproj` to add or remove references. **ALWAYS** use `dotnet add/remove reference`.
- **DIRECT EDITING** of `.csproj` is only permitted to normalize metadata (`RootNamespace`, `AssemblyName`, `Nullable`, `ImplicitUsings`).
- **ALWAYS** use the latest stable installed TFM when creating projects.
- **ALWAYS** prefer `.slnx` format. Migrate `.sln` → `.slnx` when encountered.
- **ALWAYS** place projects in a `src/` subdirectory.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Solution file | kebab-case | `geek-shop.slnx` |
| Solution `-n` arg | kebab-case | `geek-shop` |
| Project name (layered) | `<Product>.<Domain>.<Layer>` | `GeekShop.Checkout.Api` |
| Project name (simple) | `<Product>.<Domain>` | `GeekShop.Checkout` |
| Project directory | matches project name | `src/GeekShop.Checkout.Api/` |

**Always** use PascalCase for project names.

## Required `.csproj` Metadata

After creating or normalizing any project, the `.csproj` must contain these elements (example only — substitute the actual project name, TFM, and Sdk):

```xml
<Project Sdk="Microsoft.NET.Sdk"><!-- or Microsoft.NET.Sdk.Web, etc. -->

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework><!-- use latest stable installed TFM -->

    <RootNamespace>GeekShop.Checkout</RootNamespace>
    <AssemblyName>GeekShop.Checkout</AssemblyName>

    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```

Rules:
- `<TargetFramework>` must use the **latest stable installed TFM** identified via `dotnet --list-sdks` — not a fixed version.
- `<RootNamespace>` and `<AssemblyName>` must match the project name exactly.
- `<Nullable>` must be `enable`.
- **Remove** `<ImplicitUsings>` if present.
- The `Sdk` attribute must match the project type: `Microsoft.NET.Sdk` for libraries/workers/console; `Microsoft.NET.Sdk.Web` for web APIs and MVC.

## Commands Reference

### Identify latest installed TFM
```powershell
dotnet --list-sdks
# Select the highest stable version; derive TFM as net<major>.<minor> (e.g., net10.0)
```

### Check working directory and existing solutions
```powershell
Get-Location; Get-ChildItem -Path . -Filter *.sln*
```

### Create a new solution
```powershell
dotnet new sln --format slnx -n <kebab-name>
# Example: dotnet new sln --format slnx -n geek-shop
```

### Migrate .sln to .slnx
```powershell
dotnet sln <name.sln> migrate
# Then delete the .sln file after confirming migration succeeded.
```

### List available project templates
```powershell
dotnet new --list
# Use when template name is uncertain.
```

### Create a new project
```powershell
dotnet new <template> -n <ProjectName> -o src/<ProjectName> --framework <tfm>
# Example: dotnet new webapi -n GeekShop.Checkout.Api -o src/GeekShop.Checkout.Api --framework net10.0
```

### Add project to solution
```powershell
dotnet sln <name.slnx> add src/<ProjectName>/<ProjectName>.csproj
```

### Remove project from solution
```powershell
dotnet sln <name.slnx> remove src/<ProjectName>/<ProjectName>.csproj
# This removes solution membership only; source files are NOT deleted automatically.
```

### Add project reference
```powershell
dotnet add src/<A>/<A>.csproj reference src/<B>/<B>.csproj
# Example: dotnet add src/GeekShop.Checkout.Api/GeekShop.Checkout.Api.csproj reference src/GeekShop.Checkout.Application/GeekShop.Checkout.Application.csproj
```

### Remove project reference
```powershell
dotnet remove src/<A>/<A>.csproj reference src/<B>/<B>.csproj
```

### Project type classification

| Type | Templates | Verification |
|------|-----------|-------------|
| **Executable** | `webapi`, `worker`, `console`, `grpc`, `mvc`, `blazor`, `blazorserver`, `blazorwasm` | build + run |
| **Library** | `classlib`, `xunit`, `nunit`, `mstest` | build only |

### Build and verify (library projects)
```powershell
dotnet restore && dotnet build
```

### Build, verify, and run (executable projects)
```powershell
dotnet restore && dotnet build && dotnet run --no-build --no-launch-profile --project src/<ProjectName>/<ProjectName>.csproj
```
`dotnet run` keeps the process alive — confirm startup succeeds (no error in output), then stop it (Ctrl+C or `Stop-Process`).

## Solution Detection Decision Table

Run before any workflow that touches a solution:

| Situation | Action |
|-----------|--------|
| `.slnx` found | Reuse as-is |
| `.sln` found, no `.slnx` | Migrate: `dotnet sln <name.sln> migrate`, then delete `.sln` |
| Both found | Use `.slnx`, delete `.sln` |
| Neither found | Create: `dotnet new sln --format slnx -n <name>` |

## Preflight Checklist (Mandatory)

Run this checklist before creating or adding anything:

1. Confirm repository root and current directory.
2. Detect existing solution files (`*.slnx` or `*.sln`).
3. Check for path/name collisions for the target project directory and `.csproj` file.
4. Identify latest stable installed SDK/TFM and use it for project creation.
5. Confirm template availability with `dotnet new --list` when the template name is uncertain.

## Workflows

### 1. Create Single-Project Solution

1. `Get-Location; Get-ChildItem -Path . -Filter *.sln*` — verify directory, apply decision table.
2. `dotnet --list-sdks` — identify latest stable TFM.
3. `dotnet new sln --format slnx -n <kebab-name>`
4. `dotnet new <template> -n <ProjectName> -o src/<ProjectName> --framework <tfm>`
5. `dotnet sln <name>.slnx add src/<ProjectName>/<ProjectName>.csproj`
6. Normalize `.csproj` metadata (see Required `.csproj` Metadata).
7. Verify: `dotnet restore && dotnet build` — for executable project types, also run `dotnet run --no-build --no-launch-profile --project src/<ProjectName>/<ProjectName>.csproj` and confirm startup succeeds, then stop.

### 2. Create Multi-Project Solution

1. `Get-Location; Get-ChildItem -Path . -Filter *.sln*` — verify directory, apply decision table.
2. `dotnet --list-sdks` — identify latest stable TFM.
3. `dotnet new sln --format slnx -n <kebab-name>` — create solution once.
4. For each project:
   - `dotnet new <template> -n <ProjectName> -o src/<ProjectName> --framework <tfm>`
   - `dotnet sln <name>.slnx add src/<ProjectName>/<ProjectName>.csproj`
   - Normalize `.csproj` metadata.
5. Add required cross-project references (Workflow 5).
6. Verify: `dotnet restore && dotnet build` — for each executable project in the solution, also run `dotnet run --no-build --no-launch-profile --project src/<ProjectName>/<ProjectName>.csproj`, confirm startup, then stop.

### 3. Add Existing Project to Solution

1. `Get-ChildItem -Path . -Filter *.sln*` — apply decision table.
2. Confirm `.csproj` exists at expected path.
3. `dotnet sln <name>.slnx add <path/to/Project.csproj>`
4. Verify: `dotnet restore && dotnet build` — for executable projects, also run `dotnet run --no-build --no-launch-profile --project src/<ProjectName>/<ProjectName>.csproj`, confirm startup, then stop.

### 4. Remove Project from Solution

1. `dotnet sln <name>.slnx remove src/<ProjectName>/<ProjectName>.csproj`
2. Check if any remaining projects still reference this project; remove those references first (Workflow 6) if needed.
3. If the project directory should also be deleted, do so only after confirming no other projects reference it.
4. `dotnet restore && dotnet build`

### 5. Add Project Reference

1. Confirm both `.csproj` files exist and both projects are in the solution.
2. `dotnet add src/<A>/<A>.csproj reference src/<B>/<B>.csproj`
3. `dotnet restore && dotnet build`

### 6. Remove Project Reference

1. `dotnet remove src/<A>/<A>.csproj reference src/<B>/<B>.csproj`
2. `dotnet restore && dotnet build`

### 7. Normalize Project

Warn only — do not abort if the user declines a normalization step.

1. Open `.csproj` and check each element against Required `.csproj` Metadata.
2. Fix `<AssemblyName>` if it does not match the project name.
3. Fix `<RootNamespace>` if it does not match the project name.
4. Add `<Nullable>enable</Nullable>` if missing.
5. Remove `<ImplicitUsings>` if present.
6. If folder name does not match project name:
   - Rename the folder.
   - `dotnet sln <name>.slnx remove <old-path>/<Project>.csproj`
   - `dotnet sln <name>.slnx add <new-path>/<Project>.csproj`
7. Verify: `dotnet restore && dotnet build` — for executable projects, also run `dotnet run --no-build --no-launch-profile --project src/<ProjectName>/<ProjectName>.csproj`, confirm startup, then stop.
