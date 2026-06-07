---
name: dotnet-create-project-solution
description: 'Create and manage .NET projects and solutions. Use this skill when initializing new projects, adding existing projects to solutions, or managing solution structure.'
---

# .NET Project and Solution Manager

## Overview

This skill ensures consistent and safe management of .NET projects and solutions. It prioritizes using the `dotnet` CLI to maintain project integrity and enforces a strict preflight and verification workflow.

## Prerequisites

- .NET SDK is installed (or a version compatible with the target solution).
- `dotnet` CLI available on your `PATH`.


## Scope

- Create and migrate solutions.
- Create projects and add them to solutions.
- Add project references between existing projects.
- Normalize required `.csproj` metadata after project creation.

## Out of Scope

- CI/CD pipeline setup.
- Deployment automation.

## Core Rules

- **NEVER** directly create `.csproj` or `.slnx` files. **ALWAYS** use the `dotnet` CLI to perform these operations.
- **NEVER** reference projects in the solution by manually editing the `.slnx` file. **ALWAYS** use `dotnet sln add` to manage project inclusion.
- **NEVER** reference projects in other projects by manually editing the `.csproj` file. **ALWAYS** use `dotnet add reference` to manage project references.
- **DIRECT EDITING** is only permitted for changing project and solution names, or normalizing required `.csproj` metadata defined in this skill.
- **ALWAYS** create projects with the latest stable target framework available on the machine.

## Preflight Checklist (Mandatory)

Run this checklist before creating or adding anything:

1. Confirm repository root and current directory.
2. Detect existing solution files (`*.slnx` or `*.sln`).
3. Check for path/name collisions for the target project directory and `.csproj` file.
4. Identify latest stable installed SDK/TFM and use it for project creation.
5. Confirm template availability with `dotnet new --list` when the template name is uncertain.

### Project Naming Conventions

- For layered architectures (Clean, Onion, Hexagonal, etc.), use `<ProductName>.<Domain>.<Layer>`.
    - Example: `EShop.Checkout.Api`
    - Example: `EShop.Checkout.Application`
    - Example: `EShop.Checkout.Domain`
    - Example: `EShop.Checkout.Infrastructure`
- For simple structures, use `<ProductName>.<Domain>`.
    - Example: `EShop.Checkout`
- **ALWAYS** use PascalCase for project names.
- **ALWAYS** use kebab-case for solution names and solution file names.
    - Example: `eshop-checkout.slnx`

### Project `.csproj` Structure

The `.csproj` file should include the following elements:

- **ALWAYS** include the `<TargetFramework>` element to specify the target framework (e.g., `net10.0`).
- **ALWAYS** include the `<Nullable>` element set to `enable` to enforce nullable reference types.
- **ALWAYS** include the `<RootNamespace>` with the same value as the `<ProjectName>` to maintain consistency.
- **ALWAYS** include the `<AssemblyName>` with the same value as the `<ProjectName>` to maintain consistency.
- **NEVER** include the `<ImplicitUsings>` element. When this element exists, it should be removed.

**Example**:
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>

    <RootNamespace>GeekShop.Checkout</RootNamespace>
    <AssemblyName>GeekShop.Checkout</AssemblyName>

    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```


## Useful Commands

### Identify latest installed SDK

- **USE**: `dotnet --list-sdks`
- **RULE**: Select the highest stable version from the output.

### Verify working directory and existing solution files

- **USE (PowerShell)**: `Get-Location; Get-ChildItem -Path . -Filter *.sln*`

### Convert solution to SLNX format
- **USE**: `dotnet sln <SOLUTION_FILE> migrate`
- **EXAMPLE**: `dotnet sln geek-shop.sln migrate`

### Create a new solution

- **USE**: `dotnet new sln --format slnx -n <ProductName>`.
- **EXAMPLE**: `dotnet new sln --format slnx -n geek-shop`
- **RULES**:
    - **ALWAYS** use the `--format slnx` option to create a solution in the new SLNX format.
    - **ALWAYS** name the solution using kebab-case (lowercase letters and hyphens).
    - **ALWAYS** create the solution in the root directory of the repository.

### List the templates available for new project creation

- **USE**: `dotnet new --list`.

### Create a new project

- **USE**: `dotnet new <TEMPLATE> -n <PROJECT_NAME> -o <OUTPUT_DIRECTORY> --framework <LAST_STABLE_FRAMEWORK_VERSION>`.
- **EXAMPLE**: `dotnet new webapi -n GeekShop.Checkout -o src/GeekShop.Checkout --framework net10.0`
- **RULES**:
    - **ALWAYS** create the project in a subdirectory (e.g., `src/`) to maintain a clean solution structure.
    - **ALWAYS** specify the framework version using the `--framework` option with the latest stable installed target framework.

### Add an existing project to a solution

- **USE**: `dotnet sln <SOLUTION_FILE> add <PROJECT_FILE>`.
- **EXAMPLE**: `dotnet sln geek-shop.slnx add src/GeekShop.Checkout/GeekShop.Checkout.csproj`
- **RULES**:
    - **ALWAYS** specify the solution file when adding projects.

### Reference a project in another project

- **USE**: `dotnet add <PROJECT_FILE> reference <REFERENCE_PROJECT_FILE>`.
- **EXAMPLE**: `dotnet add src/GeekShop.Checkout.Api/GeekShop.Checkout.Api.csproj reference src/GeekShop.Checkout.Application/GeekShop.Checkout.Application.csproj`


## Workflows

### Initializing a New Solution

1. Run the mandatory preflight checklist.
2. Check for existing solution files in the repository root.
3. If no solution exists, create one using `dotnet new sln --format slnx -n <kebab-case-name>`.
4. If `.slnx` exists, reuse it.
5. If only `.sln` exists, migrate with `dotnet sln <SOLUTION_FILE> migrate`.
6. Validate migration output, then remove the old `.sln` file.

### Adding a New Project

1. Run the mandatory preflight checklist.
2. Confirm project type (e.g., web API, class library, worker).
3. Use `dotnet new --list` when template name is uncertain.
4. Create the project using `dotnet new <TEMPLATE> -n <PROJECT_NAME> -o <OUTPUT_DIRECTORY> --framework <LAST_STABLE_FRAMEWORK_VERSION>`.
5. Add project to solution using `dotnet sln <SOLUTION_FILE> add <PROJECT_FILE>`.
6. Validate project metadata and normalize `.csproj` elements if required.

### Adjusting Project Structure

1. Check if the `.csproj` file follows the required structure.
2. If not, modify the file to include the necessary elements mentioned in the Rules section.

### Referencing Projects

1. If the new project is part of a layered architecture or has dependencies on other projects, use `dotnet add <PROJECT_FILE> reference <REFERENCE_PROJECT_FILE>` to establish the correct project references.

### Verification

1. After creating or modifying projects and solutions, run `dotnet restore` and `dotnet build`.
2. If any command fails, stop and fix the failing step before continuing.
