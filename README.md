# Fastify Starter

## Getting Started

Follow steps to execute this boilerplate.

1. Clone this boilerplate

```bash
$ git clone --depth 1 https://github.com/Shyam-Chen/Fastify-Starter.git <PROJECT_NAME>
$ cd <PROJECT_NAME>
```

2. Install dependencies

```bash
$ npm install
```

3. Start a development server

```bash
$ yarn serve
```

4. Produce a production-ready bundle

```bash
$ yarn build
```

5. Lint and fix files

```bash
$ yarn lint
```

6. Run unit tests

```bash
$ yarn unit
```

7. Run end-to-end tests

```sh
$ yarn e2e
```

Note: If you see the `[HMR] You need to restart the application!` message to type `rs` and press Enter to restart the server. Don't forget to fix the build failure.

## Examples

- Hello World
- CRUD Operations
- Authentication
- File Uploads
- Realtime Data

## Directory Structure

```ts
.
├── src
│   ├── core
│   │   └── ...
│   ├── <FEATURE> -> feature module
│   │   ├── __tests__
│   │   │   ├── controller.spec.js
│   │   │   ├── resolver.spec.js
│   │   │   ├── document.spec.js
│   │   │   ├── relational.spec.js
│   │   │   ├── service.spec.js
│   │   │   ├── rest.e2e-spec.js
│   │   │   └── graphql.e2e-spec.js
│   │   ├── controller.js -> rest controller
│   │   ├── resolver.js -> graphql resolver
│   │   ├── document.js -> mongodb odm
│   │   ├── relational.js -> postgresql orm
│   │   ├── service.js -> provider
│   │   └── index.js
│   ├── <GROUP> -> module group
│   │   └── <FEATURE> -> feature module
│   │       ├── __tests__
│   │       │   ├── controller.spec.js
│   │       │   ├── resolver.spec.js
│   │       │   ├── document.spec.js
│   │       │   ├── relational.spec.js
│   │       │   ├── service.spec.js
│   │       │   ├── rest.e2e-spec.js
│   │       │   └── graphql.e2e-spec.js
│   │       ├── controller.js -> rest controller
│   │       ├── resolver.js -> graphql resolver
│   │       ├── document.js -> mongodb odm
│   │       ├── relational.js -> postgresql orm
│   │       ├── service.js -> provider
│   │       └── index.js
│   ├── shared
│   │   └── ...
│   ├── app.js
│   └── main.js
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .prettierrc
├── babel.config.js
├── circle.yml
├── docker-compose.yml
├── Dockerfile
├── env.js
├── jest.config.js
├── LICENSE
├── package.json
├── README.md
└── webpack.config.js
```

## Microservices

> Microservice architecture – a variant of the service-oriented architecture structural style – arranges an application as a collection of loosely coupled services. In a microservices architecture, services are fine-grained and the protocols are lightweight.

See [Server-side Micro-Fullstack](https://github.com/Shyam-Chen/Micro-Fullstack/tree/master/server) for instructions on how to create microservices from source code.
