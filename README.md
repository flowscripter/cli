# cli

[![version](https://img.shields.io/github/v/release/flowscripter/cli?sort=semver)](https://github.com/flowscripter/cli/releases)
[![build](https://img.shields.io/github/actions/workflow/status/flowscripter/cli/release-bun-executable.yml)](https://github.com/flowscripter/cli/actions/workflows/release-bun-executable.yml)
[![coverage](https://codecov.io/gh/flowscripter/cli/graph/badge.svg?token=dxU2NQB2DM)](https://codecov.io/gh/flowscripter/cli)
[![license: MIT](https://img.shields.io/github/license/flowscripter/cli)](https://github.com/flowscripter/cli/blob/main/LICENSE)

> Flowscripter command line interface

> Work in progress.

## Binary Executable Usage

**NOTE**: The binaries are 10's of megabytes in size as the entire Bun runtime
is included.

#### MacOS

Via [Homebrew](https://brew.sh/):

`brew install flowscripter/tap/cli`

#### Linux

In a terminal:

`curl -fsSL https://raw.githubusercontent.com/flowscripter/cli/main/script/install.sh | sh`

#### Windows

Via [Winget](https://github.com/microsoft/winget-cli):

`winget install Flowscripter.cli`

Windows arm64 and x64 builds are supported.

#### Manual Install

You can download and extract the binary zip files from the
[releases](https://github.com/flowscripter/cli/releases)
page.

## Development

Install dependencies:

`bun install`

Test:

`bun test`

Run:

`bun run index.ts`

Compile binary:

`bun build index.ts --compile --outfile /tmp/cli`

Format:

`bunx oxfmt`

Lint:

`bunx oxlint index.ts src/ tests/`

## Documentation

### Overview

Sample mermaid diagram to test rendering in markdown:

```mermaid
classDiagram
    Foo <|-- Bar
```

## License

MIT © Flowscripter
