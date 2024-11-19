# Fastify Starter

:leopard: A boilerplate for server applications with Fastify and Mongo using TypeScript on Vite.

:rainbow: View Demo: [Live](https://vue-starter-6fa6.onrender.com) | Windows | macOS | Android | iOS

:octocat: Source Code: [Web-side](https://github.com/Shyam-Chen/Vue-Starter) | [Native-side](https://github.com/Shyam-Chen/Tauri-Starter) | [Server-side](https://github.com/Shyam-Chen/Fastify-Starter) | [Cloud-side](https://github.com/Shyam-Chen/Pulumi-Starter)

## Table of Contents

- [Getting Started](#getting-started)
- [Project Setup](#project-setup)
- [Key Features](#key-features)
- [Configuration](#configuration)
- [Directory Structure](#directory-structure)

## Getting Started

Prerequisites:

- Node.js v20
- PNPM v9
- Docker v4 (Optional)

Get started with Fastify Starter.

```sh
# (optional)
# If you already have the MONGODB_URL and REDIS_URL connections,
# you can directly replace them.

# mongo server
$ docker compose up -d local-mongo

# redis server
$ docker compose up -d local-redis
```

```sh
# install dependencies
$ pnpm install

# dev server (in one terminal)
$ pnpm dev

# (negligible)
# The current demo doesn't make any calls to third-party or internal APIs.
# mock server (in another terminal)
$ pnpm mock
```

Or use barebones scaffolding for your new Fastify app

```sh
$ pnpm dlx degit Shyam-Chen/Barebones-Templates/fastify my-fastify-app
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

### Mock third-party/private APIs during development

```sh
$ pnpm mock
```

### Compiles and minifies for production

```sh
$ pnpm build
```

### Locally preview the production build

```sh
# Before running the `preview` command, make sure to run the following commands.
$ pnpm build

$ pnpm preview
```

### Lints and fixes files

Files: `**/*.{js,ts}`

```sh
$ pnpm lint
```

### Check types

Files: `app/src/**/*.ts`

```sh
$ pnpm check
```

### Runs unit tests

Files: `app/src/**/*.test.ts`

```sh
$ pnpm test
```

### Runs end-to-end tests

Files: `e2e/src/**/*.test.ts`

```sh
# Before running the `e2e` command, make sure to run the following commands.
$ pnpm build
$ pnpm preview

$ pnpm e2e
```

## Key Features

This seed repository provides the following features:

- ---------- **Essentials** ----------
- [x] [Fastify](https://github.com/fastify/fastify) - Web Application Framework
- [x] [Routes](https://github.com/Vanilla-IceCream/vite-plugin-fastify-routes) - File-based Routing
- [x] [MongoDB](https://github.com/fastify/fastify-mongodb) - Document Database
- [x] [JWT](https://github.com/fastify/fastify-jwt) - Authentication
- [x] [PBKDF2](https://github.com/Vanilla-IceCream/pbkdf2-passworder) - Hash Passwords
- [x] [OTP](https://github.com/yeojz/otplib) - Authenticator
- [x] [Cloudinary](https://github.com/Vanilla-IceCream/fastify-cloudinary) - Asset Management
- [x] [I18n](https://github.com/Vanilla-IceCream/fastify-i18n) - Internationalization and Localization
- [x] [Redis](https://github.com/fastify/fastify-redis) - In-memory Data Structure Store
- [x] [BullMQ](https://github.com/taskforcesh/bullmq) - Message Queue
- [x] [WebSocket](https://github.com/fastify/fastify-websocket) - Two-way Interactive Communication Session
- [x] [EventSource](https://github.com/nodefactoryio/fastify-sse-v2) - Server-sent Events
- [x] [Mailer](https://github.com/nodemailer/nodemailer) - Email Sending
- [x] [MJML](https://github.com/Shyam-Chen/MJML-Starter) - Email Builder
- [x] [Nunjucks](https://github.com/mozilla/nunjucks) - Email Rendering
- [x] [LangChain](https://github.com/langchain-ai/langchainjs) - Vector Embeddings
- [x] [OpenAI](https://github.com/openai/openai-node) - Large Language Model
- [x] [MongoDB Vector Search](https://github.com/fastify/fastify-mongodb) - Vector Store
- ---------- **Tools** ----------
- [x] [Vite](https://github.com/vitejs/vite) - Bundler
- [x] [TypeScript](https://github.com/microsoft/TypeScript) - JavaScript with Syntax for Types
- [x] [Biome](https://github.com/biomejs/biome) - Formatter and Linter
- [x] [Vitest](https://github.com/vitest-dev/vitest) - Test Runner
- [x] [Playwright](https://github.com/microsoft/playwright) - Test Automation
- ---------- **Environments** ----------
- [x] [Node.js](https://nodejs.org/en/) - JavaScript Runtime Environment
- [x] [PNPM](https://pnpm.io/) - Package Manager
- [x] [Caddy](https://caddyserver.com/) - Web Server
- [x] [Docker](https://www.docker.com/) - Containerized Application Development
- [x] [GitHub Actions](https://github.com/features/actions) - Continuous Integration and Delivery
- [x] [Render](https://render.com/) - Cloud Application Hosting

### Tiny examples

- [x] [Hello World](./app/src/routes/hello-world/+handler.ts)
- [x] [CRUD Operations](./app/src/routes/todos)
- [x] [JWT Authentication](./app/src/routes/auth/+handler.ts)
- [x] [One-time Password](./app/src/routes/auth/otp/+handler.ts)
- [x] [File Uploads](./app/src/routes/file-uploads/+handler.ts)
- [x] [Real-time Data](./app/src/routes/echo/+handler.ts)
- [x] [Real-time Updates](./app/src/routes/sse/+handler.ts)
- [x] [Sending Emails](./app/src/routes/email/+handler.ts)
- [x] [Internationalization](./app/src/routes/hello-i18n)
- [x] [Caching (Includes Redis Store)](./app/src/routes/hello-world/caching/+handler.ts)
- [x] [Cache Deduplication](./app/src/routes/hello-world/caching-dedupe/[id]-memory/+handler.ts) (Or use [Redis Store](./app/src/routes/hello-world/caching-dedupe/[id]-redis/+handler.ts))
- [x] [Background Workers](./app/src/jobs) (Or use [Redis Store](./app/src/routes/queues/+handler.ts))
- [x] [Cron Jobs](./app/src/jobs) (Or use [Redis Store](./app/src/routes/queues/cron/+handler.ts))
- [x] [Delayed jobs](./app/src/jobs) (Or use [Redis Store](./app/src/routes/queues/delay/+handler.ts))
- [x] [Streaming LLM Output](./app/src/routes/sse/model/+handler.ts)
- [x] [LLM Conversational Q&A Chatbot](./app/src/routes/conversation/+handler.ts)

## Configuration

Control the environment.

### Default environments

Set your local environment variables.

```ts
// app/vite.config.ts
  define: envify({
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,

    SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://root:rootpasswd@127.0.0.1:27017/mydb',
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://apikey:apisecret@cloudname',
    SMTP_URL: process.env.SMTP_URL || `smtp://${user}:${pass}@smtp.ethereal.email:587`,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',

    MONGOMS_VERSION: process.env.MONGOMS_VERSION || '7.0.11',
  }),
```

### Continuous integration environments

Add environment secrets to the GitHub Actions workflow.

```sh
DEPLOY_HOOK=xxx
```

### Continuous delivery environments

Add environment variables to the Render build.

```sh
SITE_URL=xxx

MONGODB_URL=xxx
REDIS_URL=xxx
CLOUDINARY_URL=xxx
SMTP_URL=xxx
OPENAI_API_KEY=xxx
```

## Directory Structure

The structure follows the LIFT Guidelines.

```coffee
.
├── .github
├── app
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── composables
│   │   ├── jobs
│   │   ├── locales
│   │   ├── middleware
│   │   ├── plugins
│   │   ├── routes
│   │   ├── templates
│   │   ├── utilities
│   │   ├── app.ts
│   │   ├── main.ts
│   │   ├── shims.d.ts
│   │   └── worker.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── db -> Set up local data for initializing and testing the database
│   ├── src
│   ├── mongo-init.js
│   └── package.json
├── e2e -> API End-to-end testing
│   ├── src
│   ├── package.json
│   ├── playwright.config.ts
│   └── tsconfig.json
├── mock -> Mocking third-party or private API calls
│   ├── src
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .dockerignore
├── .editorconfig
├── .gitignore
├── biome.json
├── Caddyfile
├── compose.yaml
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── render.yaml
```
