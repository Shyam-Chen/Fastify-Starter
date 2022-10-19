# Fastify Starter

:zap: A boilerplate for Node.js, Fastify, MongoDB, Redis, Vite, Vitest, and TypeScript.

:rainbow: [Live Demo](https://fastify-starter-12ih.onrender.com/api)

## Table of Contents

- [Getting Started](#getting-started)
- [Project Setup](#project-setup)
- [Key Features](#key-features)
- [Dockerization](#dockerization)
- [Configuration](#configuration)
- [Directory Structure](#directory-structure)
- [Microservices](#microservices)

## Getting Started

Get started with Fastify Starter.

```sh
# dev server
$ pnpm install
$ pnpm dev

# mock server
$ cd mock/requests && pnpm install && cd ../..
$ pnpm mock
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

# If it's not installed, run it.
$ cd e2e && pnpm install && cd ..

$ pnpm e2e
```

### Measures APIs

Files: `e2e/**/*.meas.ts`

```sh
# Before running the `meas` command, make sure to run the following commands.
$ pnpm build
$ pnpm preview

# If it's not installed, run it.
$ cd e2e && pnpm install && cd ..

$ pnpm meas
```

### Mock requests

[`mock/requests`](./mock/requests) is a fork [self](https://github.com/Shyam-Chen/Fastify-Starter) that was made easy and quick way to run mock APIs locally.

```sh
# If it's not installed, run it.
$ cd mock/requests && pnpm install && cd ../..

$ pnpm mock
```

## Key Features

This seed repository provides the following features:

- ---------- **Essentials** ----------
- [x] [Fastify](https://github.com/fastify/fastify)
- [x] [MongoDB](https://github.com/fastify/fastify-mongodb)
- [x] [WebSocket](https://github.com/fastify/fastify-websocket)
- [x] [EventSource](https://github.com/nodefactoryio/fastify-sse-v2)
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
- [ ] [Docker](https://www.docker.com/)
- [ ] [CircleCI](https://circleci.com/)
- [ ] [Render](https://render.com/)

## Dockerization

Dockerize an application.

1. Build and run the container in the background

```bash
$ docker-compose up -d default
```

2. Run a command in a running container

```bash
$ docker-compose exec default <COMMAND>
```

3. Remove the old container before creating the new one

```bash
$ docker-compose rm -fs
```

4. Restart up the container in the background

```bash
$ docker-compose up -d --build default
```

## Configuration

Control the environment.

### Default environments

Set your local environment variables.

```ts
// env.ts

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',

  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,

  SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

  MONGODB_URL: process.env.MONGODB_URL || 'xxx',
  REDIS_URL: process.env.REDIS_URL || 'xxx',

  SECRET_KEY: process.env.SECRET_KEY || 'xxx',
};
```

### Continuous integration environments

Add environment variables to the CircleCI build.

```sh
CODECOV_TOKEN=xxx
```

### Continuous deployment environments

Add environment variables to the Netlify build.

```sh
API_URL=http://api.example.com
```

### File-based environments

If you want to set environment variables from a file.

```coffee
.
├── e2e
├── envs
│   ├── dev.js
│   ├── stage.js
│   └── prod.js
├── mock
├── public
└── src
```

```js
// envs/<ENV_NAME>.js

function Environment() {
  this.API_URL = 'http://api.example.com';
}

module.exports = new Environment();
```

```sh
$ pnpm add env-cmd -D
```

```js
// package.json

  "scripts": {
    // "env-cmd -f ./envs/<ENV_NAME>.js" + "pnpm build"
    "build:dev": "env-cmd -f ./envs/dev.js pnpm build",
    "build:stage": "env-cmd -f ./envs/stage.js pnpm build",
    "build:prod": "env-cmd -f ./envs/prod.js pnpm build",
  },
```

### VS Code settings

The most basic configuration.

```js
{
  // ...
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ],
  "javascript.validate.enable": false,
  "css.validate": false,
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false,
  // ...
}
```

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
│   ├── assets -> handled by vite
│   ├── components
│   ├── composables
│   ├── locales -> core module
│   ├── middleware
│   ├── modules -> feature modules
│   │   └── <FEATURE> -> feature module
│   │       ├── __tests__ -> unit testing
│   │       ├── _locales
│   │       ├── controller.ts
│   │       ├── registry.ts -> route component
│   │       ├── schema.ts
│   │       ├── service.ts
│   │       └── types.ts
│   ├── plugins -> root module
│   ├── templates -> email templates with nunjucks
│   ├── utilities -> shared module
│   ├── app.ts
│   ├── error.ts
│   ├── main.ts
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

## Microservices

> A microservice architecture – a variant of the service-oriented architecture structural style – is an architectural pattern that arranges an application as a collection of loosely-coupled, fine-grained services, communicating through lightweight protocols.

See [Micro-Fullstack's Micro Backends](https://github.com/Shyam-Chen/Micro-Fullstack/tree/main/mbe) for instructions on how to create microservices from source code.
