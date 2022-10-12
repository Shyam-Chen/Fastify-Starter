# Fastify Starter

:zap: A boilerplate for Node.js, Fastify, MongoDB, Redis, Vite, Vitest, and TypeScript.

## Table of Contents

- [Project Setup](#project-setup)
- [Key Features](#key-features)
- [Dockerization](#dockerization)
- [Configuration](#configuration)
- [Directory Structure](#directory-structure)
- [Microservices](#microservices)

## Getting Started

```sh
# start dev server
$ pnpm dev

# build for production
$ pnpm build

# locally preview production build
$ pnpm preview

# run tests
$ pnpm test

# run tests once
$ pnpm coverage
```

## Project Setup

Follow steps to execute this boilerplate.

### Install dependencies

```sh
$ pnpm install
```

### Compiles and hot-reloads for development

```sh
$ pnpm dev
```

### Compiles and minifies for production

```sh
$ pnpm build
```

### Lints and fixes files

Files: `src/**/*.ts`

```sh
$ pnpm lint
```

### Runs unit tests

Files: `src/**/*.spec.ts`

```sh
$ pnpm unit
```

### Runs end-to-end tests

Files: `e2e/**/*.spec.ts`

```sh
# Before running the `e2e` command, make sure to run the following commands.
$ pnpm build
$ pnpm preview

# If it's not setup, run it.
$ pnpm setup

$ pnpm e2e
```

### Measures APIs

Files: `e2e/**/*.meas.ts`

```sh
# Before running the `meas` command, make sure to run the following commands.
$ pnpm build
$ pnpm preview

# If it's not setup, run it.
$ pnpm setup

$ pnpm meas
```

### Mock requests

[`mock/requests`](./mock/requests) is a fork of [self](https://github.com/Shyam-Chen/Fastify-Starter) that was made easy and quick way to run mock APIs locally.

```sh
# If it's not active, run it.
$ pnpm active

$ pnpm mock
```

## Key Features

This seed repository provides the following features:

- ---------- **Essentials** ----------
- [x] [Fastify](https://github.com/fastify/fastify)
- [x] [MongoDB](https://github.com/fastify/fastify-mongodb)
- [x] [WebSocket](https://github.com/fastify/fastify-websocket)
- ---------- **Tools** ----------
- [x] [Vite](https://github.com/vitejs/vite)
- [x] [TypeScript](https://github.com/microsoft/TypeScript)
- [x] [ESLint](https://github.com/eslint/eslint)
- [x] [Prettier](https://github.com/prettier/prettier)
- [x] [Vitest](https://github.com/vitest-dev/vitest)
- [ ] [SuperTest](https://github.com/visionmedia/supertest)
- [ ] [AutoCannon](https://github.com/mcollina/autocannon)
- ---------- **Environments** ----------
- [x] [Node.js](https://nodejs.org/en/)
- [x] [Pnpm](https://pnpm.io/)
- [ ] [Caddy](https://caddyserver.com/)
- [ ] [CircleCI](https://circleci.com/)
- [ ] [Render](https://render.com/)

## Directory Structure

The structure follows the LIFT Guidelines.

```coffee
.
├── e2e -> e2e testing (Caddy Server proxy api and proxy mock api)
├── mock
│   ├── requests -> mock api
│   └── responses -> mock data for mock api, unit testing, and e2e testing
├── public -> not handled by vite, copy it to dist
├── src
│   ├── locales -> core module
│   ├── middleware -> core module
│   ├── modules -> feature modules
│   │   └── <FEATURE> -> feature module
│   ├── plugins -> root module
│   ├── utilities -> shared module
│   ├── app.ts
│   ├── server.ts
│   └── shims.d.ts
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .prettierrc
├── Caddyfile
├── circle.yml
├── docker-compose.yml
├── Dockerfile
├── env.ts
├── index.mjs -> entrypoint
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── README.md
├── render.yaml
├── tsconfig.json
└── vite.config.ts
```
