# cli
[![license](https://img.shields.io/github/license/flowscripter/cli.svg)](https://github.com/flowscripter/cli/blob/master/LICENSE)
[![dependencies](https://img.shields.io/david/flowscripter/cli.svg)](https://david-dm.org/flowscripter/cli)
[![travis](https://api.travis-ci.com/flowscripter/cli.svg)](https://travis-ci.com/flowscripter/cli)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=flowscripter_cli&metric=coverage)](https://sonarcloud.io/dashboard?id=flowscripter_cli)
[![npm](https://img.shields.io/npm/v/@flowscripter/cli.svg)](https://www.npmjs.com/package/@flowscripter/cli)

> Flowscripter CLI.

## Overview

This project provides a CLI for the Flowscripter system.

**This is a work in progress**

## Development

Firstly:

```
npm install
```

then:

Build: `npm run build`

Watch: `npm run watch`

Test: `npm test`

Lint: `npm run lint`

E2E test: `npm run e2e`

## Run with Node

**NOTE**: End-to-end testing is only performed on MacOS and Linux (not Windows).

#### Running From Source

After building, the CLI can be run with:

    bin/flowscripter

To run with debug logging:

    DEBUG=* NODE_NO_WARNINGS=1 bin/flowscripter

#### Simulated Installation

To simulate installation:

    sudo npm link
    flowscripter

#### Installation via NPM

    npm install -g @flowscripter/cli
    flowscripter

## Further Details

Further details on project configuration files and Javascript version support can be found in
the [template for this project](https://github.com/flowscripter/ts-template/blob/master/README.md#overview).

## License

MIT © Flowscripter
